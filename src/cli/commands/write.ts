import { RadarService } from "../../core/service.js";
import { reportUsage } from "../shared.js";

export interface WriteOptions {
  spec: string;
  context: string;
  target: string;
  dryRun?: boolean;
  update?: boolean;
  overwrite?: boolean;
}

export async function writeCommand(opts: WriteOptions): Promise<void> {
  const radar = new RadarService();
  const result = await radar.write({
    spec: opts.spec,
    context: opts.context,
    target: opts.target,
    dryRun: opts.dryRun,
    update: opts.update,
    overwrite: opts.overwrite,
  });

  if (opts.dryRun) {
    // Dry run: write content to stdout for inspection
    process.stdout.write(result.content);
    if (!result.content.endsWith("\n")) process.stdout.write("\n");
    process.stderr.write(`\n[dry run — would write to ${result.target}]\n`);
  } else {
    process.stderr.write(`Radar wrote ${result.target}\n`);
  }
  reportUsage(result.usage, result.diagnostics);
}
