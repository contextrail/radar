import { RadarService } from "../../core/service.js";
import { reportUsage } from "../shared.js";

export interface SearchOptions {
  query: string;
  root?: string;
  context?: string;
  glob?: string;
}

export async function searchCommand(opts: SearchOptions): Promise<void> {
  const radar = new RadarService();
  const result = await radar.search({
    query: opts.query,
    root: opts.root,
    context: opts.context,
    glob: opts.glob,
  });

  if (result.matches.length > 0) {
    process.stderr.write(`Radar found ${result.matches.length} matching file(s):\n`);
    for (const m of result.matches) process.stderr.write(`  - ${m}\n`);
    process.stderr.write("\n");
  }

  process.stdout.write(result.content);
  if (!result.content.endsWith("\n")) process.stdout.write("\n");
  reportUsage(result.usage, result.diagnostics);
}
