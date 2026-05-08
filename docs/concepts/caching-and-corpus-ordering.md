---
title: Caching And Corpus Ordering
purpose: Explain why Radar sends stable source material before the changing question.
audience: Developers who want to understand Radar's provider-cache-friendly prompt layout.
user_need: understand
doc_form: concept
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Caching And Corpus Ordering

Radar sends large, stable source material before the smaller changing question.

That message order helps providers with prefix caching:

1. System prompt.
2. Corpus or document.
3. Question or focus instruction.

If you ask several questions about the same files, the corpus prefix can remain stable while only the final question changes.

## Why It Matters

Provider caching can reduce latency and cost when the beginning of a request matches a previous request. Radar's tool implementations preserve that ordering by design.

## Practical Advice

- Group related questions around the same file set.
- Avoid adding unnecessary files to the corpus.
- Use `search` first when you do not know which files matter.
- Use `RADAR_VERBOSE=1` to inspect input size and timing.
