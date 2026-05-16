'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { NOTES, SCALES, CHORDS, INTERVALS, getNoteAtInterval, type Note, type ScaleDefinition, type ChordDefinition } from '@/lib/music-theory';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import {
  Music,
  Guitar,
  Star,
  ChevronRight,
  Headphones,
  Target,
  Zap,
  Sparkles,
  Info,
  History,
  Globe,
  List,
  GitBranch,
  Layers,
  Activity,
  BarChart3,
  Compass
} from 'lucide-react';

interface ComprehensiveScaleTheoryProps {
  scale: ScaleDefinition;
  root: Note;
  scaleNotes: Note[];
}

// All chord qualities by scale degree for major keys
const MAJOR_KEY_CHORDS = [
  { degree: 'I', quality: 'Major', numeral: 'I', function: 'Tonic', emotion: 'Stable, resolved, home' },
  { degree: 'ii', quality: 'Minor', numeral: 'ii', function: 'Supertonic', emotion: 'Pre-dominant, leads to V' },
  { degree: 'iii', quality: 'Minor', numeral: 'iii', function: 'Mediant', emotion: 'Tonic substitute, weak' },
  { degree: 'IV', quality: 'Major', numeral: 'IV', function: 'Subdominant', emotion: 'Pre-dominant, movement' },
  { degree: 'V', quality: 'Major', numeral: 'V', function: 'Dominant', emotion: 'Maximum tension, leads to I' },
  { degree: 'vi', quality: 'Minor', numeral: 'vi', function: 'Submediant', emotion: 'Relative minor, tonic sub' },
  { degree: 'vii°', quality: 'Diminished', numeral: 'vii°', function: 'Leading tone', emotion: 'Dominant function' },
];

// All common chord progressions
const ALL_CHORD_PROGRESSIONS = [
  // Pop/Rock Progressions
  { name: 'I-V-vi-IV', pattern: [0, 4, 5, 3], genre: 'Pop', examples: ['Don\'t Stop Believing', 'Let It Be', 'I\'m Yours'], emotion: 'Uplifting, anthemic' },
  { name: 'vi-IV-I-V', pattern: [5, 3, 0, 4], genre: 'Pop Ballad', examples: ['Someone Like You', 'Let Her Go'], emotion: 'Emotional, yearning' },
  { name: 'I-vi-IV-V', pattern: [0, 5, 3, 4], genre: 'Doo-Wop', examples: ['Stand By Me', 'Unchained Melody'], emotion: 'Romantic, nostalgic' },
  { name: 'I-IV-V', pattern: [0, 3, 4], genre: 'Rock/Blues', examples: ['La Bamba', 'Twist and Shout'], emotion: 'Energetic, classic' },
  { name: 'I-V-IV-V', pattern: [0, 4, 3, 4], genre: 'Rock', examples: ['Blitzkrieg Bop', 'Wild Thing'], emotion: 'Punchy, driving' },
  
  // Jazz Progressions
  { name: 'ii-V-I', pattern: [1, 4, 0], genre: 'Jazz', examples: ['Autumn Leaves', 'All The Things You Are'], emotion: 'Sophisticated, resolving' },
  { name: 'vi-ii-V-I', pattern: [5, 1, 4, 0], genre: 'Jazz', examples: ['Fly Me To The Moon'], emotion: 'Smooth, flowing' },
  { name: 'I-vi-ii-V', pattern: [0, 5, 1, 4], genre: 'Jazz Standard', examples: ['Take The A Train'], emotion: 'Classic jazz' },
  { name: 'iii-vi-ii-V', pattern: [2, 5, 1, 4], genre: 'Jazz', examples: ['Satin Doll'], emotion: 'Complex, wandering' },
  { name: 'ii-V-I-vi', pattern: [1, 4, 0, 5], genre: 'Jazz', examples: ['Blue Moon'], emotion: 'Romantic jazz' },
  
  // Blues Progressions
  { name: 'I-IV-I-V-IV-I', pattern: [0, 3, 0, 4, 3, 0], genre: '12-Bar Blues', examples: ['Sweet Home Chicago', 'Crossroads'], emotion: 'Classic blues' },
  { name: 'I-IV-V-IV', pattern: [0, 3, 4, 3], genre: '8-Bar Blues', examples: ['Key To The Highway'], emotion: 'Bluesy' },
  
  // Minor Key Progressions
  { name: 'i-VI-VII-i', pattern: [0, 5, 6, 0], genre: 'Minor Rock', examples: ['All Along The Watchtower', 'Gimme Shelter'], emotion: 'Dark, powerful' },
  { name: 'i-VII-VI-V', pattern: [0, 6, 5, 4], genre: 'Andalusian', examples: ['Hit The Road Jack', 'Sultans of Swing'], emotion: 'Spanish, dramatic' },
  { name: 'i-iv-VII-i', pattern: [0, 3, 6, 0], genre: 'Minor Pop', examples: ['Losing My Religion'], emotion: 'Melancholic' },
  
  // Emotional Progressions
  { name: 'IV-V-iii-vi', pattern: [3, 4, 2, 5], genre: 'Emotional', examples: ['Fix You', 'The Scientist'], emotion: 'Deeply emotional' },
  { name: 'I-iii-IV-iv', pattern: [0, 2, 3, 3], genre: 'Sentimental', examples: ['Creep', 'Let It Go'], emotion: 'Bittersweet' },
  { name: 'vi-V-IV-iii', pattern: [5, 4, 3, 2], genre: 'Descending', examples: ['Stairway to Heaven'], emotion: 'Falling, reflective' },
  
  // Modal Progressions
  { name: 'i-bVII-bVI-i', pattern: [0, 6, 5, 0], genre: 'Dorian', examples: ['Oye Como Va', 'Eleanor Rigby'], emotion: 'Modal, mysterious' },
  { name: 'I-bII-I', pattern: [0, 1, 0], genre: 'Phrygian', examples: ['White Rabbit'], emotion: 'Exotic, tense' },
  { name: 'I-II-I', pattern: [0, 4, 0], genre: 'Lydian', examples: ['Flying In A Blue Dream'], emotion: 'Dreamy, floating' },
  { name: 'I-bVII-I', pattern: [0, 6, 0], genre: 'Mixolydian', examples: ['Sweet Home Alabama'], emotion: 'Bluesy, dominant' },
];

