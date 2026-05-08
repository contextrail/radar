import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ASK_DESCRIPTION,
  RADAR_TAGLINE,
  SEARCH_DESCRIPTION,
  SUMMARIZE_DESCRIPTION,
  SYSTEM_PROMPTS,
  WRITE_DESCRIPTION,
} from "../src/core/descriptions.js";
import { tools } from "../src/mcp/tools.js";

test("descriptions: all tool descriptions are non-empty", () => {
  assert.ok(ASK_DESCRIPTION.length > 50);
  assert.ok(SEARCH_DESCRIPTION.length > 50);
  assert.ok(SUMMARIZE_DESCRIPTION.length > 50);
  assert.ok(WRITE_DESCRIPTION.length > 50);
});

test("descriptions: tool descriptions include 'do not use' guidance", () => {
  // Sharp boundaries are critical for routing — every description should have a negative case
  for (const desc of [
    ASK_DESCRIPTION,
    SEARCH_DESCRIPTION,
    SUMMARIZE_DESCRIPTION,
    WRITE_DESCRIPTION,
  ]) {
    assert.match(desc, /do not use|DO NOT/i);
  }
});

test("descriptions: system prompts are present for all four tools", () => {
  assert.ok(SYSTEM_PROMPTS.ask);
  assert.ok(SYSTEM_PROMPTS.search);
  assert.ok(SYSTEM_PROMPTS.summarize);
  assert.ok(SYSTEM_PROMPTS.write);
});

test("descriptions: system prompts identify the worker as Radar", () => {
  // Persona consistency across all delegation surfaces
  assert.match(SYSTEM_PROMPTS.ask, /Radar/);
  assert.match(SYSTEM_PROMPTS.search, /Radar/);
  assert.match(SYSTEM_PROMPTS.summarize, /Radar/);
  assert.match(SYSTEM_PROMPTS.write, /Radar/);
});

test("descriptions: tagline reinforces the metaphor", () => {
  assert.match(RADAR_TAGLINE, /clerk|legwork|company/i);
});

test("mcp tools: routing metadata describes read/write risk", () => {
  for (const name of ["ask", "search", "summarize"]) {
    const tool = getTool(name);
    assert.ok(tool.title);
    assert.equal(tool.annotations.readOnlyHint, true);
    assert.equal(tool.annotations.destructiveHint, false);
  }

  const write = getTool("write");
  assert.ok(write.title);
  assert.equal(write.annotations.readOnlyHint, false);
  assert.equal(write.annotations.destructiveHint, true);
});

test("mcp tools: input schemas reject ambiguous or loose payloads", () => {
  for (const tool of tools) {
    assert.equal(tool.inputSchema.additionalProperties, false);
  }

  const summarize = getTool("summarize");
  const summarizeSchema = summarize.inputSchema as { oneOf?: unknown };
  assert.deepEqual(summarizeSchema.oneOf, [
    { required: ["path"], not: { required: ["content"] } },
    { required: ["content"], not: { required: ["path"] } },
  ]);
});

function getTool(name: string) {
  const tool = tools.find((candidate) => candidate.name === name);
  assert.ok(tool, `Expected MCP tool ${name} to exist`);
  return tool;
}
