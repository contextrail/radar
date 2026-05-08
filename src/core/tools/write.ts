import * as fs from "node:fs/promises";
import * as path from "node:path";
import type OpenAI from "openai";

import { SYSTEM_PROMPTS } from "../descriptions.js";
import type { RadarConfig } from "../config.js";
import type { WriteParams, WriteResult } from "../types.js";
import { elapsedMs } from "../utils/diagnostics.js";
import { readFileTruncated } from "../utils/files.js";
import { extractUsage, stripCodeFences } from "../utils/response.js";

export async function runWrite(
  client: OpenAI,
  config: RadarConfig,
  params: WriteParams,
): Promise<WriteResult> {
  const totalStart = performance.now();
  if (!params.spec?.trim()) throw new Error("write: spec is required");
  if (!params.context?.trim()) {
    throw new Error("write: context (reference path) is required");
  }
  if (!params.target?.trim()) throw new Error("write: target path is required");

  const targetExists = await fileExists(params.target);
  if (params.update && !targetExists) {
    throw new Error("write: update mode requires the target file to already exist");
  }
  if (targetExists && !params.update && !params.overwrite && !params.dryRun) {
    throw new Error(
      "write: target already exists. Use dryRun to preview, update to revise it, or overwrite to replace it.",
    );
  }

  const corpusStart = performance.now();
  const reference = await readFileTruncated(params.context, config.maxBytesPerFile);
  const target = params.update
    ? await readFileTruncated(params.target, config.maxBytesPerFile)
    : undefined;
  const inputBytes = Buffer.byteLength(reference + (target ?? ""), "utf8");
  if (inputBytes > config.maxCorpusBytes) {
    throw new Error(
      `write context is too large (${inputBytes} bytes). ` +
        `Radar accepts up to ${config.maxCorpusBytes} bytes per write call.`,
    );
  }
  const corpusMs = elapsedMs(corpusStart);

  const userMessages = [
    {
      role: "user" as const,
      content: `<reference path="${params.context}">\n${reference}\n</reference>`,
    },
  ];
  if (target !== undefined) {
    userMessages.push({
      role: "user",
      content: `<target path="${params.target}">\n${target}\n</target>`,
    });
  }

  const instruction = params.update
    ? `Update the target file according to the spec while preserving its existing style and intent.\n\n`
    : `Generate a file matching the reference's style and conventions.\n\n`;

  const apiStart = performance.now();
  const resp = await client.chat.completions.create({
    model: config.model,
    max_tokens: config.maxTokensWrite,
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.write },
      ...userMessages,
      {
        role: "user",
        content:
          instruction +
          `Spec: ${params.spec}\n\n` +
          `Output ONLY the complete target file contents. No markdown fences, no preamble.`,
      },
    ],
  });
  const usage = extractUsage(resp.usage);

  const generated = stripCodeFences(resp.choices[0]?.message?.content ?? "");

  if (!params.dryRun) {
    await fs.mkdir(path.dirname(params.target), { recursive: true });
    await fs.writeFile(params.target, generated);
  }

  return {
    content: generated,
    written: !params.dryRun,
    target: params.target,
    usage,
    diagnostics: {
      input_bytes: inputBytes,
      corpus_ms: corpusMs,
      api_ms: elapsedMs(apiStart),
      total_ms: elapsedMs(totalStart),
    },
  };
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
