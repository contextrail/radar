---
title: GitHub Actions
purpose: Document the repository automation used to validate Radar and publish docs.
audience: Radar contributors and maintainers.
user_need: understand
doc_form: architecture-overview
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# GitHub Actions

Radar uses GitHub Actions for package validation, documentation publishing, and npm releases.

## CI

The CI workflow runs on pull requests to `main`.

It checks:

- TypeScript type checking.
- ESLint.
- Prettier formatting.
- Unit tests.
- VitePress docs build.
- Package build.
- Dependency audit.

## Release

The release workflow runs on pushes to `main`, `next`, and `beta`. It runs the same validation as CI, builds the package, then runs semantic-release.

semantic-release publishes `@contextrail/radar` to npm, commits release metadata with a short-lived GitHub App token, and creates a GitHub Release with generated notes and the npm tarball attached.

The workflow sets `id-token: write` for npm trusted publishing and provenance. Configure trusted publishing in npm before the first release, using the `release` environment. Store `RELEASE_APP_ID` and `RELEASE_APP_PRIVATE_KEY` on that environment so `actions/create-github-app-token` can mint the release token.

## Documentation Deploy

The docs workflow builds VitePress and deploys the generated site to GitHub Pages.

The workflow sets:

```bash
DOCS_BASE=/radar/
```

Change that value if the final GitHub repository name is not `radar` or if the project uses a custom domain.
