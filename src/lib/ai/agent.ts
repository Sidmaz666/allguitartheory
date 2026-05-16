import type { Message, ToolCall, PageContext } from './types';
import { MAX_AGENT_ITERATIONS, MAX_RESPONSE_TOKENS } from './types';
import { TOOL_MAP } from './tools';
import { buildSystemPrompt } from './context';

const TOOL_CALL_REGEX = /TOOL_CALL:\s*(\w+)\s*\n([\s\S]*?)TOOL_CALL_END/g;

function parseToolCalls(text: string): ToolCall[] {
  const calls: ToolCall[] = [];
  const matches = text.matchAll(TOOL_CALL_REGEX);
  for (const match of matches) {
    const toolName = match[1];
    const paramsStr = match[2].trim();
    const params: Record<string, string> = {};
    for (const line of paramsStr.split('\n')) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim();
        const value = line.slice(colonIdx + 1).trim();
        if (key && value) {
          params[key] = value;
        }
      }
    }
    calls.push({
      id: `tc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: toolName,
      parameters: params,
    });
  }
  return calls;
}

function stripToolCalls(text: string): string {
  return text.replace(TOOL_CALL_REGEX, '').trim();
}

async function executeToolCall(call: ToolCall): Promise<string> {
  const tool = TOOL_MAP.get(call.name);
  if (!tool) {
    return `Error: Tool "${call.name}" not found. Available tools: ${Array.from(TOOL_MAP.keys()).join(', ')}`;
  }
  try {
    const result = await tool.execute(call.parameters);
    return typeof result === 'string' ? result : JSON.stringify(result);
  } catch (err) {
    return `Error executing ${call.name}: ${err instanceof Error ? err.message : String(err)}`;
  }
}

function buildMessagesForLLM(
  systemPrompt: string,
  conversationHistory: Message[],
  userMessage: string,
  toolCallsHistory: { call: ToolCall; result: string }[]
): { role: string; content: string }[] {
  const messages: { role: string; content: string }[] = [
    { role: 'system', content: systemPrompt },
  ];

  for (const msg of conversationHistory) {
    if (msg.role === 'system') continue;
    messages.push({ role: msg.role, content: msg.content });
  }

  messages.push({ role: 'user', content: userMessage });

  for (const { call, result } of toolCallsHistory) {
    messages.push({ role: 'assistant', content: `TOOL_CALL: ${call.name}\n${Object.entries(call.parameters).map(([k, v]) => `${k}: ${v}`).join('\n')}\nTOOL_CALL_END` });
    messages.push({ role: 'tool', content: result });
  }

  return messages;
}

export interface AgentResult {
  finalContent: string;
  toolCalls: ToolCall[];
  iterations: number;
}

export async function runAgentLoop(
  engine: any,
  pageContext: PageContext,
  conversationHistory: Message[],
  userMessage: string,
  onToolCall: (call: ToolCall) => void,
  onChunk: (chunk: string) => void,
  abortSignal?: AbortSignal
): Promise<AgentResult> {
  const systemPrompt = buildSystemPrompt(pageContext, userMessage, conversationHistory);
  const allToolCalls: ToolCall[] = [];
  let currentUserMsg = userMessage;
  let toolCallsHistory: { call: ToolCall; result: string }[] = [];
  let iterations = 0;

  while (iterations < MAX_AGENT_ITERATIONS) {
    if (abortSignal?.aborted) throw new Error('Aborted');

    const llmMessages = buildMessagesForLLM(
      systemPrompt,
      conversationHistory,
      currentUserMsg,
      toolCallsHistory
    );

    const responseText = await makeLLMCall(engine, llmMessages, !toolCallsHistory.length ? onChunk : undefined, abortSignal);

    const toolCalls = parseToolCalls(responseText);

    if (toolCalls.length === 0) {
      const cleaned = stripToolCalls(responseText);
      if (cleaned) {
        onChunk(cleaned);
      }
      return {
        finalContent: responseText,
        toolCalls: allToolCalls,
        iterations: iterations + 1,
      };
    }

    for (const call of toolCalls) {
      allToolCalls.push(call);
      onToolCall(call);
      const result = await executeToolCall(call);
      call.result = result;
      toolCallsHistory.push({ call, result });
    }

    iterations++;
  }

  const finalMessages = buildMessagesForLLM(
    systemPrompt,
    conversationHistory,
    currentUserMsg,
    toolCallsHistory
  );

  const finalResponse = await makeLLMCall(engine, finalMessages, onChunk, abortSignal);
  return {
    finalContent: finalResponse,
    toolCalls: allToolCalls,
    iterations,
  };
}

async function makeLLMCall(
  engine: any,
  messages: { role: string; content: string }[],
  onChunk: ((chunk: string) => void) | undefined,
  abortSignal?: AbortSignal
): Promise<string> {
  const completion = await engine.chat.completions.create({
    messages,
    temperature: 0.7,
    max_tokens: MAX_RESPONSE_TOKENS,
    top_p: 0.95,
    stream: !!onChunk,
  });

  if (onChunk) {
    let fullText = '';
    for await (const chunk of completion) {
      if (abortSignal?.aborted) throw new Error('Aborted');
      const delta = chunk.choices?.[0]?.delta?.content || '';
      if (delta) {
        fullText += delta;
        onChunk(delta);
      }
    }
    return fullText;
  }

  return (completion as any).choices?.[0]?.message?.content || '';
}

export { parseToolCalls, stripToolCalls, executeToolCall };
