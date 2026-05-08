import type { UsageInfo } from "../types.js";

export function stripCodeFences(text: string): string {
  const fenced = text.match(/^```[a-zA-Z0-9_-]*\n([\s\S]*?)\n```\s*$/);
  return fenced ? fenced[1]! : text;
}

export function extractUsage(usage: unknown): UsageInfo | undefined {
  if (!usage || typeof usage !== "object") return undefined;
  const value = usage as Record<string, unknown>;
  return {
    prompt_tokens: typeof value.prompt_tokens === "number" ? value.prompt_tokens : undefined,
    completion_tokens:
      typeof value.completion_tokens === "number" ? value.completion_tokens : undefined,
    total_tokens: typeof value.total_tokens === "number" ? value.total_tokens : undefined,
    cost: typeof value.cost === "number" ? value.cost : undefined,
  };
}
