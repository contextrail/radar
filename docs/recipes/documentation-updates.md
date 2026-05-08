---
title: Documentation Updates
purpose: Show how to delegate documentation update discovery and drafting to Radar.
audience: Developers maintaining docs after agentic coding sessions.
user_need: do
doc_form: how-to-guide
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Documentation Updates

Documentation updates are one of Radar's highest-value workflows.

## Workflow

1. Summarize the noisy source material.
2. Ask what the current docs need.
3. Draft the update in dry-run mode.
4. Let the host agent apply and verify the final edit.

## Example

Summarize a chat export, diff, or session notes:

```bash
radar summarize -p /tmp/session.txt -f "extract documentation-worthy changes"
```

Ask Radar to compare the summary with current docs:

```bash
radar ask -p /tmp/session-summary.txt README.md docs/delegation-model.md \
  -q "What exact documentation updates are needed?"
```

Draft the update:

```bash
radar write --dry-run --update \
  -s "Update this page with the new routing rules and safety constraints" \
  -c docs/delegation-model.md \
  -t docs/delegation-model.md
```

The host agent should review and apply the final edit. Do not let the worker model be the final authority for documentation accuracy.
