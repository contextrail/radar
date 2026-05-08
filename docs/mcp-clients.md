---
title: MCP Clients
purpose: Show how to connect Radar to common MCP-capable coding agents.
audience: Developers configuring Radar for Cursor, Claude Code, Codex, or another MCP client.
user_need: do
doc_form: how-to-guide
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# MCP Clients

Radar exposes the same four tools through MCP:

- `ask`
- `search`
- `summarize`
- `write`

The MCP server runs over stdio:

```bash
radar-mcp
```

## Cursor

Add Radar to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "radar": {
      "command": "radar-mcp"
    }
  }
}
```

Then copy the routing rule into `.cursor/rules/radar-delegation.mdc`. Installing Radar does not do this automatically.

## Claude Code

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

Then add the routing guidance from `AGENTS.md` to your project `CLAUDE.md`.

## Codex

Add Radar to `~/.codex/config.toml`:

```toml
[mcp_servers.radar]
command = "radar-mcp"
```

Then add the routing guidance from `AGENTS.md` to your project instructions.

## Routing Guidance

Radar's MCP descriptions are the primary routing signal. The included `AGENTS.md`, `CLAUDE.md`, and Cursor rule are optional templates for projects that want a stronger first-turn nudge:

```md
Before broad reading, searching, summarizing, or drafting, check whether one Radar call can reduce the host context you are about to spend.
```

Keep local instructions short. Radar works best when the client sees clear triggers, not a long policy document.

## Environment Variables

Most MCP clients inherit environment variables from the shell or support an env file. Ensure the MCP server receives at least:

```bash
RADAR_API_KEY=sk-...
```

See [Configuration](./configuration.md) for provider and limit options.
