---
title: Contributing
purpose: Explain how contributors can work on Radar locally and submit changes.
audience: OSS contributors and maintainers.
user_need: do
doc_form: onboarding-guide
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Contributing

Radar is a Node 20 TypeScript package.

## Setup

```bash
git clone https://github.com/contextrail/radar
cd radar
pnpm install
```

## Common Commands

```bash
pnpm run check
pnpm run build
pnpm run docs:dev
```

`pnpm run check` runs type checking, ESLint, Prettier check, tests, and the docs build.

## Commit Messages

Use Conventional Commits:

```bash
feat: add a user-facing capability
fix: correct a bug
docs: update project documentation
```

Husky runs commitlint on commit messages. semantic-release uses the same commit history to decide npm versions and GitHub Release notes.

## Documentation

Docs live in `docs/` and are built with VitePress.

When adding docs:

- Keep each page focused on one user need.
- Include front matter with owner, status, audience, purpose, user_need, doc_form, and last_reviewed.
- Prefer short examples that users can run.

## Pull Requests

Before opening a pull request:

```bash
pnpm run check
pnpm run build
```

CI runs the same checks, a dependency audit, and CodeQL analysis.
