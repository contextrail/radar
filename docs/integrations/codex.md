---
title: Codex Integration
purpose: Explain how to connect Radar to Codex through MCP.
audience: Codex users installing Radar.
user_need: do
doc_form: how-to-guide
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Codex Integration

Codex can use Radar through MCP.

Add Radar to `~/.codex/config.toml`:

```toml
[mcp_servers.radar]
command = "radar-mcp"
```

Then add the routing guidance from `AGENTS.md` to your project-level instructions.

Radar is most useful when Codex would otherwise spend context reading files or long command output before reasoning.
