const ALLOWED_TOOL_ARGS: Record<string, readonly string[]> = {
  ask: ["paths", "question"],
  search: ["query", "root", "context", "glob"],
  summarize: ["path", "content", "focus"],
  write: ["spec", "context", "target", "dryRun", "update", "overwrite"],
};

export function validateToolArguments(toolName: string, params: Record<string, unknown>): void {
  const allowed = ALLOWED_TOOL_ARGS[toolName];
  if (!allowed) return;

  const unknown = Object.keys(params).filter((key) => !allowed.includes(key));
  if (unknown.length > 0) {
    throw new Error(`${toolName}: unknown argument(s): ${unknown.join(", ")}`);
  }
}
