import * as fs from "node:fs/promises";
import * as path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const MAX_MATCH_FILES = 100;

export async function findMatches(query: string, root: string, glob?: string): Promise<string[]> {
  // Try ripgrep first: faster and respects .gitignore by default.
  try {
    const args = ["--files-with-matches", "--max-count", String(MAX_MATCH_FILES)];
    if (glob) args.push("--glob", glob);
    args.push("--", query, root);

    const { stdout } = await execFileAsync("rg", args, {
      maxBuffer: 10 * 1024 * 1024,
    });

    return stdout.trim().split("\n").filter(Boolean);
  } catch (err: unknown) {
    const code = getErrorCode(err);
    const stderr = getErrorStderr(err);

    // ripgrep exits 1 when nothing matches.
    if (code === 1 && !stderr) return [];

    // ripgrep missing: fall back to a basic recursive search.
    if (code === "ENOENT") {
      return fallbackSearch(query, root, glob);
    }

    throw new Error(`Radar search failed: ${getErrorMessage(err)}`, { cause: err });
  }
}

function getErrorCode(err: unknown): string | number | undefined {
  if (!err || typeof err !== "object" || !("code" in err)) return undefined;
  const code = err.code;
  return typeof code === "string" || typeof code === "number" ? code : undefined;
}

function getErrorStderr(err: unknown): string | undefined {
  if (!err || typeof err !== "object" || !("stderr" in err)) return undefined;
  return typeof err.stderr === "string" ? err.stderr : undefined;
}

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/**
 * Basic recursive search fallback for when ripgrep isn't available.
 * Skips common ignore directories. Not as fast or smart as rg, but works.
 */
async function fallbackSearch(query: string, root: string, glob?: string): Promise<string[]> {
  const matches: string[] = [];
  const ignored = new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    "__pycache__",
    ".venv",
    "venv",
    "target",
    ".next",
  ]);

  const globRegex = glob ? globToRegex(glob) : null;

  async function walk(dir: string): Promise<void> {
    if (matches.length >= MAX_MATCH_FILES) return;

    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (matches.length >= MAX_MATCH_FILES) return;
      if (ignored.has(entry.name) || entry.name.startsWith(".")) continue;

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (!entry.isFile()) continue;
      if (globRegex && !globRegex.test(entry.name)) continue;

      try {
        const content = await fs.readFile(fullPath, "utf8");
        if (content.includes(query)) {
          matches.push(fullPath);
        }
      } catch {
        // Skip binary files and transient read errors.
      }
    }
  }

  await walk(root);
  return matches;
}

function globToRegex(glob: string): RegExp {
  const escaped = glob
    .replace(/[.+^$()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\{([^}]+)\}/g, (_, opts) => `(${opts.split(",").join("|")})`);

  return new RegExp(`^${escaped}$`);
}
