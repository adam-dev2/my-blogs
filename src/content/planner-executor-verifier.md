---
title: "Planner, executor, verifier"
slug: "planner-executor-verifier"
createdAt: "2026-04-28"
updatedAt: "2026-05-03"
---

The agent kept declaring victory on investigations it hadn't finished. Adding a dedicated verifyCompletion step — a separate pass that checks the task's stated goal against what tools actually returned — cut false completions dramatically. The harder problem was persistent conversation history: without it, the verifier's feedback never made it back to the planner's next attempt, so the loop just repeated the same mistake with more confidence each time.
