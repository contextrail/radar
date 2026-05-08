---
title: Boilerplate Generation
purpose: Show how to draft repetitive files with Radar while keeping review with the host agent.
audience: Developers generating tests, docs, config, and scaffolding from existing patterns.
user_need: do
doc_form: how-to-guide
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Boilerplate Generation

Use `write` for repetitive work that follows an existing pattern.

## Draft A New File

```bash
radar write --dry-run \
  -s "node:test coverage for config validation" \
  -c test/config.test.ts \
  -t test/new-config.test.ts
```

Review the output before writing it.

## Update An Existing File

```bash
radar write --dry-run --update \
  -s "add a troubleshooting section for provider timeouts" \
  -c README.md \
  -t README.md
```

`--update` reads the target and asks the worker model to return the complete updated target content.

## Overwrite Deliberately

Radar refuses to replace an existing target unless you pass `--update`, `--overwrite`, or `--dry-run`.

```bash
radar write --overwrite \
  -s "regenerate this fixture from the reference pattern" \
  -c test/reference.test.ts \
  -t test/generated.test.ts
```

Use overwrite only when replacing the file is the intended outcome.
