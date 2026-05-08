import type { DiagnosticsInfo, UsageInfo } from "../types.js";

export function elapsedMs(start: number): number {
  return Math.round(performance.now() - start);
}

export function formatVerboseReport(
  usage: UsageInfo | undefined,
  diagnostics: DiagnosticsInfo | undefined,
): string {
  const parts: string[] = [];
  if (diagnostics?.files !== undefined) parts.push(`files=${diagnostics.files}`);
  if (diagnostics?.matches !== undefined) parts.push(`matches=${diagnostics.matches}`);
  if (diagnostics?.input_bytes !== undefined) parts.push(`input_bytes=${diagnostics.input_bytes}`);
  if (diagnostics?.truncated_files !== undefined) {
    parts.push(`truncated_files=${diagnostics.truncated_files}`);
  }
  if (diagnostics?.corpus_ms !== undefined) parts.push(`corpus_ms=${diagnostics.corpus_ms}`);
  if (diagnostics?.api_ms !== undefined) parts.push(`api_ms=${diagnostics.api_ms}`);
  if (diagnostics?.total_ms !== undefined) parts.push(`total_ms=${diagnostics.total_ms}`);
  if (usage?.prompt_tokens !== undefined) parts.push(`prompt_tokens=${usage.prompt_tokens}`);
  if (usage?.completion_tokens !== undefined) {
    parts.push(`completion_tokens=${usage.completion_tokens}`);
  }
  if (usage?.total_tokens !== undefined) parts.push(`total_tokens=${usage.total_tokens}`);
  if (usage?.cost !== undefined) parts.push(`cost=${usage.cost}`);

  return parts.length > 0 ? `[radar verbose: ${parts.join(", ")}]` : "";
}
