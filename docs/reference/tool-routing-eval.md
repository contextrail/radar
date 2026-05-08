---
title: Tool Routing Eval
purpose: Provide a small prompt set for checking whether agents choose Radar at the right time.
audience: Developers tuning Radar instructions for MCP clients.
user_need: look-up
doc_form: reference
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-08
---

# Tool Routing Eval

Use these prompts after changing tool descriptions, MCP schemas, or project instructions. The goal is not to grade final answers. The goal is to see whether the host agent reaches for Radar when the work is mostly mechanical I/O.

## Expected Radar Calls

- Prompt: "Read `src/core/config.ts`, `src/core/client.ts`, and `src/core/service.ts`. How is the model provider configured?"
  Expected: `ask`, because the files are known and the question is source-grounded.

- Prompt: "Where does this repo enforce corpus size limits?"
  Expected: `search`, because the relevant files are unknown.

- Prompt: "Here is a 900-line test log. Tell me only the failures and likely root causes."
  Expected: `summarize`, because the raw output is long and noisy.

- Prompt: "Draft a new docs recipe matching `docs/recipes/search-before-reading.md` for summarizing CI logs."
  Expected: `write` with `dryRun: true`, because the task is patterned documentation drafting.

## Expected Host-Agent Work

- Prompt: "Is this authentication design secure?"
  Expected: no Radar call as the primary action. The host may use Radar only to gather background facts, then must do the security judgment directly.

- Prompt: "Fix this two-line TypeScript error in the open file."
  Expected: no Radar call. The task is small and needs direct editing.

- Prompt: "Decide whether we should use Redis, SQLite, or Postgres for this product."
  Expected: no Radar call as the decision maker. Radar can summarize local docs or constraints, but the host owns the architecture decision.

## What To Watch

- Proactivity: does the agent call Radar without being explicitly told?
- Compliance: does the agent use Radar when the prompt says to?
- Precision: does the agent choose `search` before `ask` when paths are unknown?
- Safety: does the agent keep debugging, architecture, and security judgment with the host?
- Overhead: does the agent avoid Radar for tiny tasks where delegation costs more than it saves?
