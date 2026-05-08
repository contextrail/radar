---
title: Troubleshooting
purpose: Help users diagnose common Radar setup and runtime problems.
audience: Developers using Radar from CLI or MCP clients.
user_need: do
doc_form: runbook
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Troubleshooting

## `RADAR_API_KEY not set`

Radar did not receive credentials.

Fix:

```bash
export RADAR_API_KEY=sk-...
```

For MCP clients, make sure the MCP server process receives the same environment variable.

## MCP Tool Hangs Or Feels Slow

Set verbose diagnostics:

```bash
RADAR_VERBOSE=1 radar ask -p README.md -q "What is this?"
```

Inspect:

- `input_bytes`
- `corpus_ms`
- `api_ms`
- `total_ms`
- token usage

If `api_ms` is high, the provider or model is slow. If `input_bytes` is high, narrow the files or lower corpus limits.

## Corpus Too Large

Radar rejected the task before calling the worker model.

Fix one of these:

- Pass fewer files.
- Use `search` before `ask`.
- Summarize a large file first.
- Raise `RADAR_MAX_CORPUS_BYTES` if your provider and budget can handle it.

## `write` Refuses To Replace A File

Radar will not overwrite existing targets by default.

Use one of:

```bash
radar write --dry-run ...
radar write --update ...
radar write --overwrite ...
```

Prefer `--dry-run` for anything the host agent should review.
