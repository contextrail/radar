---
title: Environment Variables
purpose: Provide a concise lookup table for all Radar environment variables.
audience: Developers configuring Radar locally, in MCP clients, or in CI.
user_need: look-up
doc_form: reference
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Environment Variables

| Variable                   | Default                      | Purpose                                    |
| -------------------------- | ---------------------------- | ------------------------------------------ |
| `RADAR_API_KEY`            | required                     | API key for the worker model               |
| `MOONSHOT_API_KEY`         | unset                        | Fallback API key for Moonshot users        |
| `RADAR_BASE_URL`           | `https://api.moonshot.ai/v1` | OpenAI-compatible endpoint                 |
| `RADAR_MODEL`              | `kimi-k2.5`                  | Worker model name                          |
| `RADAR_MAX_READ`           | `8192`                       | Max completion tokens for read-style tools |
| `RADAR_MAX_WRITE`          | `16384`                      | Max completion tokens for `write`          |
| `RADAR_MAX_FILES`          | `30`                         | Max files for `ask`                        |
| `RADAR_MAX_SEARCH_MATCHES` | `20`                         | Max search matches to read                 |
| `RADAR_MAX_BYTES_PER_FILE` | `500000`                     | Max bytes read from one file               |
| `RADAR_MAX_CORPUS_BYTES`   | `2000000`                    | Max bytes sent in one worker call          |
| `RADAR_TIMEOUT_MS`         | `30000`                      | Request timeout in milliseconds            |
| `RADAR_VERBOSE`            | unset                        | Print timing and token diagnostics         |
