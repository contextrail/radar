import type OpenAI from "openai";

import { SYSTEM_PROMPTS } from "../descriptions.js";
import type { RadarConfig } from "../config.js";
import type { AskParams, AskResult } from "../types.js";
import { elapsedMs } from "../utils/diagnostics.js";
import { buildCorpus } from "../utils/files.js";
import { extractUsage } from "../utils/response.js";

export async function runAsk(
  client: OpenAI,
  config: RadarConfig,
  params: AskParams,
): Promise<AskResult> {
  const totalStart = performance.now();
  if (!params.paths || params.paths.length === 0) {
    throw new Error("ask: at least one path is required");
  }

  if (params.paths.length > config.maxFiles) {
    throw new Error(
      `ask: too many files (${params.paths.length}). ` +
        `Radar reads up to ${config.maxFiles} files per call. ` +
        `Narrow the file list or use 'search' for discovery.`,
    );
  }

  if (!params.question || !params.question.trim()) {
    throw new Error("ask: question is required");
  }

  const corpusStart = performance.now();
  const corpus = await buildCorpus(params.paths, {
    maxBytesPerFile: config.maxBytesPerFile,
    maxCorpusBytes: config.maxCorpusBytes,
  });
  const corpusMs = elapsedMs(corpusStart);

  const apiStart = performance.now();
  const resp = await client.chat.completions.create({
    model: config.model,
    max_tokens: config.maxTokensRead,
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.ask },
      { role: "user", content: `<corpus>\n${corpus.content}\n</corpus>` },
      { role: "user", content: params.question },
    ],
  });
  const usage = extractUsage(resp.usage);
  return {
    content: resp.choices[0]?.message?.content ?? "",
    usage,
    diagnostics: {
      files: corpus.files,
      input_bytes: corpus.inputBytes,
      truncated_files: corpus.truncatedFiles,
      corpus_ms: corpusMs,
      api_ms: elapsedMs(apiStart),
      total_ms: elapsedMs(totalStart),
    },
  };
}
