'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  NOTES,
  getNoteAtInterval,
  type Note,
  type TuningDefinition,
  type DisplayMode,
} from '@/lib/music-theory';

interface MusicNotationProps {
  selectedNotes: Note[];
  rootNote: Note;
  tuning: TuningDefinition;
  startFret?: number;
  endFret?: number;
  displayMode?: DisplayMode;
  className?: string;
}

const LINE_SPACE = 18;
const STAFF_TOP = 60;
const NOTE_SPACING = 52;
const NOTE_RADIUS = 9;

function getOct(note: Note, fret: number, si: number, t: TuningDefinition): number {
  const bo: Record<number, number> = { 0: 2, 1: 2, 2: 3, 3: 3, 4: 3, 5: 4 };
  return (bo[si] || 3) + Math.floor((fret + NOTES.indexOf(t.notes[si] as Note)) / 12);
}

function nY(note: Note, oct: number): number {
  const ni = NOTES.indexOf(note);
  const st = (ni - NOTES.indexOf('C')) + (oct - 4) * 12;
  const m: Record<number, number> = {
    0: 3, 1: 3.5, 2: 2, 3: 2.5, 4: 1, 5: 1.5, 6: 0, 7: 0.5,
    8: -1, 9: -0.5, 10: -2, 11: -1.5,
  };
  return STAFF_TOP + ((m[st % 12] ?? 0) + (oct - 4) * 3.5) * LINE_SPACE;
}

function ledgers(y: number): number[] {
  const r: number[] = [];
  const b = STAFF_TOP + 4 * LINE_SPACE;
  if (y < STAFF_TOP) for (let ly = STAFF_TOP; ly >= y - NOTE_RADIUS; ly -= LINE_SPACE) r.push(ly);
  if (y > b) for (let ly = b; ly <= y + NOTE_RADIUS; ly += LINE_SPACE) r.push(ly);
  return r;
}

const ic: Record<string, string> = {
  '1': '#f59e0b', 'b2': '#f97316', '2': '#60a5fa', 'b3': '#22c55e',
  '3': '#10b981', '4': '#6366f1', '#4': '#8b5cf6', 'b5': '#a855f7',
  '5': '#06b6d4', '#5': '#14b8a6', 'b6': '#84cc16', '6': '#facc15',
  'bb7': '#fb7185', 'b7': '#f43f5e', '7': '#ec4899',
};

