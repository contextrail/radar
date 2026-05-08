---
title: Cursor Integration
purpose: Explain how to connect Radar to Cursor and add project routing rules.
audience: Cursor users installing Radar in a project.
user_need: do
doc_form: how-to-guide
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Cursor Integration

Cursor can use Radar through MCP.

## MCP Config

Create or update `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "radar": {
      "command": "radar-mcp"
    }
  }
}
```

If you use an env file:

```json
{
  "mcpServers": {
    "radar": {
      "type": "stdio",
      "command": "radar-mcp",
      "envFile": "${workspaceFolder}/.env.cursor"
    }
  }
}
```

## Routing Rule

Copy `.cursor/rules/radar-delegation.mdc` from this repository into the consuming project.

Installing Radar does not automatically install Cursor rules. The rule must live in the project that Cursor is editing.
