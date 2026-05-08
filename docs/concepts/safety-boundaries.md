---
title: Safety Boundaries
purpose: Clarify work Radar should not own and how to use worker output safely.
audience: Developers using Radar in serious engineering workflows.
user_need: understand
doc_form: concept
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Safety Boundaries

Radar is not the reasoning authority. It is a worker for mechanical tasks.

## Do Not Delegate

- Debugging subtle behavior.
- Architecture decisions.
- Security judgment.
- Safety-critical systems.
- Numerical stability.
- Race conditions or concurrency analysis.
- Surgical edits that require exact line numbers.

## Safe Use Pattern

Use Radar to gather facts:

```bash
radar ask -p src/controller.ts src/transport.ts \
  -q "Which functions touch the shared connection state?"
```

Then have the host agent inspect, reason, and edit directly.

## Treat Drafts As Drafts

`write` output should be reviewed before it is committed. Prefer `--dry-run` for docs, tests, config, and code generation.
