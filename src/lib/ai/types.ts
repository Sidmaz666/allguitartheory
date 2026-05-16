export interface ToolParameter {
  type: 'string' | 'number' | 'boolean';
  description: string;
  required?: boolean;
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
  execute: (params: Record<string, string>) => string | Promise<string>;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, string>;
  result?: string;
}

export type ModelState = 'idle' | 'downloading' | 'ready' | 'error' | 'unavailable';

export interface DownloadProgress {
  loaded: number;
  total: number;
  text: string;
}

export interface PageContext {
  selectedKey: string;
  selectedTuning: { id: string; name: string; notes: string[] };
  viewMode: 'scales' | 'chords';
  selectedScaleName?: string;
  selectedChordName?: string;
}

export const MAX_AGENT_ITERATIONS = 3;
export const CONTEXT_BUDGET_TOKENS = 1400;
export const MAX_RESPONSE_TOKENS = 384;

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export type InitProgressCallback = (report: { text: string; progress: number }) => void;
