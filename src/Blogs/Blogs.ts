export interface Post {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  content: string;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const POSTS: Post[] = [
  {
    id: 1,
    title: "Speaking git's own protocol",
    slug: "speaking-gits-own-protocol",
    createdAt: "2026-06-02",
    updatedAt: "2026-06-14",
    content:
      "Building the platform layer that talks to the git binary directly turned out to be less about git and more about HTTP plumbing. The smart HTTP protocol wants a strict handshake: a GET to info/refs with a service query param, then a POST to git-upload-pack or git-receive-pack with the right content type. Get the Content-Type header wrong and the client silently refuses to negotiate. Once the ref advertisement is correct, clone and push mostly take care of themselves — the real work is auth gating in front of a bare repo and making sure partial reads don't corrupt the pack stream.",
  },
  {
    id: 2,
    title: "An MCP server for InsightIDR",
    slug: "an-mcp-server-for-insightidr",
    createdAt: "2026-05-11",
    updatedAt: "2026-05-20",
    content:
      "Wrapping Rapid7's Alerts and Investigations APIs behind an MCP server meant defining every tool schema in zod up front, which paid for itself the first time a field name (index vs indices, sorts vs sort) tripped up the planner. Namespacing tool names became necessary the moment a second MCP server entered the picture — without a prefix, two servers exposing a similarly named tool silently collide. StdioClientTransport is fine for local dev; SSE is where permission gating for destructive calls actually starts to matter.",
  },
  {
    id: 3,
    title: "Planner, executor, verifier",
    slug: "planner-executor-verifier",
    createdAt: "2026-04-28",
    updatedAt: "2026-05-03",
    content:
      "The agent kept declaring victory on investigations it hadn't finished. Adding a dedicated verifyCompletion step — a separate pass that checks the task's stated goal against what tools actually returned — cut false completions dramatically. The harder problem was persistent conversation history: without it, the verifier's feedback never made it back to the planner's next attempt, so the loop just repeated the same mistake with more confidence each time.",
  },
  {
    id: 4,
    title: "Baselining normal before flagging weird",
    slug: "baselining-normal-before-flagging-weird",
    createdAt: "2026-04-09",
    updatedAt: "2026-04-09",
    content:
      "Every logset — O365, Azure AD, endpoint, DNS, network, cloud infra, auth infra — has its own idea of normal, and none of it is written down anywhere useful. An agent that treats every login from a new city as suspicious will bury real signal in noise. The missing piece isn't more detection rules, it's per-entity baselining: knowing that this user always logs in from three countries because they travel for work, so the fourth isn't automatically an incident.",
  },
  {
    id: 5,
    title: "Hybrid search over your own bookmarks",
    slug: "hybrid-search-over-your-own-bookmarks",
    createdAt: "2026-03-22",
    updatedAt: "2026-03-30",
    content:
      "Dense vectors alone kept missing exact terms — someone searching for a specific package name would get semantically-close results that skipped right past it. Adding a sparse vector alongside the dense one in Qdrant, then combining both with payload filtering, fixed the recall problem without giving up the semantic matches that make the search feel smart in the first place. The filtering step matters more than it looks: without it, a query for 'auth' inside one project's bookmarks pulls in unrelated notes from every other project.",
  },
  {
    id: 6,
    title: "Time-based blind SQLi, the slow way",
    slug: "time-based-blind-sqli-the-slow-way",
    createdAt: "2026-03-04",
    updatedAt: "2026-03-04",
    content:
      "No error messages, no visible output difference — just a response that takes five seconds longer when the injected condition is true. Sqlmap automates the payload generation, but understanding why a double-quote boundary payload works where a single quote fails is what makes the next target faster to crack. Running the whole toolchain from Arch in WSL turned out to be the easy part; reading the timing signal patiently was the actual skill.",
  },
  {
    id: 7,
    title: "A terminal worth customizing",
    slug: "a-terminal-worth-customizing",
    createdAt: "2026-02-18",
    updatedAt: "2026-02-25",
    content:
      "Alacritty for raw speed, Zellij for panes that don't fight you the way tmux configs sometimes do, and a tiling window manager underneath so the terminal never has to share a spot with a mouse-managed window. None of this makes anything faster to type. It just removes the small frictions that add up over a full day of switching between an editor, a shell, and logs — which turns out to matter more than any single keybinding.",
  },
  {
    id: 8,
    title: "A terminal worth customizing",
    slug: "a-terminal-customizing",
    createdAt: "2026-02-18",
    updatedAt: "2026-02-25",
    content:
      "Alacritty for raw speed, Zellij for panes that don't fight you the way tmux configs sometimes do, and a tiling window manager underneath so the terminal never has to share a spot with a mouse-managed window. None of this makes anything faster to type. It just removes the small frictions that add up over a full day of switching between an editor, a shell, and logs — which turns out to matter more than any single keybinding.",
  },
  {
    id: 9,
    title: "A terminal worth customizing",
    slug: "worth-customizing",
    createdAt: "2026-02-18",
    updatedAt: "2026-02-25",
    content:
      "Alacritty for raw speed, Zellij for panes that don't fight you the way tmux configs sometimes do, and a tiling window manager underneath so the terminal never has to share a spot with a mouse-managed window. None of this makes anything faster to type. It just removes the small frictions that add up over a full day of switching between an editor, a shell, and logs — which turns out to matter more than any single keybinding.",
  },
]; 
