'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  NOTES,
  SCALES,
  CHORDS,
  SCALE_CATEGORIES,
  CHORD_CATEGORIES,
  TUNINGS,
  getScaleNotes,
  getChordNotes,
  getTuningById,
  type Note,
  type ScaleDefinition,
  type ChordDefinition,
  type TuningDefinition
} from '@/lib/music-theory';
import { Fretboard } from '@/components/fretboard';
import { MusicNotation } from '@/components/music-notation';
import { EarTraining } from '@/components/ear-training';
import { Quiz } from '@/components/quiz';
import { CircleOfFifths } from '@/components/circle-of-fifths';
import { ChordDiagram } from '@/components/chord-diagram';
import { ComprehensiveScaleTheory, ComprehensiveChordTheory } from '@/components/comprehensive-theory';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Music,
  Guitar,
  Star,
  FileText,
  ChevronRight,
  Headphones,
  Target,
  Zap,
  Sparkles,
  Info,
  History,
  Globe,
  GraduationCap,
  List,
  Search
} from 'lucide-react';
import { Metronome } from '@/components/metronome';
import { AiChatButton } from '@/components/ai-chat-button';
import { AiChat } from '@/components/ai-chat';
import { GuitarTuner } from '@/components/guitar-tuner';
import { RhythmStrumming } from '@/components/rhythm-strumming';
import { GuitarTechniques } from '@/components/guitar-techniques';
import { ScalesAroundTheWorld } from '@/components/scales-world';

type ViewMode = 'scales' | 'chords';

