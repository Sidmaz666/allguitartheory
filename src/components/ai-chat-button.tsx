'use client';

import { MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useAiChatStore } from '@/hooks/use-ai-chat';

export function AiChatButton() {
  const { isOpen, modelState, toggleChat } = useAiChatStore();
  const isReady = modelState === 'ready';

  // Always render the button; hide via CSS if offline (handled elsewhere if needed)
  return (
    <TooltipProvider>
      <Tooltip>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleChat}
          className={cn(
            "h-9 w-9 p-0 relative cursor-pointer",
            isOpen
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {isReady ? (
            <MessageCircle className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isReady && !isOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          )}
        </Button>
        <TooltipContent side="bottom">
          <p>AI Guitar Assistant</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
