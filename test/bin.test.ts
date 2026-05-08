import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { test } from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

test("radar-mcp: --help prints usage and exits", async () => {
  const { stdout, stderr } = await execFileAsync(
    process.execPath,
    ["--import", "tsx", "src/bin/radar-mcp.ts", "--help"],
    { cwd: process.cwd() },
  );

  assert.match(stdout, /Usage: radar-mcp/);
  assert.match(stdout, /MCP server over stdio/);
  assert.equal(stderr, "");
});

test("radar-mcp: --version prints package version and exits", async () => {
  const { stdout, stderr } = await execFileAsync(
    process.execPath,
    ["--import", "tsx", "src/bin/radar-mcp.ts", "--version"],
    { cwd: process.cwd() },
  );

  assert.match(stdout, /^\d+\.\d+\.\d+/);
  assert.equal(stderr, "");
});
