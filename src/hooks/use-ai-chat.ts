'use client';

import { create } from 'zustand';
import { useCallback, useRef } from 'react';
import type { Message, ModelState, DownloadProgress, PageContext, ToolCall } from '@/lib/ai/types';
import { CONTEXT_BUDGET_TOKENS, estimateTokens } from '@/lib/ai/types';
import { runAgentLoop } from '@/lib/ai/agent';

interface AiChatState {
  isOpen: boolean;
  messages: Message[];
  modelState: ModelState;
  downloadProgress: DownloadProgress | null;
  isProcessing: boolean;
  error: string | null;
  engineRef: any;
  activeToolCalls: ToolCall[];

  toggleChat: () => void;
  setOpen: (open: boolean) => void;
  addMessage: (msg: Message) => void;
  updateMessage: (id: string, content: string) => void;
  setModelState: (state: ModelState) => void;
  setDownloadProgress: (progress: DownloadProgress | null) => void;
  setIsProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  setEngineRef: (engine: any) => void;
  setActiveToolCalls: (calls: ToolCall[]) => void;
}

export const useAiChatStore = create<AiChatState>((set) => ({
  isOpen: false,
  messages: [],
  modelState: 'idle',
  downloadProgress: null,
  isProcessing: false,
  error: null,
  engineRef: null,
  activeToolCalls: [],

  toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  updateMessage: (id, content) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, content } : m)),
    })),
  setModelState: (modelState) => set({ modelState }),
  setDownloadProgress: (downloadProgress) => set({ downloadProgress }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  clearMessages: () => set({ messages: [] }),
  setEngineRef: (engineRef) => set({ engineRef }),
  setActiveToolCalls: (activeToolCalls) => set({ activeToolCalls }),
}));

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `👋 **Welcome to Guitar Assistant!**

I'm your AI guide to music theory and guitar knowledge. You can ask me anything about scales, chords, tunings, and more!
`,
  timestamp: Date.now(),
};

function trimContext(messages: Message[], budget: number): Message[] {
  let total = 0;
  const keep: Message[] = [];
  const welcome = messages.filter(m => m.id === 'welcome');
  const rest = messages.filter(m => m.id !== 'welcome');

  for (const m of welcome) {
    total += estimateTokens(m.content);
    keep.push(m);
  }

  for (let i = rest.length - 1; i >= 0; i--) {
    const tokens = estimateTokens(rest[i].content);
    if (total + tokens > budget && keep.length > 2) break;
    total += tokens;
    keep.splice(1, 0, rest[i]);
  }

  return keep;
}

export function useAiChat() {
  const store = useAiChatStore();
  const abortRef = useRef<AbortController | null>(null);
  const cacheCheckRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initModel = useCallback(async () => {
    if (store.modelState === 'ready' || store.modelState === 'downloading') return;

    try {
      store.setModelState('downloading');
      store.setError(null);

       // Initialize progress UI.
       store.setDownloadProgress({
         loaded: 0,
         total: 100,
         text: 'Loading model...',
       });

        const { createHFChatEngine } = await import('@/lib/ai/hf-chat-engine');
        const engine = await createHFChatEngine();

      store.setEngineRef(engine);
      store.setModelState('ready');
      store.setDownloadProgress(null);

      if (store.messages.length === 0) {
        store.addMessage(WELCOME_MESSAGE);
      }
    } catch (err) {
      console.error('Failed to initialize AI model:', err);
      store.setModelState('error');
      store.setDownloadProgress(null);
      store.setError(
        'Failed to load the AI model. Your browser may not support WebAssembly, or there may be a network issue. Try Chrome or Edge.'
      );
    }
  }, [store]);

  const sendMessage = useCallback(
    async (
      content: string,
      pageContext: PageContext
    ) => {
      if (!content.trim() || store.isProcessing) return;
      if (store.modelState !== 'ready' || !store.engineRef) return;

      abortRef.current = new AbortController();

      const conversationHistory = trimContext(store.messages, CONTEXT_BUDGET_TOKENS);

      const userMsg: Message = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };

      store.addMessage(userMsg);
      store.setIsProcessing(true);
      store.setError(null);
      store.setActiveToolCalls([]);

      const assistantMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      store.addMessage(assistantMsg);

      try {
        let fullContent = '';
        const toolCalls: ToolCall[] = [];

        await runAgentLoop(
          store.engineRef,
          pageContext,
          conversationHistory,
          content.trim(),
          (call: ToolCall) => {
            toolCalls.push(call);
            store.setActiveToolCalls([...toolCalls]);
          },
          (chunk: string) => {
            fullContent += chunk;
            store.updateMessage(assistantMsg.id, fullContent);
          },
          abortRef.current.signal
        );

        store.updateMessage(
          assistantMsg.id,
          fullContent || 'I searched my knowledge but could not find a specific answer to that question. Could you try rephrasing?'
        );
      } catch (err: any) {
        if (err?.message === 'Aborted') {
          store.updateMessage(assistantMsg.id, 'Response cancelled.');
          return;
        }
        console.error('Chat error:', err);
        store.updateMessage(
          assistantMsg.id,
          'Sorry, I encountered an error while processing your request. Please try again.'
        );
        store.setError('Failed to get AI response. Please try again.');
      } finally {
        store.setIsProcessing(false);
        store.setActiveToolCalls([]);
        abortRef.current = null;
      }
    },
    [store]
  );

  const cancelResponse = useCallback(() => {
    abortRef.current?.abort();
    store.setIsProcessing(false);
  }, [store]);

  const resetChat = useCallback(() => {
    store.clearMessages();
    if (store.modelState === 'ready') {
      store.addMessage(WELCOME_MESSAGE);
    }
  }, [store]);

  const deleteModel = useCallback(async () => {
    try {
      if (store.engineRef?.cache?.clear) {
        await store.engineRef.cache.clear();
      }
    } catch {}
    try {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        const name = db.name?.toLowerCase() || '';
        if (name.includes('webllm') || name.includes('mlc') || name.includes('huggingface') || name.includes('transformers')) {
          indexedDB.deleteDatabase(name);
        }
      }
    } catch {}
    try {
      const keys = await caches.keys();
      for (const key of keys) {
        if (key.includes('webllm') || key.includes('mlc') || key.includes('huggingface') || key.includes('transformers')) {
          caches.delete(key);
        }
      }
    } catch {}
    store.setEngineRef(null);
    store.setModelState('idle');
    store.setDownloadProgress(null);
    store.clearMessages();
  }, [store]);

  return {
    ...store,
    initModel,
    sendMessage,
    cancelResponse,
    resetChat,
    deleteModel,
  };
}
