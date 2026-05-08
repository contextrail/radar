---
title: Host vs Worker
purpose: Define the responsibilities of the expensive host agent and the cheaper Radar worker.
audience: Developers tuning agent workflows around Radar.
user_need: understand
doc_form: concept
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Host vs Worker

The host agent is responsible for intent, judgment, verification, and final edits.

Radar is responsible for mechanical work:

- Reading.
- Searching.
- Summarizing.
- Drafting.

This division keeps expensive model context focused on decisions rather than input processing.

## Host Responsibilities

- Decide whether a task should be delegated.
- Verify Radar's output against source material when correctness matters.
- Apply surgical edits.
- Own architecture, debugging, and safety decisions.

## Worker Responsibilities

- Process large source material.
- Return concise briefings.
- Draft pattern-matched output.
- Preserve stable corpus ordering for provider caching.

Radar output should change what the host agent reads, not who owns the final answer.
