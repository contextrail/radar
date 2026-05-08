import type OpenAI from "openai";

import { SYSTEM_PROMPTS } from "../descriptions.js";
import type { RadarConfig } from "../config.js";
import type { SummarizeParams, SummarizeResult } from "../types.js";
import { elapsedMs } from "../utils/diagnostics.js";
import { readFileTruncated } from "../utils/files.js";
import { extractUsage } from "../utils/response.js";

export async function runSummarize(
  client: OpenAI,
  config: RadarConfig,
  params: SummarizeParams,
): Promise<SummarizeResult> {
  const totalStart = performance.now();
  if (!params.path && !params.content) {
    throw new Error("summarize: provide either 'path' or 'content'");
  }

  if (params.path && params.content) {
    throw new Error("summarize: provide 'path' OR 'content', not both");
  }

  const corpusStart = performance.now();
  const content = params.path
    ? await readFileTruncated(params.path, config.maxBytesPerFile)
    : params.content!;
  const inputBytes = Buffer.byteLength(content, "utf8");
  if (inputBytes > config.maxCorpusBytes) {
    throw new Error(
      `document is too large (${inputBytes} bytes). ` +
        `Radar accepts up to ${config.maxCorpusBytes} bytes per summarize call.`,
    );
  }
  const corpusMs = elapsedMs(corpusStart);
  const focus = params.focus?.trim() || "Extract the key signal from this document.";

  const apiStart = performance.now();
  const resp = await client.chat.completions.create({
    model: config.model,
    max_tokens: config.maxTokensRead,
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.summarize },
      { role: "user", content: `<document>\n${content}\n</document>` },
      { role: "user", content: focus },
    ],
  });
  const usage = extractUsage(resp.usage);

  return {
    content: resp.choices[0]?.message?.content ?? "",
    usage,
    diagnostics: {
      input_bytes: inputBytes,
      corpus_ms: corpusMs,
      api_ms: elapsedMs(apiStart),
      total_ms: elapsedMs(totalStart),
    },
  };
}
