---
title: Delegation Model
purpose: Explain Radar's core routing boundary between host agent and worker model.
audience: Developers deciding when to use Radar during agentic coding.
user_need: understand
doc_form: concept
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Delegation Model

Radar exists because most expensive-agent context loss comes from paperwork, not reasoning.

The host agent should keep work that needs judgment. Radar should handle mechanical input and draft generation.

## The Boundary

Use Radar when the task is mostly:

- Reading files.
- Searching a codebase.
- Summarizing noisy output.
- Drafting boilerplate from an existing pattern.

Keep work with the host agent when the task needs:

- Debugging judgment.
- Architecture or product decisions.
- Security or safety review.
- Race-condition, numerical, or real-time-system reasoning.
- Exact line-level edits.

## Why This Works

Radar turns a large context expense into a small briefing:

1. The host agent chooses what to delegate.
2. Radar reads the large input.
3. The worker model returns a compact summary or draft.
4. The host agent verifies, reasons, and edits.

This preserves the host model's context for the part of the task where it matters most.

## Good Delegation

```bash
radar ask -p src/parser.ts src/transport.ts src/config.ts \
  -q "Which ports and URLs are used for outbound connections?"
```

This is good because the answer is in source material and does not require design judgment.

## Bad Delegation

```bash
radar ask -p src/guidance.ts src/controller.ts \
  -q "Is this control loop safe?"
```

That question requires domain judgment. The host agent should inspect and reason directly, possibly after using Radar only to gather background facts.

## Practical Rule

If the work is under roughly 2000 tokens, keep it with the host agent. If the host would read several files or pages of output before thinking, delegate the reading first.
