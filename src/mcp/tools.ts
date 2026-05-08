/**
 * MCP tool schema definitions.
 *
 * Tool descriptions come from core/descriptions.ts so they stay in sync with
 * the CLI help text. The input schemas here match the param types in
 * core/types.ts.
 */

import {
  ASK_DESCRIPTION,
  SEARCH_DESCRIPTION,
  SUMMARIZE_DESCRIPTION,
  WRITE_DESCRIPTION,
} from "../core/descriptions.js";

export const tools = [
  {
    name: "ask",
    title: "Ask Radar",
    description: ASK_DESCRIPTION,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        paths: {
          type: "array",
          items: { type: "string", minLength: 1 },
          description:
            "Exact file paths Radar should read. Use when the host already knows the relevant files.",
          minItems: 1,
        },
        question: {
          type: "string",
          minLength: 1,
          description: "One focused source-grounded question to answer about those files.",
        },
      },
      required: ["paths", "question"],
    },
  },
  {
    name: "search",
    title: "Search with Radar",
    description: SEARCH_DESCRIPTION,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: {
          type: "string",
          minLength: 1,
          description: "Literal string or regex Radar should search for across the codebase.",
        },
        root: {
          type: "string",
          minLength: 1,
          description:
            "Directory to search within. Defaults to the MCP server's current working directory.",
        },
        context: {
          type: "string",
          minLength: 1,
          description:
            "Why the host is searching. Include the behavior, config, API, or error being investigated.",
        },
        glob: {
          type: "string",
          minLength: 1,
          description: "Optional file glob to scope the search, such as '*.py' or '*.{ts,tsx}'.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "summarize",
    title: "Summarize with Radar",
    description: SUMMARIZE_DESCRIPTION,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      oneOf: [
        { required: ["path"], not: { required: ["content"] } },
        { required: ["content"], not: { required: ["path"] } },
      ],
      properties: {
        path: {
          type: "string",
          minLength: 1,
          description: "Path to a long log, transcript, diff, report, or other file to summarize.",
        },
        content: {
          type: "string",
          minLength: 1,
          description:
            "Raw content to summarize instead of reading a file path. Best for pasted logs or command output.",
        },
        focus: {
          type: "string",
          minLength: 1,
          description:
            "What signal to extract, such as 'errors and failures', 'release notes', or 'security concerns'.",
        },
      },
    },
  },
  {
    name: "write",
    title: "Draft with Radar",
    description: WRITE_DESCRIPTION,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: true,
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spec: {
          type: "string",
          minLength: 1,
          description:
            "Clear generation spec. Include the intended behavior, constraints, and what should not change.",
        },
        context: {
          type: "string",
          minLength: 1,
          description:
            "Reference file path Radar should imitate for style, structure, imports, and conventions.",
        },
        target: {
          type: "string",
          minLength: 1,
          description: "Target path for the drafted or written file.",
        },
        dryRun: {
          type: "boolean",
          description:
            "If true, return drafted content without writing. Preferred first pass for host-agent review.",
        },
        update: {
          type: "boolean",
          description:
            "If true, read the existing target and draft an update instead of a brand-new file.",
        },
        overwrite: {
          type: "boolean",
          description:
            "If true, allow replacing an existing target outside update mode. Use only when intentional.",
        },
      },
      required: ["spec", "context", "target"],
    },
  },
] as const;
