'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radio, Mic, MicOff } from 'lucide-react';


type TunerStatus = 'idle' | 'listening' | 'active';

interface StringInfo {
  note: string;
  frequency: number;
  label: string;
}

const STANDARD_STRINGS: StringInfo[] = [
  { note: 'E', frequency: 82.41, label: '6th (Low E)' },
  { note: 'A', frequency: 110.00, label: '5th (A)' },
  { note: 'D', frequency: 146.83, label: '4th (D)' },
  { note: 'G', frequency: 196.00, label: '3rd (G)' },
  { note: 'B', frequency: 246.94, label: '2nd (B)' },
  { note: 'E', frequency: 329.63, label: '1st (High E)' },
];

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function freqToNote(freq: number): { note: string; octave: number; cents: number; targetFreq: number } {
  if (freq <= 20) return { note: '--', octave: 0, cents: 0, targetFreq: 0 };
  const a4 = 440;
  const semitones = 12 * Math.log2(freq / a4);
  const rounded = Math.round(semitones);
  const cents = Math.round((semitones - rounded) * 100);
  const noteIndex = ((rounded % 12) + 12) % 12;
  const octave = 4 + Math.floor((rounded + 9) / 12);
  const targetFreq = a4 * Math.pow(2, rounded / 12);
  return { note: NOTE_NAMES[noteIndex], octave, cents, targetFreq };
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function correctOctave(freq: number): number {
  let best = freq;
  for (let div = 1; div <= 4; div *= 2) {
    const candidate = freq / div;
    for (const s of STANDARD_STRINGS) {
      const ratio = candidate / s.frequency;
      if (ratio > 0.97 && ratio < 1.03) return candidate;
    }
  }
  return best;
}

export function GuitarTuner({ className }: { className?: string }) {
  const [status, setStatus] = useState<TunerStatus>('idle');
  const [detectedNote, setDetectedNote] = useState<string>('--');
  const [detectedFreq, setDetectedFreq] = useState<number>(0);
  const [cents, setCents] = useState<number>(0);
  const [closestString, setClosestString] = useState<number>(-1);
  const [inTune, setInTune] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animRef = useRef<number>(0);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const historyRef = useRef<number[]>([]);
  const stableCountRef = useRef(0);
  const lastDisplayedFreqRef = useRef(0);

  const stopTuner = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    audioCtxRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
    historyRef.current = [];
    stableCountRef.current = 0;
    lastDisplayedFreqRef.current = 0;
    setStatus('idle');
    setDetectedNote('--');
    setDetectedFreq(0);
    setCents(0);
    setClosestString(-1);
    setInTune(false);
  }, []);

  const playPluckedString = useCallback(async (freq: number, duration = 2) => {
    try {
      let audioCtx = audioCtxRef.current;
      if (!audioCtx) {
        audioCtx = new AudioContext();
        await audioCtx.resume();
        audioCtxRef.current = audioCtx;
      } else if (audioCtx.state !== 'running') {
        await audioCtx.resume();
      }

      const sr = audioCtx.sampleRate;
      const period = Math.max(2, Math.round(sr / freq));
      const length = Math.floor(sr * duration);
      const buffer = audioCtx.createBuffer(1, length, sr);
      const data = buffer.getChannelData(0);

      const circ = new Float32Array(period);
      for (let i = 0; i < period; i++) circ[i] = Math.random() * 2 - 1;
      let pos = 0;
      let decay = 0.996;
      for (let i = 0; i < length; i++) {
        const next = 0.5 * (circ[pos] + circ[(pos + 1) % period]) * decay;
        data[i] = next;
        circ[pos] = next;
        pos = (pos + 1) % period;
        decay *= 0.99995;
      }

      const src = audioCtx.createBufferSource();
      src.buffer = buffer;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      src.connect(gain).connect(audioCtx.destination);
      src.start();
      src.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // silently ignore playback errors
    }
  }, []);

  const startTuner = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new AudioContext();
      await audioCtx.resume();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;
      source.connect(analyser);
      setStatus('listening');
      historyRef.current = [];

      const fftSize = analyser.fftSize;
      const bufferLength = fftSize;
      const timeData = new Float32Array(fftSize);
      const freqData = new Float32Array(analyser.frequencyBinCount);
      const sampleRate = audioCtx.sampleRate;

      const detect = () => {
        animRef.current = requestAnimationFrame(detect);
        if (!analyserRef.current) return;

        analyserRef.current.getFloatTimeDomainData(timeData);

        const rms = Math.sqrt(timeData.reduce((sum, v) => sum + v * v, 0) / bufferLength);
        if (rms < 0.025) {
          stableCountRef.current = 0;
          setDetectedFreq(0);
          setClosestString(-1);
          setDetectedNote('--');
          return;
        }

        const minFreq = 60;
        const maxFreq = 500;
        const minPeriod = Math.floor(sampleRate / maxFreq);
        const maxPeriod = Math.ceil(sampleRate / minFreq);

        const threshold = 0.1;

        const diff = new Float32Array(maxPeriod + 2);
        for (let k = minPeriod; k <= maxPeriod; k++) {
          let sum = 0;
          for (let i = 0; i < bufferLength - k; i++) {
            const d = timeData[i] - timeData[i + k];
            sum += d * d;
          }
          diff[k] = sum;
        }

        let firstMin = Infinity;
        let firstMinK = 0;
        let cumSum = 0;
        for (let k = minPeriod; k <= maxPeriod; k++) {
          cumSum += diff[k];
          if (cumSum === 0) continue;
          const norm = diff[k] / (cumSum / (k - minPeriod + 1));
          if (norm < firstMin && k > minPeriod) {
            firstMin = norm;
            firstMinK = k;
          }
          if (norm < threshold) {
            if (k > minPeriod) {
              firstMinK = k;
            }
            break;
          }
        }

        if (firstMinK > 0 && firstMin < 0.5) {
          const k = firstMinK;
          const a = diff[k - 1] || 0;
          const b = diff[k];
          const c = diff[k + 1] || 0;
          const denom = a - 2 * b + c;
          let refinedK = k;
          if (Math.abs(denom) > 0.0001) {
            refinedK = k + (c - a) / (2 * denom);
          }

          let freq = sampleRate / refinedK;
          if (freq >= minFreq && freq <= maxFreq) {
            freq = correctOctave(freq);

            historyRef.current.push(freq);
            if (historyRef.current.length > 12) historyRef.current.shift();

            const sorted = [...historyRef.current].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            const smoothFreq = sorted.length > 4
              ? sorted.slice(2, -2).reduce((a, b) => a + b, 0) / (sorted.length - 4)
              : median(sorted);

            if (lastDisplayedFreqRef.current > 0) {
              const ratio = smoothFreq / lastDisplayedFreqRef.current;
              if (ratio < 0.9 || ratio > 1.1) {
                stableCountRef.current = 0;
              }
            }

            if (Math.abs(smoothFreq - lastDisplayedFreqRef.current) / Math.max(smoothFreq, 1) < 0.03) {
              stableCountRef.current = Math.min(8, stableCountRef.current + 1);
            } else {
              stableCountRef.current = Math.max(0, stableCountRef.current - 1);
            }

            if (stableCountRef.current >= 2) {
              lastDisplayedFreqRef.current = smoothFreq;
              const { note, octave, cents: c, targetFreq } = freqToNote(smoothFreq);
              setDetectedNote(`${note}${octave}`);
              setDetectedFreq(Math.round(smoothFreq));
              setCents(c);
              setInTune(Math.abs(c) <= 5);

              let minDiff = Infinity;
              let closestIdx = -1;
              STANDARD_STRINGS.forEach((s, i) => {
                const d = Math.abs(smoothFreq - s.frequency);
                if (d < minDiff) {
                  minDiff = d;
                  closestIdx = i;
                }
              });
              if (minDiff < 30) {
                setClosestString(closestIdx);
                setStatus('active');
              } else {
                setClosestString(-1);
              }
            }
            return;
          }
        }

        // Fallback: FFT peak detection
        analyserRef.current.getFloatFrequencyData(freqData);
        let maxMag = -Infinity;
        let maxBin = 0;
        for (let i = 1; i < freqData.length; i++) {
          if (freqData[i] > maxMag) {
            maxMag = freqData[i];
            maxBin = i;
          }
        }
        if (maxBin > 0 && maxMag > -55) {
          let freq = maxBin * sampleRate / bufferLength;
          if (freq >= minFreq && freq <= maxFreq) {
            freq = correctOctave(freq);
            historyRef.current.push(freq);
            if (historyRef.current.length > 12) historyRef.current.shift();
            const smoothFreq = median(historyRef.current);

            if (lastDisplayedFreqRef.current > 0 && Math.abs(smoothFreq - lastDisplayedFreqRef.current) / Math.max(smoothFreq, 1) < 0.03) {
              stableCountRef.current = Math.min(8, stableCountRef.current + 1);
            } else {
              stableCountRef.current = 0;
            }

            if (stableCountRef.current >= 3) {
              lastDisplayedFreqRef.current = smoothFreq;
              const { note, octave, cents: c, targetFreq } = freqToNote(smoothFreq);
              setDetectedNote(`${note}${octave}`);
              setDetectedFreq(Math.round(smoothFreq));
              setCents(c);
              setInTune(Math.abs(c) <= 5);
            }
          }
        }
      };

      detect();
    } catch {
      setStatus('idle');
    }
  }, []);

  useEffect(() => {
    return () => { stopTuner(); };
  }, [stopTuner]);

  const centOffset = Math.max(-50, Math.min(50, cents));
  const needlePercent = ((centOffset + 50) / 100) * 100;

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center",
              status === 'idle' ? "bg-muted/50" : "bg-primary/20"
            )}>
              <Radio className={cn("w-4 h-4", status === 'idle' ? "text-muted-foreground" : "text-primary")} />
            </div>
            Guitar Tuner
          </CardTitle>
          <Button
            variant={status === 'idle' ? 'outline' : 'destructive'}
            size="sm"
            onClick={status === 'idle' ? startTuner : stopTuner}
            className="h-7 text-xs cursor-pointer"
          >
            {status === 'idle' ? (
              <><Mic className="w-3 h-3 mr-1" /> Start</>
            ) : (
              <><MicOff className="w-3 h-3 mr-1" /> Stop</>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-3">
          <div className={cn(
            "text-3xl font-bold font-mono transition-colors duration-300",
            status === 'idle' ? "text-muted-foreground" :
            inTune ? "text-green-400" :
            "text-amber-400"
          )}>
            {status === 'idle' ? '--' : detectedNote}
          </div>
          {status !== 'idle' && detectedFreq > 0 && (
            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{detectedFreq} Hz</div>
          )}
          {status === 'listening' && detectedFreq === 0 && (
            <div className="text-xs text-muted-foreground mt-1 animate-pulse">Listening...</div>
          )}
        </div>

        {status !== 'idle' && (
          <div className="mb-3">
            <div className="relative h-7 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
              <div className={cn(
                "absolute top-0 bottom-0 w-0.5 transition-all duration-100",
                inTune ? "bg-green-400" : "bg-amber-400"
              )} style={{ left: `${needlePercent}%` }} />
              <div className="absolute inset-0 flex items-center justify-between px-2 text-[8px] text-zinc-500 font-mono">
                <span>-50</span>
                <span className={cn("text-[9px] font-bold", inTune ? "text-green-400" : "text-zinc-500")}>0</span>
                <span>+50</span>
              </div>
            </div>
            <div className="text-center text-[10px] text-muted-foreground mt-0.5">
              {cents > 0 ? `+${cents}¢` : `${cents}¢`}
              {inTune && <span className="text-green-400 ml-1">✓ In Tune</span>}
            </div>
          </div>
        )}

        <div className="space-y-1">
          {STANDARD_STRINGS.map((s, i) => {
            const isActive = closestString === i && status === 'active' && detectedFreq > 0;
            const isInTune = isActive && inTune;
            return (
              <div
                key={i}
                onClick={() => playPluckedString(s.frequency)}
                role="button"
                tabIndex={0}
                className={cn(
                "flex items-center justify-between px-2 py-1 rounded text-xs transition-all duration-200",
                isActive ? "bg-primary/15 border border-primary/30" : "bg-muted/20 border border-transparent",
                isInTune && "bg-green-500/15 border-green-500/30"
              ) + " cursor-pointer"}>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-bold font-mono w-6 text-center",
                    isActive ? "text-primary" : "text-muted-foreground",
                    isInTune && "text-green-400"
                  )}>{s.note}</span>
                  <span className="text-muted-foreground">{s.label}</span>
                </div>
                <span className={cn(
                  "font-mono text-[10px]",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s.frequency.toFixed(1)} Hz
                  {isActive && (
                    <span className={cn("ml-1", isInTune ? "text-green-400" : "text-amber-400")}>
                      {cents > 0 ? `+${cents}¢` : `${cents}¢`}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-2 text-[9px] text-muted-foreground text-center">
          {status === 'idle'
            ? 'Grant mic access and play a single string'
            : 'Play one string at a time — the closest string highlights'}
        </div>
      </CardContent>
    </Card>
  );
}

export default GuitarTuner;
