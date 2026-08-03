---
title: "MCP Client in my perspective"
slug: "mcp-client-in-my-perspective"
createdAt: "2026-08-03"
updatedAt: "2026-08-03"
---

I don't think so there are any very good blogs that demonstrates how mcp-clients works or how they are and even why they exists. i mean i have seen majority of them i always felt they lack the depth in it so these are the learnings i did about mcp-client in the past week.

Let's go by answering questions cause of curiosity, and these are the questions we will be answering along with understanding how this whole thing works:

1. Why MCP-Client even exists?
2. How the communication happens between mcp-client and local/remote mcp-servers?
3. How mcp-sdk brought the revolution in building these mcp servers as well as mcp clients?

yep that is it.

---

## Why MCP-Client even exists?

traditionally we could have just done the communication between LLM's and the server and based on the llm response we could have just made any automations on it but... that's exactly the problem. every single integration would've been a one-off.

think about it like this — if you were wiring up an LLM to GitHub, you'd write custom code that:

- knows GitHub's specific API shape
- knows how to describe GitHub's actions to the LLM as tool schemas
- knows how to parse the LLM's response and turn it into a GitHub API call
- knows how to format GitHub's response back into something the LLM understands

now do that again for Jira. again for Slack. again for your internal Postgres db. every single one of these is a **bespoke integration** — the schema format, the auth handling, the error handling, none of it is shared. you're not reusing anything except maybe the HTTP client.

this is basically the N×M problem: N applications (Claude Desktop, opencode, your own agent) × M tools (GitHub, Jira, Slack, your internal APIs) = N×M custom integrations, each one built and maintained separately.

MCP flips this into N+M. any MCP-**compliant** client can talk to any MCP-compliant server, because:

- the **tool discovery format** is standardized (`tools/list` always returns the same shape)
- the **tool call format** is standardized (`tools/call` always looks the same)
- the **transport** is standardized (stdio or HTTP, same JSON-RPC envelope either way)

so the "mcp-client" isn't just a nice-to-have wrapper — it's the thing that makes a tool built once (say, an internal GitHub MCP server your team writes) usable by literally any MCP client, without either side needing to know anything specific about the other. the client's whole existence is justified by *not* needing bespoke glue code per server.

and once you have that standardization, something else falls out for free: **multi-server composition**. your agent isn't locked to one tool provider. you can connect 4 different MCP servers to the same client and the LLM just sees one unified list of tools — it doesn't care or know that `github__create_issue` and `filesystem__read_file` come from two completely different processes speaking to two completely different backends.

---

## How the communication happens between mcp-client and local/remote mcp-servers?

To answer this we can divide it into 2 halves.

### Local MCP server

In this the mcp-client spawns the child_process where it runs the mcp-server as given in the config file, and connects the stdout pipe of that to the parent's (mcp-client) stdin, and stdout of the parent to the stdin of the mcp-server — by this they can communicate in the JSON-RPC message format.

```
   CLIENT (mcp-client)                SERVER (child process)
   ─────────────────────────────────────────────────────────
   parent fd ────────pipe A────────▶ child stdin    "you→server"
   child stdout ◀───pipe B──────────── parent fd    "server→you"
```

no networking is involved here at all — this is entirely the OS's built-in inter-process communication. the client holds one end of two pipes, the child holds the other end, and neither side needs a port, a socket, or any auth handshake. the child process doesn't even know it's talking to a program instead of a human at a terminal — reading stdin and writing stdout looks identical either way.

once the pipes exist, the actual conversation is newline-delimited JSON-RPC:

```
Client writes: {"jsonrpc":"2.0","id":1,"method":"initialize","params":{...}}
Client reads:  {"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"...","serverInfo":{...}}}

Client writes: {"jsonrpc":"2.0","method":"notifications/initialized"}   ← no id, fire-and-forget
Client writes: {"jsonrpc":"2.0","id":2,"method":"tools/list"}
Client reads:  {"jsonrpc":"2.0","id":2,"result":{"tools":[{...},{...}]}}
```

