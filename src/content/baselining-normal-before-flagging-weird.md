---
title: "Baselining normal before flagging weird"
slug: "baselining-normal-before-flagging-weird"
createdAt: "2026-04-09"
updatedAt: "2026-04-09"
---

Every logset — O365, Azure AD, endpoint, DNS, network, cloud infra, auth infra — has its own idea of normal, and none of it is written down anywhere useful. An agent that treats every login from a new city as suspicious will bury real signal in noise. The missing piece isn't more detection rules, it's per-entity baselining: knowing that this user always logs in from three countries because they travel for work, so the fourth isn't automatically an incident.
