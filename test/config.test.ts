import { test } from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/core/config.js";

test("loadConfig: reads RADAR_API_KEY from env", () => {
  const config = loadConfig({
    env: { RADAR_API_KEY: "test-key" },
  });
  assert.equal(config.apiKey, "test-key");
});

test("loadConfig: falls back to MOONSHOT_API_KEY", () => {
  const config = loadConfig({
    env: { MOONSHOT_API_KEY: "moonshot-key" },
  });
  assert.equal(config.apiKey, "moonshot-key");
});

test("loadConfig: throws when no api key and required", () => {
  assert.throws(() => loadConfig({ env: {} }), /RADAR_API_KEY not set/);
});

test("loadConfig: skips api key check when requireApiKey=false", () => {
  const config = loadConfig({ env: {}, requireApiKey: false });
  assert.equal(config.apiKey, "");
});

test("loadConfig: applies defaults when env vars unset", () => {
  const config = loadConfig({ env: { RADAR_API_KEY: "k" } });
  assert.equal(config.baseUrl, "https://api.moonshot.ai/v1");
  assert.equal(config.model, "kimi-k2.5");
  assert.equal(config.maxTokensRead, 8192);
  assert.equal(config.maxTokensWrite, 16384);
  assert.equal(config.maxFiles, 30);
  assert.equal(config.maxSearchMatches, 20);
  assert.equal(config.maxBytesPerFile, 500_000);
  assert.equal(config.maxCorpusBytes, 2_000_000);
  assert.equal(config.timeoutMs, 30_000);
});

test("loadConfig: respects RADAR_BASE_URL and RADAR_MODEL", () => {
  const config = loadConfig({
    env: {
      RADAR_API_KEY: "k",
      RADAR_BASE_URL: "https://api.deepseek.com/v1",
      RADAR_MODEL: "deepseek-chat",
    },
  });
  assert.equal(config.baseUrl, "https://api.deepseek.com/v1");
  assert.equal(config.model, "deepseek-chat");
});

test("loadConfig: parses numeric env vars", () => {
  const config = loadConfig({
    env: {
      RADAR_API_KEY: "k",
      RADAR_MAX_READ: "4096",
      RADAR_MAX_WRITE: "32768",
      RADAR_MAX_FILES: "12",
      RADAR_MAX_SEARCH_MATCHES: "7",
      RADAR_MAX_BYTES_PER_FILE: "12345",
      RADAR_MAX_CORPUS_BYTES: "67890",
      RADAR_TIMEOUT_MS: "60000",
    },
  });
  assert.equal(config.maxTokensRead, 4096);
  assert.equal(config.maxTokensWrite, 32768);
  assert.equal(config.maxFiles, 12);
  assert.equal(config.maxSearchMatches, 7);
  assert.equal(config.maxBytesPerFile, 12345);
  assert.equal(config.maxCorpusBytes, 67890);
  assert.equal(config.timeoutMs, 60_000);
});

test("loadConfig: invalid numeric env vars fall back to defaults", () => {
  const config = loadConfig({
    env: {
      RADAR_API_KEY: "k",
      RADAR_MAX_READ: "not-a-number",
      RADAR_MAX_WRITE: "-100",
    },
  });
  assert.equal(config.maxTokensRead, 8192);
  assert.equal(config.maxTokensWrite, 16384);
});
