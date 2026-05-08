import { RadarService } from "../../core/service.js";
import { reportUsage } from "../shared.js";

export interface AskOptions {
  paths: string[];
  question: string;
}

export async function askCommand(opts: AskOptions): Promise<void> {
  const radar = new RadarService();
  const result = await radar.ask({
    paths: opts.paths,
    question: opts.question,
  });
  process.stdout.write(result.content);
  if (!result.content.endsWith("\n")) process.stdout.write("\n");
  reportUsage(result.usage, result.diagnostics);
}
