/**
 * RadarService — the transport-agnostic facade for Radar's core tools.
 *
 * The CLI and MCP server both instantiate this class and call the same four
 * methods. Each tool's implementation lives under `core/tools`, while shared
 * helpers live under `core/utils`.
 */

import type OpenAI from "openai";

import { createClient } from "./client.js";
import { loadConfig, type RadarConfig } from "./config.js";
import { runAsk } from "./tools/ask.js";
import { runSearch } from "./tools/search.js";
import { runSummarize } from "./tools/summarize.js";
import { runWrite } from "./tools/write.js";
import type {
  AskParams,
  AskResult,
  SearchParams,
  SearchResult,
  SummarizeParams,
  SummarizeResult,
  WriteParams,
  WriteResult,
} from "./types.js";

export class RadarService {
  private readonly config: RadarConfig;
  private client: OpenAI | null = null;

  constructor(config?: Partial<RadarConfig>) {
    const loaded = loadConfig();
    this.config = { ...loaded, ...config };
  }

  /** Lazy client initialization so config errors surface at call time, not construct time. */
  private getClient(): OpenAI {
    if (!this.client) {
      this.client = createClient(this.config);
    }
    return this.client;
  }

  async ask(params: AskParams): Promise<AskResult> {
    return runAsk(this.getClient(), this.config, params);
  }

  async search(params: SearchParams): Promise<SearchResult> {
    return runSearch(this.getClient(), this.config, params);
  }

  async summarize(params: SummarizeParams): Promise<SummarizeResult> {
    return runSummarize(this.getClient(), this.config, params);
  }

  async write(params: WriteParams): Promise<WriteResult> {
    return runWrite(this.getClient(), this.config, params);
  }
}
