/* eslint-disable no-undef */
import { accessSync, constants, existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function getGitConfigPath() {
  if (!existsSync(".git")) return undefined;

  const gitPath = statSync(".git");
  if (gitPath.isDirectory()) return join(".git", "config");

  const gitFile = readFileSync(".git", "utf8").trim();
  const match = gitFile.match(/^gitdir:\s*(.+)$/);
  return match ? join(match[1], "config") : undefined;
}

function canInstallHusky() {
  if (process.env.CI === "true" || process.env.NODE_ENV === "production") {
    return false;
  }

  const configPath = getGitConfigPath();
  if (!configPath || !existsSync(configPath)) return false;

  try {
    accessSync(configPath, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

if (!canInstallHusky()) {
  process.exit(0);
}

const husky = (await import("husky")).default;
console.log(husky());
