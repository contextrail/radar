import { test } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import { RadarService } from "../src/core/service.js";

// These tests exercise input validation only — they don't make API calls.
// Network behavior should be tested via integration tests with a real or
// recorded API.

async function tmpFile(content: string): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "radar-test-"));
  const file = path.join(dir, "test.txt");
  await fs.writeFile(file, content);
  return file;
}

function makeService(): RadarService {
  // Bypass config loading by passing partial config that satisfies the type
  process.env.RADAR_API_KEY = "test-key";
  return new RadarService();
}

test("ask: rejects empty paths array", async () => {
  const radar = makeService();
  await assert.rejects(
    () => radar.ask({ paths: [], question: "hello" }),
    /at least one path is required/,
  );
});

test("ask: rejects empty question", async () => {
  const radar = makeService();
  const file = await tmpFile("hello");
  await assert.rejects(() => radar.ask({ paths: [file], question: "" }), /question is required/);
});

test("ask: rejects too many files", async () => {
  const radar = makeService();
  const paths = Array.from({ length: 50 }, (_, i) => `file${i}.txt`);
  await assert.rejects(() => radar.ask({ paths, question: "hi" }), /too many files/);
});

test("search: rejects empty query", async () => {
  const radar = makeService();
  await assert.rejects(() => radar.search({ query: "" }), /query is required/);
});

test("summarize: rejects when neither path nor content provided", async () => {
  const radar = makeService();
  await assert.rejects(() => radar.summarize({}), /provide either 'path' or 'content'/);
});

test("summarize: rejects when both path and content provided", async () => {
  const radar = makeService();
  await assert.rejects(() => radar.summarize({ path: "x", content: "y" }), /not both/);
});

test("write: rejects missing spec", async () => {
  const radar = makeService();
  await assert.rejects(
    () => radar.write({ spec: "", context: "a", target: "b" }),
    /spec is required/,
  );
});

test("write: rejects missing context", async () => {
  const radar = makeService();
  await assert.rejects(
    () => radar.write({ spec: "a", context: "", target: "b" }),
    /context.*is required/,
  );
});

test("write: rejects missing target", async () => {
  const radar = makeService();
  await assert.rejects(
    () => radar.write({ spec: "a", context: "b", target: "" }),
    /target.*is required/,
  );
});
