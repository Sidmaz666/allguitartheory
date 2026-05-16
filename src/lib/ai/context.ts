import type { PageContext, Message } from './types';

export function buildSystemPrompt(
  pageContext: PageContext,
  query: string,
  conversationHistory: Message[]
): string {
  const pageParts = [`Key:${pageContext.selectedKey} Tuning:${pageContext.selectedTuning.name} Mode:${pageContext.viewMode}`];
  if (pageContext.viewMode === 'scales' && pageContext.selectedScaleName) {
    pageParts.push(`Selected:${pageContext.selectedScaleName}`);
  }
  if (pageContext.viewMode === 'chords' && pageContext.selectedChordName) {
    pageParts.push(`Selected:${pageContext.selectedChordName}`);
  }

  return [
    'You are Guitar Assistant for a guitar theory website.',
    `Page: ${pageParts.join(' | ')}`,
    '',
    'Tools (call via TOOL_CALL:name\\nkey:val\\nTOOL_CALL_END):',
    '- getScaleInfo(id, root?) getChordInfo(id, root?)',
    '- searchScales(q) searchChords(q) getTuningInfo(id)',
    '- getIntervalInfo(name) getNoteInfo(name) searchMusicTheory(q)',
    '',
    'Be concise. Use markdown. Use tools to look up what you need.',
  ].join('\n');
}
