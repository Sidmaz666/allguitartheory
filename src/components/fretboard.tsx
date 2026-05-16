'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  NOTES, 
  getNoteAtInterval,
  getGuitarStringFrequency,
  type Note,
  type TuningDefinition,
  type DisplayMode
} from '@/lib/music-theory';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  Square,
  ChevronLeft,
  ChevronRight,
  Ear,
  Clock,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

interface FretboardProps {
  selectedNotes?: Note[];
  rootNote?: Note;
  highlightRoot?: boolean;
  displayMode?: DisplayMode;
  tuning?: TuningDefinition;
  startFret?: number;
  endFret?: number;
  bpm?: number;
  className?: string;
}

// Interval to color mapping - more professional colors
const intervalColors: Record<string, { bg: string; text: string }> = {
  '1': { bg: 'bg-amber-500', text: 'text-white' },
  'b2': { bg: 'bg-orange-500', text: 'text-white' },
  '2': { bg: 'bg-blue-400', text: 'text-white' },
  'b3': { bg: 'bg-green-500', text: 'text-white' },
  '3': { bg: 'bg-emerald-500', text: 'text-white' },
  '4': { bg: 'bg-indigo-500', text: 'text-white' },
  '#4': { bg: 'bg-violet-500', text: 'text-white' },
  'b5': { bg: 'bg-purple-500', text: 'text-white' },
  '5': { bg: 'bg-cyan-500', text: 'text-white' },
  '#5': { bg: 'bg-teal-500', text: 'text-white' },
  'b6': { bg: 'bg-lime-500', text: 'text-gray-900' },
  '6': { bg: 'bg-yellow-400', text: 'text-gray-900' },
  'bb7': { bg: 'bg-rose-400', text: 'text-white' },
  'b7': { bg: 'bg-rose-500', text: 'text-white' },
  '7': { bg: 'bg-pink-500', text: 'text-white' },
};

// Sargam mapping
const sargamMap: Record<string, { short: string }> = {
  '1': { short: 'Sa' }, 'b2': { short: 're' }, '2': { short: 'Re' },
  'b3': { short: 'ga' }, '3': { short: 'Ga' }, '4': { short: 'Ma' },
  '#4': { short: "Mā" }, 'b5': { short: 'pa' }, '5': { short: 'Pa' },
  'b6': { short: 'dha' }, '6': { short: 'Dha' }, 'b7': { short: 'ni' }, '7': { short: 'Ni' },
};

// Solfège mapping
const solfegeMap: Record<string, { short: string }> = {
  '1': { short: 'Do' }, 'b2': { short: 'Di' }, '2': { short: 'Re' },
  'b3': { short: 'Ra' }, '3': { short: 'Mi' }, '4': { short: 'Fa' },
  '#4': { short: 'Fi' }, 'b5': { short: 'Se' }, '5': { short: 'Sol' },
  '#5': { short: 'Si' }, 'b6': { short: 'Le' }, '6': { short: 'La' },
  'bb7': { short: 'Te' }, 'b7': { short: 'Te' }, '7': { short: 'Ti' },
};

// Interval info
const intervalInfo: Record<string, { semitones: number; name: string }> = {
  '1': { semitones: 0, name: 'Root' },
  'b2': { semitones: 1, name: 'Minor 2nd' },
  '2': { semitones: 2, name: 'Major 2nd' },
  'b3': { semitones: 3, name: 'Minor 3rd' },
  '3': { semitones: 4, name: 'Major 3rd' },
  '4': { semitones: 5, name: 'Perfect 4th' },
  '#4': { semitones: 6, name: 'Augmented 4th' },
  'b5': { semitones: 6, name: 'Diminished 5th' },
  '5': { semitones: 7, name: 'Perfect 5th' },
  '#5': { semitones: 8, name: 'Augmented 5th' },
  'b6': { semitones: 8, name: 'Minor 6th' },
  '6': { semitones: 9, name: 'Major 6th' },
  'bb7': { semitones: 9, name: 'Diminished 7th' },
  'b7': { semitones: 10, name: 'Minor 7th' },
  '7': { semitones: 11, name: 'Major 7th' },
};

