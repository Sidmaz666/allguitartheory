'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  NOTES,
  getNoteAtInterval,
  getChordNotes,
  type Note,
  type ChordDefinition,
  type TuningDefinition,
} from '@/lib/music-theory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Guitar, Expand } from 'lucide-react';

interface ChordDiagramProps {
  root: Note;
  chord: ChordDefinition;
  tuning?: TuningDefinition;
  className?: string;
}

interface Voicing {
  frets: number[];
  fingerNumbers: (number | null)[];
  barreFret: number | null;
  barreStart: number;
  barreEnd: number;
}

function assignFingers(frets: number[]): { fingerNumbers: (number | null)[]; barreFret: number | null; barreStart: number; barreEnd: number } {
  const played = frets.map((f, i) => ({ f, i })).filter(x => x.f > 0);
  if (played.length === 0) return { fingerNumbers: frets.map(() => null), barreFret: null, barreStart: -1, barreEnd: -1 };

  const uniqueFrets = [...new Set(played.map(x => x.f))].sort((a, b) => a - b);

  // Check for barre: 3+ strings at same fret not at fret 1+ and the lowest fret has multiple strings
  let barreFret: number | null = null;
  let barreStart = -1;
  let barreEnd = -1;

  const fretCounts: Record<number, number> = {};
  for (const p of played) {
    fretCounts[p.f] = (fretCounts[p.f] || 0) + 1;
  }

  const lowestFret = uniqueFrets[0];
  if (fretCounts[lowestFret] >= 3 && lowestFret > 0) {
    const barreStrings = played.filter(p => p.f === lowestFret).map(p => p.i);
    barreFret = lowestFret;
    barreStart = Math.min(...barreStrings);
    barreEnd = Math.max(...barreStrings);
  }

  const fingerNumbers: (number | null)[] = frets.map(() => null);

  // Map each unique fret to a finger
  for (const p of played) {
    if (barreFret !== null && p.f === barreFret) {
      fingerNumbers[p.i] = 1; // barre = index finger
    } else {
      const idx = uniqueFrets.indexOf(p.f);
      if (idx === 0 && barreFret !== null) {
        // Second unique fret (first is barre)
        fingerNumbers[p.i] = 2;
      } else {
        fingerNumbers[p.i] = Math.min(idx + 1, 4);
      }
    }
  }

  return { fingerNumbers, barreFret, barreStart, barreEnd };
}

function findVoicings(root: Note, chord: ChordDefinition, strings: number, tuningNotes: Note[]): Voicing[] {
  const chordNotes = getChordNotes(root, chord);
  const chordNoteSet = new Set(chordNotes);
  const maxFret = 15;
  const maxSpan = 5;

  // For each string, find all frets where the note is in the chord
  const stringOptions: { fret: number; note: Note }[][] = [];
  for (let s = 0; s < strings; s++) {
    const options: { fret: number; note: Note }[] = [];
    for (let f = 0; f <= maxFret; f++) {
      const note = getNoteAtInterval(tuningNotes[s] as Note, f);
      if (chordNoteSet.has(note)) {
        options.push({ fret: f, note });
      }
    }
    // Also add muted option (-1) for strings we might skip
    options.unshift({ fret: -1, note: '' as Note });
    stringOptions.push(options);
  }

  const voicings: Voicing[] = [];
  const seen = new Set<string>();

  function search(stringIdx: number, currentFrets: number[], currentNotes: Note[]) {
    if (stringIdx === strings) {
      const playedFrets = currentFrets.filter(f => f >= 0);
      if (playedFrets.length < 3) return;

      const minFret = Math.min(...playedFrets);
      const maxFret = Math.max(...playedFrets);
      if (maxFret - minFret > maxSpan) return;

      // Check all chord notes are covered
      const presentNotes = new Set(currentNotes.filter(n => n !== undefined && n !== null));
      if (chordNotes.every(n => presentNotes.has(n))) {
        const key = currentFrets.join(',');
        if (!seen.has(key)) {
          seen.add(key);
          const { fingerNumbers, barreFret, barreStart, barreEnd } = assignFingers(currentFrets);
          voicings.push({ frets: currentFrets, fingerNumbers, barreFret, barreStart, barreEnd });
        }
      }
      return;
    }

    for (const opt of stringOptions[stringIdx]) {
      const newFrets = [...currentFrets, opt.fret];
      const newNotes = [...currentNotes, opt.note];

      // Prune: if we have played frets, check span doesn't exceed maxSpan
      const played = newFrets.filter(f => f >= 0);
      if (played.length >= 2) {
        const mn = Math.min(...played);
        const mx = Math.max(...played);
        if (mx - mn > maxSpan) continue;
      }

      search(stringIdx + 1, newFrets, newNotes);
    }
  }

  search(0, [], []);
  return voicings;
}

const FINGER_LABELS: Record<number, string> = { 1: '1', 2: '2', 3: '3', 4: '4' };

