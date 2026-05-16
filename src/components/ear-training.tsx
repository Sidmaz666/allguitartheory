'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  NOTES,
  SCALES,
  CHORDS,
  getScaleNotes,
  getChordNotes,
  getNoteAtInterval,
  getGuitarStringFrequency,
  TUNINGS,
  type Note,
  type ScaleDefinition,
  type ChordDefinition,
} from '@/lib/music-theory';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Ear, Trophy, RefreshCw, Clock, Star, Zap, Sparkles, LogOut } from 'lucide-react';

type Mode = 'scales' | 'chords';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

let audioCtx: AudioContext | null = null;

function playNote(freq: number, dur: number = 0.9, delay: number = 0) {
  if (!audioCtx) audioCtx = new AudioContext();
  const now = audioCtx.currentTime + delay;
  const master = audioCtx.createGain();
  master.gain.setValueAtTime(Math.min(0.7, 200 / freq), now);
  master.connect(audioCtx.destination);

  const lp = audioCtx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(Math.min(freq * 5, 5000), now);
  lp.Q.setValueAtTime(0.3, now);

  const body = audioCtx.createBiquadFilter();
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
    const osc = audioCtx!.createOscillator();
    const g = audioCtx!.createGain();
    osc.type = t;
    osc.frequency.setValueAtTime(freq * h, now);
    const peak = w * 0.5;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(peak, now + 0.003);
    g.gain.exponentialRampToValueAtTime(peak * 0.4, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(g);
    g.connect(lp);
    osc.start(now);
    osc.stop(now + dur);
  });

  lp.connect(body);
  body.connect(master);
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function getScalesByDifficulty(d: Difficulty): ScaleDefinition[] {
  switch (d) {
    case 'easy': return SCALES.filter(s => s.difficulty <= 1).slice(0, 8);
    case 'medium': return SCALES.filter(s => s.difficulty <= 2).slice(0, 16);
    case 'hard': return SCALES.filter(s => s.difficulty <= 3).slice(0, 30);
    case 'expert': return SCALES;
  }
}

function getChordsByDifficulty(d: Difficulty): ChordDefinition[] {
  switch (d) {
    case 'easy': return CHORDS.filter(c => c.difficulty <= 1).slice(0, 8);
    case 'medium': return CHORDS.filter(c => c.difficulty <= 2).slice(0, 12);
    case 'hard': return CHORDS.filter(c => c.difficulty <= 3).slice(0, 18);
    case 'expert': return CHORDS;
  }
}

