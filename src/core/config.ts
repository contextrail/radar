/**
 * Configuration loading for Radar.
 *
 * Radar is model-agnostic — anything with an OpenAI-compatible chat completions
 * endpoint works. Default points at Moonshot (Kimi K2.5), but you can swap
 * to DeepSeek, Together, Groq, Gemini (via OpenAI-compat), local Ollama, etc.
 * by setting RADAR_BASE_URL and RADAR_MODEL.
 */

export interface RadarConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  /** Max tokens for read-style operations (ask, search, summarize) */
  maxTokensRead: number;
  /** Max tokens for generation operations (write) */
  maxTokensWrite: number;
  /** Max files for ask operations */
  maxFiles: number;
  /** Max search matches Radar will read into context */
  maxSearchMatches: number;
  /** Max bytes to read from an individual file */
  maxBytesPerFile: number;
  /** Max total bytes sent in a single corpus */
  maxCorpusBytes: number;
  /** System prompt prefix (rarely needs override) */
  systemPromptPrefix?: string;
  /** Optional request timeout in ms */
  timeoutMs: number;
}

export interface LoadConfigOptions {
  /** Override env vars programmatically (mainly for tests) */
  env?: NodeJS.ProcessEnv;
  /** Throw if API key missing (default: true) */
  requireApiKey?: boolean;
}

const DEFAULT_BASE_URL = "https://api.moonshot.ai/v1";
const DEFAULT_MODEL = "kimi-k2.5";
const DEFAULT_MAX_TOKENS_READ = 8192;
const DEFAULT_MAX_TOKENS_WRITE = 16384;
const DEFAULT_MAX_FILES = 30;
const DEFAULT_MAX_SEARCH_MATCHES = 20;
const DEFAULT_MAX_BYTES_PER_FILE = 500_000;
const DEFAULT_MAX_CORPUS_BYTES = 2_000_000;
const DEFAULT_TIMEOUT_MS = 30_000;

export function loadConfig(options: LoadConfigOptions = {}): RadarConfig {
  const env = options.env ?? process.env;
  const requireApiKey = options.requireApiKey ?? true;

  const apiKey = env.RADAR_API_KEY ?? env.MOONSHOT_API_KEY ?? "";
  if (requireApiKey && !apiKey) {
    throw new Error(
      "RADAR_API_KEY not set. Radar can't report for duty without credentials.\n" +
        "Set it via: export RADAR_API_KEY=sk-...\n" +
        "Or fall back to MOONSHOT_API_KEY if using Kimi.",
    );
  }

  return {
    apiKey,
    baseUrl: env.RADAR_BASE_URL ?? DEFAULT_BASE_URL,
    model: env.RADAR_MODEL ?? DEFAULT_MODEL,
    maxTokensRead: parsePositiveInt(env.RADAR_MAX_READ, DEFAULT_MAX_TOKENS_READ),
    maxTokensWrite: parsePositiveInt(env.RADAR_MAX_WRITE, DEFAULT_MAX_TOKENS_WRITE),
    maxFiles: parsePositiveInt(env.RADAR_MAX_FILES, DEFAULT_MAX_FILES),
    maxSearchMatches: parsePositiveInt(env.RADAR_MAX_SEARCH_MATCHES, DEFAULT_MAX_SEARCH_MATCHES),
    maxBytesPerFile: parsePositiveInt(env.RADAR_MAX_BYTES_PER_FILE, DEFAULT_MAX_BYTES_PER_FILE),
    maxCorpusBytes: parsePositiveInt(env.RADAR_MAX_CORPUS_BYTES, DEFAULT_MAX_CORPUS_BYTES),
    timeoutMs: parsePositiveInt(env.RADAR_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
  };
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}
