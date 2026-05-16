// Text‑generation engine (fallback when WebLLM fails)
// Uses @huggingface/transformers (WASM) with a compact model.

import type { InitProgressCallback } from '@/lib/ai/types';

export async function createTextGenEngine(onProgress?: InitProgressCallback): Promise<any> {
  // Dynamically import to keep bundle size low.
  const { pipeline } = await import('@huggingface/transformers');

  onProgress?.({ text: 'Loading language model…', progress: 0 });

  // Opt‑125M works comfortably in the browser.
  const pipe = await pipeline('text-generation', 'HuggingFaceTB/SmolLM2-135M-Instruct', {
    progress_callback: (data: {progress: number; loaded: number; total: number}) => {
      // Convert to 0‑1 range expected by useAiChatStore
      onProgress?.({
        text: 'Downloading model…',
        progress: data.progress,
        loaded: data.loaded,
        total: data.total,
      });
    },
  });

  onProgress?.({ text: 'Model ready', progress: 1 });

  const MAX_INPUT_TOKENS = 256;

  async function* singleChunkStream(text: string) {
    yield { choices: [{ delta: { content: text } }] };
  }

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
          // Use last user message as prompt.
          const lastMsg = params.messages[params.messages.length - 1];
          const prompt = lastMsg.content;

           let result;
           try {
            result = await pipe(prompt, {
              temperature: params.temperature ?? 0.7,
              top_p: params.top_p ?? 0.95,
              do_sample: (params.temperature ?? 0.7) > 0,
            });

           const generated = (result as any)[0]?.generated_text || '';
           // Remove the echoed prompt if the model repeats the input.
           const content = generated.startsWith(prompt) ? generated.slice(prompt.length).trim() : generated;
           if (params.stream) {
             return singleChunkStream(content);
           }
            return { choices: [{ message: { content } }] };
           } catch (e) {
             // If the model reports unsupported input (e.g., image), inform the user.
             const msg = e instanceof Error && e.message.includes('clipboard')
               ? 'This model does not support image input.'
               : 'Model generation failed.';
             return { choices: [{ message: { content: msg } }] };
           } },


      },
    },
    cache: null,
  };
}