// Position definitions
const POSITIONS = [
  { id: 'all', name: 'All Positions', fretRange: [0, 24] },
  { id: '1', name: 'Position 1 (Open)', fretRange: [0, 4] },
  { id: '2', name: 'Position 2', fretRange: [2, 6] },
  { id: '3', name: 'Position 3', fretRange: [4, 8] },
  { id: '4', name: 'Position 4', fretRange: [7, 11] },
  { id: '5', name: 'Position 5', fretRange: [9, 13] },
  { id: '12', name: 'Position 12', fretRange: [12, 16] },
];

// Audio context
let audioContext: AudioContext | null = null;

function playGuitarNote(frequency: number, duration: number = 1.5) {
  if (!audioContext) audioContext = new AudioContext();
  const now = audioContext.currentTime;
  const masterGain = audioContext.createGain();
  masterGain.connect(audioContext.destination);

  const lp = audioContext.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(Math.min(frequency * 5, 5000), now);
  lp.Q.setValueAtTime(0.3, now);

  const body = audioContext.createBiquadFilter();
  body.type = 'peaking';
  body.frequency.setValueAtTime(100, now);
  body.Q.setValueAtTime(1.5, now);
  body.gain.setValueAtTime(4, now);

  const mix: { h: number; t: OscillatorType; w: number }[] = [
    { h: 1, t: 'sawtooth', w: 1.0 },
    { h: 2, t: 'triangle', w: 0.5 },
    { h: 3, t: 'triangle', w: 0.3 },
    { h: 4, t: 'sine', w: 0.12 },
    { h: 5, t: 'sine', w: 0.06 },
  ];

  mix.forEach(({ h, t, w }) => {
    const osc = audioContext!.createOscillator();
    const gain = audioContext!.createGain();
    osc.type = t;
    osc.frequency.setValueAtTime(frequency * h, now);
    const peak = w * 0.6;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(peak * 0.4, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(lp);
    osc.start(now);
    osc.stop(now + duration);
  });

  lp.connect(body);
  body.connect(masterGain);
}

export function Fretboard({
  selectedNotes = [],
  rootNote = 'C',
  highlightRoot = true,
  displayMode = 'notes',
  tuning,
  startFret = 0,
  endFret = 24,
  bpm = 60,
  className
}: FretboardProps) {
  const defaultTuning = {
    id: 'standard',
    name: 'Standard Tuning',
    notes: ['E', 'A', 'D', 'G', 'B', 'E'] as Note[],
    strings: 6,
    category: 'Standard',
    description: 'EADGBE'
  };
  
  const currentTuning = tuning || defaultTuning;
  const strings = currentTuning.notes.length;
  
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentDisplayMode, setCurrentDisplayMode] = useState<DisplayMode>(displayMode);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [playingNoteKey, setPlayingNoteKey] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [viewStart, setViewStart] = useState(0);
  const [viewEnd, setViewEnd] = useState(12);
  const stopRef = useRef(false);
  const pausedRef = useRef(false);
  
  const fretCount = viewEnd - viewStart + 1;
  
  useEffect(() => {
    if (selectedPosition !== 'all') {
      const pos = POSITIONS.find(p => p.id === selectedPosition);
      if (pos) {
        setViewStart(pos.fretRange[0]);
        setViewEnd(Math.min(pos.fretRange[1], pos.fretRange[0] + 12));
      }
    }
  }, [selectedPosition]);
  
  useEffect(() => {
    if (!isMetronomeOn || !audioEnabled) return;
    const interval = setInterval(() => {
      if (!audioContext) audioContext = new AudioContext();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.15, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 0.05);
    }, (60 / bpm) * 1000);
    return () => clearInterval(interval);
  }, [isMetronomeOn, bpm, audioEnabled]);
  
  const getNoteAt = useCallback((stringIndex: number, fret: number): Note => {
    const openNote = currentTuning.notes[stringIndex] as Note;
    return getNoteAtInterval(openNote, fret);
  }, [currentTuning]);
  
  const getInterval = useCallback((note: Note): string => {
    const rootIndex = NOTES.indexOf(rootNote);
    const noteIndex = NOTES.indexOf(note);
    const semitones = (noteIndex - rootIndex + 12) % 12;
    const map: Record<number, string> = {
      0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4',
      6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
    };
    return map[semitones] || '1';
  }, [rootNote]);
  
  const getDisplayLabel = useCallback((note: Note, interval: string): string => {
    switch (currentDisplayMode) {
      case 'sargam': return sargamMap[interval]?.short || note;
      case 'solfege': return solfegeMap[interval]?.short || note;
      case 'numbers': 
        const degree = selectedNotes.indexOf(note) + 1;
        return degree > 0 ? degree.toString() : note;
      case 'intervals': return interval;
      default: return note;
    }
  }, [currentDisplayMode, selectedNotes]);
  
  const isNoteSelected = useCallback((note: Note) => selectedNotes.includes(note), [selectedNotes]);
  const isNoteRoot = useCallback((note: Note) => highlightRoot && note === rootNote, [highlightRoot, rootNote]);
  const isInPosition = useCallback((fret: number) => {
    if (selectedPosition === 'all') return true;
    const pos = POSITIONS.find(p => p.id === selectedPosition);
    return pos ? fret >= pos.fretRange[0] && fret <= pos.fretRange[1] : true;
  }, [selectedPosition]);
  
  const handleNoteClick = useCallback((stringIndex: number, fret: number) => {
    if (audioEnabled) {
      const freq = getGuitarStringFrequency(stringIndex, fret, currentTuning);
      playGuitarNote(freq);
    }
  }, [audioEnabled, currentTuning]);
  
  const sleep = (ms: number) => new Promise<void>(resolve => {
    const check = () => {
      if (stopRef.current) { resolve(); return; }
      if (pausedRef.current) { setTimeout(check, 50); return; }
      resolve();
    };
    setTimeout(check, ms);
  });

  const playScale = useCallback(async () => {
    if (!audioEnabled || isPlaying || isPaused) return;
    stopRef.current = false;
    pausedRef.current = false;
    setIsPlaying(true);
    setIsPaused(false);
    
    // If "All" selected, use Position 1
    const pos = selectedPosition === 'all' ? POSITIONS[1] : POSITIONS.find(p => p.id === selectedPosition);
    const playStart = pos ? pos.fretRange[0] : viewStart;
    const playEnd = pos ? pos.fretRange[1] : viewEnd;
    
    const notePositions: { string: number; fret: number; freq: number }[] = [];
    for (let fret = playStart; fret <= playEnd; fret++) {
      for (let s = 0; s < strings; s++) {
        const note = getNoteAt(s, fret);
        if (isNoteSelected(note)) {
          notePositions.push({ string: s, fret, freq: getGuitarStringFrequency(s, fret, currentTuning) });
        }
      }
    }
    notePositions.sort((a, b) => a.freq - b.freq);
    
    const duration = 60 / bpm;
    
    const playSequence = async (positions: { string: number; fret: number; freq: number }[]) => {
      for (const pos of positions) {
        if (stopRef.current) break;
        while (pausedRef.current && !stopRef.current) {
          await new Promise(r => setTimeout(r, 50));
        }
        if (stopRef.current) break;
        setPlayingNoteKey(`${pos.string}-${pos.fret}`);
        playGuitarNote(pos.freq, duration * 1.5);
        await sleep(duration * 1000);
      }
    };
    
    await playSequence(notePositions);
    if (!stopRef.current) {
      await playSequence([...notePositions].reverse());
    }
    
    setPlayingNoteKey(null);
    setIsPlaying(false);
    setIsPaused(false);
  }, [audioEnabled, isPlaying, isPaused, selectedPosition, viewStart, viewEnd, strings, getNoteAt, isNoteSelected, currentTuning, bpm]);
  
  const scrollLeft = () => {
    if (viewStart > 0) {
      setViewStart(v => Math.max(0, v - 3));
      setViewEnd(v => Math.max(fretCount, v - 3));
    }
  };
  
  const scrollRight = () => {
    if (viewEnd < endFret) {
      setViewStart(v => v + 3);
      setViewEnd(v => Math.min(endFret, v + 3));
    }
  };
  
  // Tooltip content
  const getTooltipContent = useCallback((note: Note, interval: string, stringIndex: number, fret: number) => {
    const intervalData = intervalInfo[interval];
    const isRoot = isNoteRoot(note);
    
    if (!showTooltip) {
      return (
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="font-bold">{note}</span>
            {isRoot && <Badge variant="default" className="text-[10px] h-4">ROOT</Badge>}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            String {strings - stringIndex} · Fret {fret} · {intervalData?.name}
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-3 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-lg">{note}</span>
          {isRoot && <Badge variant="default">ROOT</Badge>}
        </div>
        <Separator className="my-2" />
        <div className="space-y-1 text-xs">
          <div className="flex justify-between"><span className="text-muted-foreground">Position:</span><span>String {strings - stringIndex} · Fret {fret}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Interval:</span><span>{interval} - {intervalData?.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Semitones:</span><span>{intervalData?.semitones}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Sargam:</span><span className="text-amber-500">{sargamMap[interval]?.short || '-'}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Solfège:</span><span className="text-sky-500">{solfegeMap[interval]?.short || '-'}</span></div>
        </div>
      </div>
    );
  }, [showTooltip, strings, isNoteRoot]);
  
  // String thickness for realistic look
  const getStringThickness = (idx: number) => {
    const thicknesses = ['h-[3px]', 'h-[2.5px]', 'h-[2px]', 'h-[1.5px]', 'h-[1.25px]', 'h-[1px]'];
    return thicknesses[idx] || 'h-[1px]';
  };
  
  return (
    <div className={cn("relative", className)}>
      {/* Controls */}
      <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {/* Group 1: Audio */}
          <div className="flex items-center gap-1.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={cn("h-8 w-8 p-0", audioEnabled && "border-primary text-primary")}
                  >
                    {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Audio {audioEnabled ? 'On' : 'Off'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {!isPlaying ? (
              <Button size="sm" onClick={playScale} disabled={!audioEnabled} className="h-8 gap-1.5">
                <Play className="h-3.5 w-3.5" />
                Play
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={() => {
                    pausedRef.current = !pausedRef.current;
                    setIsPaused(pausedRef.current);
                  }}
                  className="h-8 gap-1.5"
                >
                  {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    stopRef.current = true;
                    pausedRef.current = false;
                  }}
                  className="h-8 gap-1.5"
                >
                  <Square className="h-3.5 w-3.5" />
                  Stop
                </Button>
              </>
            )}
            
            <Button
              variant={isMetronomeOn ? "default" : "outline"}
              size="sm"
              onClick={() => setIsMetronomeOn(!isMetronomeOn)}
              disabled={!audioEnabled}
              className="h-8 gap-1"
            >
              <Clock className="h-3.5 w-3.5" />
              <span className="font-mono text-[10px]">{bpm}</span>
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          {/* Group 2: View */}
          <div className="flex items-center gap-1.5">
            <Label className="text-xs text-muted-foreground shrink-0">Position:</Label>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {POSITIONS.map(p => <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Label className="text-xs text-muted-foreground shrink-0">Display:</Label>
            <Select value={currentDisplayMode} onValueChange={(v) => setCurrentDisplayMode(v as DisplayMode)}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <Ear className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="notes">Notes</SelectItem>
                <SelectItem value="intervals">Intervals</SelectItem>
                <SelectItem value="numbers">Degrees</SelectItem>
                <SelectItem value="sargam">Sargam</SelectItem>
                <SelectItem value="solfege">Solfège</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
            <Label className="text-xs text-muted-foreground">Show Tool Tip:</Label>
            <Switch checked={showTooltip} onCheckedChange={setShowTooltip} className="h-5 w-8" />
          </div>
          
          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          {/* Group 3: Navigation */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={scrollLeft} disabled={viewStart === 0} className="h-8 w-7 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Badge variant="secondary" className="text-xs px-2 py-0.5 h-5 font-mono">{viewStart}-{viewEnd}</Badge>
            <Button variant="ghost" size="sm" onClick={scrollRight} disabled={viewEnd >= endFret} className="h-8 w-7 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Fretboard Container */}
      <div className="w-full overflow-x-auto overflow-y-hidden -webkit-overflow-scrolling-touch">
        <div className="relative min-w-[640px] sm:min-w-[720px] md:min-w-[800px]">
          
          {/* Fretboard Dark Background */}
          <div className="absolute inset-0 rounded-lg overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`
            }} />
          </div>
          
          {/* Left column background */}
          <div className="absolute left-0 top-0 bottom-0 w-[52px] z-20 bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700 shadow-[2px_0_8px_rgba(0,0,0,0.3)] rounded-l-md border-r border-zinc-600/30" />
          
          {/* Fret Numbers Row */}
          <div className={cn(
            "flex items-end h-7 relative z-10",
            "ml-[52px]"
          )}>
            {Array.from({ length: fretCount }).map((_, i) => {
              const fret = viewStart === 0 ? i + 1 : viewStart + i;
              const isDoubleDot = fret === 12 || fret === 24 || (fret > 12 && (fret - 12) % 12 === 0);
              const isSingleDot = [3, 5, 7, 9, 15, 17, 19, 21].includes(fret);
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end pb-0.5">
                  <span className="text-[10px] text-white/70 font-medium drop-shadow">{fret}</span>
                  <div className="flex flex-col items-center gap-[2px] mt-[2px]">
                    {isSingleDot && <div className="w-1.5 h-1.5 rounded-full bg-white/40" />}
                    {isDoubleDot && (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Strings Container */}
          <div className={"relative pb-1 ml-[52px]"}>
            {[...currentTuning.notes].reverse().map((openNote, reversedIdx) => {
              const stringIdx = currentTuning.notes.length - 1 - reversedIdx;
              const note = getNoteAt(stringIdx, 0);
              const isSelected = isNoteSelected(note);
              const isRoot = isNoteRoot(note);
              const interval = getInterval(note);
              const colorStyle = intervalColors[interval];
              
              return (
                <div key={stringIdx} className="relative flex items-center h-8 sm:h-9">
                  {/* Open String Note */}
                  <div className="absolute -left-[52px] w-[52px] flex items-center justify-center z-30">
                      {showTooltip ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleNoteClick(stringIdx, 0)}
                                className={cn(
                                  "cursor-pointer w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-transform hover:scale-110 active:scale-95 shadow-sm",
                                  playingNoteKey === `${stringIdx}-0` && "ring-2 ring-white scale-110",
                                  isRoot ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50 ring-2 ring-primary/30" :
                                  isSelected && colorStyle ? cn(colorStyle.bg, colorStyle.text) :
                                  "bg-white/90 text-gray-800 hover:bg-white"
                                )}
                              >
                                {isNoteSelected(note) ? getDisplayLabel(note, interval) : openNote}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">{getTooltipContent(note, interval, stringIdx, 0)}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <button
                          onClick={() => handleNoteClick(stringIdx, 0)}
                          className={cn(
                            "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-transform hover:scale-110 active:scale-95 shadow-sm",
                            playingNoteKey === `${stringIdx}-0` && "ring-2 ring-white scale-110",
                            isRoot ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50 ring-2 ring-primary/30" :
                            isSelected && colorStyle ? cn(colorStyle.bg, colorStyle.text) :
                            "bg-white/90 text-gray-800 hover:bg-white"
                          )}
                        >
                          {isNoteSelected(note) ? getDisplayLabel(note, interval) : openNote}
                        </button>
                      )}
                    </div>
                  
                  {/* String */}
                  <div className="flex-1 relative">
                    <div className={cn(
                      "absolute left-0 right-0 rounded-full",
                      getStringThickness(stringIdx),
                      stringIdx < 3 
                        ? "bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500" 
                        : "bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400"
                    )} style={{ top: '50%', transform: 'translateY(-50%)' }} />
                    
                    {/* Frets and Notes */}
                    <div className="relative flex">
                      {Array.from({ length: fretCount }).map((_, fretIdx) => {
                        const actualFret = viewStart === 0 ? fretIdx + 1 : viewStart + fretIdx;
                        const note = getNoteAt(stringIdx, actualFret);
                        const isSelected = isNoteSelected(note);
                        const isRoot = isNoteRoot(note);
                        const interval = getInterval(note);
                        const inPos = isInPosition(actualFret);
                        const colorStyle = intervalColors[interval];
                        
                        return (
                          <div key={fretIdx} className="flex-1 relative h-8 sm:h-9 flex items-center justify-center">
                            {/* Fret Wire */}
                            <div 
                              className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500"
                              style={{ boxShadow: '-1px 0 3px rgba(0,0,0,0.4), 1px 0 1px rgba(255,255,255,0.15)' }}
                            />
                            
                            {/* Note Marker */}
                            {(isSelected || isRoot) && (
                              <>
                                {showTooltip ? (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={() => handleNoteClick(stringIdx, actualFret)}
                                        className={cn(
                                          "cursor-pointer relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all duration-150 shadow-sm hover:scale-110 active:scale-95",
                                          playingNoteKey === `${stringIdx}-${actualFret}` && "ring-2 ring-white scale-110 z-20",
                                          inPos ? (
                                            isRoot 
                                              ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-1 ring-offset-transparent scale-105 shadow-lg" 
                                              : cn(colorStyle?.bg || "bg-white", colorStyle?.text || "text-gray-900", "shadow-lg")
                                          ) : (
                                            "bg-zinc-700/30 text-zinc-500"
                                          )
                                        )}
                                      >
                                        {getDisplayLabel(note, interval)}
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">{getTooltipContent(note, interval, stringIdx, actualFret)}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <button
                                  onClick={() => handleNoteClick(stringIdx, actualFret)}
                                  className={cn(
                                    "cursor-pointer relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all duration-150 shadow-sm hover:scale-110 active:scale-95",
                                      playingNoteKey === `${stringIdx}-${actualFret}` && "ring-2 ring-white scale-110 z-20",
                                      inPos ? (
                                        isRoot 
                                          ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-1 ring-offset-transparent scale-105 shadow-lg" 
                                          : cn(colorStyle?.bg || "bg-white", colorStyle?.text || "text-gray-900", "shadow-lg")
                                      ) : (
                                        "bg-zinc-700/30 text-zinc-500"
                                      )
                                    )}
                                  >
                                    {getDisplayLabel(note, interval)}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Bottom Fret Markers */}
          <div className={"flex items-start h-4 relative z-10 ml-[52px]"}>
            {Array.from({ length: fretCount }).map((_, i) => {
              const fret = viewStart === 0 ? i + 1 : viewStart + i;
              const isDoubleDot = fret === 12 || fret === 24 || (fret > 12 && (fret - 12) % 12 === 0);
              const isSingleDot = [3, 5, 7, 9, 15, 17, 19, 21].includes(fret);
              
              return (
                <div key={i} className="flex-1 flex justify-center pt-1">
                  {isSingleDot && <div className="w-2 h-2 rounded-full bg-white/30" />}
                  {isDoubleDot && (
                    <div className="flex flex-col gap-0.5">
                      <div className="w-2 h-2 rounded-full bg-white/30" />
                      <div className="w-2 h-2 rounded-full bg-white/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-3 p-2.5 rounded-lg bg-muted/20 border border-border/30">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px]">
          <span className="text-muted-foreground font-medium">Intervals:</span>
          {Object.entries(intervalColors).slice(0, 12).map(([int, style]) => (
            <div key={int} className="flex items-center gap-1">
              <div className={cn("w-2.5 h-2.5 rounded-full", style.bg)} />
              <span className="text-muted-foreground">{int}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Fretboard;
