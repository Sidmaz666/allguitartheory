'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Music, Drum, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { getChordNotes, getNoteFrequency, type Note, type ChordDefinition } from '@/lib/music-theory';

type S = 'D' | 'U' | '-';

interface Pattern {
  name: string;
  genre: string;
  timeSig: string;
  label: string;
  description: string;
  example: string;
  feel: string;
  difficulty: number;
  notes: S[];
  bpm: number;
}

const DATA: Pattern[] = [
  { name: 'Basic Downstrokes', genre: 'Folk / Pop', timeSig: '4/4', label: '4 Quarter Notes', description: 'Four steady quarter‑note downstrokes per bar — the foundation of all strumming. Keep your wrist loose and strike all strings evenly.', example: 'Knockin\' on Heaven\'s Door (Bob Dylan), Horse With No Name (America)', feel: 'Steady, driving, simple', difficulty: 1, notes: ['D','-','-','-','D','-','-','-','D','-','-','-','D','-','-','-'], bpm: 90 },
  { name: 'Basic Down‑Up', genre: 'Folk / Pop', timeSig: '4/4', label: '8th Notes: D‑U‑D‑U‑D‑U‑D‑U', description: 'Alternating eighth‑note strokes D‑U‑D‑U‑D‑U‑D‑U. The wrist moves in a continuous pendulum — never stop moving!', example: 'Brown Eyed Girl (Van Morrison), Wonderwall (Oasis)', feel: 'Bouncy, energetic, flowing', difficulty: 2, notes: ['D','-','U','-','D','-','U','-','D','-','U','-','D','-','U','-'], bpm: 100 },
  { name: 'Folk Boom‑Chick', genre: 'Folk / Country', timeSig: '4/4', label: 'D‑U‑·‑U · D‑U‑·‑U', description: 'Bass on beats 1 & 3 (down), chord on the & of each beat (up). Accent bass strings on downstrokes and treble on upstrokes.', example: 'The Boxer (Simon & Garfunkel), Fast Car (Tracy Chapman)', feel: 'Warm, storytelling, acoustic', difficulty: 3, notes: ['D','-','U','-','-','-','U','-','D','-','U','-','-','-','U','-'], bpm: 80 },
  { name: 'Rock Eighth Beat', genre: 'Rock / Pop', timeSig: '4/4', label: 'Rock Syncopated', description: 'Accent downstrokes on 1–4, snappy upstrokes in between. The one pattern that drives thousands of songs.', example: 'Have You Ever Seen the Rain (CCR), Free Fallin\' (Tom Petty)', feel: 'Driving, energetic, confident', difficulty: 4, notes: ['D','-','U','-','D','U','-','-','D','-','U','-','D','U','-','-'], bpm: 120 },
  { name: '16th Note Rock', genre: 'Rock / Pop', timeSig: '4/4', label: '16th Notes: D‑U‑D‑U per beat', description: 'Constant 16th‑note strumming D‑U‑D‑U on every beat. Stamina builder — accent beats 1–4 to keep the groove.', example: 'Back in Black (AC/DC), You Shook Me All Night Long (AC/DC)', feel: 'Intense, driving, relentless', difficulty: 6, notes: ['D','U','D','U','D','U','D','U','D','U','D','U','D','U','D','U'], bpm: 140 },
  { name: 'Reggae Skank', genre: 'Reggae / Ska', timeSig: '4/4', label: 'Off‑beat Ups: ·‑U‑·‑U‑·‑U‑·‑U', description: 'Off‑beat chops. Mute strings and strum sharp upstrokes on the & of every beat. The downbeat is felt but never played.', example: 'No Woman No Cry (Bob Marley), Stir It Up (Bob Marley)', feel: 'Choppy, relaxed, off‑beat', difficulty: 4, notes: ['-','-','U','-','-','-','U','-','-','-','U','-','-','-','U','-'], bpm: 80 },
  { name: 'Funk Ghost Notes', genre: 'Funk / R&B', timeSig: '4/4', label: 'Syncopated 16ths', description: 'Sparse syncopated 16th‑note funk. Hand moves constantly but only some strokes connect — ghost notes create the tight percussive feel.', example: 'Superstition (Stevie Wonder), Get Up Offa That Thing (James Brown)', feel: 'Syncopated, tight, groovy', difficulty: 8, notes: ['D','-','-','-','-','-','-','-','D','U','-','-','-','U','-','-'], bpm: 100 },
  { name: 'Waltz (3/4)', genre: 'Classical / Folk', timeSig: '3/4', label: 'STRONG‑weak‑weak', description: 'Three beats per bar: STRONG‑weak‑weak. Accent beat 1 with a firm downstroke, lighter on 2 and 3.', example: 'Hallelujah (Leonard Cohen), The Times They Are A‑Changin\' (Bob Dylan)', feel: 'Graceful, flowing, elegant', difficulty: 3, notes: ['D','-','-','U','-','-','U','-','-','-','-','-'], bpm: 90 },
  { name: 'Shuffle / Swing', genre: 'Blues / Jazz', timeSig: '12/8', label: 'Triplet Swing', description: 'Triplet‑based swing. Each beat divides into three with first two tied. Loose, swinging motion — upbeats accented.', example: 'Pride and Joy (Stevie Ray Vaughan), Mustang Sally (Wilson Pickett)', feel: 'Swinging, laid‑back, bluesy', difficulty: 6, notes: ['D','-','-','U','-','-','D','-','-','U','-','-','D','-','-','U','-','-','D','-','-','U','-','-'], bpm: 110 },
  { name: 'Texas Shuffle', genre: 'Blues / Texas', timeSig: '12/8', label: 'Heavy Swing', description: 'Heavier, more aggressive shuffle. Accent backbeats 2 & 4 with a percussive "chunk" on muted downstrokes.', example: 'Texas Flood (Stevie Ray Vaughan), La Grange (ZZ Top)', feel: 'Heavy, grooving, swaggering', difficulty: 6, notes: ['D','-','-','U','-','-','D','-','-','U','-','-','D','-','-','U','-','-','D','-','-','U','-','-'], bpm: 130 },
  { name: 'Country Bass‑Slap', genre: 'Country / Bluegrass', timeSig: '4/4', label: 'Alternating Bass‑Chord', description: 'Alternate bass‑string downstrokes with treble‑string upstrokes. Thumb handles down, fingers handle up.', example: 'Friends in Low Places (Garth Brooks), Ring of Fire (Johnny Cash)', feel: 'Bouncy, fast, percussive', difficulty: 6, notes: ['D','-','U','-','D','-','U','-','-','-','U','-','D','-','U','-'], bpm: 130 },
  { name: 'Metal Gallop', genre: 'Metal / Hard Rock', timeSig: '4/4', label: 'Gallop: D‑U‑D', description: 'Classic gallop: ONE‑two‑three‑ONE‑two‑three. Palm‑mute for chunkier sound. Bridge pickup for more bite.', example: 'Enter Sandman (Metallica), The Trooper (Iron Maiden)', feel: 'Aggressive, driving, powerful', difficulty: 6, notes: ['D','-','U','D','-','-','-','-','D','-','U','D','-','-','-','-'], bpm: 140 },
  { name: 'Metal Downpick', genre: 'Metal / Thrash', timeSig: '4/4', label: 'All Downstrokes', description: 'Relentless all‑downstroke eighth‑notes. Requires exceptional picking‑hand stamina. No upstrokes.', example: 'Master of Puppets (Metallica), Angel of Death (Slayer)', feel: 'Relentless, aggressive, intense', difficulty: 8, notes: ['D','-','-','-','D','-','-','-','D','-','-','-','D','-','-','-'], bpm: 180 },
  { name: 'Bossa Nova', genre: 'Latin / Jazz', timeSig: '2/4', label: 'D‑U‑·‑U', description: 'Smooth syncopated Latin rhythm. Thumb plays bass on downbeats, fingers strum chords on upbeats.', example: 'The Girl from Ipanema (Jobim), Corcovado (Jobim)', feel: 'Smooth, sophisticated, relaxed', difficulty: 8, notes: ['D','-','U','-','-','U','-','-'], bpm: 80 },
  { name: 'Samba', genre: 'Latin / Brazilian', timeSig: '2/4', label: 'Carnival Syncopation', description: 'Fast Brazilian carnival rhythm with heavy syncopation. Guitar plays steady pulse with accents on upbeats.', example: 'Mas Que Nada (Sergio Mendes), Magalenha (Sergio Mendes)', feel: 'Festive, fast, danceable', difficulty: 8, notes: ['D','-','U','-','-','U','D','U'], bpm: 160 },
  { name: 'Disco 4/4', genre: 'Disco / Funk', timeSig: '4/4', label: 'Four‑on‑the‑Floor', description: 'Steady quarter‑note downstrokes with bright clean tone. Mute strings slightly between chords for the classic "chk".', example: 'Stayin\' Alive (Bee Gees), Le Freak (Chic)', feel: 'Danceable, steady, bright', difficulty: 2, notes: ['D','-','-','-','D','-','-','-','D','-','-','-','D','-','-','-'], bpm: 120 },
  { name: 'Indie Skank', genre: 'Indie / Alternative', timeSig: '4/4', label: 'Syncopated Ups', description: 'Syncopated pattern with heavy upstroke accents. Hand moves in constant 8th notes but only connects on pattern.', example: 'Take Me Out (Franz Ferdinand), Last Nite (The Strokes)', feel: 'Angular, punchy, stylish', difficulty: 6, notes: ['D','-','U','-','D','-','U','-','-','-','U','-','D','-','U','-'], bpm: 140 },
  { name: '6/8 Ballad', genre: 'Ballad / Pop', timeSig: '6/8', label: 'ONE‑23‑FOUR‑56', description: 'Six eighth‑notes per bar. Strong on 1, secondary on 4. Count: ONE‑two‑three‑FOUR‑five‑six.', example: 'Everybody Hurts (REM), Nothing Else Matters (Metallica)', feel: 'Flowing, emotional, spacious', difficulty: 3, notes: ['D','-','-','U','-','-','D','-','-','U','-','-'], bpm: 75 },
  { name: '12/8 Blues', genre: 'Blues / Soul', timeSig: '12/8', label: '12/8 Triplet Feel', description: 'Twelve eighth‑notes grouped as four triplets. The quintessential slow‑blues feel.', example: 'Crossroads (Robert Johnson/Cream), The Thrill Is Gone (B.B. King)', feel: 'Deep, grooving, soulful', difficulty: 5, notes: ['D','-','-','U','-','-','D','-','-','U','-','-','D','-','-','U','-','-','D','-','-','U','-','-'], bpm: 70 },
  { name: 'Afrobeat Groove', genre: 'Afrobeat / World', timeSig: '4/4', label: 'Hypnotic Pulse', description: 'Hypnotic repetitive pattern with strong rhythmic pulse. Accent off‑beats with steady driving feel.', example: 'Water No Get Enemy (Fela Kuti), Zombie (Fela Kuti)', feel: 'Hypnotic, polyrhythmic, grooving', difficulty: 8, notes: ['D','-','-','-','D','-','-','-','D','-','D','-','-','-','U','-'], bpm: 110 },
  { name: 'Polka 2/4', genre: 'Folk / Polka', timeSig: '2/4', label: 'Oom‑Pah‑Oom‑Pah', description: 'Lively two‑beat with strong accents on both downbeats. Oom‑pah feel from alternating bass with chords.', example: 'Beer Barrel Polka, Pennsylvania Polka', feel: 'Lively, bouncy, celebratory', difficulty: 3, notes: ['D','-','U','-','D','-','U','-'], bpm: 130 },
  { name: 'Rumba / Bolero', genre: 'Latin / Ballad', timeSig: '4/4', label: 'Dotted Latin Feel', description: 'Slow romantic Latin rhythm with dotted feel. Bass on beats 1 & 3, chords fill on the upbeats.', example: 'Bésame Mucho (Consuelo Velázquez), Perfidia (Alberto Dominguez)', feel: 'Romantic, smooth, dramatic', difficulty: 5, notes: ['D','-','-','-','D','U','-','-','-','U','-','-','D','U','-','-'], bpm: 70 },
  { name: 'Mambo', genre: 'Latin / Cuba', timeSig: '4/4', label: 'Syncopated Mambo', description: 'Upbeat Cuban dance rhythm. Guitar plays sharp percussive chords on offbeats while bass marks downbeats.', example: 'Mambo No. 5 (Pérez Prado), Mambo Italiano (Rosemary Clooney)', feel: 'Energetic, syncopated, danceable', difficulty: 7, notes: ['-','-','D','U','-','-','D','U','D','-','U','-','-','-','D','U'], bpm: 130 },
  { name: 'Flamenco (Bulerías)', genre: 'Flamenco / Spanish', timeSig: '12/8', label: '12‑Beat Compás', description: '12‑beat flamenco compás with accents on 3, 6, 8, 10, 12. Rasgueado creates the signature percussive sound.', example: 'Entre Dos Aguas (Paco de Lucía), Bulerías (traditional)', feel: 'Passionate, intense, dramatic', difficulty: 9, notes: ['-','-','D','-','-','D','-','D','U','D','-','D'], bpm: 120 },
  { name: 'Bluegrass Chop', genre: 'Bluegrass / Country', timeSig: '4/4', label: 'Chop on 2 & 4', description: 'Sharp percussive chop on beats 2 & 4. Mute strings and strum a tight "chop" on the backbeats.', example: 'Foggy Mountain Breakdown (Flatt & Scruggs), Big Sciota (traditional)', feel: 'Percussive, driving, bright', difficulty: 6, notes: ['-','-','D','U','-','-','D','U','-','-','D','U','-','-','D','U'], bpm: 160 },
  { name: 'One Drop (Reggae)', genre: 'Reggae / Dub', timeSig: '4/4', label: 'One Drop Feel', description: 'Beat 1 is empty (the "drop"), heavy accent on beat 3. Bass drum drops on 3 while guitar skanks on offbeats.', example: 'One Love (Bob Marley), Three Little Birds (Bob Marley)', feel: 'Heavy, relaxed, hypnotic', difficulty: 5, notes: ['-','-','U','-','-','-','D','U','-','-','U','-','-','-','U','-'], bpm: 75 },
  { name: 'Soca Pulse', genre: 'Caribbean / Calypso', timeSig: '2/4', label: 'Carnival Pulse', description: 'Upbeat Caribbean carnival rhythm. Fast, syncopated, bouncy — the sound of Trinidad and Tobago.', example: 'Hot Hot Hot (Arrow), Sunshine Day (Osibisa)', feel: 'Festive, driving, happy', difficulty: 7, notes: ['D','-','U','-','-','U','D','U'], bpm: 150 },
  { name: 'Bachata', genre: 'Latin / Dominican', timeSig: '4/4', label: 'D‑U‑·‑· D‑U‑·‑·', description: 'Dominican romantic guitar: bass on 1, strum &, bass on 3, strum &. Bongó marks the signature tick‑tock.', example: 'Propuesta Indecente (Romeo Santos), Obsesión (Aventura)', feel: 'Romantic, smooth, danceable', difficulty: 5, notes: ['D','-','U','-','-','-','-','-','D','-','U','-','-','-','-','-'], bpm: 130 },
  { name: 'Dembow', genre: 'Latin / Reggaeton', timeSig: '4/4', label: 'Reggaeton Beat', description: 'Foundational reggaeton beat. Three kick hits per bar. Guitar stabs on offbeats over steady bass drum.', example: 'Gasolina (Daddy Yankee), Despacito (Luis Fonsi)', feel: 'Driving, urban, danceable', difficulty: 5, notes: ['D','-','-','-','-','U','-','-','-','U','-','-','D','-','U','-'], bpm: 95 },
  { name: 'Gypsy Jazz (La Pompe)', genre: 'Jazz / Manouche', timeSig: '4/4', label: 'D‑·‑D‑U‑·‑U', description: '"The pump" — steady swinging pulse with accented up‑down‑down‑up. Django Reinhardt\'s signature rhythm.', example: 'Minor Swing (Django Reinhardt), Nuages (Django Reinhardt)', feel: 'Swinging, driving, elegant', difficulty: 8, notes: ['D','-','D','U','-','U','-','-','D','-','D','U','-','U','-','-'], bpm: 160 },
  { name: 'James Brown Funk', genre: 'Funk / Soul', timeSig: '4/4', label: 'JB Stabs', description: 'Archetypal funk rhythm. Single‑note stabs on 1 and & of 3. Tight, clean, syncopated — Jimmy Nolen style.', example: 'Papa\'s Got a Brand New Bag (James Brown), I Got You (James Brown)', feel: 'Tight, syncopated, iconic', difficulty: 9, notes: ['D','-','-','-','-','-','-','-','D','U','-','-','D','-','-','-'], bpm: 110 },
  { name: 'Motown Soul', genre: 'Motown / Soul', timeSig: '4/4', label: 'Upbeat Chops', description: 'Smooth soul rhythm with guitar playing on upbeats. Bass carries the melody, guitar provides rhythmic glue.', example: 'My Girl (The Temptations), I Heard It Through the Grapevine (Marvin Gaye)', feel: 'Smooth, soulful, warm', difficulty: 3, notes: ['-','-','U','-','-','-','U','-','-','-','U','-','-','-','U','-'], bpm: 105 },
  { name: 'NOLA Funk', genre: 'Funk / Second Line', timeSig: '4/4', label: 'Second Line', description: 'Syncopated "second line" feel from New Orleans. Loose, rolling syncopation with drunken feel.', example: 'Cissy Strut (The Meters), Fire on the Bayou (The Meters)', feel: 'Loose, rolling, funky', difficulty: 8, notes: ['-','U','D','-','-','U','D','-','D','U','-','-','-','U','D','-'], bpm: 100 },
  { name: 'Punk Downstrokes', genre: 'Punk / Hardcore', timeSig: '4/4', label: 'Fast Downpicking', description: 'Rapid all‑downstroke eighth‑notes. Requires picking‑hand endurance. The Ramones style — raw and fast.', example: 'Blitzkrieg Bop (Ramones), Anarchy in the UK (Sex Pistols)', feel: 'Aggressive, fast, raw', difficulty: 7, notes: ['D','-','-','-','D','-','-','-','D','-','-','-','D','-','-','-'], bpm: 170 },
];

