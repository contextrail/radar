import { test } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import type OpenAI from "openai";

import { loadConfig, type RadarConfig } from "../src/core/config.js";
import { runAsk } from "../src/core/tools/ask.js";
import { runWrite } from "../src/core/tools/write.js";

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  model: string;
  max_tokens: number;
  messages: ChatMessage[];
}

function makeConfig(overrides: Partial<RadarConfig> = {}): RadarConfig {
  return {
    ...loadConfig({ env: { RADAR_API_KEY: "test-key" } }),
    ...overrides,
  };
}

function makeClient(responseContent = "worker response"): {
  client: OpenAI;
  requests: ChatRequest[];
} {
  const requests: ChatRequest[] = [];
  const client = {
    chat: {
      completions: {
        create: async (request: ChatRequest) => {
          requests.push(request);
          return {
            choices: [{ message: { content: responseContent } }],
            usage: {
              prompt_tokens: 10,
              completion_tokens: 5,
              total_tokens: 15,
            },
          };
        },
      },
    },
  } as unknown as OpenAI;

  return { client, requests };
}

async function tempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "radar-delegation-"));
}

test("ask: sends corpus before question for provider prefix caching", async () => {
  const dir = await tempDir();
  const file = path.join(dir, "a.ts");
  await fs.writeFile(file, "export const answer = 42;\n");
  const { client, requests } = makeClient();

  const result = await runAsk(client, makeConfig(), {
    paths: [file],
    question: "What does this export?",
  });

  assert.equal(result.content, "worker response");
  assert.equal(requests.length, 1);
  assert.match(requests[0]!.messages[1]!.content, /<corpus>/);
  assert.equal(requests[0]!.messages[2]!.content, "What does this export?");
  assert.equal(result.diagnostics?.files, 1);
  assert.equal(result.diagnostics?.truncated_files, 0);
  assert.equal(result.usage?.total_tokens, 15);
});

test("ask: rejects a corpus over the configured total byte cap", async () => {
  const dir = await tempDir();
  const file = path.join(dir, "large.txt");
  await fs.writeFile(file, "x".repeat(200));
  const { client, requests } = makeClient();

  await assert.rejects(
    () =>
      runAsk(client, makeConfig({ maxCorpusBytes: 100 }), {
        paths: [file],
        question: "Summarize this",
      }),
    /corpus is too large/,
  );
  assert.equal(requests.length, 0);
});

test("write: dry-run returns content without writing target", async () => {
  const dir = await tempDir();
  const context = path.join(dir, "context.ts");
  const target = path.join(dir, "target.ts");
  await fs.writeFile(context, "export const existing = true;\n");
  const { client } = makeClient("export const generated = true;\n");

  const result = await runWrite(client, makeConfig(), {
    spec: "Generate a matching file",
    context,
    target,
    dryRun: true,
  });

  assert.equal(result.written, false);
  assert.equal(result.content, "export const generated = true;\n");
  await assert.rejects(() => fs.stat(target), /ENOENT/);
});

test("write: refuses to replace an existing target without update or overwrite", async () => {
  const dir = await tempDir();
  const context = path.join(dir, "context.ts");
  const target = path.join(dir, "target.ts");
  await fs.writeFile(context, "export const existing = true;\n");
  await fs.writeFile(target, "export const keep = true;\n");
  const { client, requests } = makeClient();

  await assert.rejects(
    () =>
      runWrite(client, makeConfig(), {
        spec: "Replace this file",
        context,
        target,
      }),
    /target already exists/,
  );
  assert.equal(requests.length, 0);
});

test("write: update mode includes the current target in the worker prompt", async () => {
  const dir = await tempDir();
  const context = path.join(dir, "context.ts");
  const target = path.join(dir, "target.ts");
  await fs.writeFile(context, "export const style = true;\n");
  await fs.writeFile(target, "export const before = true;\n");
  const { client, requests } = makeClient("export const after = true;\n");

  const result = await runWrite(client, makeConfig(), {
    spec: "Update this file",
    context,
    target,
    update: true,
    dryRun: true,
  });

  assert.equal(result.written, false);
  assert.match(requests[0]!.messages[2]!.content, /<target path=/);
  assert.match(requests[0]!.messages[3]!.content, /Update the target file/);
});
