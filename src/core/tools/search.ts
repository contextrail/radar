import type OpenAI from "openai";

import { SYSTEM_PROMPTS } from "../descriptions.js";
import type { RadarConfig } from "../config.js";
import type { SearchParams, SearchResult } from "../types.js";
import { elapsedMs } from "../utils/diagnostics.js";
import { buildCorpus } from "../utils/files.js";
import { extractUsage } from "../utils/response.js";
import { findMatches } from "../utils/search.js";

export async function runSearch(
  client: OpenAI,
  config: RadarConfig,
  params: SearchParams,
): Promise<SearchResult> {
  const totalStart = performance.now();
  if (!params.query || !params.query.trim()) {
    throw new Error("search: query is required");
  }

  const root = params.root ?? process.cwd();
  const matchFiles = await findMatches(params.query, root, params.glob);

  if (matchFiles.length === 0) {
    return {
      content: `Radar swept ${root} but found no matches for: ${params.query}`,
      matches: [],
    };
  }

  const limited = matchFiles.slice(0, config.maxSearchMatches);
  const corpusStart = performance.now();
  const corpus = await buildCorpus(limited, {
    maxBytesPerFile: config.maxBytesPerFile,
    maxCorpusBytes: config.maxCorpusBytes,
  });
  const corpusMs = elapsedMs(corpusStart);
  const userPrompt =
    `Find: ${params.query}\n\n` +
    (params.context ? `Context: ${params.context}\n\n` : "") +
    `Report file:line locations and why each match is relevant.`;

  const apiStart = performance.now();
  const resp = await client.chat.completions.create({
    model: config.model,
    max_tokens: config.maxTokensRead,
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.search },
      { role: "user", content: `<corpus>\n${corpus.content}\n</corpus>` },
      { role: "user", content: userPrompt },
    ],
  });
  const usage = extractUsage(resp.usage);

  return {
    content: resp.choices[0]?.message?.content ?? "",
    matches: limited,
    usage,
    diagnostics: {
      files: corpus.files,
      matches: limited.length,
      input_bytes: corpus.inputBytes,
      truncated_files: corpus.truncatedFiles,
      corpus_ms: corpusMs,
      api_ms: elapsedMs(apiStart),
      total_ms: elapsedMs(totalStart),
    },
  };
}
