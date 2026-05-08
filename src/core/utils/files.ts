import * as fs from "node:fs/promises";

/** Hard cap on bytes per file. Anything bigger gets truncated with a marker. */
export const MAX_BYTES_PER_FILE = 500_000;

export interface BuildCorpusOptions {
  maxBytesPerFile?: number;
  maxCorpusBytes?: number;
}

export interface CorpusInfo {
  content: string;
  inputBytes: number;
  files: number;
  truncatedFiles: number;
}

interface ReadFileInfo {
  content: string;
  inputBytes: number;
  truncated: boolean;
}

export async function buildCorpus(
  paths: string[],
  options: BuildCorpusOptions = {},
): Promise<CorpusInfo> {
  const maxCorpusBytes = options.maxCorpusBytes ?? Number.POSITIVE_INFINITY;
  const docs = await Promise.all(
    paths.map(async (filePath) => {
      const file = await readFileForCorpus(filePath, options.maxBytesPerFile);
      const content = `<file path="${filePath}">\n${file.content}\n</file>`;
      return { ...file, content };
    }),
  );

  const corpus = docs.map((doc) => doc.content).join("\n\n");
  const inputBytes = Buffer.byteLength(corpus, "utf8");
  if (inputBytes > maxCorpusBytes) {
    throw new Error(
      `corpus is too large (${inputBytes} bytes). ` +
        `Radar accepts up to ${maxCorpusBytes} bytes per call. ` +
        `Narrow the file set, lower per-file caps, or use search/summarize first.`,
    );
  }

  return {
    content: corpus,
    inputBytes,
    files: paths.length,
    truncatedFiles: docs.filter((doc) => doc.truncated).length,
  };
}

export async function readFileTruncated(
  filePath: string,
  maxBytes = MAX_BYTES_PER_FILE,
): Promise<string> {
  return (await readFileForCorpus(filePath, maxBytes)).content;
}

async function readFileForCorpus(
  filePath: string,
  maxBytes = MAX_BYTES_PER_FILE,
): Promise<ReadFileInfo> {
  const stat = await fs.stat(filePath);
  if (stat.size <= maxBytes) {
    const content = await fs.readFile(filePath, "utf8");
    return {
      content,
      inputBytes: Buffer.byteLength(content, "utf8"),
      truncated: false,
    };
  }

  // Read the first chunk only so large files don't blow the worker context budget.
  const handle = await fs.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(maxBytes);
    await handle.read(buffer, 0, maxBytes, 0);
    const content =
      buffer.toString("utf8") +
      `\n\n[...truncated: file is ${stat.size} bytes, showing first ${maxBytes}]`;
    return {
      content,
      inputBytes: Buffer.byteLength(content, "utf8"),
      truncated: true,
    };
  } finally {
    await handle.close();
  }
}