function playChordStrum(freqs: number[]) {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const dur = 0.5;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.35, now);
    masterGain.gain.linearRampToValueAtTime(0.3, now + 0.005);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    masterGain.connect(ctx.destination);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(4000, now);
    lp.Q.setValueAtTime(0.4, now);

    const body = ctx.createBiquadFilter();
    body.type = 'peaking';
    body.frequency.setValueAtTime(100, now);
    body.Q.setValueAtTime(1.5, now);
    body.gain.setValueAtTime(4, now);

    freqs.forEach((freq, si) => {
      const t = now + si * 0.004;
      const mix = [
        { h: 1, t: 'sawtooth' as OscillatorType, w: 1.0 },
        { h: 2, t: 'triangle' as OscillatorType, w: 0.5 },
        { h: 3, t: 'triangle' as OscillatorType, w: 0.3 },
        { h: 4, t: 'sine' as OscillatorType, w: 0.12 },
        { h: 5, t: 'sine' as OscillatorType, w: 0.06 },
      ];
      mix.forEach(({ h, t: type, w }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq * h, t);
        const peak = w * 0.6;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(peak, t + 0.003);
        g.gain.exponentialRampToValueAtTime(peak * 0.4, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur * (1 - si * 0.04));
        osc.connect(g);
        g.connect(lp);
        osc.start(t);
        osc.stop(t + dur + 0.1 + si * 0.004);
      });
    });

    lp.connect(body);
    body.connect(masterGain);
    setTimeout(() => ctx.close(), (dur + 0.5) * 1000);
  } catch {}
}

