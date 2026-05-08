---
title: Search Before Reading
purpose: Show how to use Radar to locate relevant files before spending host-agent context.
audience: Developers whose agents need to find code locations before answering a question.
user_need: do
doc_form: how-to-guide
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Search Before Reading

Use `search` when you do not know which files matter.

## Example

```bash
radar search \
  -q "RADAR_MAX_CORPUS_BYTES" \
  -g "*.ts" \
  -c "Find where corpus limits are configured and enforced"
```

Radar uses ripgrep when available, reads the matching files, and reports locations with context.

## When To Use It

- You would otherwise grep blindly.
- You need a short map of relevant files.
- You want the host agent to inspect only the important results.

## When Not To Use It

If you already know the files, use `ask`. If you need exact line numbers for an edit, let the host agent inspect the file directly after Radar narrows the search.
