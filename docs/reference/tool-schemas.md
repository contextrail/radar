---
title: Tool Schemas
purpose: Provide a lookup reference for Radar MCP tool inputs.
audience: Developers integrating Radar with MCP clients or programmatic wrappers.
user_need: look-up
doc_form: api-spec
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Tool Schemas

Radar exposes four MCP tools.

## `ask`

```json
{
  "paths": ["src/a.ts", "src/b.ts"],
  "question": "How do these modules communicate?"
}
```

Required:

- `paths`: array of file paths.
- `question`: focused question about those files.

Validation:

- `paths` must contain at least one non-empty path.
- `question` must be non-empty.
- Extra properties are rejected.

## `search`

```json
{
  "query": "RADAR_API_KEY",
  "root": ".",
  "glob": "*.ts",
  "context": "Find where config is loaded"
}
```

Required:

- `query`: literal string or regex pattern.

Optional:

- `root`
- `glob`
- `context`

Validation:

- All provided string fields must be non-empty.
- Extra properties are rejected.

## `summarize`

```json
{
  "path": "test-output.log",
  "focus": "focus on failures"
}
```

Provide either:

- `path`
- `content`

Optional:

- `focus`

Validation:

- Provide exactly one of `path` or `content`.
- All provided string fields must be non-empty.
- Extra properties are rejected.

## `write`

```json
{
  "spec": "Generate a test file matching this reference",
  "context": "test/config.test.ts",
  "target": "test/new-config.test.ts",
  "dryRun": true
}
```

Required:

- `spec`
- `context`
- `target`

Optional:

- `dryRun`
- `update`
- `overwrite`

Validation:

- `spec`, `context`, and `target` must be non-empty.
- Extra properties are rejected.