function getChordFrequencies(root: Note, chord: ChordDefinition): number[] {
  const notes = getChordNotes(root, chord);
  const freqs: number[] = [];
  for (const note of notes) {
    const n = note as Note;
    freqs.push(getNoteFrequency(n, 3));
    freqs.push(getNoteFrequency(n, 4));
  }
  freqs.sort((a, b) => a - b);
  return freqs.slice(-6);
}

function playPattern(notes: S[], bpm: number, root: Note, chord: ChordDefinition) {
  const chordFreqs = getChordFrequencies(root, chord);
  const beatDur = 60 / bpm;
  const sub = beatDur / 4;
  notes.forEach((symbol, i) => {
    if (symbol !== '-') {
      const time = i * sub * 1000;
      setTimeout(() => playChordStrum(chordFreqs), time);
    }
  });
}

function diffStyle(d: number) {
  if (d <= 2) return 'text-green-400 bg-green-500/10';
  if (d <= 4) return 'text-emerald-400 bg-emerald-500/10';
  if (d <= 6) return 'text-amber-400 bg-amber-500/10';
  if (d <= 8) return 'text-orange-400 bg-orange-500/10';
  return 'text-red-400 bg-red-500/10';
}

function Visualizer({ notes, active }: { notes: S[]; active: boolean }) {
  const beats: S[][] = [];
  for (let b = 0; b < notes.length; b += 4) {
    beats.push(notes.slice(b, b + 4));
  }
  return (
    <div className="flex items-end gap-1 h-16 overflow-x-auto pb-1">
      {beats.map((beat, bi) => (
        <div key={bi} className="flex items-end gap-0.5">
          {beat.map((s, i) => {
            const isD = s === 'D';
            const isU = s === 'U';
            const has = isD || isU;
            const h = has ? Math.max(24 - i * 4, 10) : 0;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className={cn(
                  "flex items-center justify-center w-4 h-4 transition-all",
                  isD ? "text-amber-400" : isU ? "text-blue-400" : "text-transparent"
                )}>
                  {isD ? <ChevronDown className="w-4 h-4" /> : isU ? <ChevronUp className="w-4 h-4" /> : ''}
                </span>
                <div className={cn(
                  "w-[6px] rounded-sm transition-all duration-75",
                  isD ? "bg-amber-500/70" : isU ? "bg-blue-500/60" : "bg-transparent",
                  active && has && "animate-pulse"
                )} style={{ height: `${h}px` }} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

type RhythmProps = {
  className?: string;
  root?: Note;
  chord?: ChordDefinition;
};

export function RhythmStrumming({ className, root = 'C', chord = { id: 'major', name: 'Major Triad', symbol: '', intervals: ['1', '3', '5'], category: 'Triad', difficulty: 1 as const, description: '', theory: { construction: '', function: '', scaleSources: [], voiceLeading: '', substitutions: [] } } }: RhythmProps) {
  const [genre, setGenre] = useState('All');
  const [playing, setPlaying] = useState<number | null>(null);
  const genres = ['All', ...new Set(DATA.map(p => p.genre).sort())];
  const filtered = genre === 'All' ? DATA : DATA.filter(p => p.genre === genre);

  const handlePlay = useCallback((idx: number) => {
    if (playing === idx) { setPlaying(null); return; }
    setPlaying(idx);
    playPattern(filtered[idx].notes, filtered[idx].bpm, root, chord);
    setTimeout(() => setPlaying(null), 3000);
  }, [playing, filtered, root, chord]);

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-base mb-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Drum className="w-4 h-4 text-emerald-400" />
          </div>
          <CardTitle className="text-base">Rhythm & Strumming Patterns</CardTitle>
          <Badge variant="secondary" className="text-[10px] ml-auto">{DATA.length} patterns</Badge>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {genres.map(g => (
            <button key={g} onClick={() => setGenre(g)} className={cn(
              "cursor-pointer text-xs px-2.5 py-1 rounded-full border transition-all",
              genre === g ? "bg-primary/20 border-primary/40 text-foreground font-medium" : "bg-muted/20 border-border/30 text-muted-foreground hover:text-foreground"
            )}>{g}</button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filtered.map((p, idx) => {
            const active = playing === idx;
            return (
              <div key={idx} className="p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-border/50 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm">{p.name}</h4>
                      <Badge variant="secondary" className="text-[10px] h-4 px-1">{p.timeSig}</Badge>
                      <Badge variant="outline" className="text-[10px] h-4 px-1">{p.genre}</Badge>
                      <span className="text-[10px] text-muted-foreground">♩ = {p.bpm}</span>
                      <Badge className={cn("text-[9px] h-4 px-1.5", diffStyle(p.difficulty))}>{p.difficulty}/10</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                  </div>
                  <Button variant={active ? 'default' : 'ghost'} size="sm" className="h-8 w-8 p-0 shrink-0 cursor-pointer" onClick={() => handlePlay(idx)}>
                    {active ? <Volume2 className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] text-muted-foreground mb-1">
                      {p.timeSig.startsWith('3') || p.timeSig.startsWith('6') || p.timeSig === '12/8'
                        ? `${p.notes.length / 4} beats · ${p.notes.length} × \u00B9/\u2081\u2086`
                        : `4 beats · ${p.notes.length} × \u00B9/\u2081\u2086`}
                    </div>
                    <Visualizer notes={p.notes} active={active} />
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-mono text-amber-400 leading-tight">{p.label}</div>
                    <div className="flex flex-wrap gap-0.5 mt-1 justify-end max-w-[120px]">
                      {p.notes.slice(0, 16).map((n, i) => (
                        <span key={i} className={cn(
                          "text-[9px] font-bold font-mono leading-none",
                          n === 'D' ? 'text-amber-400' : n === 'U' ? 'text-blue-400' : 'text-zinc-700'
                        )}>{n}</span>
                      ))}
                      {p.notes.length > 16 && <span className="text-[9px] text-muted-foreground">…</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                  <span>{p.feel}</span>
                </div>
                {active && (
                  <div className="mt-2 p-2 rounded bg-muted/30 border border-border/30 animate-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Music className="w-3 h-3" />
                      <span>Examples: <span className="text-foreground font-medium">{p.example}</span></span>
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground italic">
                      Tip: Start at ♩ = {Math.max(40, p.bpm - 30)} and gradually increase
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default RhythmStrumming;
