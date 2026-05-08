---
title: Package API
purpose: Show the programmatic API exposed by the Radar npm package.
audience: Developers embedding Radar in scripts or other tooling.
user_need: look-up
doc_form: api-spec
owner: Radar maintainers
status: draft
last_reviewed: 2026-05-07
---

# Package API

Radar exports `RadarService` from the package root.

The package is ESM-only and requires Node.js 20 or newer. CommonJS callers need to use dynamic `import()`.

```typescript
import { RadarService } from "@contextrail/radar";

const radar = new RadarService();

const result = await radar.ask({
  paths: ["src/foo.ts", "src/bar.ts"],
  question: "How do these modules communicate?",
});

console.log(result.content);
```

## Constructor

```typescript
new RadarService(config?: Partial<RadarConfig>);
```

The service loads environment defaults and applies any explicit overrides.

## Methods

- `ask(params)`
- `search(params)`
- `summarize(params)`
- `write(params)`

All methods return `content`, optional `usage`, and optional `diagnostics`.

## Subpath Exports

```typescript
import { startMcpServer } from "@contextrail/radar/mcp";
import { buildCli } from "@contextrail/radar/cli";
```

These exports are mainly for advanced integrations. Most users should use the CLI or MCP server binaries.
