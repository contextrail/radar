/**
 * MCP server transport for Radar.
 *
 * Exposes RadarService methods as MCP tools over stdio. Compatible with
 * Claude Code, Codex, Cursor, and any other MCP client.
 *
 * Usage in client config:
 *   { "mcpServers": { "radar": { "command": "radar-mcp" } } }
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { RadarService } from "../core/service.js";
import type {
  AskParams,
  DiagnosticsInfo,
  SearchParams,
  SummarizeParams,
  UsageInfo,
  WriteParams,
} from "../core/types.js";
import { formatVerboseReport } from "../core/utils/diagnostics.js";
import { getPackageVersion } from "../core/version.js";
import { tools } from "./tools.js";
import { validateToolArguments } from "./validation.js";

const SERVER_INFO = {
  name: "radar",
  version: getPackageVersion(),
} as const;

export async function startMcpServer(): Promise<void> {
  const radar = new RadarService();
  const server = new Server(SERVER_INFO, {
    capabilities: { tools: {} },
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools as unknown as (typeof tools)[number][],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const params = (args ?? {}) as Record<string, unknown>;

    try {
      validateToolArguments(name, params);
      const text = await dispatchTool(radar, name, params);
      return {
        content: [{ type: "text", text }],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Radar reporting back with an error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

async function dispatchTool(
  radar: RadarService,
  name: string,
  params: Record<string, unknown>,
): Promise<string> {
  switch (name) {
    case "ask": {
      const result = await radar.ask(params as unknown as AskParams);
      return withVerboseFooter(result.content, result.usage, result.diagnostics);
    }
    case "search": {
      const result = await radar.search(params as unknown as SearchParams);
      const header =
        result.matches.length > 0
          ? `Radar found ${result.matches.length} matching file(s):\n${result.matches.map((m) => `  - ${m}`).join("\n")}\n\n`
          : "";
      return withVerboseFooter(header + result.content, result.usage, result.diagnostics);
    }
    case "summarize": {
      const result = await radar.summarize(params as unknown as SummarizeParams);
      return withVerboseFooter(result.content, result.usage, result.diagnostics);
    }
    case "write": {
      const result = await radar.write(params as unknown as WriteParams);
      const status = result.written
        ? `Radar wrote the file to ${result.target}.`
        : `Radar drafted the file (dry run, not written).`;
      return withVerboseFooter(
        `${status}\n\n--- Contents ---\n${result.content}`,
        result.usage,
        result.diagnostics,
      );
    }
    default:
      throw new Error(`Radar doesn't know that one: ${name}`);
  }
}

function withVerboseFooter(
  text: string,
  usage: UsageInfo | undefined,
  diagnostics: DiagnosticsInfo | undefined,
): string {
  if (!process.env.RADAR_VERBOSE) return text;
  const report = formatVerboseReport(usage, diagnostics);
  return report ? `${text}\n\n${report}` : text;
}
