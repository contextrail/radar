#!/usr/bin/env node
/**
 * Radar MCP server binary (stdio transport).
 *
 * Configure your MCP client to launch this binary:
 *   { "mcpServers": { "radar": { "command": "radar-mcp" } } }
 */

import { startMcpServer } from "../mcp/server.js";
import { getPackageVersion } from "../core/version.js";

const HELP = `Usage: radar-mcp [options]

Radar MCP server over stdio.

Configure your MCP client to launch this binary:
  { "mcpServers": { "radar": { "command": "radar-mcp" } } }

Options:
  -V, --version  output the version number
  -h, --help     display help for command
`;

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write(HELP);
  process.exit(0);
}

if (args.includes("--version") || args.includes("-V")) {
  process.stdout.write(`${getPackageVersion()}\n`);
  process.exit(0);
}

startMcpServer().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`radar-mcp: ${message}\n`);
  process.exit(1);
});
