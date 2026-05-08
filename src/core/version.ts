import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FALLBACK_VERSION = "0.0.0";

export function getPackageVersion(): string {
  let dir = dirname(fileURLToPath(import.meta.url));

  for (let depth = 0; depth < 6; depth += 1) {
    const packagePath = join(dir, "package.json");
    if (existsSync(packagePath)) {
      return readVersion(packagePath);
    }
    dir = dirname(dir);
  }

  return FALLBACK_VERSION;
}

function readVersion(packagePath: string): string {
  try {
    const parsed = JSON.parse(readFileSync(packagePath, "utf8")) as { version?: unknown };
    return typeof parsed.version === "string" ? parsed.version : FALLBACK_VERSION;
  } catch {
    return FALLBACK_VERSION;
  }
}
