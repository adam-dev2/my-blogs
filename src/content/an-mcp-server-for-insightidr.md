---
title: "An MCP server for InsightIDR"
slug: "an-mcp-server-for-insightidr"
createdAt: "2026-05-11"
updatedAt: "2026-05-20"
---

Wrapping Rapid7's Alerts and Investigations APIs behind an MCP server meant defining every tool schema in zod up front, which paid for itself the first time a field name (index vs indices, sorts vs sort) tripped up the planner. Namespacing tool names became necessary the moment a second MCP server entered the picture — without a prefix, two servers exposing a similarly named tool silently collide. StdioClientTransport is fine for local dev; SSE is where permission gating for destructive calls actually starts to matter.
