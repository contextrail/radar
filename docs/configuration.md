---
title: Configuration
purpose: Explain Radar environment variables, defaults, and provider overrides.
audience: Developers configuring Radar for a worker model provider.
user_need: look-up
doc_form: reference
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Configuration

Radar reads configuration from environment variables. The only required value is a worker model API key.

## Required

```bash
export RADAR_API_KEY=sk-...
```

If you use Moonshot, Radar also accepts `MOONSHOT_API_KEY` as a fallback.

## Provider Examples

Moonshot / Kimi:

```bash
export RADAR_BASE_URL=https://api.moonshot.ai/v1
export RADAR_MODEL=kimi-k2.5
```

DeepSeek:

```bash
export RADAR_BASE_URL=https://api.deepseek.com/v1
export RADAR_MODEL=deepseek-chat
```

Together:

```bash
export RADAR_BASE_URL=https://api.together.xyz/v1
export RADAR_MODEL=Qwen/Qwen2.5-72B-Instruct-Turbo
```

Local Ollama:

```bash
export RADAR_BASE_URL=http://localhost:11434/v1
export RADAR_MODEL=qwen2.5-coder:32b
```

## Limits

Radar enforces input limits before calling the worker model.

| Variable                   |   Default | Purpose                                                    |
| -------------------------- | --------: | ---------------------------------------------------------- |
| `RADAR_MAX_READ`           |    `8192` | Max completion tokens for `ask`, `search`, and `summarize` |
| `RADAR_MAX_WRITE`          |   `16384` | Max completion tokens for `write`                          |
| `RADAR_MAX_FILES`          |      `30` | Max files for `ask`                                        |
| `RADAR_MAX_SEARCH_MATCHES` |      `20` | Max search results Radar reads                             |
| `RADAR_MAX_BYTES_PER_FILE` |  `500000` | Max bytes read from one file                               |
| `RADAR_MAX_CORPUS_BYTES`   | `2000000` | Max bytes sent to one worker call                          |
| `RADAR_TIMEOUT_MS`         |   `30000` | OpenAI-compatible request timeout                          |

## Verbose Diagnostics

Set `RADAR_VERBOSE=1` to print delegation metrics:

```bash
export RADAR_VERBOSE=1
```

Verbose output includes file counts, input bytes, corpus-build time, API time, total time, and token usage when the provider returns it.
