/**
 * Radar CLI entry point.
 *
 * Builds the commander program. The actual binary (bin/radar.ts) calls
 * buildCli().parseAsync(process.argv).
 */

import { Command } from "commander";

import { askCommand } from "./commands/ask.js";
import { searchCommand } from "./commands/search.js";
import { summarizeCommand } from "./commands/summarize.js";
import { writeCommand } from "./commands/write.js";
import {
  ASK_DESCRIPTION,
  RADAR_TAGLINE,
  SEARCH_DESCRIPTION,
  SUMMARIZE_DESCRIPTION,
  WRITE_DESCRIPTION,
} from "../core/descriptions.js";
import { getPackageVersion } from "../core/version.js";

export function buildCli(): Command {
  const program = new Command();

  program
    .name("radar")
    .description(RADAR_TAGLINE)
    .version(getPackageVersion())
    .addHelpText(
      "after",
      "\nEnvironment variables:\n" +
        "  RADAR_API_KEY        API key for the worker model (required)\n" +
        "  RADAR_BASE_URL       OpenAI-compatible endpoint (default: Moonshot)\n" +
        "  RADAR_MODEL          Worker model name (default: kimi-k2.5)\n" +
        "  RADAR_MAX_READ       Max tokens for read ops (default: 8192)\n" +
        "  RADAR_MAX_WRITE      Max tokens for generation (default: 16384)\n" +
        "  RADAR_MAX_FILES      Max files for ask (default: 30)\n" +
        "  RADAR_MAX_SEARCH_MATCHES  Max search matches to read (default: 20)\n" +
        "  RADAR_MAX_BYTES_PER_FILE  Max bytes per file (default: 500000)\n" +
        "  RADAR_MAX_CORPUS_BYTES    Max bytes per corpus (default: 2000000)\n" +
        "  RADAR_TIMEOUT_MS     Request timeout in ms (default: 30000)\n" +
        "  RADAR_VERBOSE        If set, print token usage and timings to stderr\n",
    );

  program
    .command("ask")
    .description(short(ASK_DESCRIPTION))
    .requiredOption("-p, --paths <paths...>", "files for Radar to read")
    .requiredOption("-q, --question <question>", "what you need answered")
    .action(askCommand);

  program
    .command("search")
    .description(short(SEARCH_DESCRIPTION))
    .requiredOption("-q, --query <query>", "what to search for")
    .option("-r, --root <path>", "directory to search", process.cwd())
    .option("-c, --context <text>", "why you're searching")
    .option("-g, --glob <glob>", "file glob (e.g. '*.py')")
    .action(searchCommand);

  program
    .command("summarize")
    .description(short(SUMMARIZE_DESCRIPTION))
    .option("-p, --path <path>", "file to summarize")
    .option("-f, --focus <focus>", "what aspect to focus on")
    .option("--stdin", "read content from stdin instead of a file")
    .action(summarizeCommand);

  program
    .command("write")
    .description(short(WRITE_DESCRIPTION))
    .requiredOption("-s, --spec <spec>", "what to generate")
    .requiredOption("-c, --context <path>", "reference file to match")
    .requiredOption("-t, --target <path>", "where to write the result")
    .option("--dry-run", "print to stdout instead of writing to disk")
    .option("--update", "read and update the existing target file")
    .option("--overwrite", "allow replacing an existing target outside update mode")
    .action(writeCommand);

  return program;
}

/** Truncate long descriptions for CLI help (full text shows in MCP). */
function short(text: string): string {
  const firstSentence = text.split(". ")[0];
  return firstSentence ? `${firstSentence}.` : text;
}