function GuitarFretDiagram({ frets, fingerNumbers, barreFret, barreStart, barreEnd, startFret, size = 'sm' }: {
  frets: number[];
  fingerNumbers: (number | null)[];
  barreFret: number | null;
  barreStart: number;
  barreEnd: number;
  startFret: number;
  size?: 'sm' | 'lg';
}) {
  const visibleFrets = 5;
  const isLg = size === 'lg';
  const w = isLg ? 200 : 100;
  const h = isLg ? 240 : 120;
  const vw = isLg ? 200 : 100;
  const vh = isLg ? 240 : 120;
  const s = isLg ? 2.2 : 1.1;
  const ox = 12 * s;
  const oy = 10 * s;
  const sp = 17 * s;
  const strX = (i: number) => ox + i * 10 * s;
  const dotR = isLg ? 12 : 6;
  const fontSize = isLg ? 9 : 7;
  const fingerFont = isLg ? 14 : 7;
  const xoFont = isLg ? 18 : 9;

  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full h-full">
      <defs>
        <radialGradient id={`dot-${size}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.7" />
        </radialGradient>
      </defs>

      {/* Nut */}
      {startFret === 0 ? (
        <rect x={ox} y={oy * 0.8} width={60 * s} height={4 * s} rx={1.5 * s} fill="#a3a3a3" />
      ) : (
        <line x1={ox} y1={oy} x2={ox + 60 * s} y2={oy} stroke="#525252" strokeWidth={1 * s} />
      )}

      {/* Fret lines */}
      {Array.from({ length: visibleFrets }).map((_, i) => (
        <line key={i} x1={ox} y1={oy + (i + 1) * sp} x2={ox + 60 * s} y2={oy + (i + 1) * sp} stroke="#525252" strokeWidth={0.8 * s} />
      ))}

      {/* Strings */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1={strX(i)} y1={oy} x2={strX(i)} y2={oy + visibleFrets * sp} stroke="#737373" strokeWidth={(i < 3 ? 1.8 - i * 0.3 : 0.8) * s} opacity={0.7} />
      ))}

      {/* Starting fret number */}
      {startFret > 0 && (
        <text x={ox - 5 * s} y={oy + sp * 0.85} fontSize={isLg ? 16 : 8} fill="#a3a3a3" textAnchor="end">{startFret}</text>
      )}

      {/* Barre indicator */}
      {barreFret !== null && barreStart >= 0 && barreEnd > barreStart && (
        <line
          x1={strX(barreStart) + dotR * 0.5}
          y1={oy + (barreFret - startFret) * sp - dotR * 0.7}
          x2={strX(barreEnd) + dotR * 0.5}
          y2={oy + (barreFret - startFret) * sp - dotR * 0.7}
          stroke="#f59e0b" strokeWidth={3 * s} strokeLinecap="round" opacity={0.6}
        />
      )}

      {/* X / O and finger positions */}
      {frets.map((fret, stringIdx) => {
        const x = strX(stringIdx);
        if (fret === -1) {
          return <text key={stringIdx} x={x} y={oy * 0.7} textAnchor="middle" fontSize={xoFont} fontWeight="bold" fill="#ef4444">✕</text>;
        }
        if (fret === 0) {
          return <circle key={stringIdx} cx={x} cy={oy * 0.6} r={isLg ? 7 : 3.5} fill="none" stroke="#22c55e" strokeWidth={isLg ? 3 : 1.5} />;
        }
        const adjustedFret = startFret > 0 ? fret - startFret + 1 : fret;
        const cy = oy + adjustedFret * sp - sp * 0.5;
        const fn = fingerNumbers[stringIdx];
        return (
          <g key={stringIdx}>
            <circle cx={x} cy={cy} r={dotR} fill={`url(#dot-${size})`} stroke="#f59e0b" strokeWidth={0.5 * s} opacity={0.9} />
            {fn !== null && (
              <text x={x} y={cy + (isLg ? 5 : 1.5)} textAnchor="middle" fontSize={fingerFont} fontWeight="bold" fill="#000" style={{ pointerEvents: 'none' }}>
                {FINGER_LABELS[fn] || ''}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const stringLabels = ['E', 'A', 'D', 'G', 'B', 'E'];

function ChordDiagramBox({ voicing, root, chordName, position, chordNotes, onZoom }: {
  voicing: Voicing;
  root: Note;
  chordName: string;
  position: number;
  chordNotes: Note[];
  onZoom: () => void;
}) {
  const { frets, fingerNumbers, barreFret, barreStart, barreEnd } = voicing;
  const playedFrets = frets.filter(f => f >= 0);
  const minFret = playedFrets.length > 0 ? Math.min(...playedFrets) : 0;
  const startFret = minFret > 3 ? minFret : 0;

  return (
    <div className="flex flex-col items-center p-2 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/30 transition-colors cursor-pointer group relative" onClick={onZoom}>
      <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10" onClick={(e) => { e.stopPropagation(); onZoom(); }}>
        <Expand className="w-3 h-3 text-muted-foreground hover:text-foreground" />
      </button>
      <div className="flex items-center justify-between w-full mb-1">
        <Badge variant="secondary" className="text-[8px] h-3.5 px-1 leading-none">Pos {position}</Badge>
        <Badge variant="outline" className="text-[8px] h-3.5 px-1 leading-none">
          {startFret === 0 ? 'Open' : `Fret ${startFret}`}
        </Badge>
      </div>
      <div className="relative w-[100px] h-[120px]">
        <GuitarFretDiagram frets={frets} fingerNumbers={fingerNumbers} barreFret={barreFret} barreStart={barreStart} barreEnd={barreEnd} startFret={startFret} size="sm" />
      </div>
      <div className="flex flex-wrap gap-0.5 justify-center mt-1">
        {frets.map((fret, i) => (
          <span key={i} className={cn(
            "text-[6px] font-mono leading-none",
            fret === -1 ? "text-red-400" :
            fret === 0 ? "text-green-400" :
            "text-amber-400"
          )}>
            {stringLabels[i]}{fret >= 0 ? fret : 'x'}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ChordDiagram({ root, chord, tuning, className }: ChordDiagramProps) {
  const defaultTuning: TuningDefinition = {
    id: 'standard', name: 'Standard Tuning', notes: ['E', 'A', 'D', 'G', 'B', 'E'] as Note[],
    strings: 6, category: 'Standard', description: 'EADGBE'
  };
  const currentTuning = tuning || defaultTuning;
  const strings = currentTuning.notes.length;
  const tuningNotes = currentTuning.notes as Note[];

  const [page, setPage] = useState(0);
  const [zoomIdx, setZoomIdx] = useState<number | null>(null);

  const chordNoteList = useMemo(() => getChordNotes(root, chord), [root, chord]);

  const voicings = useMemo(() => {
    return findVoicings(root, chord, strings, tuningNotes);
  }, [root, chord, strings, tuningNotes]);

  const perPage = 4;
  const totalPages = Math.max(1, Math.ceil(voicings.length / perPage));
  const paged = voicings.slice(page * perPage, (page + 1) * perPage);

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Guitar className="w-4 h-4 text-amber-400" />
            </div>
            Chord Diagrams
          </CardTitle>
          <Badge variant="secondary" className="text-xs">{voicings.length} position{voicings.length !== 1 ? 's' : ''}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {voicings.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {paged.map((voicing, idx) => {
                const actualIdx = page * perPage + idx;
                return (
                  <ChordDiagramBox
                    key={idx}
                    voicing={voicing}
                    root={root}
                    chordName={`${root}${chord.symbol}`}
                    position={actualIdx + 1}
                    chordNotes={chordNoteList}
                    onZoom={() => setZoomIdx(actualIdx)}
                  />
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-3">
                <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="h-7 w-7 p-0 cursor-pointer">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
                <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="h-7 w-7 p-0 cursor-pointer">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No chord diagrams available for {root}{chord.symbol}
          </div>
        )}
      </CardContent>

      {/* Zoom Dialog */}
      <Dialog open={zoomIdx !== null} onOpenChange={(open) => !open && setZoomIdx(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="sr-only">Chord Diagram Zoom</DialogTitle>
          </DialogHeader>
          {zoomIdx !== null && voicings[zoomIdx] && (
            <div className="flex flex-col items-center p-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Position {zoomIdx + 1} / {voicings.length}</Badge>
                <Badge variant="outline">{root}{chord.symbol}</Badge>
              </div>
              <div className="flex items-center gap-2 w-full justify-center">
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 shrink-0 cursor-pointer" disabled={zoomIdx <= 0} onClick={() => setZoomIdx(zoomIdx - 1)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="w-[220px] h-[260px]">
                  {(() => {
                    const vz = voicings[zoomIdx];
                    const pf = vz.frets.filter(f => f >= 0);
                    const mn = pf.length > 0 ? Math.min(...pf) : 0;
                    const sf = mn > 3 ? mn : 0;
                    return <GuitarFretDiagram frets={vz.frets} fingerNumbers={vz.fingerNumbers} barreFret={vz.barreFret} barreStart={vz.barreStart} barreEnd={vz.barreEnd} startFret={sf} size="lg" />;
                  })()}
                </div>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 shrink-0 cursor-pointer" disabled={zoomIdx >= voicings.length - 1} onClick={() => setZoomIdx(zoomIdx + 1)}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                {voicings[zoomIdx].frets.map((fret, i) => (
                  <span key={i} className={cn("text-xs font-mono", fret === -1 ? "text-red-400" : fret === 0 ? "text-green-400" : "text-amber-400")}>
                    {stringLabels[i]}{fret >= 0 ? fret : 'x'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default ChordDiagram;