// All scale relationships
const SCALE_RELATIONSHIPS = [
  { type: 'Relative Major/Minor', description: 'Shares the same key signature' },
  { type: 'Parallel Major/Minor', description: 'Same root, different quality' },
  { type: 'Dominant Relationship', description: 'V7 of the target key' },
  { type: 'Subdominant Relationship', description: 'IV chord connection' },
  { type: 'Mediant Relationship', description: 'Third relationship (C to E or Ab)' },
  { type: 'Neapolitan Relationship', description: 'bII chord substitution' },
  { type: 'Tritone Substitution', description: 'Dominant chord a tritone away' },
];

// Interval vector calculations
function getIntervalVector(intervals: string[]): { vector: number[], setClass: string } {
  const semitones = intervals.map(i => INTERVALS[i]?.semitones ?? 0);
  const vector = [0, 0, 0, 0, 0, 0]; // m2, M2, m3, M3, P4/P5, tritone
  
  for (let i = 0; i < semitones.length; i++) {
    for (let j = i + 1; j < semitones.length; j++) {
      const diff = Math.abs(semitones[j] - semitones[i]) % 12;
      const interval = diff > 6 ? 12 - diff : diff;
      
      if (interval === 1) vector[0]++;
      else if (interval === 2) vector[1]++;
      else if (interval === 3 || interval === 9) vector[2]++;
      else if (interval === 4 || interval === 8) vector[3]++;
      else if (interval === 5 || interval === 7) vector[4]++;
      else if (interval === 6) vector[5]++;
    }
  }
  
  return {
    vector,
    setClass: `(${vector.join(', ')})`
  };
}

