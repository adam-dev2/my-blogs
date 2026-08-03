---
title: "Speaking git's own protocol"
slug: "speaking-gits-own-protocol"
createdAt: "2026-06-02"
updatedAt: "2026-06-14"
---

Building the platform layer that talks to the git binary directly turned out to be less about git and more about HTTP plumbing. The smart HTTP protocol wants a strict handshake: a GET to info/refs with a service query param, then a POST to git-upload-pack or git-receive-pack with the right content type. Get the Content-Type header wrong and the client silently refuses to negotiate. Once the ref advertisement is correct, clone and push mostly take care of themselves — the real work is auth gating in front of a bare repo and making sure partial reads don't corrupt the pack stream.