`initialize` → `notifications/initialized` → `tools/list` is a fixed handshake order, not arbitrary. the server shouldn't process real requests before both sides agree on protocol version, same logic as any handshake in networking — just happening over pipes instead of sockets.

every message carries an `id`. this is what lets the client fire off a request and later match the response to it, even if multiple requests are technically in flight — the client keeps a `pending: Map<id, resolver>` internally, and when a line comes back with `"id":2`, it resolves whichever promise was waiting on id 2.

### Remote MCP server

same JSON-RPC messages, same handshake order, same everything — the only thing that changes is the I/O layer underneath:

```
{ "mcp": { "remote": { "url": "https://mcp.example.com/sse" } } }
```

instead of spawn + two pipes, the client opens an HTTP/SSE connection, sends the same JSON-RPC payload as the body of a POST, and reads the reply from the HTTP response or an SSE stream. `initialize`, `tools/list`, `tools/call` — identical shape, identical id-correlation logic. the transport is genuinely just a thin adapter at the bottom; all the protocol logic above it is shared code.

this is why an mcp-client can treat a local server and a remote server completely uniformly once connected — `client.listTools()` and `client.callTool()` don't care whether the bytes traveled through an OS pipe or a TCP socket.

### one important thing that trips people up

the mcp-client's JSON-RPC conversation is with the **MCP server only**. the LLM itself is never spoken to in JSON-RPC — that part is a completely separate, stateless REST call (`POST /v1/messages` or similar), with its own totally different message shape (`tool_use`/`tool_result` blocks, no `id` correlation, no persistent connection). the mcp-client is the only component that understands both protocols — it translates MCP's tool schemas into the LLM API's tool format, and translates the LLM's "call this tool" response back into a real `tools/call` JSON-RPC message sent down the pipe. two different protocols, two different jobs, one component bridging them.

---

## How mcp-sdk brought the revolution in building these mcp servers as well as mcp clients?

everything above — the pipe management, the newline-JSON buffering, the id-correlation map, the exact handshake sequence — is stuff you'd otherwise have to hand-roll for every single client or server you write. and it's exactly the kind of code that's easy to get subtly wrong: forget to handle a partial line at the end of a chunk, forget that `notifications/initialized` has no `id` and shouldn't go in the pending map, forget that stderr needs to stay separate from the RPC channel.

the SDK collapses all of that into a few method calls:

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({ command: "npx", args: ["-y", "@modelcontextprotocol/server-github"] });
const client = new Client({ name: "my-client", version: "1.0.0" }, { capabilities: {} });

await client.connect(transport);        // does the whole initialize handshake for you
const { tools } = await client.listTools();
const result = await client.callTool({ name: "create_issue", arguments: {...} });
```

`connect()` is your `initialize` + `notifications/initialized` sequence. `listTools()` and `callTool()` are typed, schema-validated wrappers around raw `request()` calls you'd otherwise be constructing by hand. swapping `StdioClientTransport` for `StreamableHTTPClientTransport` gets you a remote server with zero other code changes — this is the "transport is a thin adapter" idea, made real instead of theoretical.

the revolution isn't that the SDK invented some clever new mechanism — it's that it took something genuinely simple (spawn a process, open two pipes, speak newline JSON) and made it so nobody has to reimplement the boring, error-prone parts ever again. that's the same trick Unix pipes pulled off in 1973 — Doug McIlroy's idea, Ken Thompson's implementation in one night — small, simple building blocks that got standardized once and then just... never needed reinventing. MCP servers over stdio are, mechanically, doing exactly what any Unix filter program has always done. the SDK just wraps that ancient mechanism in a modern, typed API.

---

that's basically the whole mental model. no magic — spawn a process, hook up two pipes, speak JSON-RPC over them, and let the SDK handle the plumbing so you can focus on what your server actually does or what your agent actually decides.
