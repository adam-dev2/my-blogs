---
title: "Hybrid search over your own bookmarks"
slug: "hybrid-search-over-your-own-bookmarks"
createdAt: "2026-03-22"
updatedAt: "2026-03-30"
---

Dense vectors alone kept missing exact terms — someone searching for a specific package name would get semantically-close results that skipped right past it. Adding a sparse vector alongside the dense one in Qdrant, then combining both with payload filtering, fixed the recall problem without giving up the semantic matches that make the search feel smart in the first place. The filtering step matters more than it looks: without it, a query for 'auth' inside one project's bookmarks pulls in unrelated notes from every other project.
