import { test } from "node:test";
import assert from "node:assert/strict";
import { validateToolArguments } from "../src/mcp/validation.js";

test("mcp validation: accepts known tool arguments", () => {
  assert.doesNotThrow(() =>
    validateToolArguments("ask", {
      paths: ["src/core/config.ts"],
      question: "How is config loaded?",
    }),
  );
});

test("mcp validation: rejects unknown tool arguments", () => {
  assert.throws(
    () =>
      validateToolArguments("search", {
        query: "RADAR_API_KEY",
        unexpected: true,
      }),
    /search: unknown argument\(s\): unexpected/,
  );
});

test("mcp validation: ignores unknown tool names", () => {
  assert.doesNotThrow(() => validateToolArguments("missing", { anything: true }));
});
