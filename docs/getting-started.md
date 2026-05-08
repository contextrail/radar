---
title: Getting Started
purpose: Help a new user install Radar, configure a worker model, and run one useful delegation task.
audience: Developers trying Radar for the first time.
user_need: do
doc_form: how-to-guide
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Getting Started

This guide gets Radar running from the CLI first. After that, connect it to your AI agent through MCP or project rules.

## Prerequisites

- Node.js 20 or newer.
- pnpm, npm, or another package manager that can install npm packages.
- An API key for an OpenAI-compatible worker model provider.

## Install Radar

```bash
pnpm install -g @contextrail/radar
```

## Configure A Worker Model

Set an API key:

```bash
export RADAR_API_KEY=sk-...
```

Radar defaults to Moonshot / Kimi:

```bash
export RADAR_BASE_URL=https://api.moonshot.ai/v1
export RADAR_MODEL=kimi-k2.5
```

Any OpenAI-compatible chat completions endpoint can work.

## Try The CLI

Ask Radar to read a couple of files and return a short answer:

```bash
radar ask -p package.json README.md -q "What is this package for?"
```

Summarize a long test output:

```bash
pnpm test 2>&1 | radar summarize --stdin -f "focus on failures and root causes"
```

Draft a file without writing it:

```bash
radar write --dry-run \
  -s "test file matching this style" \
  -c test/service.test.ts \
  -t test/new-feature.test.ts
```

## Add Agent Routing Rules

Installing Radar does not automatically modify your project. Copy the routing rules you want into the consuming project:

- `AGENTS.md` for general agent guidance.
- `.cursor/rules/radar-delegation.mdc` for Cursor.
- `CLAUDE.md` for Claude Code.

See [MCP Clients](./mcp-clients.md) and the integration guides for client-specific setup.

## Next Steps

- Read the [Delegation Model](./delegation-model.md).
- Add an MCP client config from [MCP Clients](./mcp-clients.md).
- Try the [Documentation Updates](./recipes/documentation-updates.md) recipe.
