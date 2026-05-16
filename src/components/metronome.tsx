'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
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
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Square, 
  Minus, 
  Plus, 
  Clock,
  Volume2,
  VolumeX,
  Drum
} from 'lucide-react';

interface MetronomeProps {
  initialBpm?: number;
  onBpmChange?: (bpm: number) => void;
  className?: string;
}

// Time signatures
const TIME_SIGNATURES = [
  { id: '4/4', beats: 4, subdivision: 4, label: '4/4', description: 'Common Time' },
  { id: '3/4', beats: 3, subdivision: 4, label: '3/4', description: 'Waltz Time' },
  { id: '2/4', beats: 2, subdivision: 4, label: '2/4', description: 'March Time' },
  { id: '6/8', beats: 6, subdivision: 8, label: '6/8', description: 'Compound Duple' },
  { id: '5/4', beats: 5, subdivision: 4, label: '5/4', description: 'Odd Meter' },
  { id: '7/8', beats: 7, subdivision: 8, label: '7/8', description: 'Odd Meter' },
  { id: '9/8', beats: 9, subdivision: 8, label: '9/8', description: 'Compound Triple' },
  { id: '12/8', beats: 12, subdivision: 8, label: '12/8', description: 'Compound Quadruple' },
];

// Accent patterns
const ACCENT_PATTERNS = [
  { id: 'standard', name: 'Standard', pattern: [1, 0, 0, 0] },
  { id: 'backbeat', name: 'Backbeat', pattern: [1, 0, 1, 0] },
  { id: 'waltz', name: 'Waltz', pattern: [1, 0, 0] },
  { id: 'syncopated', name: 'Syncopated', pattern: [1, 0, 1, 1] },
  { id: 'all-down', name: 'All Down', pattern: [1, 1, 1, 1] },
];

export function Metronome({ 
  initialBpm = 60, 
  onBpmChange,
  className 
}: MetronomeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(initialBpm);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [accentPattern, setAccentPattern] = useState('standard');
  const [currentBeat, setCurrentBeat] = useState(0);
  const [visualBeat, setVisualBeat] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const currentBeatRef = useRef(0);

  const selectedTimeSignature = TIME_SIGNATURES.find(t => t.id === timeSignature) || TIME_SIGNATURES[0];
  const selectedAccentPattern = ACCENT_PATTERNS.find(a => a.id === accentPattern) || ACCENT_PATTERNS[0];
  const beatsPerMeasure = selectedTimeSignature.beats;

  // Initialize audio context
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  // Play click sound
  const playClick = useCallback((accent: boolean, beat: number) => {
    if (!audioEnabled) return;
    
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create oscillator for click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    // Higher pitch for accented beats
    osc.frequency.setValueAtTime(accent ? 1000 : 800, now);
    osc.type = 'sine';
    
    // Filter for warmer sound
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, now);
    
    // Envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(accent ? 0.4 : 0.25, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }, [audioEnabled, getAudioContext]);

  // Scheduler for precise timing
  const scheduler = useCallback(() => {
    const ctx = getAudioContext();
    const secondsPerBeat = 60.0 / bpm;
    
    while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
      const accentIndex = currentBeatRef.current % selectedAccentPattern.pattern.length;
      const isAccent = selectedAccentPattern.pattern[accentIndex] === 1 || currentBeatRef.current === 0;
      
      playClick(isAccent, currentBeatRef.current);
      
      // Update visual beat (slightly delayed for sync)
      const beatToSet = currentBeatRef.current;
      setTimeout(() => {
        setCurrentBeat(beatToSet);
        setVisualBeat(beatToSet);
      }, Math.max(0, (nextNoteTimeRef.current - ctx.currentTime) * 1000 - 10));
      
      currentBeatRef.current = (currentBeatRef.current + 1) % beatsPerMeasure;
      nextNoteTimeRef.current += secondsPerBeat;
    }
  }, [bpm, beatsPerMeasure, selectedAccentPattern, playClick, getAudioContext]);

  // Start metronome
  const startMetronome = useCallback(() => {
    const ctx = getAudioContext();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    setIsPlaying(true);
    currentBeatRef.current = 0;
    nextNoteTimeRef.current = ctx.currentTime;
    setCurrentBeat(0);
    
    // Start scheduler
    timerIdRef.current = setInterval(scheduler, 25);
  }, [scheduler, getAudioContext]);

  // Stop metronome
  const stopMetronome = useCallback(() => {
    setIsPlaying(false);
    setCurrentBeat(0);
    setVisualBeat(0);
    currentBeatRef.current = 0;
    
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  }, [isPlaying, startMetronome, stopMetronome]);

  // Update BPM
  const updateBpm = (newBpm: number) => {
    const clampedBpm = Math.max(30, Math.min(300, newBpm));
    setBpm(clampedBpm);
    onBpmChange?.(clampedBpm);
  };

  const decreaseBpm = () => updateBpm(bpm - 5);
  const increaseBpm = () => updateBpm(bpm + 5);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, []);

  // Handle time signature change
  const handleTimeSignatureChange = (value: string) => {
    setTimeSignature(value);
    if (isPlaying) {
      stopMetronome();
      setTimeout(startMetronome, 100);
    }
  };

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {/* Play/Pause Button */}
      <Button
        variant={isPlaying ? "default" : "outline"}
        size="sm"
        onClick={togglePlay}
        className={cn(
          "h-9 gap-2 px-4",
          isPlaying && "bg-primary text-primary-foreground"
        )}
      >
        {isPlaying ? (
          <>
            <Square className="h-4 w-4" />
            <span className="hidden sm:inline">Stop</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Start</span>
          </>
        )}
      </Button>

      {/* BPM Control */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/50 border border-border/50">
        <Drum className="w-4 h-4 text-primary" />
        <Label className="text-xs text-muted-foreground hidden md:inline">BPM</Label>
        <Button variant="ghost" size="sm" onClick={decreaseBpm} className="h-7 w-7 p-0">
          <Minus className="w-3 h-3" />
        </Button>
        <Input
          type="number"
          value={bpm}
          onChange={(e) => updateBpm(parseInt(e.target.value) || 60)}
          className="w-14 h-7 text-sm text-center bg-background border-border p-1 font-mono"
        />
        <Button variant="ghost" size="sm" onClick={increaseBpm} className="h-7 w-7 p-0">
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      {/* Time Signature */}
      <Select value={timeSignature} onValueChange={handleTimeSignatureChange}>
        <SelectTrigger className="w-[70px] h-9 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TIME_SIGNATURES.map(ts => (
            <SelectItem key={ts.id} value={ts.id} className="text-xs">
              {ts.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Accent Pattern */}
      <Select value={accentPattern} onValueChange={setAccentPattern}>
        <SelectTrigger className="w-[100px] h-9 text-xs hidden md:flex">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ACCENT_PATTERNS.map(ap => (
            <SelectItem key={ap.id} value={ap.id} className="text-xs">
              {ap.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Audio Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setAudioEnabled(!audioEnabled)}
        className={cn(
          "h-9 w-9 p-0",
          audioEnabled ? "text-primary" : "text-muted-foreground"
        )}
      >
        {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </Button>

      {/* Beat Indicator */}
      {isPlaying && (
        <div className="flex items-center gap-1">
          {Array.from({ length: beatsPerMeasure }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-75",
                visualBeat === i 
                  ? "bg-primary scale-125 shadow-lg shadow-primary/50" 
                  : i === 0 
                    ? "bg-primary/40"
                    : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Metronome;
