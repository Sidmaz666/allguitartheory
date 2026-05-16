// HuggingFace Transformers.js Question‑Answering engine
// Loads a lightweight QA model and provides a simple answer function.

import type { InitProgressCallback } from '@/lib/ai/types';

export async function createHFQAEngine(onProgress?: InitProgressCallback) {
  // Dynamically import to keep the initial bundle small.
  const { pipeline } = await import('@huggingface/transformers');

  onProgress?.({ text: 'Loading QA model…', progress: 0 });

  // Use a compact, well‑supported model for QA.
  const qaPipe = await pipeline('question-answering', 'distilbert-base-uncased-distilled-squad');

  onProgress?.({ text: 'QA model ready', progress: 1 });

  return {
    // Simple API: give a question and a context, receive an answer.
    async answer(params: { question: string; context: string }) {
      const result = await qaPipe(params.question, params.context);
      // The pipeline returns { answer, score, start, end } – we only need the answer.
      return { answer: (result as any).answer };
    },
  };
}
