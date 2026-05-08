---
title: Long Log Summarization
purpose: Show how to delegate noisy logs, test output, transcripts, and diffs to Radar.
audience: Developers who need signal from long command output without spending host-agent context.
user_need: do
doc_form: how-to-guide
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Long Log Summarization

Use `summarize` when the raw content is mostly noise around a few important facts.

## From A File

```bash
radar summarize -p test-output.log -f "focus on failures and root causes"
```

## From Stdin

```bash
pnpm test 2>&1 | radar summarize --stdin -f "what failed and what should I inspect?"
```

## Good Focus Prompts

- "Focus on failures and root causes."
- "Extract action items for documentation updates."
- "Group related errors and ignore repeated stack frames."
- "Summarize only behavior changes from this diff."

## Keep With The Host Agent

If the output is short, read it directly. Radar is most useful when the output is long enough that reading it would crowd out the host agent's reasoning context.
