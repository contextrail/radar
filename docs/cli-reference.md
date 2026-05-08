---
title: CLI Reference
purpose: Provide a lookup reference for Radar CLI commands and flags.
audience: Developers using Radar from a terminal or through a shell-capable agent.
user_need: look-up
doc_form: reference
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# CLI Reference

Radar provides four commands.

## `radar ask`

Read known files and answer one focused question.

```bash
radar ask -p <file...> -q "<question>"
```

Options:

- `-p, --paths <paths...>`: files for Radar to read.
- `-q, --question <question>`: what you need answered.

## `radar search`

Find files before the host agent reads them.

```bash
radar search -q "<query>" --glob "*.ts"
```

Options:

- `-q, --query <query>`: literal or regex query.
- `-r, --root <path>`: directory to search.
- `-c, --context <text>`: why you are searching.
- `-g, --glob <glob>`: file glob, such as `*.py` or `*.{ts,tsx}`.

## `radar summarize`

Extract signal from a file or stdin.

```bash
radar summarize -p test-output.log -f "focus on failures"
```

```bash
pnpm test 2>&1 | radar summarize --stdin -f "what failed and why?"
```

Options:

- `-p, --path <path>`: file to summarize.
- `-f, --focus <focus>`: what to focus on.
- `--stdin`: read content from stdin.

## `radar write`

Draft a file from a spec and reference pattern.

```bash
radar write -s "<spec>" -c <reference> -t <target> --dry-run
```

Options:

- `-s, --spec <spec>`: what to generate.
- `-c, --context <path>`: reference file to match.
- `-t, --target <path>`: where to write the result.
- `--dry-run`: print output without writing.
- `--update`: read and update an existing target.
- `--overwrite`: allow replacing an existing target outside update mode.

Use `--dry-run` first when drafting documentation or code that a host agent should review.
