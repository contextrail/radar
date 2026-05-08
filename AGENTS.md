# Radar Delegation Rules

Radar is the worker model. The host agent keeps judgment, intent, debugging, and edits that need exact line-level control.

Before broad reading, searching, summarizing, or drafting, check whether one Radar call can reduce the host context you are about to spend.

## Use Radar

- Use `radar ask` / MCP `ask` when you would read 3+ files, any single large file, or a stable file set to answer one focused question.
- Use `radar search` / MCP `search` when you do not know which files contain the answer.
- Use `radar summarize` / MCP `summarize` for long logs, diffs, transcripts, test output, or chat exports where the signal is buried in noise.
- Use `radar write --dry-run` / MCP `write` with `dryRun: true` for boilerplate, tests, scaffolding, and documentation drafts that match an existing pattern.

## Keep It With The Host Agent

- Do not delegate debugging, architecture, safety-critical reasoning, numerical stability, race conditions, or security judgment.
- Do not delegate tasks under roughly 2000 tokens; the handoff cost is usually not worth it.
- Do not use Radar when exact line numbers or surgical edits are required.
- Treat Radar output as a draft or briefing. Verify facts before editing or shipping.

## Documentation Workflow

1. Use `summarize` on transcripts, diffs, logs, or long notes to extract the document-worthy changes.
2. Use `ask` against the current docs plus the summary to identify exact update needs.
3. Use `write --dry-run` with the current doc as context to draft replacement text.
4. The host agent applies the final edits and checks that the result is accurate.

The rule: the host agent thinks; Radar handles the paperwork.
