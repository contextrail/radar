---
title: Security
purpose: Explain how to report security issues and use Radar safely with source material.
audience: Radar users, contributors, and maintainers.
user_need: understand
doc_form: runbook
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Security

Radar sends selected source material, logs, transcripts, and prompts to your configured worker model provider.

## Before Delegating

Check whether the material can leave your machine or organization.

Do not send:

- Secrets.
- Credentials.
- Private keys.
- Regulated personal data.
- Proprietary source code to providers you are not approved to use.

## Provider Choice

Radar is provider-neutral. You control:

- `RADAR_BASE_URL`
- `RADAR_MODEL`
- `RADAR_API_KEY`

Use a provider that matches your project security requirements. For sensitive work, consider an approved private endpoint or local model.

## Reporting Vulnerabilities

Report suspected security vulnerabilities privately by emailing `support@contextrail.com`.

Do not open public GitHub issues for vulnerabilities, exposed credentials, private keys, or sensitive data exposure. Include affected versions, commands, logs with secrets redacted, and expected impact when possible.

## Development Dependency Advisories

CI and release workflows run `pnpm run security:audit`, which fails on high or critical advisories.

Moderate advisories currently come from the local VitePress documentation toolchain. They affect dev-server behavior, not Radar's published runtime dependencies. Maintainers should continue tracking VitePress, Vite, and esbuild updates and upgrade when patched versions are available in the docs stack.
