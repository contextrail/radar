#!/usr/bin/env node
/**
 * Radar CLI binary.
 */

import { buildCli } from "../cli/index.js";

buildCli()
  .parseAsync(process.argv)
  .catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`radar: ${message}\n`);
    process.exit(1);
  });