export function MusicNotation({
  selectedNotes: sn,
  rootNote,
  tuning,
  startFret = 0,
  endFret = 12,
  displayMode = 'notes',
  className,
}: MusicNotationProps) {
  const notes = useMemo(() => {
    const r: { note: Note; oct: number; fr: number }[] = [];
    for (let f = startFret; f <= endFret; f++) {
      for (let s = 0; s < tuning.notes.length; s++) {
        const note = getNoteAtInterval(tuning.notes[s] as Note, f);
        if (sn.includes(note)) {
          r.push({ note, oct: getOct(note, f, s, tuning), fr: f });
        }
      }
    }
    const u = new Map<string, typeof r[0]>();
    for (const item of r) {
      const k = `${item.note}${item.oct}`;
      if (!u.has(k)) u.set(k, item);
    }
    return Array.from(u.values()).sort((a, b) => {
      const ai = NOTES.indexOf(a.note);
      const bi = NOTES.indexOf(b.note);
      return a.oct !== b.oct ? a.oct - b.oct : ai - bi;
    });
  }, [sn, tuning, startFret, endFret]);

  const getI = (note: Note): string => {
    const m: Record<number, string> = { 0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7' };
    return m[(NOTES.indexOf(note) - NOTES.indexOf(rootNote) + 12) % 12] || '1';
  };

  const getL = (note: Note, int: string): string => {
    if (displayMode === 'intervals') return int;
    if (displayMode === 'numbers') return (sn.indexOf(note) + 1).toString();
    return note;
  };

  const cnt = Math.max(notes.length, 1);
  const staffW = cnt * NOTE_SPACING + 200;
  const w = Math.max(staffW, 600);
  const h = 320;
  const staffBtm = STAFF_TOP + 4 * LINE_SPACE;

  return (
    <div className={cn("relative select-none", className)}>
      <div className="w-full rounded-lg bg-zinc-900/60 border border-border/30 p-4">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
          <defs>
            <filter id="note-glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Staff lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line key={i} x1={50} x2={staffW - 20} y1={STAFF_TOP + i * LINE_SPACE} y2={STAFF_TOP + i * LINE_SPACE} stroke="#737373" strokeWidth="1.2" />
          ))}

          {/* Bracket */}
          <line x1={28} y1={STAFF_TOP} x2={28} y2={staffBtm} stroke="#a3a3a3" strokeWidth="3" />
          <line x1={28} y1={STAFF_TOP} x2={36} y2={STAFF_TOP} stroke="#a3a3a3" strokeWidth="3" />
          <line x1={28} y1={staffBtm} x2={36} y2={staffBtm} stroke="#a3a3a3" strokeWidth="3" />

          {/* Treble clef */}
          <text x={52} y={STAFF_TOP + 3.6 * LINE_SPACE} fontSize="52" fontFamily="serif" fill="#a3a3a3" textAnchor="middle">𝄞</text>

          {/* Root key badge */}
          <rect x={80} y={STAFF_TOP - 16} width={28} height={14} rx={4} fill="#f59e0b" opacity={0.2} />
          <text x={94} y={STAFF_TOP - 6} fontSize="10" fontWeight="bold" fill="#f59e0b" textAnchor="middle">{rootNote}</text>

          {/* Time signature */}
          <text x={118} y={STAFF_TOP + LINE_SPACE - 2} fontSize="14" fontFamily="serif" fill="#737373" textAnchor="middle">4</text>
          <text x={118} y={STAFF_TOP + LINE_SPACE * 3 - 2} fontSize="14" fontFamily="serif" fill="#737373" textAnchor="middle">4</text>

          {/* Notes */}
          {notes.map((item, i) => {
            const intv = getI(item.note);
            const isR = item.note === rootNote;
            const y = nY(item.note, item.oct);
            const x = 150 + i * NOTE_SPACING;
            const c = isR ? '#f59e0b' : (ic[intv] || '#d4d4d4');
            const leds = ledgers(y);
            const stemUp = y < STAFF_TOP + 2 * LINE_SPACE;
            const stemLen = 36;

            return (
              <g key={`${item.note}${item.oct}`}>
                {leds.map((ly, li) => (
                  <line key={li} x1={x - NOTE_RADIUS * 2} x2={x + NOTE_RADIUS * 2} y1={ly} y2={ly} stroke="#737373" strokeWidth="0.8" />
                ))}
                <line x1={x + NOTE_RADIUS + 1} y1={y} x2={x + NOTE_RADIUS + 1} y2={y + (stemUp ? -stemLen : stemLen)} stroke={c} strokeWidth="1.8" opacity={0.7} />
                <ellipse cx={x} cy={y} rx={NOTE_RADIUS} ry={NOTE_RADIUS * 0.7} fill={c} opacity={isR ? 1 : 0.85} stroke={isR ? c : '#525252'} strokeWidth={isR ? 1.2 : 0.6} filter={isR ? 'url(#note-glow)' : undefined} />
                {(item.note.includes('#') || item.note.includes('b')) && (
                  <text x={x - NOTE_RADIUS * 2.5} y={y + 5} fontSize="12" fontWeight="bold" fill="#a3a3a3" textAnchor="middle">{item.note.includes('#') ? '♯' : '♭'}</text>
                )}
                <text x={x} y={staffBtm + NOTE_RADIUS + 22} fontSize="11" fontWeight={isR ? 'bold' : 'normal'} fill={c} textAnchor="middle">{getL(item.note, intv)}</text>
                <text x={x} y={staffBtm + NOTE_RADIUS + 36} fontSize="8" fill="#737373" textAnchor="middle">({item.oct})</text>
              </g>
            );
          })}

          {/* No notes message */}
          {notes.length === 0 && (
            <text x={w / 2} y={h / 2} fontSize="14" fill="#737373" textAnchor="middle">No notes to display</text>
          )}
        </svg>
      </div>
    </div>
  );
}

export default MusicNotation;