export function ComprehensiveScaleTheory({ scale, root, scaleNotes }: ComprehensiveScaleTheoryProps) {
  // Calculate nerdy stats
  const intervalVector = useMemo(() => getIntervalVector(scale.intervals), [scale.intervals]);
  const scaleDegreeNames = ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Leading Tone', 'Octave'];
  
  // Generate all diatonic chords
  const diatonicChords = useMemo(() => {
    const qualities = scale.theory?.chordQuality || [];
    return scaleNotes.slice(0, 7).map((note, i) => ({
      degree: i + 1,
      roman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'][i] || `${i + 1}`,
      note,
      quality: qualities[i] || 'maj',
      function: MAJOR_KEY_CHORDS[i]?.function || 'Unknown',
      emotion: MAJOR_KEY_CHORDS[i]?.emotion || 'Various'
    }));
  }, [scaleNotes, scale]);

  // Find progressions that can be played with this scale
  const usableProgressions = useMemo(() => {
    return ALL_CHORD_PROGRESSIONS.filter(prog => {
      const numChords = scaleNotes.length >= 7 ? 7 : scaleNotes.length;
      return prog.pattern.every(p => p < numChords);
    });
  }, [scaleNotes]);

  // Calculate complementary scales for soloing
  const complementaryScales = useMemo(() => {
    const notes = scaleNotes.slice(0, 7);
    const allScales: { name: string; match: number; reason: string }[] = [];
    
    SCALES.forEach(s => {
      const sNotes = NOTES.filter((_, i) => s.intervals.some(int => {
        const semitones = INTERVALS[int]?.semitones ?? 0;
        return i === semitones;
      }));
      
      const matchCount = notes.filter(n => sNotes.includes(n)).length;
      
      if (matchCount >= 5 && s.id !== scale.id) {
        allScales.push({
          name: s.name,
          match: Math.round((matchCount / notes.length) * 100),
          reason: matchCount === notes.length ? 'Perfect match - all notes compatible' :
                  matchCount >= 6 ? 'Excellent overlap - mostly compatible' :
                  'Good overlap - use with care'
        });
      }
    });
    
    return allScales.slice(0, 10);
  }, [scaleNotes, scale]);

  // All modes derived from this scale
  const derivedModes = useMemo(() => {
    if (scale.intervals.length < 7) return [];
    
    return scaleNotes.slice(0, 7).map((note, i) => ({
      startDegree: i + 1,
      rootNote: note,
      name: ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'][i] || `Mode ${i + 1}`,
      intervals: [...scale.intervals.slice(i), ...scale.intervals.slice(0, i)]
    }));
  }, [scaleNotes, scale]);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          Comprehensive Scale Theory & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['construction', 'diatonic', 'progressions']} className="w-full">
          
          {/* Construction & Formula */}
          <AccordionItem value="construction" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Construction & Formula
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {scale.theory?.construction}
                </p>
                
                {/* Interval breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {scale.intervals.map((interval, i) => {
                    const intervalData = INTERVALS[interval];
                    return (
                      <div key={i} className="p-2 rounded bg-muted/30 border border-border/30">
                        <div className="text-xs font-bold text-primary">{interval}</div>
                        <div className="text-[10px] text-muted-foreground">{intervalData?.name || interval}</div>
                        <div className="text-[10px] text-muted-foreground">{intervalData?.semitones ?? '?'} semitones</div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Nerdy Stats */}
                <div className="p-3 rounded bg-muted/20 border border-border/30">
                  <h5 className="text-xs font-semibold mb-2 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-primary" />
                    Interval Vector & Set Theory
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div><span className="text-muted-foreground">Interval Vector:</span> <span className="font-mono">{intervalVector.setClass}</span></div>
                    <div><span className="text-muted-foreground">Cardinality:</span> {scale.intervals.length} notes</div>
                    <div><span className="text-muted-foreground">Scale Type:</span> {scale.intervals.length <= 5 ? 'Pentatonic' : scale.intervals.length === 6 ? 'Hexatonic' : scale.intervals.length === 7 ? 'Heptatonic' : scale.intervals.length === 8 ? 'Octatonic' : 'Chromatic'}</div>
                    <div><span className="text-muted-foreground">Difficulty:</span> {'★'.repeat(scale.difficulty)}{'☆'.repeat(5 - scale.difficulty)}</div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Diatonic Chords */}
          <AccordionItem value="diatonic" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                Diatonic Chords (Harmonization)
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-3">
                <p className="text-xs text-muted-foreground">
                  When this scale is harmonized in thirds, it produces the following chord qualities on each scale degree:
                </p>
                
                <div className="grid gap-2">
                  {diatonicChords.map((chord, i) => (
                    <div key={i} className="p-2 rounded bg-muted/20 border border-border/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs w-8 justify-center">{chord.roman}</Badge>
                        <span className="font-medium text-sm">{chord.note}{chord.quality}</span>
                        <Badge variant="secondary" className="text-[10px]">{chord.function}</Badge>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{chord.emotion}</span>
                    </div>
                  ))}
                </div>
                
                <div className="p-2 rounded bg-primary/5 border border-primary/20">
                  <p className="text-[10px] text-muted-foreground">
                    <strong>Tip:</strong> In {root} {scale.name}, the I ({root}), IV, and V chords are primary. 
                    The ii, iii, and vi are secondary. The vii° is a diminished leading-tone chord.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Chord Progressions */}
          <AccordionItem value="progressions" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-primary" />
                Chord Progressions ({usableProgressions.length} available)
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-3">
                <p className="text-xs text-muted-foreground">
                  These progressions can be constructed using the diatonic chords of this scale:
                </p>
                
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {usableProgressions.map((prog, i) => (
                    <div key={i} className="p-2 rounded bg-muted/20 border border-border/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm font-bold text-primary">{prog.name}</span>
                        <Badge variant="outline" className="text-[10px]">{prog.genre}</Badge>
                      </div>
                      <div className="flex gap-1 mb-1 flex-wrap">
                        {prog.pattern.map((p, j) => {
                          const chord = diatonicChords[p];
                          return (
                            <Badge key={j} variant="secondary" className="text-[10px]">
                              {chord?.roman || p + 1}
                            </Badge>
                          );
                        })}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        <strong>Emotion:</strong> {prog.emotion} | <strong>Examples:</strong> {prog.examples.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Soloing Scales */}
          <AccordionItem value="soloing" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Guitar className="w-4 h-4 text-primary" />
                Scales for Soloing (Compatible)
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-3">
                <p className="text-xs text-muted-foreground">
                  These scales share notes with the current scale and can be used for improvisation:
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {complementaryScales.map((s, i) => (
                    <div key={i} className="p-2 rounded bg-muted/20 border border-border/30">
                      <div className="text-xs font-medium">{s.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${s.match}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{s.match}%</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">{s.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Derived Modes */}
          {derivedModes.length > 0 && (
            <AccordionItem value="modes" className="border-border/50">
              <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Derived Modes ({derivedModes.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-6 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Starting this scale on different scale degrees creates these modal variations:
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {derivedModes.map((mode, i) => (
                      <div key={i} className="p-2 rounded bg-muted/20 border border-border/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-xs">{mode.rootNote} {mode.name}</span>
                          <Badge variant="outline" className="text-[10px]">Degree {mode.startDegree}</Badge>
                        </div>
                        <div className="flex gap-0.5 flex-wrap">
                          {mode.intervals.slice(0, 7).map((int, j) => (
                            <span key={j} className="text-[9px] px-1 py-0.5 bg-muted/50 rounded">{int}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Characteristics */}
          <AccordionItem value="characteristics" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Characteristics & Emotional Qualities
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-3">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {scale.theory?.characteristics}
                </p>
                
                {/* Emotional Keywords */}
                <div className="flex flex-wrap gap-1.5">
                  {scale.category.includes('Major') && (
                    <>
                      <Badge variant="secondary" className="text-xs">Bright</Badge>
                      <Badge variant="secondary" className="text-xs">Happy</Badge>
                      <Badge variant="secondary" className="text-xs">Uplifting</Badge>
                    </>
                  )}
                  {scale.category.includes('Minor') && (
                    <>
                      <Badge variant="secondary" className="text-xs">Dark</Badge>
                      <Badge variant="secondary" className="text-xs">Melancholic</Badge>
                      <Badge variant="secondary" className="text-xs">Emotional</Badge>
                    </>
                  )}
                  {scale.category.includes('Pentatonic') && (
                    <>
                      <Badge variant="secondary" className="text-xs">Versatile</Badge>
                      <Badge variant="secondary" className="text-xs">Safe</Badge>
                      <Badge variant="secondary" className="text-xs">Universal</Badge>
                    </>
                  )}
                  {scale.category.includes('Blues') && (
                    <>
                      <Badge variant="secondary" className="text-xs">Soulful</Badge>
                      <Badge variant="secondary" className="text-xs">Expressive</Badge>
                      <Badge variant="secondary" className="text-xs">Gritty</Badge>
                    </>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Usage Examples */}
          <AccordionItem value="usage" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-primary" />
                Usage Examples & Applications
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-2">
                <ul className="space-y-1.5">
                  {scale.theory?.usageExamples?.map((example, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Famous Songs */}
          <AccordionItem value="songs" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Famous Songs Using This Scale
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6">
                <div className="flex flex-wrap gap-1.5">
                  {scale.theory?.famousSongs?.map((song, i) => (
                    <Badge key={i} variant="outline" className="border-border text-xs">
                      {song}
                    </Badge>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Historical Background */}
          <AccordionItem value="history" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Historical & Cultural Background
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 text-sm text-muted-foreground space-y-3">
                <p>
                  <strong className="text-foreground">Origins:</strong> The {scale.name} has roots in 
                  {scale.category.includes('Major') || scale.category.includes('Minor') 
                    ? ' ancient Greek music theory, which laid the foundation for Western classical music. The modes were named after ancient Greek tribes and regions, though the actual Greek musical system differed significantly from the medieval church modes that later adopted these names.' 
                    : scale.category.includes('Pentatonic') 
                      ? ' ancient civilizations worldwide, found in Chinese, African, Native American, Celtic, and Japanese musical traditions dating back thousands of years. This five-note scale is arguably the most universal scale in human music.'
                      : scale.category.includes('Blues')
                        ? ' African American musical traditions in the Deep South, evolving from work songs, spirituals, and field hollers in the late 19th and early 20th century. The "blue notes" (flattened 3rd, 5th, and 7th) are derived from African tonal systems that don\'t fit precisely into Western equal temperament.'
                        : ' various musical traditions and has been developed and refined over centuries by composers and musicians from multiple cultures.'}
                </p>
                <p>
                  <strong className="text-foreground">Cultural Significance:</strong> This scale represents 
                  {scale.intervals.length <= 5 
                    ? ' a foundational element in many musical cultures, prized for its simplicity, emotional directness, and ease of improvisation. Its absence of semitones makes it harmonically versatile and melodically pleasing across genres.'
                    : ' a sophisticated approach to melody and harmony, offering rich expressive possibilities that have been explored by classical composers, jazz musicians, and contemporary artists alike.'}
                </p>
                <p>
                  <strong className="text-foreground">Modern Usage:</strong> Today, this scale is used in 
                  {scale.category.includes('Blues') 
                    ? ' virtually all contemporary popular music, from rock and blues to jazz, R&B, and hip-hop. It forms the backbone of guitar improvisation and is essential vocabulary for any serious musician.'
                    : ' a wide variety of musical contexts, from film scoring to video game music, from educational settings to professional performance. Its versatility makes it an essential tool in any musician\'s arsenal.'}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}

// ==================== COMPREHENSIVE CHORD THEORY ====================

interface ComprehensiveChordTheoryProps {
  chord: ChordDefinition;
  root: Note;
  chordNotes: Note[];
}

// All possible chord functions
const CHORD_FUNCTIONS = [
  { function: 'Tonic (I)', description: 'The home chord, provides resolution and stability', tension: 0 },
  { function: 'Supertonic (ii)', description: 'Pre-dominant, typically leads to V', tension: 2 },
  { function: 'Mediant (iii)', description: 'Tonic substitute, weak progression', tension: 1 },
  { function: 'Subdominant (IV)', description: 'Pre-dominant, adds forward motion', tension: 3 },
  { function: 'Dominant (V)', description: 'Maximum tension, leads to I', tension: 5 },
  { function: 'Submediant (vi)', description: 'Relative minor, tonic substitute', tension: 1 },
  { function: 'Leading Tone (vii°)', description: 'Dominant function, leads to I', tension: 4 },
];

// All possible extensions and alterations
const CHORD_EXTENSIONS = [
  { name: '9th', semitones: 14, description: 'Adds color and richness' },
  { name: '11th', semitones: 17, description: 'Creates suspended quality' },
  { name: '13th', semitones: 21, description: 'Full, jazz harmony' },
  { name: '#11', semitones: 18, description: 'Lydian color, bright' },
  { name: 'b9', semitones: 13, description: 'Exotic, diminished flavor' },
  { name: '#9', semitones: 15, description: 'Hendrix chord, bluesy' },
  { name: 'b13', semitones: 20, description: 'Dark, altered dominant' },
];

// All scale sources for soloing over chords
const CHORD_SCALE_SOURCES: Record<string, { scales: string[], reason: string }> = {
  'major': {
    scales: ['Major Scale (Ionian)', 'Major Pentatonic', 'Lydian', 'Mixolydian'],
    reason: 'Major chord quality - use major scales and modes'
  },
  'minor': {
    scales: ['Natural Minor (Aeolian)', 'Minor Pentatonic', 'Dorian', 'Phrygian', 'Blues Scale'],
    reason: 'Minor chord quality - use minor scales and modes'
  },
  'dominant': {
    scales: ['Mixolydian', 'Blues Scale', 'Mixolydian Blues', 'Lydian Dominant', 'Altered Scale'],
    reason: 'Dominant chord - maximum tension, many options'
  },
  'diminished': {
    scales: ['Diminished Scale (W-H)', 'Diminished Scale (H-W)', 'Locrian'],
    reason: 'Diminished quality - use symmetrical scales'
  },
  'half-diminished': {
    scales: ['Locrian', 'Locrian #2', 'Aeolian b5'],
    reason: 'Half-diminished - jazz minor modes work well'
  },
  'augmented': {
    scales: ['Whole Tone Scale', 'Augmented Scale', 'Lydian #5'],
    reason: 'Augmented quality - use symmetrical and exotic scales'
  },
};

export function ComprehensiveChordTheory({ chord, root, chordNotes }: ComprehensiveChordTheoryProps) {
  // Determine chord type for scale matching
  const chordType = useMemo(() => {
    if (chord.id.includes('dim') && chord.id.includes('7')) return 'diminished';
    if (chord.id.includes('dim')) return 'half-diminished';
    if (chord.id.includes('aug')) return 'augmented';
    if (chord.id.includes('7') && !chord.id.includes('maj')) return 'dominant';
    if (chord.id.includes('min')) return 'minor';
    return 'major';
  }, [chord]);

  // Find all progressions containing this chord type
  const progressionsWithChord = useMemo(() => {
    return ALL_CHORD_PROGRESSIONS.map(prog => {
      const chords = prog.pattern.map(p => MAJOR_KEY_CHORDS[p]);
      const containsChordType = chords.some(c => {
        if (chordType === 'major') return c.quality === 'Major';
        if (chordType === 'minor') return c.quality === 'Minor';
        if (chordType === 'diminished') return c.quality === 'Diminished';
        return true;
      });
      return { ...prog, containsChordType, chords };
    }).filter(p => p.containsChordType);
  }, [chordType]);

  // Get scales for soloing
  const soloingScales = CHORD_SCALE_SOURCES[chordType] || CHORD_SCALE_SOURCES['major'];

  // Calculate voice leading possibilities
  const voiceLeadingOptions = useMemo(() => {
    const options: { target: string; motion: string; strength: number }[] = [];
    
    // Common resolutions based on chord function
    if (chordType === 'dominant') {
      options.push({ target: 'I (Tonic)', motion: 'Strongest resolution - 5th falls to root, 7th falls to 3rd', strength: 5 });
      options.push({ target: 'vi (Deceptive)', motion: 'Deceptive cadence - 5th stays, 7th falls to 3rd of vi', strength: 4 });
      options.push({ target: 'IV (Backdoor)', motion: 'Backdoor dominant - common in jazz', strength: 3 });
    } else if (chordType === 'minor') {
      options.push({ target: 'IV or V', motion: 'Pre-dominant motion', strength: 4 });
      options.push({ target: 'III or VI', motion: 'Relative major motion', strength: 3 });
    } else if (chordType === 'diminished') {
      options.push({ target: 'I (Chromatically)', motion: 'Diminished 7th resolves up by semitone', strength: 5 });
      options.push({ target: 'Any chord a minor 3rd up', motion: 'Symmetrical resolution', strength: 4 });
    } else {
      options.push({ target: 'Any diatonic chord', motion: 'Tonic can move anywhere', strength: 3 });
    }
    
    return options;
  }, [chordType]);

  // Calculate chord tensions
  const chordTensions = useMemo(() => {
    const tensions: { note: string; type: string; available: boolean }[] = [];
    const rootIndex = NOTES.indexOf(root);
    
    // Check available tensions
    const usedSemitones = chord.intervals.map(i => INTERVALS[i]?.semitones ?? 0);
    
    [9, 11, 13].forEach(ext => {
      const semitone = ext === 9 ? 14 : ext === 11 ? 17 : 21;
      const noteIndex = (rootIndex + semitone) % 12;
      tensions.push({
        note: NOTES[noteIndex],
        type: `${ext}th`,
        available: !usedSemitones.includes(semitone % 12)
      });
    });
    
    // Check alterations
    ['#9', 'b9', '#11', 'b13'].forEach(alt => {
      const semitone = alt === 'b9' ? 13 : alt === '#9' ? 15 : alt === '#11' ? 18 : 20;
      const noteIndex = (rootIndex + semitone) % 12;
      tensions.push({
        note: NOTES[noteIndex],
        type: alt,
        available: chordType === 'dominant'
      });
    });
    
    return tensions;
  }, [root, chord, chordType]);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-primary" />
          </div>
          Comprehensive Chord Theory & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['construction', 'progressions', 'soloing']} className="w-full">
          
          {/* Construction */}
          <AccordionItem value="construction" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Construction & Formula
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {chord.theory?.construction}
                </p>
                
                {/* Chord tones breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {chord.intervals.map((interval, i) => {
                    const intervalData = INTERVALS[interval];
                    const noteIndex = (NOTES.indexOf(root) + (intervalData?.semitones ?? 0)) % 12;
                    const note = NOTES[noteIndex];
                    return (
                      <div key={i} className="p-2 rounded bg-muted/30 border border-border/30 text-center">
                        <div className="text-xs font-bold text-primary">{note}</div>
                        <div className="text-[10px] text-muted-foreground">{interval}</div>
                        <div className="text-[10px] text-muted-foreground">{intervalData?.name || interval}</div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Chord Symbol Info */}
                <div className="p-3 rounded bg-muted/20 border border-border/30">
                  <h5 className="text-xs font-semibold mb-2">Chord Symbol Analysis</h5>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div><span className="text-muted-foreground">Root:</span> <strong>{root}</strong></div>
                    <div><span className="text-muted-foreground">Symbol:</span> <strong>{root}{chord.symbol}</strong></div>
                    <div><span className="text-muted-foreground">Quality:</span> <strong>{chord.category}</strong></div>
                    <div><span className="text-muted-foreground">Notes:</span> <strong>{chordNotes.join(' - ')}</strong></div>
                    <div><span className="text-muted-foreground">Difficulty:</span> <strong>{'★'.repeat(chord.difficulty)}{'☆'.repeat(5 - chord.difficulty)}</strong></div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Chord Progressions */}
          <AccordionItem value="progressions" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-primary" />
                Chord Progressions ({progressionsWithChord.length} containing {chordType} chords)
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-3">
                <p className="text-xs text-muted-foreground">
                  These progressions commonly use {chordType} quality chords like {root}{chord.symbol}:
                </p>
                
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {progressionsWithChord.slice(0, 15).map((prog, i) => (
                    <div key={i} className="p-2 rounded bg-muted/20 border border-border/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm font-bold text-primary">{prog.name}</span>
                        <Badge variant="outline" className="text-[10px]">{prog.genre}</Badge>
                      </div>
                      <div className="flex gap-1 mb-1 flex-wrap">
                        {prog.chords.map((c, j) => (
                          <Badge key={j} variant={c.quality === 'Major' ? 'default' : c.quality === 'Minor' ? 'secondary' : 'destructive'} className="text-[10px]">
                            {c.numeral}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {prog.emotion} • {prog.examples.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Soloing Scales */}
          <AccordionItem value="soloing" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Guitar className="w-4 h-4 text-primary" />
                Scales for Soloing Over This Chord
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-3">
                <p className="text-xs text-muted-foreground mb-2">
                  {soloingScales.reason}
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {soloingScales.scales.map((scale, i) => (
                    <div key={i} className="p-2 rounded bg-muted/20 border border-border/30">
                      <div className="text-xs font-medium">{scale}</div>
                      <div className="text-[10px] text-muted-foreground">in key of {root}</div>
                    </div>
                  ))}
                </div>
                
                <div className="p-2 rounded bg-primary/5 border border-primary/20 mt-3">
                  <h5 className="text-xs font-semibold mb-1">Soloing Tips for {root}{chord.symbol}</h5>
                  <ul className="text-[10px] text-muted-foreground space-y-1">
                    <li>• <strong>Target chord tones:</strong> {chordNotes.join(', ')} - these are your "safe" landing notes</li>
                    <li>• <strong>Emphasize:</strong> the 3rd and 7th (if present) for chord definition</li>
                    <li>• <strong>Avoid:</strong> playing the 4th over a major chord (sounds unresolved)</li>
                    {chordType === 'dominant' && <li>• <strong>Dominant:</strong> experiment with alterations (#9, b9, #11, b13) for tension</li>}
                    {chordType === 'minor' && <li>• <strong>Minor:</strong> minor pentatonic and blues scales work universally</li>}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Voice Leading */}
          <AccordionItem value="voiceleading" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                Voice Leading & Resolution
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Voice leading describes how individual notes move from one chord to the next:
                </p>
                
                <div className="grid gap-2">
                  {voiceLeadingOptions.map((opt, i) => (
                    <div key={i} className="p-2 rounded bg-muted/20 border border-border/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-xs">Resolve to {opt.target}</span>
                        <div className="flex gap-0.5">
                          {Array(5).fill(0).map((_, j) => (
                            <div key={j} className={cn(
                              "w-2 h-2 rounded-full",
                              j < opt.strength ? "bg-primary" : "bg-muted"
                            )} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{opt.motion}</p>
                    </div>
                  ))}
                </div>
                
                <div className="p-2 rounded bg-muted/20 border border-border/30">
                  <h5 className="text-xs font-semibold mb-1">General Voice Leading Rules</h5>
                  <ul className="text-[10px] text-muted-foreground space-y-1">
                    <li>• Keep common tones between chords</li>
                    <li>• Move other voices by step (conjunct motion)</li>
                    <li>• Avoid parallel fifths and octaves in classical style</li>
                    <li>• Resolve tendency tones (leading tone → tonic, 7th → 3rd)</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Extensions & Alterations */}
          <AccordionItem value="extensions" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Extensions & Alterations
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Add color and tension to this chord with extensions and alterations:
                </p>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {chordTensions.map((t, i) => (
                    <div key={i} className={cn(
                      "p-2 rounded border text-center",
                      t.available ? "bg-muted/20 border-border/30" : "bg-muted/10 border-border/20 opacity-50"
                    )}>
                      <div className="text-xs font-bold">{t.note}</div>
                      <div className="text-[10px] text-primary">{t.type}</div>
                      <div className="text-[9px] text-muted-foreground">
                        {t.available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-2 rounded bg-primary/5 border border-primary/20">
                  <h5 className="text-xs font-semibold mb-1">Extension Guidelines</h5>
                  <ul className="text-[10px] text-muted-foreground space-y-1">
                    <li>• <strong>9th:</strong> Can be added to most 7th chords for richness</li>
                    <li>• <strong>11th:</strong> Works well on minor and sus chords; avoid on major (clashes with 3rd)</li>
                    <li>• <strong>13th:</strong> Full jazz harmony; typically replaces the 5th</li>
                    <li>• <strong>Altered:</strong> Use on dominant chords for maximum tension before resolution</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Harmonic Function */}
          <AccordionItem value="function" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Harmonic Function
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-3">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {chord.theory?.function}
                </p>
                
                <div className="grid grid-cols-3 gap-2">
                  {CHORD_FUNCTIONS.map((func, i) => (
                    <div key={i} className="p-2 rounded bg-muted/20 border border-border/30">
                      <div className="text-xs font-medium">{func.function}</div>
                      <div className="text-[10px] text-muted-foreground">{func.description}</div>
                      <div className="flex gap-0.5 mt-1">
                        {Array(5).fill(0).map((_, j) => (
                          <div key={j} className={cn(
                            "w-2 h-2 rounded-full",
                            j < func.tension ? "bg-primary" : "bg-muted"
                          )} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Substitutions */}
          <AccordionItem value="substitutions" className="border-border/50">
            <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Substitutions & Related Chords
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-3">
                <p className="text-xs text-muted-foreground mb-2">
                  Chords that can substitute for {root}{chord.symbol}:
                </p>
                
                <div className="flex flex-wrap gap-1.5">
                  {chord.theory?.substitutions?.map((sub, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {root}{sub}
                    </Badge>
                  ))}
                </div>
                
                <Separator className="my-3" />
                
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold">Common Substitution Types</h5>
                  <ul className="text-[10px] text-muted-foreground space-y-1">
                    <li>• <strong>Tritone Substitution:</strong> Replace V7 with a dominant 7th a tritone away</li>
                    <li>• <strong>Relative Major/Minor:</strong> Swap I and vi, or iv and VI</li>
                    <li>• <strong>Secondary Dominant:</strong> Use V7 of any diatonic chord</li>
                    <li>• <strong>Diminished 7th:</strong> Can substitute for V7 or V7b9</li>
                    <li>• <strong>Chord Quality Sub:</strong> Major 7 for major, minor 7 for minor, etc.</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}

export default ComprehensiveScaleTheory;
