---
title: Release Process
purpose: Explain how Radar is published to npm and GitHub Releases.
audience: Radar maintainers.
user_need: do
doc_form: runbook
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Release Process

Radar releases are automated with semantic-release. Maintainers do not manually edit the package version.

## Release Channels

- `main` publishes stable releases to npm.
- `next` publishes prereleases on the `next` dist-tag.
- `beta` publishes prereleases on the `beta` dist-tag.

## Commit Format

Use Conventional Commits so semantic-release can calculate the next version:

```bash
feat: add new delegation guardrail
fix: preserve diagnostics for MCP responses
docs: update installation guide
```

Breaking changes use `!` or a `BREAKING CHANGE:` footer:

```bash
feat!: change write tool overwrite behavior
```

Husky runs commitlint in the `commit-msg` hook to catch invalid commit messages locally.

## GitHub Actions

The release workflow runs on pushes to release branches. It:

- Installs dependencies from `pnpm-lock.yaml`.
- Audits dependencies.
- Runs the full project check.
- Builds the package.
- Runs semantic-release.

semantic-release then:

- Calculates the next version from commit history.
- Updates `CHANGELOG.md`.
- Updates the published package version.
- Publishes `@contextrail/radar` to npm as a public package.
- Commits release metadata back to the release branch.
- Creates a GitHub Release with generated release notes.
- Attaches the generated npm tarball.

## Required Repository Setup

Before the first release:

- Create the GitHub repository at `contextrail/radar`, or update package metadata and the Pages custom domain if the final repository name or docs domain differs.
- Configure npm trusted publishing for the package and the GitHub Actions release workflow.
- Create a `release` GitHub environment.
- Add `RELEASE_APP_ID` as a variable on the `release` environment.
- Add `RELEASE_APP_PRIVATE_KEY` as a secret on the `release` environment.
- Allow the release GitHub App to bypass the protected release branches in the branch ruleset.
- Ensure GitHub Actions has permission to create releases.
- Ensure the package name `@contextrail/radar` is available or already owned by the organization.

The workflow includes `id-token: write` so npm can publish with provenance through trusted publishing. Do not add a long-lived npm token unless trusted publishing is unavailable and the release workflow is updated intentionally.

## Release Bot

Release commits use a short-lived token minted from a dedicated GitHub App.

Create a GitHub App for releases and install it only on `contextrail/radar`.

The app needs repository permissions:

- Repository contents: read and write.
- Issues: read and write.
- Pull requests: read and write.
- Metadata: read.

In GitHub:

1. Create a GitHub App for release automation.
2. Install the app on `contextrail/radar`.
3. Go to **Settings > Environments** and create `release`.
4. Add `RELEASE_APP_ID` as an environment variable. Use the app's numeric **App ID**, not the client ID.
5. Generate a private key for the app and add it as the `RELEASE_APP_PRIVATE_KEY` environment secret.
6. Go to **Settings > Rules > Rulesets**.
7. Add the release GitHub App to the bypass list for `main`, `next`, and `beta`.
8. Require approval for the `release` environment if you want a human gate before publishing.

In npm trusted publishing, set the environment to `release` because the workflow job uses the `release` environment.
