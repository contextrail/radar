---
title: Claude Code Integration
purpose: Explain how to connect Radar to Claude Code and teach Claude when to delegate.
audience: Claude Code users installing Radar.
user_need: do
doc_form: how-to-guide
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Claude Code Integration

Claude Code can use Radar through MCP and project instructions.

## MCP Config

Add Radar to your Claude MCP config:

```json
{
  "mcpServers": {
    "radar": {
      "command": "radar-mcp"
    }
  }
}
```

## Project Instructions

Copy the routing guidance from `AGENTS.md` into your project `CLAUDE.md`.

The important instruction is:

> The host agent thinks. Radar handles the paperwork.

Be explicit about when not to delegate. That prevents Claude from sending debugging, architecture, and safety-critical work to the worker model.
