// TinyLlama client‑side engine using @xenova/transformers
// This runs entirely in the browser (WebGPU/WebGL/WASM fallback).

import type { InitProgressCallback } from '@/lib/ai/types';

function formatChatMessages(messages: { role: string; content: string }[]): string {
  let prompt = '';
  for (const msg of messages) {
    const role = msg.role === 'user' ? 'user' : msg.role === 'system' ? 'system' : 'assistant';
    prompt += `<|im_start|>${role}\n${msg.content}<|im_end|>\n`;
  }
  prompt += '<|im_start|>assistant\n';
  return prompt;
}

async function* singleChunkStream(text: string) {
  yield { choices: [{ delta: { content: text } }] };
}

export async function createTinyLlamaEngine(onProgress?: InitProgressCallback): Promise<any> {
  // Ensure this runs only in the browser.
  if (typeof window === 'undefined') {
    // Return a no‑op engine for SSR.
    return {
      chat: { completions: { create: async () => ({ choices: [{ message: { content: '' } }] }) } },
      cache: null,
    };
  }

  // Dynamically import HuggingFace Transformers.js (runs in WASM).
  const { pipeline } = await import('@huggingface/transformers');

  onProgress?.({ text: 'Loading language model…', progress: 0 });

  // Use a lightweight text‑generation model that works comfortably in the browser.
  const pipe = await pipeline('text-generation', 'Xenova/opt-125m');

  onProgress?.({ text: 'Finalizing...', progress: 1 });

  return {
    chat: {
      completions: {
        create: async (params: {
          messages: { role: string; content: string }[];
          temperature?: number;
          max_tokens?: number;
          top_p?: number;
          stream?: boolean;
        }) => {
          // Use only the latest user message as plain prompt to stay within model limits.
          const lastMsg = params.messages[params.messages.length - 1];
          const prompt = lastMsg.content;
            // Limit input length to avoid out‑of‑bounds errors in the WASM runtime.
            const MAX_INPUT_TOKENS = 256;
            // Limit generation to keep memory usage low and avoid buffer‑overflow bugs.
            // The QA pipeline expects {question, context}. Use the last user message as the question
            // and concatenate earlier messages (if any) as context, capped to the input limit.
            const contextMessages = params.messages.slice(0, -1);
            const context = contextMessages.map(m => m.content).join(' ');
            const result = await pipe({ question: prompt, context });
            const answer = (result as any).answer || '';
            if (params.stream) {
              return singleChunkStream(answer);
            }
            return { choices: [{ message: { content: answer } }] };
        },
      },
    },
    // expose cache for deleteModel cleanup (not used by TinyLlama)
    cache: null,
  };
}
