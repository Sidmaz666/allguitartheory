// HuggingFace Space Chat Completion engine
// Calls the OpenAI‑compatible endpoint at sidmaz666-qwen3-5api.hf.space

import type { InitProgressCallback } from '@/lib/ai/types';

const API_URL = 'https://sidmaz666-qwen3-5api.hf.space/v1/chat/completions';

export async function createHFChatEngine(onProgress?: InitProgressCallback): Promise<any> {
  // No heavy model download – just report ready.
  onProgress?.({ text: 'Connecting to AI service…', progress: 0 });

  // Simple wrapper matching the existing engine interface.
  async function* singleChunkStream(text: string) {
    yield { choices: [{ delta: { content: text } }] };
  }

  const engine = {
    chat: {
      completions: {
        create: async (params: {
          messages: { role: string; content: string }[];
          temperature?: number;
          max_tokens?: number;
          top_p?: number;
          stream?: boolean;
        }) => {
          const requestBody = {
            model: 'Qwen/Qwen3.5-2B',
            messages: params.messages,
            temperature: params.temperature ?? 0.7,
            max_tokens: params.max_tokens ?? 256,
            top_p: params.top_p ?? 1.0,
            stream: !!params.stream,
          };

          const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HF API error ${response.status}: ${errText}`);
          }

          if (params.stream) {
            // Streamed response – OpenAI style SSE chunks.
            const decoder = new TextDecoder();
            const reader = response.body?.getReader() as ReadableStreamDefaultReader<Uint8Array>;
            if (!reader) throw new Error('No streaming body');
            let buffer = '';
            async function* streamChunks() {
              while (true) {
                const { done, value } = await reader.read() as { done: boolean; value: Uint8Array };
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                // Split on newlines, each line may be a JSON object prefixed by "data: "
                const lines = buffer.split(/\n/);
                buffer = lines.pop() || '';
                for (const line of lines) {
                  const trimmed = line.trim();
                  if (!trimmed || !trimmed.startsWith('data:')) continue;
                  const jsonStr = trimmed.replace(/^data:\s*/, '');
                  if (jsonStr === '[DONE]') continue;
                  try {
                    const parsed = JSON.parse(jsonStr);
                    const delta = parsed.choices?.[0]?.delta?.content ?? '';
                    if (delta) {
                      yield { choices: [{ delta: { content: delta } }] };
                    }
                  } catch (_) {
                    // ignore parse errors
                  }
                }
              }
            }
            return streamChunks();
          } else {
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';
            return { choices: [{ message: { content } }] };
          }
        },
      },
    },
    cache: null,
  };

  onProgress?.({ text: 'AI service ready', progress: 1 });
  return engine;
}
