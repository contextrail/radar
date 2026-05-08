import { RadarService } from "../../core/service.js";
import { reportUsage } from "../shared.js";

export interface SummarizeOptions {
  path?: string;
  focus?: string;
  /** If true, read content from stdin instead of a file */
  stdin?: boolean;
}

export async function summarizeCommand(opts: SummarizeOptions): Promise<void> {
  const radar = new RadarService();

  let content: string | undefined;
  if (opts.stdin) {
    content = await readStdin();
  }

  const result = await radar.summarize({
    path: opts.path,
    content,
    focus: opts.focus,
  });

  process.stdout.write(result.content);
  if (!result.content.endsWith("\n")) process.stdout.write("\n");
  reportUsage(result.usage, result.diagnostics);
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}