const diffIcon = { easy: Star, medium: Zap, hard: Sparkles, expert: Trophy };
const diffLabel = { easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert' };
const diffColor = { easy: 'text-emerald-400 border-emerald-500/30', medium: 'text-amber-400 border-amber-500/30', hard: 'text-orange-400 border-orange-500/30', expert: 'text-rose-400 border-rose-500/30' };

interface EarTrainingProps {
  mode: Mode;
  className?: string;
}

export function EarTraining({ mode, className }: EarTrainingProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [state, setState] = useState<'idle' | 'playing' | 'answering' | 'result'>('idle');
  const [currentRoot, setCurrentRoot] = useState<Note>('C');
  const [currentItem, setCurrentItem] = useState<ScaleDefinition | ChordDefinition | null>(null);
  const [rootOptions, setRootOptions] = useState<Note[]>([]);
  const [nameOptions, setNameOptions] = useState<string[]>([]);
  const [selectedRoot, setSelectedRoot] = useState<Note | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [timer, setTimer] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const currentAudioRef = useRef<{ freq: number }[]>([]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startTimer = () => {
    setTimer(15);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (timer === 0 && state === 'answering') {
      handleSubmit();
    }
  }, [timer]);

  const startRound = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFeedback(null);
    setSelectedRoot(null);
    setSelectedName(null);

    const items = mode === 'scales' ? getScalesByDifficulty(difficulty) : getChordsByDifficulty(difficulty);
    const item = items[Math.floor(Math.random() * items.length)];
    const root = NOTES[Math.floor(Math.random() * 12)];

    setCurrentRoot(root);
    setCurrentItem(item);
    setTotal(t => t + 1);

    const wrongRoots = shuffle(NOTES.filter(n => n !== root)).slice(0, 3);
    setRootOptions(shuffle([root, ...wrongRoots]));

    const itemName = mode === 'scales' ? (item as ScaleDefinition).name : `${root}${(item as ChordDefinition).symbol}`;
    const allNames = mode === 'scales'
      ? SCALES.map(s => s.name)
      : CHORDS.map(c => `${root}${c.symbol}`);
    const wrongNames = shuffle(allNames.filter(n => n !== itemName)).slice(0, 3);
    setNameOptions(shuffle([itemName, ...wrongNames]));

    setState('playing');

    const scaleNotes = mode === 'scales'
      ? getScaleNotes(root, item as ScaleDefinition)
      : getChordNotes(root, item as ChordDefinition);

    // Collect all fret positions in Position 1 (frets 0-4) for this scale/chord
    const tuning = TUNINGS[0];
    const posNotes: { freq: number }[] = [];
    for (let f = 0; f <= 4; f++) {
      for (let s = 0; s < tuning.notes.length; s++) {
        const note = getNoteAtInterval(tuning.notes[s] as Note, f);
        if (scaleNotes.includes(note)) {
          posNotes.push({ freq: getGuitarStringFrequency(s, f, tuning) });
        }
      }
    }
    const unique = new Map<number, number>();
    for (const pn of posNotes) {
      const key = Math.round(pn.freq * 10);
      if (!unique.has(key)) unique.set(key, pn.freq);
    }
    const sorted = Array.from(unique.values()).sort((a, b) => a - b);
    currentAudioRef.current = sorted.map(f => ({ freq: f }));

    // Play: scales ascend then descend, chords strum with slight delay
    if (mode === 'chords') {
      sorted.forEach((f, i) => playNote(f, 1.2, i * 0.04));
      await sleep(1500);
    } else {
      for (const f of sorted) { playNote(f, 0.65); await sleep(500); }
      await sleep(300);
      for (const f of [...sorted].reverse()) { playNote(f, 0.65); await sleep(500); }
    }

    setState('answering');
    startTimer();
  }, [mode, difficulty]);

  const replay = useCallback(async () => {
    const freqs = currentAudioRef.current;
    if (freqs.length === 0) return;
    if (mode === 'chords') {
      freqs.forEach(({ freq }, i) => playNote(freq, 1.2, i * 0.04));
    } else {
      for (const { freq } of freqs) { playNote(freq, 0.65); await sleep(500); }
      await sleep(300);
      for (const { freq } of [...freqs].reverse()) { playNote(freq, 0.65); await sleep(500); }
    }
  }, [mode]);

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const correctRoot = currentRoot === selectedRoot;
    const correctName = mode === 'scales'
      ? selectedName === (currentItem as ScaleDefinition)?.name
      : selectedName === `${currentRoot}${(currentItem as ChordDefinition)?.symbol}`;
    const isCorrect = selectedRoot && selectedName && correctRoot && correctName;
    if (isCorrect) setScore(s => s + 1);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setState('result');
  };

  const correctAnswer = mode === 'scales'
    ? `${currentRoot} ${(currentItem as ScaleDefinition)?.name}`
    : `${currentRoot}${(currentItem as ChordDefinition)?.symbol}`;

  const body = mode === 'scales' ? (currentItem as ScaleDefinition)?.description : (currentItem as ChordDefinition)?.description;

  const quit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (total > 0) setShowSummary(true);
    setState('idle');
  };

  const dismissSummary = () => {
    setShowSummary(false);
    setScore(0);
    setTotal(0);
  };

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Ear className="w-4 h-4 text-primary" />
            </div>
            Ear Training – {mode === 'scales' ? 'Scales' : 'Chords'}
          </CardTitle>
          <div className="flex items-center gap-2">
            {state !== 'idle' && (
              <button onClick={quit} className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-all">
                <LogOut className="w-3 h-3" /> Quit
              </button>
            )}
            <Badge variant="secondary" className="text-xs gap-1"><Trophy className="w-3 h-3" /> {score}/{total}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map(d => {
            const Icon = diffIcon[d];
            return (
              <button
                key={d}
                onClick={() => { if (state === 'idle') setDifficulty(d); }}
                className={cn(
                  "cursor-pointer flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium border transition-all",
                  difficulty === d ? cn("bg-muted", diffColor[d]) : "border-transparent text-muted-foreground hover:text-foreground",
                  state !== 'idle' && "opacity-50 cursor-not-allowed"
                )}
                disabled={state !== 'idle'}
              >
                <Icon className="w-3 h-3" />
                {diffLabel[d]}
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        {state === 'idle' && !showSummary && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="text-sm text-muted-foreground text-center max-w-md">
              Listen to the {mode === 'scales' ? 'scale' : 'chord'} played and identify its <strong>key</strong> and <strong>{mode === 'scales' ? 'name' : 'type'}</strong>.<br />
              Choose Easy, Medium, Hard, or Expert difficulty.
            </div>
            <Button onClick={startRound} className="gap-2">
              <Play className="w-4 h-4" /> Start Test
            </Button>
          </div>
        )}

        {showSummary && (
          <div className="py-6 text-center">
            <Trophy className="w-10 h-10 text-primary mx-auto mb-3" />
            <div className="text-lg font-bold text-primary mb-1">Session Complete</div>
            <div className="text-sm text-muted-foreground mb-1">
              You answered <strong className="text-foreground">{score}</strong> out of <strong className="text-foreground">{total}</strong> correctly
            </div>
            <div className="text-2xl font-bold text-primary mb-4">
              {total > 0 ? Math.round(score / total * 100) : 0}%
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button onClick={dismissSummary} variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-3.5 h-3.5" /> New Session
              </Button>
              <Button onClick={() => { setShowSummary(false); startRound(); }} size="sm" className="gap-2">
                <Play className="w-3.5 h-3.5" /> Play Again
              </Button>
            </div>
          </div>
        )}

        {(state === 'playing' || state === 'answering' || state === 'result') && (
          <div className="space-y-4">
            {state === 'playing' && (
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">Playing {mode === 'scales' ? 'scale' : 'chord'}...</span>
              </div>
            )}

            {state === 'answering' && (
              <div className="flex items-center justify-center gap-3 py-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className={cn("text-lg font-bold font-mono", timer <= 5 ? "text-rose-400" : "text-amber-400")}>{timer}s</span>
                <button onClick={replay} className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-all">
                  <RefreshCw className="w-3.5 h-3.5" /> Replay
                </button>
              </div>
            )}

            {(state === 'answering' || state === 'result') && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Select Key:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {rootOptions.map(r => (
                      <button
                        key={r}
                        onClick={() => { if (state === 'answering') setSelectedRoot(r); }}
                        className={cn(
                          "cursor-pointer px-3 py-1.5 rounded-md text-sm font-semibold border transition-all",
                          state === 'result' && r === currentRoot && "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
                          state === 'result' && r === selectedRoot && r !== currentRoot && "bg-rose-500/20 border-rose-500/50 text-rose-400",
                          selectedRoot === r && state === 'answering' && "bg-primary/20 border-primary/50 text-primary",
                          selectedRoot !== r && state === 'answering' && "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        )}
                        disabled={state === 'result'}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Select {mode === 'scales' ? 'Scale' : 'Chord'}:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {nameOptions.map(n => (
                      <button
                        key={n}
                        onClick={() => { if (state === 'answering') setSelectedName(n); }}
                        className={cn(
                          "cursor-pointer px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
                          state === 'result' && n === correctAnswer.slice(correctAnswer.indexOf(' ') + 1) && "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
                          state === 'result' && n === selectedName && n !== correctAnswer.slice(correctAnswer.indexOf(' ') + 1) && "bg-rose-500/20 border-rose-500/50 text-rose-400",
                          selectedName === n && state === 'answering' && "bg-primary/20 border-primary/50 text-primary",
                          selectedName !== n && state === 'answering' && "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        )}
                        disabled={state === 'result'}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {state === 'answering' && (
                  <Button onClick={handleSubmit} className="w-full gap-2" disabled={!selectedRoot || !selectedName}>
                    Submit Answer
                  </Button>
                )}

                {state === 'result' && (
                  <div className={cn(
                    "p-3 rounded-lg border text-center",
                    feedback === 'correct' ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30"
                  )}>
                    <div className={cn("text-lg font-bold mb-1", feedback === 'correct' ? "text-emerald-400" : "text-rose-400")}>
                      {feedback === 'correct' ? '✓ Correct!' : '✗ Wrong'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Answer: <span className="text-primary font-bold">{correctAnswer}</span>
                    </div>
                    {body && <div className="text-[10px] text-muted-foreground mt-1">{body}</div>}
                    <Button onClick={startRound} className="mt-3 gap-2" size="sm">
                      <RefreshCw className="w-3.5 h-3.5" /> Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EarTraining;
