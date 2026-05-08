---
title: Installation
purpose: Document install options and package requirements for Radar.
audience: Developers installing Radar locally or in a project.
user_need: do
doc_form: how-to-guide
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Installation

Radar is distributed as an npm package with two binaries:

- `radar`: CLI transport.
- `radar-mcp`: MCP server transport over stdio.

## Requirements

- Node.js 20 or newer.
- A worker model API key.
- Network access to your chosen OpenAI-compatible provider.

## Global Install

```bash
pnpm install -g @contextrail/radar
```

You can also use npm:

```bash
npm install -g @contextrail/radar
```

## Project Install

For project-local use:

```bash
pnpm add -D @contextrail/radar
```

Then call the binaries through your package manager:

```bash
pnpm exec radar --help
pnpm exec radar-mcp
```

## What Install Does Not Do

Install does not automatically add agent rules or MCP config to your project. Copy the examples from:

- `AGENTS.md`
- `.cursor/rules/radar-delegation.mdc`
- [MCP Clients](./mcp-clients.md)

This keeps Radar from mutating projects without an explicit setup step.
