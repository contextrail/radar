---
title: Cost And Token Savings
purpose: Explain why delegating paperwork can reduce host-agent context usage and cost.
audience: Developers evaluating whether Radar is worth adding to their workflow.
user_need: understand
doc_form: concept
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Cost And Token Savings

Radar saves host-model context by replacing raw source material with a compact briefing.

Without delegation, the host agent might read thousands of tokens of files or logs before doing any reasoning. With Radar, the worker model reads the raw input and returns a short result.

## Example

Before Radar:

- Host reads 5 files.
- Host spends context on raw implementation details.
- Host answers after carrying all that context.

With Radar:

- Radar reads the 5 files.
- Worker returns a short briefing.
- Host reads the briefing and reasons from it.

## Measure It

Set `RADAR_VERBOSE=1`:

```bash
RADAR_VERBOSE=1 radar ask -p src/a.ts src/b.ts -q "How do these interact?"
```

Verbose output shows input bytes, timings, and token usage when the provider returns it. Use that data to decide whether future tasks are worth delegating.
