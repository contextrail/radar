/**
 * Shared types for Radar service operations.
 *
 * These types describe the contract between the core service layer
 * and any transport (MCP, CLI, programmatic).
 */

export interface UsageInfo {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  cost?: number;
}

export interface DiagnosticsInfo {
  files?: number;
  matches?: number;
  input_bytes?: number;
  truncated_files?: number;
  corpus_ms?: number;
  api_ms?: number;
  total_ms?: number;
}

// ---- ask ----

export interface AskParams {
  /** File paths Radar should read */
  paths: string[];
  /** The question to answer about those files */
  question: string;
}

export interface AskResult {
  content: string;
  usage?: UsageInfo;
  diagnostics?: DiagnosticsInfo;
}

// ---- search ----

export interface SearchParams {
  /** What to search for (string or regex pattern) */
  query: string;
  /** Directory root to search within (default: cwd) */
  root?: string;
  /** Optional context to help Radar prioritize matches */
  context?: string;
  /** Optional file glob to scope the search (e.g. "*.py") */
  glob?: string;
}

export interface SearchResult {
  content: string;
  /** File paths that matched the query */
  matches: string[];
  usage?: UsageInfo;
  diagnostics?: DiagnosticsInfo;
}

// ---- summarize ----

export interface SummarizeParams {
  /** File path to summarize (mutually exclusive with content) */
  path?: string;
  /** Raw content to summarize (mutually exclusive with path) */
  content?: string;
  /** Optional focus instruction (e.g. "focus on errors and failures") */
  focus?: string;
}

export interface SummarizeResult {
  content: string;
  usage?: UsageInfo;
  diagnostics?: DiagnosticsInfo;
}

// ---- write ----

export interface WriteParams {
  /** Description of what to generate */
  spec: string;
  /** Path to a reference file Radar should match in style */
  context: string;
  /** Path where the generated file should be written */
  target: string;
  /** If true, return the content but don't write to disk */
  dryRun?: boolean;
  /** If true, update the existing target file using it as current content */
  update?: boolean;
  /** If true, allow replacing an existing target when not in update mode */
  overwrite?: boolean;
}

export interface WriteResult {
  content: string;
  written: boolean;
  target: string;
  usage?: UsageInfo;
  diagnostics?: DiagnosticsInfo;
}
