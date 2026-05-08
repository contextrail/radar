/**
 * OpenAI-compatible client factory.
 *
 * The OpenAI SDK works against any provider that exposes a compatible
 * /v1/chat/completions endpoint. By centralizing client construction here,
 * we keep the service layer free of provider-specific concerns.
 */

import OpenAI from "openai";
import type { RadarConfig } from "./config.js";

export function createClient(config: RadarConfig): OpenAI {
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseUrl,
    timeout: config.timeoutMs,
  });
}
