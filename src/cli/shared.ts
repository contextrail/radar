/**
 * Shared CLI helpers.
 */

import type { DiagnosticsInfo, UsageInfo } from "../core/types.js";
import { formatVerboseReport } from "../core/utils/diagnostics.js";

/**
 * Print token usage to stderr if RADAR_VERBOSE is set.
 *
 * Goes to stderr, not stdout, so it doesn't pollute piped output.
 */
export function reportUsage(
  usage: UsageInfo | undefined,
  diagnostics?: DiagnosticsInfo | undefined,
): void {
  if (!process.env.RADAR_VERBOSE) return;
  const report = formatVerboseReport(usage, diagnostics);
  if (report) {
    process.stderr.write(`\n${report}\n`);
  }
}