export default function GuitarTheoryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('scales');
  const [selectedRoot, setSelectedRoot] = useState<Note>('C');
  const [selectedScale, setSelectedScale] = useState<ScaleDefinition>(SCALES[0]);
  const [selectedChord, setSelectedChord] = useState<ChordDefinition>(CHORDS[0]);
  const [selectedTuning, setSelectedTuning] = useState<TuningDefinition>(TUNINGS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bpm, setBpm] = useState(60);
  const [showNotation, setShowNotation] = useState(false);
  const [circleMode, setCircleMode] = useState<'major' | 'minor'>('major');

  const currentScaleNotes = useMemo(() => {
    return getScaleNotes(selectedRoot, selectedScale);
  }, [selectedRoot, selectedScale]);

  const currentChordNotes = useMemo(() => {
    return getChordNotes(selectedRoot, selectedChord);
  }, [selectedRoot, selectedChord]);

  const activeNotes = viewMode === 'scales' ? currentScaleNotes : currentChordNotes;

  const filteredScales = useMemo(() => {
    if (selectedCategory === 'all') return SCALES;
    return SCALES.filter(s => s.category === selectedCategory);
  }, [selectedCategory]);

  const filteredChords = useMemo(() => {
    if (selectedCategory === 'all') return CHORDS;
    return CHORDS.filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  const categories = viewMode === 'scales' ? ['all', ...SCALE_CATEGORIES] : ['all', ...CHORD_CATEGORIES];

  const handleKeySelect = (key: Note) => {
    setSelectedRoot(key);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-2">

          <div className="flex items-center justify-around gap-4">
            <span className="text-lg font-bold ring-2 uppercase tracking-tighter px-2 mr-2 text-amber-400">ALL GUITAR THEORY</span>
            <nav className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">

              {[
                { mode: 'scales' as ViewMode, icon: Music, label: 'Scales', activeColor: 'text-emerald-400', activeBg: 'bg-emerald-500/10' },
                { mode: 'chords' as ViewMode, icon: Guitar, label: 'Chords', activeColor: 'text-amber-400', activeBg: 'bg-amber-500/10' },
              ].map(({ mode, icon: Icon, label, activeColor, activeBg }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                    viewMode === mode
                      ? cn(activeBg, activeColor, "shadow-sm")
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </nav>


            <div className="flex items-center gap-1 sm:gap-2">
              {/* Group: Key */}
              <div className="flex items-center gap-1.5">
                <Label className="text-xs text-muted-foreground hidden sm:inline">Key:</Label>
                <Select value={selectedRoot} onValueChange={(v) => setSelectedRoot(v as Note)}>
                  <SelectTrigger className="w-[80px] h-7 text-xs cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTES.map(note => (
                      <SelectItem key={note} value={note} className="text-xs cursor-pointer">{note}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-5 hidden sm:block" />

              {/* Group: Tuning */}
              <div className="flex items-center gap-1.5">
                <Label className="text-xs text-muted-foreground hidden sm:inline">Tuning:</Label>
                <Select
                  value={selectedTuning.id}
                  onValueChange={v => setSelectedTuning(getTuningById(v) || TUNINGS[0])}
                >
                  <SelectTrigger className="w-[170px] h-7 text-xs cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TUNINGS.map(tuning => (
                      <SelectItem key={tuning.id} value={tuning.id} className="text-xs cursor-pointer">
                        {tuning.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-5 hidden sm:block" />

              {/* Group: Metronome */}
              <Metronome
                initialBpm={bpm}
                onBpmChange={setBpm}
              />

              <AiChatButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-4 pt-16 pb-20 md:pb-4 relative z-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Main area */}
          <div className="space-y-4">
            {/* Current selection */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 overflow-hidden relative">
              <CardContent className="pt-4 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="border-border text-xs">
                        {viewMode === 'scales' ? selectedScale.category : selectedChord.category}
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      <span className="text-primary">{selectedRoot}</span>
                      {' '}
                      {viewMode === 'scales' ? selectedScale.name : selectedChord.name}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {viewMode === 'scales' ? selectedScale.description : selectedChord.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNotes.map((note, i) => (
                      <Badge
                        key={i}
                        variant={note === selectedRoot ? 'default' : 'secondary'}
                        className={cn(
                          "text-sm px-2 py-1 font-semibold",
                          note === selectedRoot
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                            : "bg-muted"
                        )}
                      >
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fretboard / Notation */}
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center",
                      showNotation ? "bg-amber-500/20" : "bg-primary/20"
                    )}>
                      {showNotation ? (
                        <FileText className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Guitar className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    {showNotation ? 'Music Notation' : 'Interactive Fretboard'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowNotation(!showNotation)}
                      className={cn(
                        "cursor-pointer text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-200 border",
                        showNotation
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-primary/10 text-primary border-primary/30"
                      )}
                    >
                      {showNotation ? 'Fretboard' : 'Notation'}
                    </button>
                    <Badge variant="secondary" className="text-xs">
                      {selectedTuning.name}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {showNotation ? (
                  <MusicNotation
                    selectedNotes={activeNotes}
                    rootNote={selectedRoot}
                    tuning={selectedTuning}
                    startFret={0}
                    endFret={24}
                    displayMode="notes"
                  />
                ) : (
                  <Fretboard
                    selectedNotes={activeNotes}
                    rootNote={selectedRoot}
                    highlightRoot={true}
                    tuning={selectedTuning}
                    endFret={24}
                    bpm={bpm}
                  />
                )}
              </CardContent>
            </Card>

            {/* Chord Diagrams (only in chords mode, right after fretboard) */}
            {viewMode === 'chords' && (
              <ChordDiagram
                root={selectedRoot}
                chord={selectedChord}
                tuning={selectedTuning}
              />
            )}

            {/* Ear Training */}
            <EarTraining mode={viewMode} />

            {/* Theory Quiz */}
            <Quiz />

            {/* Comprehensive Scale Theory */}
            {viewMode === 'scales' && (
              <ComprehensiveScaleTheory
                scale={selectedScale}
                root={selectedRoot}
                scaleNotes={currentScaleNotes}
              />
            )}

            {/* Scale Degrees & Harmonic Function */}
            {viewMode === 'scales' && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Music className="w-4 h-4 text-emerald-400" />
                    </div>
                    Scale Degrees & Harmonic Function
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left p-2 font-medium">Degree</th>
                          <th className="text-left p-2 font-medium">Name</th>
                          <th className="text-left p-2 font-medium">Function</th>
                          <th className="text-left p-2 font-medium">Chord (C Major)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['I', 'Tonic', 'Home, resolution, stability', 'C'],
                          ['ii', 'Supertonic', 'Pre-dominant, leads to V', 'Dm'],
                          ['iii', 'Mediant', 'Tonic substitute, weak', 'Em'],
                          ['IV', 'Subdominant', 'Pre-dominant, movement', 'F'],
                          ['V', 'Dominant', 'Maximum tension, leads to I', 'G'],
                          ['vi', 'Submediant', 'Relative minor, tonic substitute', 'Am'],
                          ['vii°', 'Leading tone', 'Dominant function, resolves to I', 'Bdim'],
                        ].map(([degree, name, func, chord]) => (
                          <tr key={degree} className="border-b border-border/30">
                            <td className="p-2 font-bold text-emerald-400">{degree}</td>
                            <td className="p-2">{name}</td>
                            <td className="p-2 text-muted-foreground text-xs">{func}</td>
                            <td className="p-2"><Badge variant="secondary" className="text-xs">{chord}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scales Around the World */}
            {viewMode === 'scales' && (
              <ScalesAroundTheWorld />
            )}

            {/* Rhythm & Strumming Patterns */}
            <RhythmStrumming root={selectedRoot} chord={selectedChord} />

            {/* Guitar Techniques */}
            {viewMode === 'scales' && (
              <GuitarTechniques root={selectedRoot} chord={selectedChord} />
            )}

            {/* Practice Tips */}
            {viewMode === 'scales' && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                    </div>
                    Practice Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-muted/30">
                      <h4 className="font-medium text-sm mb-1">1. Learn One Position at a Time</h4>
                      <p className="text-xs text-muted-foreground">
                        Master the CAGED positions one by one. Start with Position 1 (open position) before moving up the neck.
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <h4 className="font-medium text-sm mb-1">2. Connect the Positions</h4>
                      <p className="text-xs text-muted-foreground">
                        Practice sliding between positions to create seamless lines across the fretboard.
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <h4 className="font-medium text-sm mb-1">3. Use the Metronome</h4>
                      <p className="text-xs text-muted-foreground">
                        Start slow (60 BPM) and gradually increase. Clean technique is more important than speed.
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <h4 className="font-medium text-sm mb-1">4. Practice in All Keys</h4>
                      <p className="text-xs text-muted-foreground">
                        Don't just practice in C! Use the Circle of Fifths to systematically practice in all 12 keys.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comprehensive Chord Theory */}
            {viewMode === 'chords' && (
              <ComprehensiveChordTheory
                chord={selectedChord}
                root={selectedRoot}
                chordNotes={currentChordNotes}
              />
            )}
            {/* How Chords Are Formed */}
            {viewMode === 'chords' && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Info className="w-4 h-4 text-amber-400" />
                    </div>
                    How Chords Are Formed
                  </CardTitle>
                  <CardDescription>Understanding chord construction from first principles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-medium text-sm mb-2">Triads (3-note chords)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      All chords are built by stacking intervals of thirds (major or minor) on top of a root note.
                      A major third = 4 semitones, a minor third = 3 semitones.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2 rounded bg-muted/50">
                        <div className="font-medium text-amber-400 text-sm">Major</div>
                        <div className="text-xs text-muted-foreground">1 - 3 - 5</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Major 3rd + Minor 3rd</div>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <div className="font-medium text-amber-400 text-sm">Minor</div>
                        <div className="text-xs text-muted-foreground">1 - b3 - 5</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Minor 3rd + Major 3rd</div>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <div className="font-medium text-amber-400 text-sm">Diminished</div>
                        <div className="text-xs text-muted-foreground">1 - b3 - b5</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Minor 3rd + Minor 3rd</div>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <div className="font-medium text-amber-400 text-sm">Augmented</div>
                        <div className="text-xs text-muted-foreground">1 - 3 - #5</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Major 3rd + Major 3rd</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-medium text-sm mb-2">Seventh Chords (4-note chords)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Adding a seventh interval creates more complex harmonies. Each seventh chord type has a unique emotional quality.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2 rounded bg-muted/50">
                        <div className="font-medium text-amber-400 text-sm">Major 7</div>
                        <div className="text-xs text-muted-foreground">1 - 3 - 5 - 7</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Dreamy, peaceful</div>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <div className="font-medium text-amber-400 text-sm">Dominant 7</div>
                        <div className="text-xs text-muted-foreground">1 - 3 - 5 - b7</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Tense, bluesy</div>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <div className="font-medium text-amber-400 text-sm">Minor 7</div>
                        <div className="text-xs text-muted-foreground">1 - b3 - 5 - b7</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Smooth, soulful</div>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <div className="font-medium text-amber-400 text-sm">Half-Dim</div>
                        <div className="text-xs text-muted-foreground">1 - b3 - b5 - b7</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Dark, mysterious</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-medium text-sm mb-2">Extensions (9ths, 11ths, 13ths)</h4>
                    <p className="text-sm text-muted-foreground">
                      Extensions add color beyond the 7th. A 9th is the same as a 2nd but an octave higher.
                      The 11th equals the 4th, and 13th equals the 6th. These create lush, sophisticated sounds.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-medium text-sm mb-2">Alterations (b5, #5, b9, #9, #11)</h4>
                    <p className="text-sm text-muted-foreground">
                      Altered chords contain notes that have been raised or lowered from their normal position.
                      They create maximum tension and are essential in jazz for resolving to tonic chords.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Common Chord Progressions */}
            {viewMode === 'chords' && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Guitar className="w-4 h-4 text-amber-400" />
                    </div>
                    Common Chord Progressions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'I - V - vi - IV', example: 'C - G - Am - F', desc: 'Pop progression, used in countless hits' },
                      { name: 'ii - V - I', example: 'Dm - G - C', desc: 'Jazz standard turnaround' },
                      { name: 'I - IV - V', example: 'C - F - G', desc: 'Rock and blues foundation' },
                      { name: 'vi - IV - I - V', example: 'Am - F - C - G', desc: 'Emotional ballad progression' },
                      { name: 'I - vi - IV - V', example: 'C - Am - F - G', desc: '50s doo-wop progression' },
                      { name: 'i - bVI - bVII', example: 'Am - F - G', desc: 'Minor key rock progression' },
                    ].map(prog => (
                      <div key={prog.name} className="p-2 rounded bg-muted/30 flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="font-mono text-sm font-bold text-amber-400">{prog.name}</div>
                        <div className="text-xs text-muted-foreground">({prog.example})</div>
                        <div className="text-xs text-muted-foreground sm:ml-auto">{prog.desc}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Scale/Chord selector */}
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {viewMode === 'scales' ? 'Select Scale' : 'Select Chord'}
                  </CardTitle>
                  <Badge variant="secondary" className="text-[10px]">
                    {viewMode === 'scales'
                      ? `${filteredScales.length} scales`
                      : `${filteredChords.length} chords`}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4">
                <div className="mb-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat} className="text-xs">
                          {cat === 'all' ? 'All Categories' : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="h-80 overflow-y-auto overflow-x-hidden pr-1 space-y-1">
                  {viewMode === 'scales' ? (
                    filteredScales.map(scale => (
                      <button
                        key={scale.id}
                        onClick={() => setSelectedScale(scale)}
                        className={cn(
                          "cursor-pointer w-full text-left px-2 py-1.5 rounded-lg transition-all duration-200 border",
                          selectedScale.id === scale.id
                            ? "bg-primary/15 border-primary/30 text-foreground"
                            : "bg-muted/20 border-transparent hover:bg-muted/30 hover:border-border/50"
                        )}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-medium text-[11px] truncate">{scale.name}</span>
                          <Badge variant="outline" className="text-[8px] px-1 h-3.5 shrink-0 leading-none">
                            {scale.intervals.length}
                          </Badge>
                        </div>
                        <p className="text-[9px] text-muted-foreground truncate mb-1">
                          {scale.description}
                        </p>
                        <div className="flex items-center gap-1 text-[8px] flex-wrap">
                          {scale.intervals.slice(0, 7).map((int, i) => (
                            <span key={i} className="px-1 py-0.5 bg-muted/50 rounded text-muted-foreground shrink-0 leading-none">{int}</span>
                          ))}
                          {scale.intervals.length > 7 && (
                            <span className="text-muted-foreground shrink-0 leading-none">+{scale.intervals.length - 7}</span>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    filteredChords.map(chord => (
                      <button
                        key={chord.id}
                        onClick={() => setSelectedChord(chord)}
                        className={cn(
                          "cursor-pointer w-full text-left px-2 py-1.5 rounded-lg transition-all duration-200 border",
                          selectedChord.id === chord.id
                            ? "bg-primary/15 border-primary/30 text-foreground"
                            : "bg-muted/20 border-transparent hover:bg-muted/30 hover:border-border/50"
                        )}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-medium text-[11px] truncate">{selectedRoot}{chord.symbol}</span>
                          <Badge variant="outline" className="text-[8px] px-1 h-3.5 shrink-0 leading-none">
                            {chord.intervals.length}
                          </Badge>
                        </div>
                        <p className="text-[9px] text-muted-foreground truncate mb-1">
                          {chord.description}
                        </p>
                        <div className="flex items-center gap-1 text-[8px] flex-wrap">
                          {chord.intervals.map((int, i) => (
                            <span key={i} className="px-1 py-0.5 bg-muted/50 rounded text-muted-foreground shrink-0 leading-none">{int}</span>
                          ))}
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Total count summary */}
                <div className="mt-3 pt-2 border-t border-border/50">
                  <div className="text-[10px] text-muted-foreground">
                    {viewMode === 'scales' ? (
                      <span>{SCALES.length} scale types × 12 keys = <strong className="text-foreground">{SCALES.length * 12}</strong> total combinations</span>
                    ) : (
                      <span>{CHORDS.length} chord types × 12 keys = <strong className="text-foreground">{CHORDS.length * 12}</strong> total combinations</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Circle of Fifths */}
            <CircleOfFifths
              selectedKey={selectedRoot}
              onKeySelect={handleKeySelect}
              mode={circleMode}
              onModeChange={setCircleMode}
            />

            {/* Guitar Tuner */}
            <GuitarTuner />
          </div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl z-50">
        <div className="flex justify-around py-2">
          {[
            { mode: 'scales' as ViewMode, icon: Music, label: 'Scales', activeColor: 'text-emerald-400' },
            { mode: 'chords' as ViewMode, icon: Guitar, label: 'Chords', activeColor: 'text-amber-400' },
          ].map(({ mode, icon: Icon, label, activeColor }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "cursor-pointer flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all duration-200",
                viewMode === mode
                  ? activeColor
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
              {viewMode === mode && (
                <div className={cn("w-1 h-1 rounded-full", mode === 'scales' ? 'bg-emerald-400' : 'bg-amber-400')} />
              )}
            </button>
          ))}
        </div>
      </div>

      <AiChat pageContext={{
        selectedKey: selectedRoot,
        selectedTuning: { id: selectedTuning.id, name: selectedTuning.name, notes: selectedTuning.notes },
        viewMode,
        selectedScaleName: viewMode === 'scales' ? selectedScale.name : undefined,
        selectedChordName: viewMode === 'chords' ? selectedChord.name : undefined,
      }} />
    </div>
  );
}
