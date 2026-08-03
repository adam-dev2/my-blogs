---
title: "MCP-SDK unknowingly parsed whole headache"
slug: "mcp-sdk-unknowingly-parsed-whole-headache"
createdAt: "2026-02-18"
updatedAt: "2026-02-25"
---

If this modelcontextprotocol sdk isn't existed then i should be doing all of this before sending a message to mcp-server either vise too

1. Read STDIN
2. Detect message boundaries
3. parse JSON
4. Validate JSON-RPC
5. Check methods -> Intialize || tools/list || tools/call
6. buidl the valid response
7. serialise JSON
8. write to STDOUT
