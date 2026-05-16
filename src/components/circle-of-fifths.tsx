'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { NOTES, type Note } from '@/lib/music-theory';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CircleOfFifthsProps {
  selectedKey?: Note;
  onKeySelect?: (key: Note) => void;
  mode?: 'major' | 'minor';
  onModeChange?: (mode: 'major' | 'minor') => void;
  className?: string;
}

const majorKeys: string[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
const relativeMinors: string[] = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'Bb', 'F', 'C', 'G', 'D'];

const keySignatures: Record<string, { sharps: number; flats: number; accidentals: string[] }> = {
  'C': { sharps: 0, flats: 0, accidentals: [] },
  'G': { sharps: 1, flats: 0, accidentals: ['F#'] },
  'D': { sharps: 2, flats: 0, accidentals: ['F#', 'C#'] },
  'A': { sharps: 3, flats: 0, accidentals: ['F#', 'C#', 'G#'] },
  'E': { sharps: 4, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#'] },
  'B': { sharps: 5, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#', 'A#'] },
  'F#': { sharps: 6, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'] },
  'Db': { sharps: 0, flats: 5, accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'] },
  'Ab': { sharps: 0, flats: 4, accidentals: ['Bb', 'Eb', 'Ab', 'Db'] },
  'Eb': { sharps: 0, flats: 3, accidentals: ['Bb', 'Eb', 'Ab'] },
  'Bb': { sharps: 0, flats: 2, accidentals: ['Bb', 'Eb'] },
  'F': { sharps: 0, flats: 1, accidentals: ['Bb'] },
};

const keyChords: Record<string, string[]> = {
  'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
  'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
  'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
  'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
  'E': ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'],
  'B': ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim'],
  'F#': ['F#', 'G#m', 'A#m', 'B', 'C#', 'D#m', 'E#dim'],
  'Db': ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm', 'Cdim'],
  'Ab': ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm', 'Gdim'],
  'Eb': ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm', 'Ddim'],
  'Bb': ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'Adim'],
  'F': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
};

const SVG_SIZE = 100;
const SVG_PADDING = 8;
const CENTER = SVG_SIZE / 2;
const MAJOR_RADIUS = 38;
const MINOR_RADIUS = 24;
const MAJOR_CIRCLE_R = 5.5;
const MINOR_CIRCLE_R = 4;
const SELECTED_SCALE = 1.2;

// Each key gets a color based on its position in the circle (0=top/C, going clockwise)
const KEY_COLORS: Record<string, string> = {
  'C': '#a3a3a3',
  'G': '#fbbf24',
  'D': '#fb923c',
  'A': '#f87171',
  'E': '#e879f9',
  'B': '#818cf8',
  'F#': '#60a5fa',
  'Db': '#22d3ee',
  'Ab': '#34d399',
  'Eb': '#4ade80',
  'Bb': '#a3e635',
  'F': '#fde047',
};

export function CircleOfFifths({
  selectedKey = 'C',
  onKeySelect,
  mode = 'major',
  onModeChange,
  className
}: CircleOfFifthsProps) {
  const [hoveredKey, setHoveredKey] = useState<Note | null>(null);

  const majorKeyPositions = useMemo(() => {
    return majorKeys.map((_, index) => {
      const angle = (index * 30 - 90) * (Math.PI / 180);
      return {
        x: Number((CENTER + MAJOR_RADIUS * Math.cos(angle)).toFixed(2)),
        y: Number((CENTER + MAJOR_RADIUS * Math.sin(angle)).toFixed(2))
      };
    });
  }, []);

  const minorKeyPositions = useMemo(() => {
    return relativeMinors.map((_, index) => {
      const angle = (index * 30 - 90) * (Math.PI / 180);
      return {
        x: Number((CENTER + MINOR_RADIUS * Math.cos(angle)).toFixed(2)),
        y: Number((CENTER + MINOR_RADIUS * Math.sin(angle)).toFixed(2))
      };
    });
  }, []);

  const currentKeySignature = keySignatures[selectedKey] || { sharps: 0, flats: 0, accidentals: [] };
  const currentKeyChords = keyChords[selectedKey] || [];

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            Circle of Fifths
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant={mode === 'major' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onModeChange?.('major')}
              className="h-6 text-xs px-2"
            >
              Major
            </Button>
            <Button
              variant={mode === 'minor' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onModeChange?.('minor')}
              className="h-6 text-xs px-2"
            >
              Minor
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-[300px] mx-auto aspect-square">
          <svg
            viewBox={`${-SVG_PADDING} ${-SVG_PADDING} ${SVG_SIZE + SVG_PADDING * 2} ${SVG_SIZE + SVG_PADDING * 2}`}
            className="w-full h-full"
          >
            <defs>
              {majorKeys.map((key, i) => {
                const base = KEY_COLORS[key] || '#737373';
                return (
                  <radialGradient key={key} id={`g-${i}`} cx="35%" cy="30%">
                    <stop offset="0%" stopColor={base} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={base} stopOpacity="0.4" />
                  </radialGradient>
                );
              })}
            </defs>

            <circle cx={CENTER} cy={CENTER} r={MAJOR_RADIUS + MAJOR_CIRCLE_R + 2} fill="none" stroke="currentColor" strokeWidth="0.3" className="text-border" />
            <circle cx={CENTER} cy={CENTER} r={(MAJOR_RADIUS + MINOR_RADIUS) / 2} fill="none" stroke="currentColor" strokeWidth="0.2" className="text-border" />
            <circle cx={CENTER} cy={CENTER} r={MINOR_RADIUS - MINOR_CIRCLE_R - 2} fill="none" stroke="currentColor" strokeWidth="0.2" className="text-border" />

            {majorKeyPositions.map((pos, i) => (
              <line key={i} x1={CENTER} y1={CENTER} x2={pos.x} y2={pos.y} stroke="currentColor" strokeWidth="0.15" className="text-border/30" />
            ))}

            {majorKeys.map((key, i) => {
              const pos = majorKeyPositions[i];
              const isSelected = selectedKey === key && mode === 'major';
              const isHovered = hoveredKey === key;
              const r = isSelected ? MAJOR_CIRCLE_R * SELECTED_SCALE : MAJOR_CIRCLE_R;
              const color = KEY_COLORS[key] || '#737373';

              return (
                <g key={key}>
                  <circle cx={pos.x} cy={pos.y} r={r + 1} fill={`url(#g-${i})`} opacity={isSelected || isHovered ? 0.7 : 0} className="transition-all duration-300" />
                  <circle
                    cx={pos.x} cy={pos.y} r={r}
                    fill={isSelected ? 'hsl(var(--primary))' : color}
                    stroke={isSelected ? 'hsl(var(--primary))' : color}
                    strokeWidth={isSelected ? 1 : 0.6}
                    opacity={isSelected ? 1 : (isHovered ? 0.9 : 0.7)}
                    className="transition-all duration-200 cursor-pointer"
                    style={{ cursor: 'pointer' }}
                    onClick={() => { onKeySelect?.(key as Note); onModeChange?.('major'); }}
                    onMouseEnter={() => setHoveredKey(key as Note)}
                    onMouseLeave={() => setHoveredKey(null)}
                  />
                  <text x={pos.x} y={pos.y + 1.5} textAnchor="middle" fontSize={isSelected ? 5 : 4.5} fontWeight={isSelected ? "bold" : "normal"} fill={isSelected ? '#fff' : '#f5f5f5'} className="cursor-pointer select-none pointer-events-none">{key}</text>
                </g>
              );
            })}

            {relativeMinors.map((key, i) => {
              const pos = minorKeyPositions[i];
              const isSelected = mode === 'minor' && selectedKey === key;
              const r = isSelected ? MINOR_CIRCLE_R * SELECTED_SCALE : MINOR_CIRCLE_R;
              const majorKey = majorKeys[i];
              const color = KEY_COLORS[majorKey] || '#737373';

              return (
                <g key={`m-${key}`}>
                  <circle cx={pos.x} cy={pos.y} r={r} fill={isSelected ? 'hsl(var(--primary))' : 'transparent'} stroke={isSelected ? 'hsl(var(--primary))' : color} strokeWidth={isSelected ? 0.8 : 0.4} opacity={isSelected ? 1 : 0.5} className="transition-all duration-200 cursor-pointer" style={{ cursor: 'pointer' }} onClick={() => { onKeySelect?.(key as Note); onModeChange?.('minor'); }} />
                  <text x={pos.x} y={pos.y + 1} textAnchor="middle" fontSize="3.5" fontWeight={isSelected ? "bold" : "normal"} fill={isSelected ? '#fff' : '#d4d4d4'} className="cursor-pointer select-none pointer-events-none">{key}m</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">{selectedKey} {mode === 'minor' ? 'Minor' : 'Major'}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" /></TooltipTrigger>
                <TooltipContent className="max-w-xs bg-popover border-border">
                  <p className="text-xs text-popover-foreground">The Circle of Fifths shows relationships between keys. Moving clockwise adds sharps, counterclockwise adds flats.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-[10px]">{mode === 'major' ? 'Major' : 'Minor'}</Badge>
            {currentKeySignature.sharps > 0 && <Badge variant="secondary" className="text-[10px] bg-orange-500/20 text-orange-400 border-orange-500/30">{currentKeySignature.sharps} ♯</Badge>}
            {currentKeySignature.flats > 0 && <Badge variant="secondary" className="text-[10px] bg-sky-500/20 text-sky-400 border-sky-500/30">{currentKeySignature.flats} ♭</Badge>}
            {currentKeySignature.sharps === 0 && currentKeySignature.flats === 0 && <Badge variant="secondary" className="text-[10px]">Natural</Badge>}
          </div>

          {currentKeySignature.accidentals.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mb-2">
              <span className="text-[10px] text-muted-foreground mr-0.5">
                {currentKeySignature.sharps > 0 ? 'Sharps' : 'Flats'}:
              </span>
              {currentKeySignature.accidentals.map((acc, i) => (
                <Badge key={i} variant="outline" className={cn("text-[9px] h-4 px-1", currentKeySignature.sharps > 0 ? "border-orange-500/30 text-orange-400" : "border-sky-500/30 text-sky-400")}>{acc}</Badge>
              ))}
            </div>
          )}

          {currentKeyChords.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-muted-foreground">Diatonic chords:</span>
              {currentKeyChords.map((chord, i) => {
                const isPrimary = i === 0 || i === 4 || i === 5;
                return (
                  <Badge key={chord} variant={isPrimary ? 'default' : 'outline'} className={cn("text-[10px] h-5", isPrimary && "bg-primary/80")}>{chord}</Badge>
                );
              })}
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-2 text-[9px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> Sharps</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400" /> Flats</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Selected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CircleOfFifths;
