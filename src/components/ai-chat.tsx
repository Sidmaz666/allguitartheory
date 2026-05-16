'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Send, Sparkles, Loader2, Square, RefreshCw, Music, Guitar, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAiChat, useAiChatStore } from '@/hooks/use-ai-chat';
import type { PageContext, ToolCall } from '@/lib/ai/types';

interface AiChatProps {
  pageContext: PageContext;
}

// Suggested quick‑start prompts
const SUGGESTED_QUESTIONS = [
  { icon: Music, text: 'What notes are in C Major scale?' },
  { icon: Guitar, text: 'Show me A minor chord' },
  { icon: BookOpen, text: 'How to build a dominant 7th chord?' },
  { icon: Sparkles, text: 'Difference between Dorian and Mixolydian' },
];

function ToolCallIndicator({ toolCalls }: { toolCalls: ToolCall[] }) {
  if (toolCalls.length === 0) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 mb-2">
      <Loader2 className="h-3 w-3 animate-spin text-primary" />
      <span className="text-xs text-muted-foreground">Using {toolCalls.map(t => t.name).join(', ')}...</span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

function WelcomeScreen({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <h3 className="text-lg font-semibold mb-2">Guitar Assistant</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        AI‑powered music‑theory guide with full access to scales, chords, tunings, and more.
      </p>
      <div className="grid gap-2 w-full max-w-xs">
        {SUGGESTED_QUESTIONS.map((q, i) => {
          const Icon = q.icon;
          return (
            <button
              key={i}
              onClick={() => onSelect(q.text)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 text-left text-sm transition-all duration-200 group cursor-pointer"
            >
              <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
              <span className="text-muted-foreground group-hover:text-foreground">{q.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-destructive/15 flex items-center justify-center mb-4">
        <X className="h-7 w-7 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Model Unavailable</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-xs">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 cursor-pointer">
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}

function renderMarkdown(text: string): string {
  let html = text
    .replace(/### (.+)/g, '<h3 class="text-sm font-semibold mt-3 mb-1">$1</h3>')
    .replace(/## (.+)/g, '<h2 class="text-base font-semibold mt-3 mb-1">$1</h2>')
    .replace(/# (.+)/g, '<h1 class="text-lg font-semibold mt-3 mb-1">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/^\- (.+)$/gm, '<li class="text-sm ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-sm ml-4 list-decimal">$1. $2</li>')
    .replace(/\n\n/g, '<br class="my-1" />')
    .replace(/\n/g, '<br />');
  html = html.replace(/(<li[^>]*>.*?<\/li>)/g, m => m.replace(/<br\s*\/?>>/g, ''));
  return html;
}

export function AiChat({ pageContext }: AiChatProps) {
  const {
    isOpen,
    messages,
    modelState,
    isProcessing,
    error,
    activeToolCalls,
    toggleChat,
    initModel,
    sendMessage,
    cancelResponse,
    deleteModel,
    setOpen,
  } = useAiChat();

  const [input, setInput] = useState('');
const scrollRef = useRef<HTMLDivElement>(null);
  const { clearMessages } = useAiChatStore();
  const [online, setOnline] = useState(true); // Default to true for SSR consistency

  useEffect(() => {
    // Update online status only on client
    const updateOnlineStatus = () => {
      if (typeof navigator !== 'undefined') {
        setOnline(navigator.onLine);
      }
    };
    
    // Set initial status
    updateOnlineStatus();
    
    // Listen for changes
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const hasInitialized = useRef(false);

  // Initialise model on first open
  useEffect(() => {
    if (isOpen && !hasInitialized.current && modelState === 'idle') {
      hasInitialized.current = true;
      initModel();
    }
  }, [isOpen, modelState, initModel]);

  const hasMessages = messages.length > 0;
  const showWelcome = !hasMessages && modelState === 'ready';
  const showError = modelState === 'error';

  // Auto‑scroll behaviour
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (showWelcome || showError) {
      el.scrollTop = 0;
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, activeToolCalls, isProcessing, showWelcome, showError]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isProcessing || modelState !== 'ready') return;
    sendMessage(input.trim(), pageContext);
    setInput('');
  }, [input, isProcessing, modelState, sendMessage, pageContext]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleSuggested = useCallback((q: string) => {
    if (modelState !== 'ready') return;
    sendMessage(q, pageContext);
  }, [modelState, sendMessage, pageContext]);

  const handleRetry = useCallback(() => initModel(), [initModel]);



  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:pointer-events-none"
          onClick={e => e.target === e.currentTarget && setOpen(false)}
        />
      )}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] border-l border-border/50 bg-background flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
          {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2.5">
            {online && (
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Guitar className="h-4 w-4 text-primary" />
              </div>
            )}
            <h2 className="text-base font-semibold">Guitar Assistant</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => clearMessages()}>
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
          {showError && <ErrorState message={error ?? 'Something went wrong'} onRetry={handleRetry} />}
          {showWelcome && <WelcomeScreen onSelect={handleSuggested} />}
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div key={i} className={cn('mb-4 flex', isUser ? 'justify-end' : 'justify-start')}>
                <div className={cn('max-w-[80%] p-3 rounded-lg prose', isUser ? 'bg-primary/10 text-foreground' : 'bg-muted/10 text-foreground')}>
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                </div>
              </div>
            );
          })}
          {activeToolCalls.length > 0 && <ToolCallIndicator toolCalls={activeToolCalls} />}
          {isProcessing && <TypingIndicator />}
        </div>

        {/* Composer */}
        <div className="border-t border-border/50 p-4 shrink-0 flex items-end gap-2">
          <Input
            placeholder="Ask the guitar assistant…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isProcessing || modelState !== 'ready'} size="icon">
            <Send className="h-5 w-5" />
          </Button>
          {isProcessing && (
            <Button variant="ghost" size="icon" onClick={cancelResponse}>
              <Square className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
