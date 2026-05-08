---
title: Bulk Code Reading
purpose: Show how to use Radar when an answer is spread across known files.
audience: Developers asking coding agents to understand code without exhausting host-model context.
user_need: do
doc_form: how-to-guide
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Bulk Code Reading

Use `ask` when you already know which files contain the information.

## Example

```bash
radar ask \
  -p src/cli/index.ts src/core/config.ts src/mcp/server.ts \
  -q "How does configuration flow from CLI or MCP into the service?"
```

Radar reads the files and returns a compact briefing. The host agent uses that briefing to reason and edit.

## Good Questions

- "Which environment variables are read and where?"
- "Which files define the MCP tool schemas?"
- "What ports, URLs, or paths are used?"
- "What are the public exports?"

## Avoid

Do not ask Radar to decide whether an architecture is correct, whether a security design is safe, or whether subtle concurrency code is bug-free. Use Radar to gather facts, then let the host agent reason.
