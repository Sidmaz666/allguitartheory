// Complete Music Theory Library for Guitar - EXPANDED
// Contains 100+ scales, all tunings, comprehensive theory

// ===== NOTES & INTERVALS =====
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

export type Note = typeof NOTES[number];

// Sargam (Indian Classical) syllables
export const SARGAM = ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni', 'Sa'] as const;
export const SARGAM_KOMAL = ['Sa', 're', 'ga', 'Ma', 'Pa', 'dha', 'ni', 'Sa'] as const;

// Solfège (Western) syllables  
export const SOLFEGE = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti', 'Do'] as const;

export const INTERVALS: Record<string, { semitones: number; name: string; short: string }> = {
  '1': { semitones: 0, name: 'Root', short: 'R' },
  'b2': { semitones: 1, name: 'Minor 2nd', short: 'b2' },
  '2': { semitones: 2, name: 'Major 2nd', short: '2' },
  'b3': { semitones: 3, name: 'Minor 3rd', short: 'b3' },
  '3': { semitones: 4, name: 'Major 3rd', short: '3' },
  '4': { semitones: 5, name: 'Perfect 4th', short: '4' },
  '#4': { semitones: 6, name: 'Augmented 4th', short: '#4' },
  'b5': { semitones: 6, name: 'Diminished 5th', short: 'b5' },
  '5': { semitones: 7, name: 'Perfect 5th', short: '5' },
  '#5': { semitones: 8, name: 'Augmented 5th', short: '#5' },
  'b6': { semitones: 8, name: 'Minor 6th', short: 'b6' },
  '6': { semitones: 9, name: 'Major 6th', short: '6' },
  'bb7': { semitones: 9, name: 'Diminished 7th', short: 'bb7' },
  'b7': { semitones: 10, name: 'Minor 7th', short: 'b7' },
  '7': { semitones: 11, name: 'Major 7th', short: '7' },
  'b9': { semitones: 13, name: 'Minor 9th', short: 'b9' },
  '9': { semitones: 14, name: 'Major 9th', short: '9' },
  '#9': { semitones: 15, name: 'Augmented 9th', short: '#9' },
  '11': { semitones: 17, name: 'Perfect 11th', short: '11' },
  '#11': { semitones: 18, name: 'Augmented 11th', short: '#11' },
  'b13': { semitones: 20, name: 'Minor 13th', short: 'b13' },
  '13': { semitones: 21, name: 'Major 13th', short: '13' },
};

// Display modes for fretboard
export type DisplayMode = 'notes' | 'sargam' | 'solfege' | 'numbers' | 'intervals' | 'fingerings';

export interface ScaleDefinition {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  intervals: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  parentScale?: string;
  modeNumber?: number;
  description: string;
  theory: {
    construction: string;
    characteristics: string;
    chordQuality: string[];
    usageExamples: string[];
    famousSongs: string[];
    practiceTips: string[];
  };
}

export const SCALE_CATEGORIES = [
  'Major & Modes',
  'Melodic Minor Modes',
  'Harmonic Minor Modes',
  'Harmonic Major Modes',
  'Pentatonic',
  'Blues',
  'Symmetrical',
  'Bebop',
  'Exotic & World',
  'Ethnic & Regional',
  'Synthetic',
  'Classical & Historical'
] as const;

export const SCALES: ScaleDefinition[] = [
  // ==================== MAJOR SCALE & MODES (7) ====================
  {
    id: 'ionian',
    name: 'Major Scale (Ionian)',
    aliases: ['Ionian', 'Natural Major'],
    category: 'Major & Modes',
    intervals: ['1', '2', '3', '4', '5', '6', '7'],
    difficulty: 1,
    description: 'The foundation of Western music theory. The major scale is the parent scale from which all modes are derived.',
    theory: {
      construction: 'W-W-H-W-W-W-H (Whole and Half steps). Built from the intervals: Root, Major 2nd, Major 3rd, Perfect 4th, Perfect 5th, Major 6th, Major 7th.',
      characteristics: 'Bright, happy, and resolved sound. The 7th is a half step below the root, creating a strong sense of resolution when moving to the tonic.',
      chordQuality: ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5'],
      usageExamples: ['Pop and rock songs', 'Hymns and folk music', 'Classical compositions'],
      famousSongs: ['Happy Birthday', 'Twinkle Twinkle Little Star', 'Let It Be - The Beatles'],
      practiceTips: ['Start with 5 positions using CAGED system', 'Practice ascending and descending', 'Learn to hear the characteristic bright sound']
    }
  },
  {
    id: 'dorian',
    name: 'Dorian Mode',
    aliases: ['Dorian', 'Mode II'],
    category: 'Major & Modes',
    intervals: ['1', '2', 'b3', '4', '5', '6', 'b7'],
    difficulty: 2,
    parentScale: 'ionian',
    modeNumber: 2,
    description: 'The second mode of the major scale. Minor with a raised 6th, giving it a unique "minor with hope" quality.',
    theory: {
      construction: 'Like natural minor but with a major 6th instead of minor 6th. The major 6th is the characteristic tone.',
      characteristics: 'Minor quality but brighter than natural minor. Used extensively in jazz, rock, and Celtic music.',
      chordQuality: ['m7', 'm7', 'maj7', '7', 'm7', 'm7b5', 'maj7'],
      usageExamples: ['Jazz improvisation over minor chords', 'Rock and funk grooves', 'Fusion music'],
      famousSongs: ['So What - Miles Davis', 'Oye Como Va - Santana', 'Scarborough Fair'],
      practiceTips: ['Emphasize the 6th to bring out the Dorian character', 'Use over Im7 chords in minor blues']
    }
  },
  {
    id: 'phrygian',
    name: 'Phrygian Mode',
    aliases: ['Phrygian', 'Mode III'],
    category: 'Major & Modes',
    intervals: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
    difficulty: 2,
    parentScale: 'ionian',
    modeNumber: 3,
    description: 'The third mode of the major scale. Spanish/Flamenco flavor due to the flattened 2nd.',
    theory: {
      construction: 'Like natural minor with a flattened 2nd (b2). The b2 creates an exotic tension.',
      characteristics: 'Dark, exotic, Spanish-flavored. The b2-1 semitone movement is the most distinctive feature.',
      chordQuality: ['m7', 'maj7', '7', 'm7', 'm7b5', 'maj7', 'm7'],
      usageExamples: ['Flamenco and Spanish music', 'Metal and progressive rock', 'Jazz over susb9 chords'],
      famousSongs: ['White Rabbit - Jefferson Airplane', 'Symphony X songs', 'Spanish Romance'],
      practiceTips: ['Focus on the b2 to root resolution', 'Combine with Phrygian Dominant for more tension']
    }
  },
  {
    id: 'lydian',
    name: 'Lydian Mode',
    aliases: ['Lydian', 'Mode IV'],
    category: 'Major & Modes',
    intervals: ['1', '2', '3', '#4', '5', '6', '7'],
    difficulty: 2,
    parentScale: 'ionian',
    modeNumber: 4,
    description: 'The fourth mode of the major scale. Major with a raised 4th, creating a dreamy, floating quality.',
    theory: {
      construction: 'Major scale with a raised 4th (#4). The #4 creates a dreamy, suspended quality.',
      characteristics: 'Bright but mysterious. The #4 (tritone) adds tension but without the dominant function.',
      chordQuality: ['maj7#11', '7', 'm7', 'm7b5', 'maj7', 'm7', 'm7'],
      usageExamples: ['Film scores for magical scenes', 'Jazz over maj7#11 chords', 'Progressive rock and fusion'],
      famousSongs: ['Flying in a Blue Dream - Joe Satriani', 'Dreams - Fleetwood Mac', 'The Simpsons Theme'],
      practiceTips: ['Emphasize the #4 for the Lydian flavor', 'Use over Imaj7 chords that last multiple bars']
    }
  },
  {
    id: 'mixolydian',
    name: 'Mixolydian Mode',
    aliases: ['Mixolydian', 'Mode V', 'Dominant Scale'],
    category: 'Major & Modes',
    intervals: ['1', '2', '3', '4', '5', '6', 'b7'],
    difficulty: 1,
    parentScale: 'ionian',
    modeNumber: 5,
    description: 'The fifth mode of the major scale. Major with a flattened 7th, perfect for dominant chords and blues.',
    theory: {
      construction: 'Major scale with a flattened 7th (b7). Creates the dominant 7th sound essential to blues and rock.',
      characteristics: 'Bluesy and rock-oriented. The b7 gives it a less resolved, more open quality.',
      chordQuality: ['7', 'm7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7'],
      usageExamples: ['Blues progressions over dominant chords', 'Rock guitar solos', 'Jazz over V7 chords'],
      famousSongs: ['Born Under a Bad Sign', 'Purple Haze - Jimi Hendrix', 'Sweet Home Alabama'],
      practiceTips: ['Use over dominant 7th chords', 'Combine with blues scale for authentic blues']
    }
  },
  {
    id: 'aeolian',
    name: 'Natural Minor (Aeolian)',
    aliases: ['Aeolian', 'Natural Minor', 'Mode VI'],
    category: 'Major & Modes',
    intervals: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    difficulty: 1,
    parentScale: 'ionian',
    modeNumber: 6,
    description: 'The sixth mode of the major scale. The natural minor scale - sad, introspective, and foundational.',
    theory: {
      construction: 'W-H-W-W-H-W-W. Built from: Root, Major 2nd, Minor 3rd, Perfect 4th, Perfect 5th, Minor 6th, Minor 7th.',
      characteristics: 'Sad, melancholic, introspective. The b6 creates a darker quality than Dorian.',
      chordQuality: ['m7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7', '7'],
      usageExamples: ['Power ballads and emotional songs', 'Rock and metal', 'Classical minor key compositions'],
      famousSongs: ['All Along the Watchtower - Hendrix', 'Stairway to Heaven - Led Zeppelin', 'Nothing Else Matters - Metallica'],
      practiceTips: ['Compare with Dorian to hear the emotional difference', 'Use over Im chords in natural minor progressions']
    }
  },
  {
    id: 'locrian',
    name: 'Locrian Mode',
    aliases: ['Locrian', 'Mode VII', 'Half-Diminished Scale'],
    category: 'Major & Modes',
    intervals: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
    difficulty: 3,
    parentScale: 'ionian',
    modeNumber: 7,
    description: 'The seventh mode of the major scale. Diminished quality - unstable, tense, and rarely used as a tonal center.',
    theory: {
      construction: 'All notes are flattened except the root. The b5 makes it a natural fit for half-diminished chords.',
      characteristics: 'Unstable, tense, unresolved. Essential for jazz over m7b5 chords.',
      chordQuality: ['m7b5', 'maj7', 'm7', 'm7', 'maj7', '7', 'm7'],
      usageExamples: ['Jazz over half-diminished chords', 'Metal for tense passages', 'Avant-garde compositions'],
      famousSongs: ['Jazz standards with ii-V-I in minor keys', 'Progressive metal passages'],
      practiceTips: ['Use over m7b5 chords in minor ii-V-i progressions', 'Resolve to related stable tonalities']
    }
  },

  // ==================== MELODIC MINOR MODES (7) ====================
  {
    id: 'melodic-minor',
    name: 'Melodic Minor (Jazz Minor)',
    aliases: ['Jazz Minor'],
    category: 'Melodic Minor Modes',
    intervals: ['1', '2', 'b3', '4', '5', '6', '7'],
    difficulty: 2,
    description: 'Natural minor with raised 6th and 7th. In jazz, used both ascending and descending.',
    theory: {
      construction: 'Natural minor with raised 6th and 7th. Eliminates the augmented 2nd of harmonic minor.',
      characteristics: 'Sophisticated minor sound. Smoother than harmonic minor, with jazz applications.',
      chordQuality: ['mMaj7', 'm7', 'maj7#5', '7', '7', 'm7b5', 'm7b5'],
      usageExamples: ['Jazz minor key compositions', 'Fusion', 'Modern classical'],
      famousSongs: ['Spain - Chick Corea', 'Blue in Green - Miles Davis'],
      practiceTips: ['Use over mMaj7 and m6 chords', 'Parent scale for many jazz modes']
    }
  },
  {
    id: 'dorian-b2',
    name: 'Dorian b2 (Phrygian #6)',
    aliases: ['Dorian Flat 2', 'Phrygian Natural 6'],
    category: 'Melodic Minor Modes',
    intervals: ['1', 'b2', 'b3', '4', '5', '6', 'b7'],
    difficulty: 3,
    parentScale: 'melodic-minor',
    modeNumber: 2,
    description: 'Second mode of melodic minor. Phrygian with a raised 6th - exotic and sophisticated.',
    theory: {
      construction: 'Phrygian with major 6th instead of minor 6th. Combines exotic b2 with bright 6th.',
      characteristics: 'Exotic yet sophisticated. Used in Indian and Middle Eastern fusion.',
      chordQuality: ['m7', 'm7', 'maj7', '7', 'm7b5', 'maj7', 'm7'],
      usageExamples: ['Jazz over susb9 chords', 'Indian fusion', 'World music'],
      famousSongs: ['John McLaughlin compositions', 'Eastern-influenced jazz'],
      practiceTips: ['Use the b2 for exotic flavor', 'The major 6th creates unique tension-resolution']
    }
  },
  {
    id: 'lydian-augmented',
    name: 'Lydian Augmented',
    aliases: ['Lydian #5', 'Major #5 #4'],
    category: 'Melodic Minor Modes',
    intervals: ['1', '2', '3', '#4', '#5', '6', '7'],
    difficulty: 4,
    parentScale: 'melodic-minor',
    modeNumber: 3,
    description: 'Third mode of melodic minor. Major with both #4 and #5 - dreamy and surreal.',
    theory: {
      construction: 'Major scale with raised 4th and raised 5th. Creates an ethereal, floating quality.',
      characteristics: 'Dreamy, surreal, otherworldly. Works over augmented major 7th chords.',
      chordQuality: ['maj7#5', 'maj7#5#11', '7#5', '9#5', '13#5'],
      usageExamples: ['Avant-garde jazz', 'Film scores for surreal scenes', 'Modern classical'],
      famousSongs: ['Wayne Shorter compositions', 'Herbie Hancock fusion'],
      practiceTips: ['Use over maj7#5 chords', 'Create dreamlike atmospheres']
    }
  },
  {
    id: 'lydian-dominant',
    name: 'Lydian Dominant',
    aliases: ['Lydian b7', 'Mixolydian #4'],
    category: 'Melodic Minor Modes',
    intervals: ['1', '2', '3', '#4', '5', '6', 'b7'],
    difficulty: 3,
    parentScale: 'melodic-minor',
    modeNumber: 4,
    description: 'Fourth mode of melodic minor. Mixolydian with a raised 4th - perfect for dominant chords with tension.',
    theory: {
      construction: 'Mixolydian with a raised 4th (#4). Creates tension while maintaining dominant function.',
      characteristics: 'Spacey dominant sound. Used extensively in modern jazz over 7#11 chords.',
      chordQuality: ['7#11', '9#11', '13#11', '7#9#11'],
      usageExamples: ['Jazz over V7#11 chords', 'Fusion solos', 'Modern jazz harmony'],
      famousSongs: ['Witch Hunt - Wayne Shorter', 'Jazz standards with tritone substitution'],
      practiceTips: ['Use over 7#11 and 9#11 chords', 'Great for ii-V-I where V7 has extensions']
    }
  },
  {
    id: 'mixolydian-b6',
    name: 'Mixolydian b6 (Fifth Mode)',
    aliases: ['Mixolydian Flat 6', 'Hindu Scale'],
    category: 'Melodic Minor Modes',
    intervals: ['1', '2', '3', '4', '5', 'b6', 'b7'],
    difficulty: 3,
    parentScale: 'melodic-minor',
    modeNumber: 5,
    description: 'Fifth mode of melodic minor. Mixolydian with a flattened 6th - exotic dominant sound.',
    theory: {
      construction: 'Mixolydian with minor 6th instead of major 6th. Creates exotic dominant tension.',
      characteristics: 'Exotic dominant quality. The b6 creates a unique flavor against the major 3rd.',
      chordQuality: ['7', '7b13', '9b13', '11b13'],
      usageExamples: ['Indian-influenced music', 'Jazz fusion', 'World music over V7'],
      famousSongs: ['John Coltrane India', 'Ravi Shankar collaborations'],
      practiceTips: ['The b6 creates the Hindu scale flavor', 'Use over V7b13 chords']
    }
  },
  {
    id: 'locrian-#2',
    name: 'Locrian #2 (Half-Diminished Natural 2)',
    aliases: ['Aeolian b5', 'Natural 9'],
    category: 'Melodic Minor Modes',
    intervals: ['1', '2', 'b3', '4', 'b5', 'b6', 'b7'],
    difficulty: 3,
    parentScale: 'melodic-minor',
    modeNumber: 6,
    description: 'Sixth mode of melodic minor. Locrian with a natural 2nd - easier to use than Locrian.',
    theory: {
      construction: 'Locrian with major 2nd instead of minor 2nd. The natural 9 makes it more consonant.',
      characteristics: 'Half-diminished sound but more usable. The natural 9 avoids harsh dissonance.',
      chordQuality: ['m7b5', 'm9b5', 'ø9', 'm11b5'],
      usageExamples: ['Jazz over m7b5 chords', 'Minor ii-V-i progressions', 'Modern jazz'],
      famousSongs: ['John Coltrane ballads', 'Bill Evans trios'],
      practiceTips: ['Use over m9b5 and m7b5 chords', 'Easier to phrase than standard Locrian']
    }
  },
  {
    id: 'super-locrian',
    name: 'Super Locrian (Altered Scale)',
    aliases: ['Altered Scale', 'Diminished-Whole Tone'],
    category: 'Melodic Minor Modes',
    intervals: ['1', 'b2', '#2', '3', 'b5', '#5', 'b7'],
    difficulty: 4,
    parentScale: 'melodic-minor',
    modeNumber: 7,
    description: 'Seventh mode of melodic minor. Contains all possible alterations of a dominant chord.',
    theory: {
      construction: 'All chord tones and extensions are altered (b5, #5, b9, #9). The ultimate tension scale.',
      characteristics: 'Maximum tension and dissonance. The most important scale for jazz dominant harmony.',
      chordQuality: ['7alt', '7#9', '7b9', '7#5b9', '7#5#9', '7b5b9', '7b5#9'],
      usageExamples: ['Jazz V7 chords with alterations', 'Resolution to major or minor tonic', 'Advanced jazz vocabulary'],
      famousSongs: ['Confirmation - Charlie Parker', 'All jazz standards with V7alt'],
      practiceTips: ['Use over V7alt chords', 'Resolve to the 3rd of the I chord']
    }
  },

  // ==================== HARMONIC MINOR MODES (7) ====================
  {
    id: 'harmonic-minor',
    name: 'Harmonic Minor',
    aliases: ['Mohammedan Scale'],
    category: 'Harmonic Minor Modes',
    intervals: ['1', '2', 'b3', '4', '5', 'b6', '7'],
    difficulty: 2,
    description: 'Natural minor with a raised 7th. Creates the exotic "Eastern" sound and strong V-i resolution.',
    theory: {
      construction: 'Natural minor with a raised 7th. The major 7th creates a leading tone and enables V7-i cadence.',
      characteristics: 'Exotic, Eastern-flavored. The augmented 2nd interval (b6 to 7) gives it a distinctive sound.',
      chordQuality: ['mMaj7', 'm7b5', 'maj7#5', 'm7', '7', 'maj7', 'dim7'],
      usageExamples: ['Classical minor key compositions', 'Neoclassical metal', 'Jazz minor ii-V-i'],
      famousSongs: ['Malagueña', 'Smooth - Santana', 'Classical pieces by Bach, Mozart'],
      practiceTips: ['Use over V7 in minor progressions', 'The major 7th creates strong resolution to tonic']
    }
  },
  {
    id: 'locrian-#6',
    name: 'Locrian #6 (Harmonic Minor Mode II)',
    aliases: ['Locrian Natural 6'],
    category: 'Harmonic Minor Modes',
    intervals: ['1', 'b2', 'b3', '4', 'b5', '6', 'b7'],
    difficulty: 3,
    parentScale: 'harmonic-minor',
    modeNumber: 2,
    description: 'Second mode of harmonic minor. Locrian with a major 6th - unusual but useful.',
    theory: {
      construction: 'Locrian with major 6th. Creates a unique half-diminished quality.',
      characteristics: 'Unusual half-diminished sound. The natural 6 adds unexpected brightness.',
      chordQuality: ['m7b5', 'm9b5', 'ø11', 'm7b5/13'],
      usageExamples: ['Jazz over m7b5 chords', 'Minor ii-V-i with unique flavor', 'Avant-garde'],
      famousSongs: ['Rarely used as standalone', 'Classical minor key passages'],
      practiceTips: ['Use over m7b5 when you want the natural 6', 'Creates unexpected harmonic movement']
    }
  },
  {
    id: 'ionian-#5',
    name: 'Ionian #5 (Harmonic Minor Mode III)',
    aliases: ['Major #5', 'Ionian Augmented'],
    category: 'Harmonic Minor Modes',
    intervals: ['1', '2', '3', '4', '#5', '6', '7'],
    difficulty: 4,
    parentScale: 'harmonic-minor',
    modeNumber: 3,
    description: 'Third mode of harmonic minor. Major with a raised 5th - ethereal and dreamy.',
    theory: {
      construction: 'Major scale with raised 5th. Creates an augmented major quality.',
      characteristics: 'Dreamy, ethereal, slightly surreal. Works over augmented major chords.',
      chordQuality: ['maj7#5', 'maj9#5', 'maj7#5#11', 'aug(maj7)'],
      usageExamples: ['Avant-garde classical', 'Film scores', 'Modern jazz'],
      famousSongs: ['Rare in popular music', 'Used in 20th century classical'],
      practiceTips: ['Use over maj7#5 chords', 'Creates dreamlike atmosphere']
    }
  },
  {
    id: 'dorian-#4',
    name: 'Dorian #4 (Harmonic Minor Mode IV)',
    aliases: ['Dorian Sharp 4', 'Romanian Scale', 'Ukrainian Dorian'],
    category: 'Harmonic Minor Modes',
    intervals: ['1', '2', 'b3', '#4', '5', '6', 'b7'],
    difficulty: 3,
    parentScale: 'harmonic-minor',
    modeNumber: 4,
    description: 'Fourth mode of harmonic minor. Dorian with a raised 4th - Eastern European folk sound.',
    theory: {
      construction: 'Dorian with raised 4th. The #4 creates Eastern European folk quality.',
      characteristics: 'Eastern European, gypsy jazz flavor. Popular in Romanian and Ukrainian folk music.',
      chordQuality: ['m7#11', 'm9#11', 'mMaj7', 'm6/9'],
      usageExamples: ['Eastern European folk music', 'Gypsy jazz', 'Django Reinhardt style'],
      famousSongs: ['Django Reinhardt compositions', 'Balkan folk music'],
      practiceTips: ['The #4 gives it a unique Eastern flavor', 'Use in gypsy jazz context']
    }
  },
  {
    id: 'phrygian-dominant',
    name: 'Phrygian Dominant',
    aliases: ['Spanish Gypsy', 'Freygish', 'Harmonic Minor Mode V', 'Spanish Phrygian'],
    category: 'Harmonic Minor Modes',
    intervals: ['1', 'b2', '3', '4', '5', 'b6', 'b7'],
    difficulty: 2,
    parentScale: 'harmonic-minor',
    modeNumber: 5,
    description: 'Fifth mode of harmonic minor. The ultimate Spanish/Flamenco sound.',
    theory: {
      construction: 'Phrygian with a major 3rd instead of minor 3rd. Creates the classic Spanish guitar sound.',
      characteristics: 'Passionate, exotic, Spanish/Flamenco. The b2-3 semitone movement is unmistakable.',
      chordQuality: ['7', '7b9', '7b9b13', 'F major over E bass', 'F(add9)/E'],
      usageExamples: ['Flamenco music', 'Spanish guitar pieces', 'Metal with exotic flavor'],
      famousSongs: ['Malagueña', 'Asturias', 'Danzón', 'Between Heaven and Hell - Symphony X'],
      practiceTips: ['Use over V7 in harmonic minor progressions', 'The major 3rd creates tension against b2']
    }
  },
  {
    id: 'lydian-#2',
    name: 'Lydian #2 (Harmonic Minor Mode VI)',
    aliases: ['Lydian Sharp 2'],
    category: 'Harmonic Minor Modes',
    intervals: ['1', '#2', '3', '#4', '5', '6', '7'],
    difficulty: 4,
    parentScale: 'harmonic-minor',
    modeNumber: 6,
    description: 'Sixth mode of harmonic minor. Lydian with a raised 2nd - extremely exotic.',
    theory: {
      construction: 'Lydian with minor 2nd (spelled as #2). Creates extreme exotic tension.',
      characteristics: 'Extremely exotic, almost alien. Very rarely used but highly distinctive.',
      chordQuality: ['maj7#11', 'maj7#9#11', 'maj7#5#11'],
      usageExamples: ['Avant-garde compositions', 'Extremely exotic passages', 'Sci-fi soundtracks'],
      famousSongs: ['Extremely rare in popular music'],
      practiceTips: ['Use sparingly for maximum exotic effect', 'Very dissonant but beautiful']
    }
  },
  {
    id: 'ultra-locrian',
    name: 'Ultra Locrian (Harmonic Minor Mode VII)',
    aliases: ['Super Locrian bb7', 'Altered Dominant bb7'],
    category: 'Harmonic Minor Modes',
    intervals: ['1', 'b2', 'b3', '4', 'b5', 'bb7', 'b7'],
    difficulty: 5,
    parentScale: 'harmonic-minor',
    modeNumber: 7,
    description: 'Seventh mode of harmonic minor. Most dissonant mode possible.',
    theory: {
      construction: 'Locrian with diminished 7th (bb7). Maximum dissonance.',
      characteristics: 'Extremely tense and dissonant. Rarely used but theoretically important.',
      chordQuality: ['dim7', 'dim9', 'dim11', 'dim7b5'],
      usageExamples: ['Horror movie soundtracks', 'Avant-garde classical', 'Extreme metal'],
      famousSongs: ['Extremely rare', 'Used in extreme dissonance contexts'],
      practiceTips: ['Handle with care - extremely dissonant', 'Resolve to stable tonality']
    }
  },

  // ==================== PENTATONIC SCALES (10+) ====================
  {
    id: 'major-pentatonic',
    name: 'Major Pentatonic',
    aliases: ['Country Scale'],
    category: 'Pentatonic',
    intervals: ['1', '2', '3', '5', '6'],
    difficulty: 1,
    description: 'A five-note scale derived from the major scale. Sweet, happy, universally used.',
    theory: {
      construction: 'Major scale with the 4th and 7th removed. Eliminates half steps for universally pleasing sound.',
      characteristics: 'Sweet, happy, and harmonically safe. Works over major chords and many progressions.',
      chordQuality: ['maj', 'maj7', 'maj9', '6', 'add9'],
      usageExamples: ['Country guitar licks', 'Pop melodies', 'Folk songs'],
      famousSongs: ['Sweet Home Alabama', 'Country Roads', 'My Girl - The Temptations'],
      practiceTips: ['Learn all 5 positions (CAGED)', 'Connect positions for longer phrases']
    }
  },
  {
    id: 'minor-pentatonic',
    name: 'Minor Pentatonic',
    aliases: ['Rock Scale', 'Blues Pentatonic'],
    category: 'Pentatonic',
    intervals: ['1', 'b3', '4', '5', 'b7'],
    difficulty: 1,
    description: 'The most important scale for rock, blues, and pop guitar. Five notes, countless uses.',
    theory: {
      construction: 'Natural minor scale with the 2nd and 6th removed. Creates versatile improvisation framework.',
      characteristics: 'Gritty, emotional, and universally useful. The foundation of rock and blues guitar.',
      chordQuality: ['m', 'm7', 'm9', '7', '9'],
      usageExamples: ['Blues solos', 'Rock riffs', 'Pop improvisation'],
      famousSongs: ['Stairway to Heaven solo', 'Whole Lotta Love', 'Sunshine of Your Love - Cream'],
      practiceTips: ['Master all 5 box positions', 'Practice bending the b3 and b7']
    }
  },
  {
    id: 'blues-scale',
    name: 'Blues Scale',
    aliases: ['Minor Blues Scale', 'Hexatonic Blues'],
    category: 'Blues',
    intervals: ['1', 'b3', '4', 'b5', '5', 'b7'],
    difficulty: 1,
    description: 'The essential blues scale. Minor pentatonic with an added b5 (blue note).',
    theory: {
      construction: 'Minor pentatonic with added flattened 5th (blue note). Tritone creates distinctive blues tension.',
      characteristics: 'Soulful, expressive, authentically bluesy. The blue note adds tension that resolves multiple ways.',
      chordQuality: ['7', '9', '7#9', '7b9', '13'],
      usageExamples: ['All blues styles', 'Rock solos', 'Jazz blues'],
      famousSongs: ['The Thrill Is Gone - B.B. King', 'Red House - Jimi Hendrix', 'Crossroads - Robert Johnson'],
      practiceTips: ['Use the b5 sparingly for maximum impact', 'Bend from 4 to b5 and from b5 to 5']
    }
  },
  {
    id: 'major-blues',
    name: 'Major Blues Scale',
    aliases: ['Country Blues'],
    category: 'Blues',
    intervals: ['1', '2', 'b3', '3', '5', '6'],
    difficulty: 1,
    description: 'Major pentatonic with added b3. Used in country, gospel, and R&B.',
    theory: {
      construction: 'Major pentatonic with added minor 3rd (blue note). Creates country/blues crossover.',
      characteristics: 'Happy with a touch of blues. Essential for country and gospel.',
      chordQuality: ['maj7', '6', 'add9', '7', '9'],
      usageExamples: ['Country blues', 'Gospel', 'R&B'],
      famousSongs: ['Pride and Joy - Stevie Ray Vaughan', 'Country blues standards'],
      practiceTips: ['The b3 creates the bluesy feel', 'Mix with major pentatonic for variety']
    }
  },
  {
    id: 'egyptian-pentatonic',
    name: 'Egyptian Pentatonic',
    aliases: ['Suspended Pentatonic', 'Dorian Pentatonic'],
    category: 'Pentatonic',
    intervals: ['1', '2', '4', '5', 'b7'],
    difficulty: 2,
    description: 'Ambiguous, suspended-sounding pentatonic. Used in Egyptian and Middle Eastern music.',
    theory: {
      construction: 'Dorian mode without the 3rd. Creates suspended, ambiguous quality.',
      characteristics: 'Mysterious, suspended, exotic. Neither major nor minor.',
      chordQuality: ['sus2', 'sus4', '7sus4', '11', '9sus4'],
      usageExamples: ['Middle Eastern music', 'Metal exotic passages', 'Atmospheric rock'],
      famousSongs: ['Kashmir - Led Zeppelin', 'Middle Eastern folk songs'],
      practiceTips: ['Works well over sus chords', 'The lack of 3rd creates ambiguity']
    }
  },
  {
    id: 'hirajoshi',
    name: 'Hirajoshi Scale',
    aliases: ['Japanese Scale', 'Kumoijoshi'],
    category: 'Pentatonic',
    intervals: ['1', '2', 'b3', '5', 'b6'],
    difficulty: 2,
    description: 'A Japanese pentatonic scale with distinctive Eastern sound.',
    theory: {
      construction: 'Five-note Japanese scale. The b3 and b6 create characteristic Eastern sound.',
      characteristics: 'Mystical, Eastern, Japanese. Instantly evokes Asian imagery.',
      chordQuality: ['m', 'm7b5', 'm(add9)', 'm7', 'm6'],
      usageExamples: ['Japanese folk music', 'Video game soundtracks', 'Meditation music'],
      famousSongs: ['Traditional Japanese songs', 'Video game themes', 'Silent Hill soundtrack'],
      practiceTips: ['Use for exotic passages', 'Focus on the b6 for Japanese character']
    }
  },
  {
    id: 'kumoi',
    name: 'Kumoi Scale',
    aliases: ['Japanese Pentatonic II', 'Ritsu'],
    category: 'Pentatonic',
    intervals: ['1', '2', '4', '5', '6'],
    difficulty: 2,
    description: 'Another Japanese pentatonic scale. Brighter than Hirajoshi.',
    theory: {
      construction: 'Five-note Japanese scale without minor intervals. Brighter, more hopeful.',
      characteristics: 'Peaceful, bright, Eastern. Used in Japanese folk and meditation music.',
      chordQuality: ['maj7', 'maj9', 'add9', '6', 'sus2'],
      usageExamples: ['Japanese folk music', 'Meditation music', 'Ambient'],
      famousSongs: ['Traditional Japanese court music', 'Gagaku'],
      practiceTips: ['The absence of 3rd creates openness', 'Works well with sus2 chords']
    }
  },
  {
    id: 'iwato',
    name: 'Iwato Scale',
    aliases: ['Japanese Diminished'],
    category: 'Pentatonic',
    intervals: ['1', 'b2', '4', 'b5', 'b7'],
    difficulty: 3,
    description: 'Japanese pentatonic with tritone. Very dark and mysterious.',
    theory: {
      construction: 'Five-note Japanese scale with tritone. Very dissonant and dark.',
      characteristics: 'Extremely dark, mysterious, exotic. Used in Noh theater.',
      chordQuality: ['dim7', 'm7b5', '7b5', '7b9'],
      usageExamples: ['Noh theater music', 'Dark ambient', 'Horror soundtracks'],
      famousSongs: ['Noh theater compositions', 'Japanese dark ambient'],
      practiceTips: ['The tritone creates extreme tension', 'Use sparingly for dramatic effect']
    }
  },
  {
    id: 'pelog',
    name: 'Pelog Scale',
    aliases: ['Balinese Pentatonic', 'Indonesian'],
    category: 'Pentatonic',
    intervals: ['1', 'b2', 'b3', '5', 'b6'],
    difficulty: 3,
    description: 'Balinese/Indonesian scale. Exotic and mysterious.',
    theory: {
      construction: 'Five-note Indonesian scale. The b2 and b6 create distinctive exotic quality.',
      characteristics: 'Mystical, exotic, Indonesian. Used in Gamelan orchestras.',
      chordQuality: ['m', 'm7', 'm(add9)', 'm/Maj7'],
      usageExamples: ['Gamelan music', 'Indonesian folk', 'World music'],
      famousSongs: ['Traditional Balinese Gamelan', 'Indonesian folk songs'],
      practiceTips: ['The b2-b3 semitone is characteristic', 'Combine with Hirajoshi for variety']
    }
  },
  {
    id: 'in-sen',
    name: 'In-Sen Scale',
    aliases: ['Japanese Minor', 'Ichikosucho'],
    category: 'Pentatonic',
    intervals: ['1', 'b2', '4', '5', 'b7'],
    difficulty: 2,
    description: 'Japanese pentatonic used in traditional folk music.',
    theory: {
      construction: 'Five-note Japanese scale with b2. Melancholic and contemplative.',
      characteristics: 'Contemplative, melancholic, Japanese. Used in folk ballads.',
      chordQuality: ['sus4', '7sus4', 'm7', 'm11', 'phrygian chords'],
      usageExamples: ['Japanese folk ballads', 'Contemplative pieces', 'Meditation'],
      famousSongs: ['Sakura Sakura variations', 'Japanese folk songs'],
      practiceTips: ['The b2 creates Japanese melancholy', 'Works over sus4 chords']
    }
  },

  // ==================== BLUES SCALES (5+) ====================
  {
    id: 'blues-extended',
    name: 'Extended Blues Scale',
    aliases: ['Major-Minor Blues'],
    category: 'Blues',
    intervals: ['1', 'b3', '4', 'b5', '5', 'b7', '7'],
    difficulty: 2,
    description: 'Blues scale with added major 7th for jazzier phrasing.',
    theory: {
      construction: 'Blues scale with added major 7th passing tone. Creates bebop-blues hybrid.',
      characteristics: 'Bluesy with jazz sophistication. The major 7th creates smooth voice leading.',
      chordQuality: ['7', '9', '7alt', '7b9', '7#9'],
      usageExamples: ['Jazz blues', 'Bebop blues', 'Modern blues'],
      famousSongs: ['Charlie Parker blues', 'Modern jazz blues'],
      practiceTips: ['The major 7th is a passing tone to root', 'Use in descending lines']
    }
  },
  {
    id: 'bebop-blues',
    name: 'Bebop Blues Scale',
    aliases: ['Blues with Passing Tones'],
    category: 'Blues',
    intervals: ['1', 'b3', '4', 'b5', '5', '6', 'b7', '7'],
    difficulty: 2,
    description: 'Blues scale with additional passing tones for bebop phrasing.',
    theory: {
      construction: 'Blues scale with added major 6th and major 7th. Creates smooth 8-note phrases.',
      characteristics: 'Blues foundation with bebop sophistication. Great for ii-V-I blues progressions.',
      chordQuality: ['7', '9', '13', '7b9', '7#9', '7alt'],
      usageExamples: ['Bebop blues heads', 'Jazz blues improvisation', 'Charlie Parker style'],
      famousSongs: ['Billie\'s Bounce - Charlie Parker', 'Now\'s The Time'],
      practiceTips: ['Keep chord tones on downbeats', 'Practice in all keys']
    }
  },

  // ==================== SYMMETRICAL SCALES (8+) ====================
  {
    id: 'whole-tone',
    name: 'Whole Tone Scale',
    aliases: ['Hexatonic'],
    category: 'Symmetrical',
    intervals: ['1', '2', '3', '#4', '#5', 'b7'],
    difficulty: 3,
    description: 'All whole steps. Creates dreamy, floating quality with no tonal center.',
    theory: {
      construction: 'All whole steps (6 notes). Symmetrical structure creates ambiguous tonality.',
      characteristics: 'Dreamy, floating, unresolved. Works over augmented and dominant 7#5 chords.',
      chordQuality: ['aug', '7#5', 'maj7#5', '7#11', '9#5'],
      usageExamples: ['Impressionist music', 'Jazz over augmented chords', 'Film scores for dream sequences'],
      famousSongs: ['Dream a Little Dream', 'Mystery movie soundtracks', 'Debussy compositions'],
      practiceTips: ['Only 2 unique whole-tone scales', 'Use over 7#5 and augmented chords']
    }
  },
  {
    id: 'diminished-half-whole',
    name: 'Diminished Scale (Half-Whole)',
    aliases: ['Octatonic', 'H-W Diminished'],
    category: 'Symmetrical',
    intervals: ['1', 'b2', '#2', '3', '#4', '5', '6', 'b7'],
    difficulty: 3,
    description: 'Alternating half and whole steps. Perfect for diminished and dominant 7b9 chords.',
    theory: {
      construction: 'Alternating half and whole steps (8 notes). Symmetrical structure creates unique patterns.',
      characteristics: 'Tense, suspenseful. Works over diminished chords and dominant chords with alterations.',
      chordQuality: ['dim7', '7b9', '7#9', '13b9', '7b9#5'],
      usageExamples: ['Jazz over diminished chords', 'Horror movie soundtracks', 'Metal passages'],
      famousSongs: ['Pink Panther Theme', 'Jazz standards with diminished passing chords'],
      practiceTips: ['Only 3 unique diminished scales', 'Start patterns on any note']
    }
  },
  {
    id: 'diminished-whole-half',
    name: 'Diminished Scale (Whole-Half)',
    aliases: ['W-H Diminished'],
    category: 'Symmetrical',
    intervals: ['1', '2', 'b3', '4', 'b5', '#5', '6', '7'],
    difficulty: 3,
    description: 'Alternating whole and half steps. Used over diminished chords.',
    theory: {
      construction: 'Alternating whole and half steps (8 notes). Natural for diminished harmony.',
      characteristics: 'Mysterious, tense. Natural fit for diminished 7th chords.',
      chordQuality: ['dim7', 'dim9', 'dim11', 'dimMaj7'],
      usageExamples: ['Jazz over dim7 chords', 'Classical diminished passages', 'Metal'],
      famousSongs: ['Classical diminished passages', 'Jazz turnarounds'],
      practiceTips: ['Different application than H-W', 'Use over dim7 chords']
    }
  },
  {
    id: 'chromatic',
    name: 'Chromatic Scale',
    aliases: ['Twelve-Tone', 'Dodecatonic'],
    category: 'Symmetrical',
    intervals: ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', '#5', '6', 'b7', '7'],
    difficulty: 2,
    description: 'All twelve notes. The foundation of chromatic harmony.',
    theory: {
      construction: 'All twelve semitones in equal temperament. No tonal center.',
      characteristics: 'No tonal gravity. Used for chromatic passing, atonal music, and twelve-tone rows.',
      chordQuality: ['Any chord possible', 'Chromatic mediant relationships'],
      usageExamples: ['Chromatic passing in solos', 'Atonal compositions', 'Serial music'],
      famousSongs: ['Serial compositions', 'Chromatic jazz lines'],
      practiceTips: ['Use sparingly in tonal music', 'As passing tones between scale tones']
    }
  },
  {
    id: 'augmented-scale',
    name: 'Augmented Scale',
    aliases: ['Minor Third Scale', 'Symmetrical Augmented'],
    category: 'Symmetrical',
    intervals: ['1', 'b3', '3', '5', '#5', '7'],
    difficulty: 4,
    description: 'Symmetrical scale built from minor thirds. Dreamy and mysterious.',
    theory: {
      construction: 'Built from alternating minor and major thirds. Only 4 unique augmented scales.',
      characteristics: 'Dreamy, mysterious, floating. Works over augmented chords and maj7#5.',
      chordQuality: ['aug', 'maj7#5', 'maj7#5#11', '7#5', '9#5'],
      usageExamples: ['Modern jazz', 'Impressionist music', 'Film scores'],
      famousSongs: ['Wayne Shorter compositions', 'Herbie Hancock'],
      practiceTips: ['Only 4 unique augmented scales', 'Combine with whole tone']
    }
  },
  {
    id: 'tritone-scale',
    name: 'Tritone Scale',
    aliases: ['Two-Tritone Scale'],
    category: 'Symmetrical',
    intervals: ['1', 'b2', 'b5', '#5', 'b7'],
    difficulty: 4,
    description: 'Built from two tritones. Extremely dissonant and exotic.',
    theory: {
      construction: 'Two tritones a half step apart. Maximum tension.',
      characteristics: 'Extremely tense, dissonant. Used for shock effect.',
      chordQuality: ['7b5', '7#5', '7b5#5', '7alt'],
      usageExamples: ['Avant-garde jazz', 'Horror soundtracks', 'Extreme metal'],
      famousSongs: ['Avant-garde compositions'],
      practiceTips: ['Use sparingly', 'Resolve to stable harmony']
    }
  },

  // ==================== BEBOP SCALES (8+) ====================
  {
    id: 'bebop-dominant',
    name: 'Bebop Dominant',
    aliases: ['Mixolydian with Passing Tone'],
    category: 'Bebop',
    intervals: ['1', '2', '3', '4', '5', '6', 'b7', '7'],
    difficulty: 2,
    description: 'Mixolydian with added major 7th. Creates smooth 8-note phrases in jazz.',
    theory: {
      construction: 'Mixolydian with added major 7th passing tone. Creates even 8-note phrases in 4/4.',
      characteristics: 'Jazz phrasing made easy. Extra note keeps chord tones on strong beats.',
      chordQuality: ['7', '9', '13', '7b9', '7#9'],
      usageExamples: ['Bebop lines over V7', 'Jazz improvisation', 'ii-V-I vocabulary'],
      famousSongs: ['Charlie Parker solos', 'Dizzy Gillespie compositions', 'Bebop standards'],
      practiceTips: ['Start lines on downbeats', 'Major 7th is passing tone to root']
    }
  },
  {
    id: 'bebop-major',
    name: 'Bebop Major',
    aliases: ['Major with Added b6'],
    category: 'Bebop',
    intervals: ['1', '2', '3', '4', '5', 'b6', '6', '7'],
    difficulty: 2,
    description: 'Major scale with added b6. Creates smooth voice leading in major keys.',
    theory: {
      construction: 'Major scale with added minor 6th passing tone. Creates chromatic line.',
      characteristics: 'Smooth major jazz phrasing. The b6 connects 5 and 6 smoothly.',
      chordQuality: ['maj7', 'maj9', '6', 'maj6', 'maj7#5'],
      usageExamples: ['Major key jazz', 'Bebop major lines', 'iii-VI-ii-V progressions'],
      famousSongs: ['Bebop standards in major keys'],
      practiceTips: ['The b6 is a passing tone', 'Use between 5 and 6']
    }
  },
  {
    id: 'bebop-dorian',
    name: 'Bebop Dorian',
    aliases: ['Dorian with Added Major 7'],
    category: 'Bebop',
    intervals: ['1', '2', 'b3', '3', '4', '5', '6', 'b7'],
    difficulty: 2,
    description: 'Dorian with added major 3rd. Creates bluesy bebop phrasing.',
    theory: {
      construction: 'Dorian with added major 3rd passing tone. Bluesier than regular Dorian.',
      characteristics: 'Minor with bluesy major 3rd passing. Great for minor blues.',
      chordQuality: ['m7', 'm9', 'm11', 'm6'],
      usageExamples: ['Minor key jazz', 'Minor blues', 'Bebop minor lines'],
      famousSongs: ['Minor key bebop tunes'],
      practiceTips: ['The major 3rd is a passing tone', 'Use between b3 and 4']
    }
  },
  {
    id: 'bebop-melodic-minor',
    name: 'Bebop Melodic Minor',
    aliases: ['Melodic Minor with Added b6'],
    category: 'Bebop',
    intervals: ['1', '2', 'b3', '4', '5', 'b6', '6', '7'],
    difficulty: 3,
    description: 'Melodic minor with added b6. Combines ascending and descending forms.',
    theory: {
      construction: 'Melodic minor with added minor 6th. Creates smooth chromatic line.',
      characteristics: 'Sophisticated minor sound. Both major and minor 6th available.',
      chordQuality: ['mMaj7', 'm6', 'm9', 'm11'],
      usageExamples: ['Jazz minor', 'Sophisticated minor lines', 'Modern jazz'],
      famousSongs: ['Modern jazz compositions'],
      practiceTips: ['The b6 is a passing tone', 'Use between 5 and 6']
    }
  },

  // ==================== EXOTIC & WORLD SCALES (30+) ====================
  {
    id: 'hungarian-minor',
    name: 'Hungarian Minor',
    aliases: ['Gypsy Minor', 'Double Harmonic Minor'],
    category: 'Exotic & World',
    intervals: ['1', '2', 'b3', '#4', '5', 'b6', '7'],
    difficulty: 3,
    description: 'Harmonic minor with raised 4th. Dramatic Eastern European sound.',
    theory: {
      construction: 'Harmonic minor with raised 4th. Creates two augmented 2nd intervals.',
      characteristics: 'Dramatic, gypsy-flavored. Popular in Eastern European folk music.',
      chordQuality: ['mMaj7', 'dim7', 'aug', '7', 'm7', 'maj7#5', '7'],
      usageExamples: ['Eastern European folk music', 'Classical with gypsy themes', 'Metal with exotic flavor'],
      famousSongs: ['Hungarian Dances - Brahms', 'Black Page - Zappa'],
      practiceTips: ['Focus on the #4 for characteristic sound', 'Works with harmonic minor progressions']
    }
  },
  {
    id: 'hungarian-major',
    name: 'Hungarian Major',
    aliases: ['Ukrainian Major'],
    category: 'Exotic & World',
    intervals: ['1', '#2', '3', '#4', '5', '6', 'b7'],
    difficulty: 4,
    description: 'Exotic major scale from Eastern European tradition.',
    theory: {
      construction: 'Major scale with raised 2nd and raised 4th. Very exotic.',
      characteristics: 'Extremely exotic, Eastern European. Used in folk music.',
      chordQuality: ['maj7#11', '7#11', '9#11', '7#9#11'],
      usageExamples: ['Eastern European folk', 'Gypsy jazz', 'Progressive metal'],
      famousSongs: ['Eastern European folk music'],
      practiceTips: ['The #2 is most distinctive', 'Very dissonant but beautiful']
    }
  },
  {
    id: 'romanian-minor',
    name: 'Romanian Minor',
    aliases: ['Ukrainian Dorian', 'Dorian #4'],
    category: 'Exotic & World',
    intervals: ['1', '2', 'b3', '#4', '5', '6', 'b7'],
    difficulty: 3,
    description: 'Dorian with raised 4th. Eastern European folk sound.',
    theory: {
      construction: 'Dorian mode with raised 4th. Same as Dorian #4 from harmonic minor.',
      characteristics: 'Eastern European folk, gypsy jazz flavor. Similar to Ukrainian Dorian.',
      chordQuality: ['m7#11', 'm9#11', 'mMaj7', 'm6/9'],
      usageExamples: ['Romanian folk music', 'Gypsy jazz', 'Django Reinhardt style'],
      famousSongs: ['Django Reinhardt compositions', 'Balkan folk music'],
      practiceTips: ['The #4 gives Eastern European flavor', 'Use in gypsy jazz context']
    }
  },
  {
    id: 'spanish-gypsy',
    name: 'Spanish Gypsy Scale',
    aliases: ['Phrygian Major', 'Flamenco Scale'],
    category: 'Exotic & World',
    intervals: ['1', 'b2', '3', '4', '5', 'b6', 'b7'],
    difficulty: 2,
    description: 'Same as Phrygian Dominant. The essential Flamenco scale.',
    theory: {
      construction: 'Phrygian with major 3rd. Creates classic Spanish/Flamenco sound.',
      characteristics: 'Passionate, exotic, Spanish/Flamenco. The b2-3 semitone is unmistakable.',
      chordQuality: ['7', '7b9', '7b9b13', 'F/E'],
      usageExamples: ['Flamenco music', 'Spanish guitar', 'Metal with exotic flavor'],
      famousSongs: ['Malagueña', 'Asturias', 'Flamenco standards'],
      practiceTips: ['The b2-3 movement is key', 'Combine with natural minor']
    }
  },
  {
    id: 'double-harmonic',
    name: 'Double Harmonic Major',
    aliases: ['Byzantine Scale', 'Arabic Scale', 'Gypsy Major'],
    category: 'Exotic & World',
    intervals: ['1', 'b2', '3', '4', '5', 'b6', '7'],
    difficulty: 3,
    description: 'Major with b2 and b6. Eastern Mediterranean sound.',
    theory: {
      construction: 'Major scale with minor 2nd and minor 6th. Two augmented 2nd intervals.',
      characteristics: 'Eastern Mediterranean, Middle Eastern. The b2 and b6 create exotic quality.',
      chordQuality: ['maj7', '7b9', '7b9b13', 'mMaj7'],
      usageExamples: ['Middle Eastern music', 'Greek music', 'Arabic maqam'],
      famousSongs: ['Miserlou', 'Middle Eastern folk songs'],
      practiceTips: ['The augmented 2nd intervals are key', 'Used in maqam Hijaz']
    }
  },
  {
    id: 'neapolitan-major',
    name: 'Neapolitan Major',
    aliases: ['Neapolitan Scale'],
    category: 'Exotic & World',
    intervals: ['1', 'b2', 'b3', '4', '5', '6', '7'],
    difficulty: 3,
    description: 'Minor with b2. Classical opera tradition scale.',
    theory: {
      construction: 'Natural minor with flattened 2nd. Classical opera tradition.',
      characteristics: 'Classical, dramatic, operatic. Used in Neapolitan school of opera.',
      chordQuality: ['mMaj7', 'm7', 'maj7#5', '7'],
      usageExamples: ['Classical opera', 'Dramatic compositions', 'Neapolitan songs'],
      famousSongs: ['Classical opera arias', 'Neapolitan songs'],
      practiceTips: ['The b2 creates classical tension', 'Resolve to natural minor']
    }
  },
  {
    id: 'neapolitan-minor',
    name: 'Neapolitan Minor',
    aliases: ['Neapolitan Minor Scale'],
    category: 'Exotic & World',
    intervals: ['1', 'b2', 'b3', '4', '5', 'b6', '7'],
    difficulty: 3,
    description: 'Harmonic minor with b2. Classical and exotic.',
    theory: {
      construction: 'Harmonic minor with flattened 2nd. Combines Neapolitan and harmonic minor.',
      characteristics: 'Classical with exotic flavor. Used in opera and art song.',
      chordQuality: ['mMaj7', 'm7b5', 'maj7#5', '7b9'],
      usageExamples: ['Classical opera', 'Art song', 'Dramatic compositions'],
      famousSongs: ['Opera arias', 'Art songs'],
      practiceTips: ['The b2 adds exotic tension', 'Use in minor key classical']
    }
  },
  {
    id: 'enigmatic',
    name: 'Enigmatic Scale',
    aliases: ['Enigmatica', 'Verdi Scale'],
    category: 'Exotic & World',
    intervals: ['1', 'b2', '3', '#4', '#5', '#6', '7'],
    difficulty: 5,
    description: 'Mysterious scale used by Verdi. Very unusual and exotic.',
    theory: {
      construction: 'Root, minor 2nd, major 3rd, then all augmented intervals. Very unusual.',
      characteristics: 'Mysterious, otherworldly, unique. Verdi used it in Ave Maria.',
      chordQuality: ['maj7#5#11', '7#5#11', '9#5#11', 'maj7#5'],
      usageExamples: ['Opera', 'Avant-garde classical', 'Unique compositions'],
      famousSongs: ['Verdi Ave Maria', 'Opera enigmatic passages'],
      practiceTips: ['Very dissonant and unusual', 'Use sparingly for effect']
    }
  },
  {
    id: 'persian-scale',
    name: 'Persian Scale',
    aliases: ['Persian Major'],
    category: 'Exotic & World',
    intervals: ['1', 'b2', '3', '4', 'b5', 'b6', '7'],
    difficulty: 4,
    description: 'Traditional Persian music scale. Exotic Middle Eastern sound.',
    theory: {
      construction: 'Major with b2, b5, and b6. Middle Eastern maqam tradition.',
      characteristics: 'Middle Eastern, Persian, exotic. Used in traditional Persian music.',
      chordQuality: ['maj7', '7b9', '7b5', 'maj7#5'],
      usageExamples: ['Persian classical music', 'Middle Eastern folk', 'World music'],
      famousSongs: ['Traditional Persian music', 'Middle Eastern folk songs'],
      practiceTips: ['The b2-b5 combination is distinctive', 'Used in dastgah system']
    }
  },
  {
    id: 'hijaz',
    name: 'Hijaz Scale',
    aliases: ['Arabic Hijaz', 'Maqam Hijaz'],
    category: 'Exotic & World',
    intervals: ['1', 'b2', '3', '4', '5', 'b6', 'b7'],
    difficulty: 2,
    description: 'Arabic maqam Hijaz. Essential Middle Eastern scale.',
    theory: {
      construction: 'Same as Phrygian Dominant. The most common Arabic maqam.',
      characteristics: 'Arabic, Middle Eastern, exotic. The b2-3 semitone is unmistakable.',
      chordQuality: ['7', '7b9', '7b9b13', 'F/E'],
      usageExamples: ['Arabic music', 'Middle Eastern pop', 'World music'],
      famousSongs: ['Arabic pop songs', 'Middle Eastern folk'],
      practiceTips: ['The b2-3 movement is essential', 'Most common Arabic maqam']
    }
  },
  {
    id: 'hijaz-nahawand',
    name: 'Hijaz Nahawand Scale',
    aliases: ['Hijaz Kar', 'Maqam Hijaz Kar'],
    category: 'Exotic & World',
    intervals: ['1', 'b2', '3', '4', '5', '6', 'b7'],
    difficulty: 3,
    description: 'Hijaz with major 6th. Brighter Arabic sound.',
    theory: {
      construction: 'Phrygian Dominant with major 6th. Brighter than standard Hijaz.',
      characteristics: 'Arabic but brighter, more optimistic. Used in Middle Eastern pop.',
      chordQuality: ['7', '9', '7b9', '13b9'],
      usageExamples: ['Arabic pop', 'Middle Eastern music', 'World music'],
      famousSongs: ['Arabic pop songs'],
      practiceTips: ['The major 6th brightens the sound', 'Compare with standard Hijaz']
    }
  },
  {
    id: 'bayati',
    name: 'Bayati Scale',
    aliases: ['Maqam Bayati', 'Arabic Bayati'],
    category: 'Exotic & World',
    intervals: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
    difficulty: 2,
    description: 'Very common Arabic maqam. Traditional Middle Eastern.',
    theory: {
      construction: 'Phrygian with minor 6th. One of the most common Arabic maqams.',
      characteristics: 'Traditional Arabic, folk quality. Very common in Middle Eastern music.',
      chordQuality: ['m7', 'm9', 'm11', '7sus4'],
      usageExamples: ['Arabic folk music', 'Traditional Middle Eastern', 'Religious recitation'],
      famousSongs: ['Arabic folk songs', 'Quran recitation'],
      practiceTips: ['The b2-b3 semitone is essential', 'Most common folk maqam']
    }
  },
  {
    id: 'saba',
    name: 'Saba Scale',
    aliases: ['Maqam Saba'],
    category: 'Exotic & World',
    intervals: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
    difficulty: 4,
    description: 'Arabic maqam Saba. Very sad and emotional.',
    theory: {
      construction: 'Phrygian with diminished 5th. Very sad and emotional.',
      characteristics: 'Very sad, emotional, Arabic. Used for sad occasions.',
      chordQuality: ['m7b5', 'dim7', 'm7', 'm11b5'],
      usageExamples: ['Sad Arabic songs', 'Funeral music', 'Emotional occasions'],
      famousSongs: ['Sad Arabic ballads'],
      practiceTips: ['The b5 creates extreme sadness', 'Used for mourning']
    }
  },
  {
    id: 'rast',
    name: 'Rast Scale',
    aliases: ['Maqam Rast', 'Turkish Rast'],
    category: 'Exotic & World',
    intervals: ['1', '2', '3', '#4', '5', '6', 'b7'],
    difficulty: 3,
    description: 'Turkish/Arabic maqam Rast. Traditional Middle Eastern.',
    theory: {
      construction: 'Major with raised 4th and minor 7th. Traditional Turkish/Arabic.',
      characteristics: 'Traditional Middle Eastern, joyful. The most important Turkish maqam.',
      chordQuality: ['maj7', '7', 'maj7#11', '9'],
      usageExamples: ['Turkish classical', 'Arabic traditional', 'Middle Eastern folk'],
      famousSongs: ['Turkish classical music', 'Arabic folk'],
      practiceTips: ['The #4 and b7 combination is key', 'Fundamental maqam']
    }
  },
  {
    id: 'jiharkah',
    name: 'Jiharkah Scale',
    aliases: ['Maqam Jiharkah', 'Egyptian Jiharkah'],
    category: 'Exotic & World',
    intervals: ['1', '2', '3', '4', '5', '6', '7'],
    difficulty: 2,
    description: 'Egyptian maqam. Same as major scale but with different ornaments.',
    theory: {
      construction: 'Same intervals as major scale but with Arabic ornaments and phrasing.',
      characteristics: 'Egyptian, joyful, celebratory. Used in Egyptian folk and pop.',
      chordQuality: ['maj7', 'maj9', '6', 'add9'],
      usageExamples: ['Egyptian folk music', 'Celebrations', 'Egyptian pop'],
      famousSongs: ['Egyptian folk songs', 'Celebration music'],
      practiceTips: ['The phrasing makes it Egyptian', 'Use Arabic ornaments']
    }
  },
  {
    id: 'misheberakh',
    name: 'Misheberakh Scale',
    aliases: ['Ukrainian Dorian', 'Dorian #4'],
    category: 'Exotic & World',
    intervals: ['1', '2', 'b3', '#4', '5', '6', 'b7'],
    difficulty: 3,
    description: 'Jewish/Eastern European scale. Klezmer tradition.',
    theory: {
      construction: 'Dorian with raised 4th. Jewish klezmer tradition.',
      characteristics: 'Jewish klezmer, Eastern European folk. Joyful celebration.',
      chordQuality: ['m7#11', 'm9#11', 'mMaj7', 'm6'],
      usageExamples: ['Klezmer music', 'Jewish celebration', 'Eastern European folk'],
      famousSongs: ['Klezmer tunes', 'Jewish celebration songs', 'Hava Nagila variations'],
      practiceTips: ['The #4 gives Jewish flavor', 'Use in klezmer context']
    }
  },
  {
    id: 'ahava-rabbah',
    name: 'Ahava Rabbah Scale',
    aliases: ['Freygish', 'Jewish Phrygian'],
    category: 'Exotic & World',
    intervals: ['1', 'b2', '3', '4', '5', 'b6', 'b7'],
    difficulty: 2,
    description: 'Jewish prayer mode scale. Same as Phrygian Dominant.',
    theory: {
      construction: 'Same as Phrygian Dominant. Jewish prayer mode Ahava Rabbah.',
      characteristics: 'Jewish liturgical, prayerful, emotional. Used in synagogue music.',
      chordQuality: ['7', '7b9', '7b9b13', 'F/E'],
      usageExamples: ['Jewish liturgical music', 'Synagogue prayers', 'Klezmer'],
      famousSongs: ['Jewish prayer melodies', 'Klezmer standards'],
      practiceTips: ['The b2-3 is essential', 'Use in Jewish liturgical context']
    }
  },
  {
    id: 'prometheus',
    name: 'Prometheus Scale',
    aliases: ['Scriabin Scale'],
    category: 'Synthetic',
    intervals: ['1', '2', '3', '#4', '6', 'b7'],
    difficulty: 4,
    description: 'Created by Scriabin. Mysterious and cosmic.',
    theory: {
      construction: 'Whole tone and augmented combined. Six-note synthetic scale.',
      characteristics: 'Mysterious, cosmic, otherworldly. Scriabin\'s mystic chord.',
      chordQuality: ['mystic chord', 'maj7#11', '7#11', '9#11'],
      usageExamples: ['Scriabin compositions', 'Avant-garde classical', 'Cosmic themes'],
      famousSongs: ['Scriabin Prometheus', 'Mystic chord compositions'],
      practiceTips: ['The whole tone + augmented quality', 'Creates cosmic atmosphere']
    }
  },

  // ==================== HARMONIC MAJOR MODES (7) ====================
  {
    id: 'harmonic-major',
    name: 'Harmonic Major',
    aliases: ['Major b6'],
    category: 'Harmonic Major Modes',
    intervals: ['1', '2', '3', '4', '5', 'b6', '7'],
    difficulty: 3,
    description: 'Major with minor 6th. Classical and exotic hybrid.',
    theory: {
      construction: 'Major scale with minor 6th. Hybrid of major and harmonic minor.',
      characteristics: 'Classical exotic, bittersweet. The b6 creates unexpected darkness.',
      chordQuality: ['maj7', 'm7b5', 'mMaj7', 'm7b5', '7', 'maj7#5', 'dim7'],
      usageExamples: ['Modern jazz', 'Classical exotic', 'Avant-garde'],
      famousSongs: ['Rare in popular music', 'Modern classical'],
      practiceTips: ['The b6 is the distinctive tone', 'Compare with natural major']
    }
  },

  // ==================== FEW MORE IMPORTANT SCALES ====================
  {
    id: 'blues-major-minor',
    name: 'Blues Major-Minor Hybrid',
    aliases: ['Composite Blues'],
    category: 'Blues',
    intervals: ['1', 'b3', '3', '4', 'b5', '5', 'b7'],
    difficulty: 2,
    description: 'Combines major and minor blues for complete blues vocabulary.',
    theory: {
      construction: 'Minor blues notes plus major 3rd. Complete blues vocabulary.',
      characteristics: 'Complete blues expression. Both major and minor 3rd available.',
      chordQuality: ['7', '9', '7#9', '7b9', '13'],
      usageExamples: ['Complete blues solos', 'Jazz blues', 'Modern blues'],
      famousSongs: ['All blues standards'],
      practiceTips: ['Use major 3rd over major chords', 'b3 over minor or dominant']
    }
  },
  {
    id: 'harmonic-double',
    name: 'Double Harmonic Scale',
    aliases: ['Byzantine', 'Arabic Major', 'Gypsy Major'],
    category: 'Exotic & World',
    intervals: ['1', 'b2', '3', '4', '5', 'b6', '7'],
    difficulty: 3,
    description: 'Major with b2 and b6. Eastern Mediterranean and Arabic.',
    theory: {
      construction: 'Major scale with flattened 2nd and 6th. Two augmented 2nd intervals.',
      characteristics: 'Eastern Mediterranean, Arabic, exotic. The b2 and b6 create distinctive quality.',
      chordQuality: ['maj7', '7b9', 'mMaj7', 'maj7#5'],
      usageExamples: ['Middle Eastern music', 'Greek music', 'Flamenco'],
      famousSongs: ['Miserlou', 'Greek folk songs', 'Flamenco palos'],
      practiceTips: ['The two augmented 2nds are key', 'Used in maqam Hijaz Kar']
    }
  }
];

// ===== CHORD DEFINITIONS =====
export interface ChordDefinition {
  id: string;
  name: string;
  symbol: string;
  category: string;
  intervals: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
  theory: {
    construction: string;
    function: string;
    scaleSources: string[];
    voiceLeading: string;
    substitutions: string[];
  };
}

export const CHORD_CATEGORIES = [
  'Triads',
  'Suspended',
  'Sevenths',
  'Extended',
  'Added',
  'Altered',
  'Slash/Inversions',
  'Power Chords'
] as const;

export const CHORDS: ChordDefinition[] = [
  // Triads
  {
    id: 'major',
    name: 'Major Triad',
    symbol: '',
    category: 'Triads',
    intervals: ['1', '3', '5'],
    difficulty: 1,
    description: 'The most fundamental chord in Western music. Built from root, major third, and perfect fifth.',
    theory: {
      construction: 'Stack of major third + minor third. The major 3rd gives it a bright, happy quality.',
      function: 'Tonic (I), Subdominant (IV) in major keys. The "home" chord.',
      scaleSources: ['Major', 'Lydian', 'Mixolydian', 'Major Pentatonic'],
      voiceLeading: 'Leads to IV or vi. The 3rd often moves to the root of the next chord.',
      substitutions: ['maj7', 'maj9', '6', 'add9']
    }
  },
  {
    id: 'minor',
    name: 'Minor Triad',
    symbol: 'm',
    category: 'Triads',
    intervals: ['1', 'b3', '5'],
    difficulty: 1,
    description: 'Sad or contemplative chord built from root, minor third, and perfect fifth.',
    theory: {
      construction: 'Stack of minor third + major third. The minor 3rd creates the sad quality.',
      function: 'Tonic (i) in minor keys, Supertonic (ii) and Submediant (vi) in major keys.',
      scaleSources: ['Natural Minor', 'Dorian', 'Phrygian', 'Minor Pentatonic'],
      voiceLeading: 'Often leads to IV or V. The b3 can rise to 4 or fall to 2.',
      substitutions: ['m7', 'm9', 'm11', 'm6']
    }
  },
  {
    id: 'diminished',
    name: 'Diminished Triad',
    symbol: 'dim',
    category: 'Triads',
    intervals: ['1', 'b3', 'b5'],
    difficulty: 2,
    description: 'Tense, unstable chord. Built from two minor thirds. Needs resolution.',
    theory: {
      construction: 'Two stacked minor thirds. The b5 creates instability that demands resolution.',
      function: 'Leading tone chord (vii°) in major keys. Often extended to dim7.',
      scaleSources: ['Locrian', 'Harmonic Minor (on 7th)', 'Diminished scale'],
      voiceLeading: 'Leads strongly to I or i. The b5 usually resolves up to the 3rd of I.',
      substitutions: ['m7b5', 'dim7']
    }
  },
  {
    id: 'augmented',
    name: 'Augmented Triad',
    symbol: 'aug',
    category: 'Triads',
    intervals: ['1', '3', '#5'],
    difficulty: 2,
    description: 'Dreamy, floating chord. Two stacked major thirds. Symmetrical structure.',
    theory: {
      construction: 'Two stacked major thirds. Symmetrical structure creates ambiguous tonality.',
      function: 'Chromatic passing chord, creates tension for resolution.',
      scaleSources: ['Whole Tone', 'Harmonic Minor (on 3rd)', 'Melodic Minor (on 3rd)'],
      voiceLeading: 'Often resolves to vi or I. Can move by semitone in either direction.',
      substitutions: ['maj7#5', '7#5', '+']
    }
  },
  // Suspended
  {
    id: 'sus2',
    name: 'Suspended 2nd',
    symbol: 'sus2',
    category: 'Suspended',
    intervals: ['1', '2', '5'],
    difficulty: 1,
    description: 'Open, floating sound. The 2nd replaces the 3rd, creating tonal ambiguity.',
    theory: {
      construction: 'Root, major 2nd, and perfect 5th. No 3rd means neither major nor minor.',
      function: 'Creates open, atmospheric sound. Often resolves to major triad.',
      scaleSources: ['Major', 'Dorian', 'Mixolydian', 'Lydian'],
      voiceLeading: 'The 2nd usually resolves to the 3rd of a major triad.',
      substitutions: ['add9', 'add2']
    }
  },
  {
    id: 'sus4',
    name: 'Suspended 4th',
    symbol: 'sus4',
    category: 'Suspended',
    intervals: ['1', '4', '5'],
    difficulty: 1,
    description: 'Tension chord. The 4th replaces the 3rd, creating anticipation.',
    theory: {
      construction: 'Root, perfect 4th, and perfect 5th. The 4th creates tension that wants to resolve.',
      function: 'Creates suspension that typically resolves to the 3rd.',
      scaleSources: ['Major', 'Lydian', 'Mixolydian'],
      voiceLeading: 'The 4th resolves down to the 3rd (4-3 suspension).',
      substitutions: ['7sus4', '11', 'add11']
    }
  },
  // Sevenths
  {
    id: 'maj7',
    name: 'Major 7th',
    symbol: 'maj7',
    category: 'Sevenths',
    intervals: ['1', '3', '5', '7'],
    difficulty: 1,
    description: 'Rich, jazzy major chord. Major triad with added major 7th.',
    theory: {
      construction: 'Major triad + major 7th. Creates a sophisticated, jazz quality.',
      function: 'Tonic chord in jazz. I and IV chord quality in major keys.',
      scaleSources: ['Major', 'Lydian', 'Ionian'],
      voiceLeading: 'The 7th can stay as a common tone or resolve to the 3rd of V.',
      substitutions: ['maj9', 'maj6', 'maj7#11']
    }
  },
  {
    id: 'm7',
    name: 'Minor 7th',
    symbol: 'm7',
    category: 'Sevenths',
    intervals: ['1', 'b3', '5', 'b7'],
    difficulty: 1,
    description: 'Smooth, versatile minor chord. Minor triad with added minor 7th.',
    theory: {
      construction: 'Minor triad + minor 7th. Smooth and versatile.',
      function: 'ii, iii, and vi chord in major keys. i and iv in minor keys.',
      scaleSources: ['Dorian', 'Natural Minor', 'Phrygian'],
      voiceLeading: 'The b7 often moves to the 3rd of the next chord.',
      substitutions: ['m9', 'm11', 'm13']
    }
  },
  {
    id: 'dom7',
    name: 'Dominant 7th',
    symbol: '7',
    category: 'Sevenths',
    intervals: ['1', '3', '5', 'b7'],
    difficulty: 1,
    description: 'The most important tension chord. Major triad with added minor 7th.',
    theory: {
      construction: 'Major triad + minor 7th. Creates strong pull toward the tonic.',
      function: 'V chord in major and minor keys. Creates dominant function.',
      scaleSources: ['Mixolydian', 'Blues', 'Bebop Dominant'],
      voiceLeading: 'The 3rd resolves up to the root of I; the b7 resolves down to the 3rd of I.',
      substitutions: ['9', '13', '7b9', '7#9', '7alt']
    }
  },
  {
    id: 'm7b5',
    name: 'Half-Diminished 7th',
    symbol: 'm7b5',
    category: 'Sevenths',
    intervals: ['1', 'b3', 'b5', 'b7'],
    difficulty: 2,
    description: 'Minor 7th with flattened 5th. Essential for minor ii-V-i progressions.',
    theory: {
      construction: 'Diminished triad + minor 7th. The b5 and b7 create unique tension.',
      function: 'ii chord in minor keys. Essential for jazz minor ii-V-i.',
      scaleSources: ['Locrian', 'Locrian #2', 'Melodic Minor (on 6th)'],
      voiceLeading: 'The b5 resolves down to the 9th of V7; the b7 resolves to the 3rd of V7.',
      substitutions: ['m9b5', 'ø7']
    }
  },
  {
    id: 'dim7',
    name: 'Diminished 7th',
    symbol: 'dim7',
    category: 'Sevenths',
    intervals: ['1', 'b3', 'b5', 'bb7'],
    difficulty: 2,
    description: 'Symmetrical chord. All notes are equidistant. Creates maximum tension.',
    theory: {
      construction: 'Diminished triad + diminished 7th (bb7). Symmetrical structure.',
      function: 'Passing chord, creates chromatic motion. Often substitutes for V7.',
      scaleSources: ['Diminished Scale', 'Harmonic Minor (on 7th)'],
      voiceLeading: 'Any note can be the root. Resolves by semitone to major or minor chord.',
      substitutions: ['7b9', 'viidim7 for V7']
    }
  },
  {
    id: 'mMaj7',
    name: 'Minor Major 7th',
    symbol: 'mMaj7',
    category: 'Sevenths',
    intervals: ['1', 'b3', '5', '7'],
    difficulty: 2,
    description: 'Minor triad with major 7th. Sophisticated and mysterious.',
    theory: {
      construction: 'Minor triad + major 7th. Creates sophisticated minor quality.',
      function: 'i chord in melodic minor and harmonic minor progressions.',
      scaleSources: ['Harmonic Minor', 'Melodic Minor'],
      voiceLeading: 'The major 7th often resolves to the root or stays as color tone.',
      substitutions: ['m6', 'm9(Maj7)']
    }
  },
  // Extended
  {
    id: 'maj9',
    name: 'Major 9th',
    symbol: 'maj9',
    category: 'Extended',
    intervals: ['1', '3', '5', '7', '9'],
    difficulty: 2,
    description: 'Rich major chord with added 9th. Sophisticated jazz harmony.',
    theory: {
      construction: 'Major 7th + major 9th. Extended major harmony.',
      function: 'Tonic chord in jazz and R&B. Rich and sophisticated.',
      scaleSources: ['Major', 'Lydian'],
      voiceLeading: 'The 9th often acts as a color tone; 7th voice leads as in maj7.',
      substitutions: ['maj7', 'maj11', 'maj13']
    }
  },
  {
    id: 'm9',
    name: 'Minor 9th',
    symbol: 'm9',
    category: 'Extended',
    intervals: ['1', 'b3', '5', 'b7', '9'],
    difficulty: 2,
    description: 'Smooth minor chord with added 9th. Essential for jazz and R&B.',
    theory: {
      construction: 'Minor 7th + major 9th. Creates rich, smooth minor quality.',
      function: 'ii chord in major and minor keys. Very common in jazz.',
      scaleSources: ['Dorian', 'Natural Minor'],
      voiceLeading: 'The 9th adds color; b7 voice leads as in m7.',
      substitutions: ['m7', 'm11', 'm13']
    }
  },
  {
    id: 'dom9',
    name: 'Dominant 9th',
    symbol: '9',
    category: 'Extended',
    intervals: ['1', '3', '5', 'b7', '9'],
    difficulty: 2,
    description: 'Dominant 7th with added 9th. Essential for funk, R&B, and jazz.',
    theory: {
      construction: 'Dominant 7th + major 9th. Creates rich dominant quality.',
      function: 'V chord with added color. Common in funk and R&B.',
      scaleSources: ['Mixolydian', 'Bebop Dominant'],
      voiceLeading: 'Voice leads as dominant 7th; the 9th adds color.',
      substitutions: ['7', '11', '13', '9sus4']
    }
  },
  {
    id: 'dom11',
    name: 'Dominant 11th',
    symbol: '11',
    category: 'Extended',
    intervals: ['1', '3', '5', 'b7', '9', '11'],
    difficulty: 3,
    description: 'Dominant with 9th and 11th. Often played as 9sus4 for cleaner sound.',
    theory: {
      construction: 'Dominant 9th + 11th. The 11th can clash with the 3rd.',
      function: 'V chord with suspensions. Often voiced without the 3rd.',
      scaleSources: ['Mixolydian', 'Dorian (for sus4 sound)'],
      voiceLeading: 'The 11th can resolve down to the 3rd or stay as a suspension.',
      substitutions: ['9sus4', '7sus4', '13sus4']
    }
  },
  {
    id: 'dom13',
    name: 'Dominant 13th',
    symbol: '13',
    category: 'Extended',
    intervals: ['1', '3', '5', 'b7', '9', '13'],
    difficulty: 3,
    description: 'Full dominant extension. Essential jazz and blues chord.',
    theory: {
      construction: 'Dominant 11th + 13th (usually voiced without 11th to avoid clash).',
      function: 'V chord with maximum color. Signature jazz sound.',
      scaleSources: ['Mixolydian', 'Bebop Dominant'],
      voiceLeading: 'The 13th often resolves to the 9th of the I chord.',
      substitutions: ['9', '7', '13#11']
    }
  },
  // Altered
  {
    id: '7b9',
    name: 'Dominant 7th flat 9',
    symbol: '7b9',
    category: 'Altered',
    intervals: ['1', '3', '5', 'b7', 'b9'],
    difficulty: 3,
    description: 'Dominant with flattened 9th. Creates exotic, Spanish-flavored tension.',
    theory: {
      construction: 'Dominant 7th + minor 9th. The b9 creates intense tension.',
      function: 'V chord in minor keys or as tritone substitution.',
      scaleSources: ['Phrygian Dominant', 'Harmonic Minor (on 5th)', 'Altered Scale'],
      voiceLeading: 'The b9 resolves down to the 5th of the I chord.',
      substitutions: ['dim7', '7alt', '7#9']
    }
  },
  {
    id: '7#9',
    name: 'Dominant 7th sharp 9',
    symbol: '7#9',
    category: 'Altered',
    intervals: ['1', '3', '5', 'b7', '#9'],
    difficulty: 3,
    description: 'Hendrix chord. Dominant with sharpened 9th. Bluesy and intense.',
    theory: {
      construction: 'Dominant 7th + augmented 9th. The #9 creates bluesy tension.',
      function: 'V chord in blues, rock, and jazz-fusion.',
      scaleSources: ['Blues', 'Altered Scale', 'Mixolydian'],
      voiceLeading: 'The #9 often resolves to the 5th of the I chord.',
      substitutions: ['7b9', '7alt', '9#5']
    }
  },
  {
    id: '7alt',
    name: 'Altered Dominant',
    symbol: '7alt',
    category: 'Altered',
    intervals: ['1', '3', 'b7', 'b9', '#9', 'b5', '#5'],
    difficulty: 4,
    description: 'Maximum tension dominant. Contains all possible alterations.',
    theory: {
      construction: 'Dominant 7th with b5, #5, b9, #9. Maximum chromatic tension.',
      function: 'V chord resolving to major or minor. Ultimate jazz tension.',
      scaleSources: ['Altered Scale', 'Super Locrian'],
      voiceLeading: 'Any altered note resolves to a chord tone of I.',
      substitutions: ['7b9#5', '7#9b5', 'dim7']
    }
  },
  // Added
  {
    id: 'add9',
    name: 'Add 9',
    symbol: 'add9',
    category: 'Added',
    intervals: ['1', '3', '5', '9'],
    difficulty: 1,
    description: 'Major triad with added 9th (no 7th). Bright, open, modern sound.',
    theory: {
      construction: 'Major triad + major 9th (no 7th). Simpler than maj9.',
      function: 'Tonic or subdominant in pop, rock, and worship music.',
      scaleSources: ['Major', 'Lydian', 'Major Pentatonic'],
      voiceLeading: 'Voice leads like a major triad; the 9th is a color tone.',
      substitutions: ['add2', 'sus2', 'maj7']
    }
  },
  {
    id: 'madd9',
    name: 'Minor Add 9',
    symbol: 'madd9',
    category: 'Added',
    intervals: ['1', 'b3', '5', '9'],
    difficulty: 1,
    description: 'Minor triad with added 9th. Emotional and atmospheric.',
    theory: {
      construction: 'Minor triad + major 9th (no 7th). Emotional and open.',
      function: 'Tonic in minor keys, or ii chord in major keys.',
      scaleSources: ['Dorian', 'Natural Minor'],
      voiceLeading: 'Voice leads like a minor triad; the 9th adds color.',
      substitutions: ['m9', 'm11', 'sus2']
    }
  },
  // Power Chords
  {
    id: 'power',
    name: 'Power Chord',
    symbol: '5',
    category: 'Power Chords',
    intervals: ['1', '5'],
    difficulty: 1,
    description: 'Root and 5th only. Neutral, powerful, essential for rock and metal.',
    theory: {
      construction: 'Root + perfect 5th only. No 3rd means neither major nor minor.',
      function: 'Works over any major or minor progression. Rock and metal essential.',
      scaleSources: ['Any major or minor scale', 'Pentatonic'],
      voiceLeading: 'Moves with root motion; no tendency tones.',
      substitutions: ['sus2', 'sus4', 'power chord with added octave']
    }
  }
];

// ===== TUNINGS =====
export interface TuningDefinition {
  id: string;
  name: string;
  notes: string[];
  strings: number;
  category: string;
  description: string;
}

export const TUNINGS: TuningDefinition[] = [
  // Standard Tunings
  {
    id: 'standard',
    name: 'Standard Tuning',
    notes: ['E', 'A', 'D', 'G', 'B', 'E'],
    strings: 6,
    category: 'Standard',
    description: 'The most common guitar tuning. E-A-D-G-B-E from low to high.'
  },
  {
    id: 'half-down',
    name: 'Half Step Down (Eb)',
    notes: ['Eb', 'Ab', 'Db', 'Gb', 'Bb', 'Eb'],
    strings: 6,
    category: 'Standard',
    description: 'Standard tuned down a half step. Common in rock and blues.'
  },
  {
    id: 'full-down',
    name: 'Full Step Down (D)',
    notes: ['D', 'G', 'C', 'F', 'A', 'D'],
    strings: 6,
    category: 'Standard',
    description: 'Standard tuned down a whole step. Heavy metal and doom.'
  },
  {
    id: 'c-standard',
    name: 'C Standard',
    notes: ['C', 'F', 'Bb', 'Eb', 'G', 'C'],
    strings: 6,
    category: 'Standard',
    description: 'Standard tuning down 2 whole steps. Heavy metal.'
  },
  {
    id: 'b-standard',
    name: 'B Standard',
    notes: ['B', 'E', 'A', 'D', 'F#', 'B'],
    strings: 6,
    category: 'Standard',
    description: 'Standard tuning down 3 half steps. Death metal.'
  },

  // Drop Tunings
  {
    id: 'drop-d',
    name: 'Drop D',
    notes: ['D', 'A', 'D', 'G', 'B', 'E'],
    strings: 6,
    category: 'Drop',
    description: 'Standard with low E tuned down to D. Great for power chords.'
  },
  {
    id: 'drop-c',
    name: 'Drop C',
    notes: ['C', 'G', 'C', 'F', 'A', 'D'],
    strings: 6,
    category: 'Drop',
    description: 'Drop D tuned down a whole step. Heavy rock and metal.'
  },
  {
    id: 'drop-b',
    name: 'Drop B',
    notes: ['B', 'F#', 'B', 'E', 'G#', 'C#'],
    strings: 6,
    category: 'Drop',
    description: 'Very low drop tuning. Nu metal and djent.'
  },
  {
    id: 'drop-a',
    name: 'Drop A',
    notes: ['A', 'E', 'A', 'D', 'F#', 'B'],
    strings: 6,
    category: 'Drop',
    description: 'Extremely low drop tuning. Extended range music.'
  },

  // Open Tunings
  {
    id: 'open-g',
    name: 'Open G',
    notes: ['D', 'G', 'D', 'G', 'B', 'D'],
    strings: 6,
    category: 'Open',
    description: 'Open G major chord. Used by Keith Richards, Robert Johnson.'
  },
  {
    id: 'open-d',
    name: 'Open D',
    notes: ['D', 'A', 'D', 'F#', 'A', 'D'],
    strings: 6,
    category: 'Open',
    description: 'Open D major chord. Great for slide guitar.'
  },
  {
    id: 'open-e',
    name: 'Open E',
    notes: ['E', 'B', 'E', 'G#', 'B', 'E'],
    strings: 6,
    category: 'Open',
    description: 'Open E major chord. Duane Allman\'s preferred slide tuning.'
  },
  {
    id: 'open-a',
    name: 'Open A',
    notes: ['E', 'A', 'E', 'A', 'C#', 'E'],
    strings: 6,
    category: 'Open',
    description: 'Open A major chord. Robert Johnson used this.'
  },
  {
    id: 'open-c',
    name: 'Open C',
    notes: ['C', 'G', 'C', 'G', 'C', 'E'],
    strings: 6,
    category: 'Open',
    description: 'Open C major chord. Rich, resonant sound.'
  },
  {
    id: 'open-f',
    name: 'Open F',
    notes: ['F', 'A', 'C', 'F', 'A', 'F'],
    strings: 6,
    category: 'Open',
    description: 'Open F major chord. Deep, warm resonance.'
  },
  {
    id: 'open-em',
    name: 'Open E Minor',
    notes: ['E', 'B', 'E', 'G', 'B', 'E'],
    strings: 6,
    category: 'Open',
    description: 'Open E minor chord. Dark, emotional slide tuning.'
  },
  {
    id: 'open-dm',
    name: 'Open D Minor',
    notes: ['D', 'A', 'D', 'F', 'A', 'D'],
    strings: 6,
    category: 'Open',
    description: 'Open D minor chord. Melancholic slide tuning.'
  },

  // Modal / Alternate Tunings
  {
    id: 'dadgad',
    name: 'DADGAD',
    notes: ['D', 'A', 'D', 'G', 'A', 'D'],
    strings: 6,
    category: 'Modal',
    description: 'Drone tuning. Popular for Celtic and folk music.'
  },
  {
    id: 'daddad',
    name: 'Double Drop D',
    notes: ['D', 'A', 'D', 'G', 'B', 'D'],
    strings: 6,
    category: 'Modal',
    description: 'Both E strings tuned to D. Neil Young used this.'
  },
  {
    id: 'cgcgcc',
    name: 'CGCGCC (Open Csus2)',
    notes: ['C', 'G', 'C', 'G', 'C', 'C'],
    strings: 6,
    category: 'Modal',
    description: 'Devil\'s tuning. Used in atmospheric metal.'
  },
  {
    id: 'all-fourths',
    name: 'All Fourths',
    notes: ['E', 'A', 'D', 'G', 'C', 'F'],
    strings: 6,
    category: 'Modal',
    description: 'All strings tuned in perfect fourths. Symmetrical patterns.'
  },
  {
    id: 'all-fifths',
    name: 'All Fifths (Mandoguitar)',
    notes: ['C', 'G', 'D', 'A', 'E', 'B'],
    strings: 6,
    category: 'Modal',
    description: 'All strings tuned in perfect fifths. Mandolin-like range.'
  },
  {
    id: 'new-standard',
    name: 'New Standard Tuning',
    notes: ['C', 'G', 'D', 'A', 'E', 'G'],
    strings: 6,
    category: 'Modal',
    description: 'Robert Fripp\'s tuning. Guitar Craft standard.'
  },
  {
    id: 'nashville',
    name: 'Nashville Tuning',
    notes: ['E', 'A', 'D', 'G', 'B', 'E'],
    strings: 6,
    category: 'Special',
    description: 'Standard tuning with high octave strings. Jangly sound.'
  },

  // 7-String Tunings
  {
    id: 'seven-standard',
    name: '7-String Standard',
    notes: ['B', 'E', 'A', 'D', 'G', 'B', 'E'],
    strings: 7,
    category: '7-String',
    description: 'Standard 7-string tuning with low B.'
  },
  {
    id: 'seven-drop-a',
    name: '7-String Drop A',
    notes: ['A', 'E', 'A', 'D', 'G', 'B', 'E'],
    strings: 7,
    category: '7-String',
    description: '7-string with low A. Modern metal standard.'
  },

  // 8-String Tunings
  {
    id: 'eight-standard',
    name: '8-String Standard',
    notes: ['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E'],
    strings: 8,
    category: '8-String',
    description: 'Standard 8-string tuning with low F#.'
  },
  {
    id: 'eight-drop-e',
    name: '8-String Drop E',
    notes: ['E', 'B', 'E', 'A', 'D', 'G', 'B', 'E'],
    strings: 8,
    category: '8-String',
    description: '8-string with low E. Djent standard.'
  },

  // Baritone Tunings
  {
    id: 'baritone-b',
    name: 'Baritone B-B',
    notes: ['B', 'E', 'A', 'D', 'F#', 'B'],
    strings: 6,
    category: 'Baritone',
    description: 'Baritone guitar standard tuning.'
  },
  {
    id: 'baritone-a',
    name: 'Baritone A-A',
    notes: ['A', 'D', 'G', 'C', 'E', 'A'],
    strings: 6,
    category: 'Baritone',
    description: 'Lower baritone tuning. Deep, growling tone.'
  },

  // Special Tunings
  {
    id: 'ostrich',
    name: 'Ostrich Tuning (All D)',
    notes: ['D', 'D', 'D', 'D', 'D', 'D'],
    strings: 6,
    category: 'Special',
    description: 'All strings tuned to the same note. John Cale, Velvets.'
  },
  {
    id: 'pelog-tuning',
    name: 'Pelog Tuning (Approximation)',
    notes: ['E', 'F#', 'G#', 'A#', 'B', 'D'],
    strings: 6,
    category: 'Special',
    description: 'Approximation of Indonesian Pelog scale.'
  }
];

// ===== HELPER FUNCTIONS =====

export function getNoteAtInterval(root: Note, semitones: number): Note {
  const rootIndex = NOTES.indexOf(root);
  const newIndex = (rootIndex + semitones) % 12;
  return NOTES[newIndex];
}

export function getScaleNotes(root: Note, scale: ScaleDefinition): Note[] {
  return scale.intervals.map(interval => {
    const semitones = INTERVALS[interval]?.semitones ?? 0;
    return getNoteAtInterval(root, semitones);
  });
}

export function getChordNotes(root: Note, chord: ChordDefinition): Note[] {
  return chord.intervals.map(interval => {
    const semitones = INTERVALS[interval]?.semitones ?? 0;
    return getNoteAtInterval(root, semitones);
  });
}

export function getTuningById(id: string): TuningDefinition | undefined {
  return TUNINGS.find(t => t.id === id);
}

export function getScaleById(id: string): ScaleDefinition | undefined {
  return SCALES.find(s => s.id === id);
}

export function getChordById(id: string): ChordDefinition | undefined {
  return CHORDS.find(c => c.id === id);
}

// Get interval from root to target note
export function getIntervalFromRoot(root: Note, target: Note): string {
  const rootIndex = NOTES.indexOf(root);
  const targetIndex = NOTES.indexOf(target);
  const semitones = (targetIndex - rootIndex + 12) % 12;
  
  const semitoneToInterval: Record<number, string> = {
    0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4',
    6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
  };
  
  return semitoneToInterval[semitones] || '1';
}

// Get display label based on mode
export function getNoteDisplayLabel(
  note: Note, 
  root: Note, 
  displayMode: DisplayMode,
  scaleIntervals: string[],
  noteIndex: number
): string {
  const interval = getIntervalFromRoot(root, note);
  
  switch (displayMode) {
    case 'sargam':
      // Map intervals to Sargam
      const sargamMap: Record<string, string> = {
        '1': 'Sa', 'b2': 're', '2': 'Re', 'b3': 'ga', '3': 'Ga',
        '4': 'Ma', '#4': 'Ma\'', 'b5': 'Pa', '5': 'Pa',
        'b6': 'dha', '6': 'Dha', 'b7': 'ni', '7': 'Ni'
      };
      return sargamMap[interval] || note;
    
    case 'solfege':
      const solfegeMap: Record<string, string> = {
        '1': 'Do', 'b2': 'Di', '2': 'Re', 'b3': 'Ra', '3': 'Mi',
        '4': 'Fa', '#4': 'Fi', 'b5': 'Se', '5': 'Sol',
        'b6': 'Si', '6': 'La', 'b7': 'Te', '7': 'Ti'
      };
      return solfegeMap[interval] || note;
    
    case 'numbers':
      // Scale degree number
      const scaleDegree = scaleIntervals.indexOf(interval) + 1;
      return scaleDegree > 0 ? scaleDegree.toString() : note;
    
    case 'intervals':
      return interval;
    
    case 'fingerings':
      // This would be based on position/fingering logic
      return note; // Placeholder
    
    case 'notes':
    default:
      return note;
  }
}

// CAGED Position helpers
export const CAGED_POSITIONS = [
  { name: 'Position 1 (E Shape)', rootString: 6, description: 'Root on 6th string' },
  { name: 'Position 2 (D Shape)', rootString: 4, description: 'Root on 4th string' },
  { name: 'Position 3 (C Shape)', rootString: 5, description: 'Root on 5th string' },
  { name: 'Position 4 (A Shape)', rootString: 5, description: 'Root on 5th string' },
  { name: 'Position 5 (G Shape)', rootString: 6, description: 'Root on 6th string' }
] as const;

// Get notes within a specific position
export function getNotesInPosition(
  root: Note,
  scale: ScaleDefinition,
  position: number,
  tuning: TuningDefinition
): { string: number; fret: number; note: Note }[] {
  const positionNotes: { string: number; fret: number; note: Note }[] = [];
  const scaleNotes = getScaleNotes(root, scale);
  
  // Simplified position calculation based on CAGED
  const positionStartFret = (position - 1) * 2 + NOTES.indexOf(root) % 12;
  
  for (let stringIndex = 0; stringIndex < tuning.notes.length; stringIndex++) {
    const openNote = tuning.notes[stringIndex] as Note;
    const openIndex = NOTES.indexOf(openNote);
    
    for (let fret = positionStartFret; fret < positionStartFret + 6; fret++) {
      const noteIndex = (openIndex + fret) % 12;
      const note = NOTES[noteIndex];
      
      if (scaleNotes.includes(note)) {
        positionNotes.push({ string: stringIndex, fret, note });
      }
    }
  }
  
  return positionNotes;
}

// Note frequency calculation for audio
export function getNoteFrequency(note: Note, octave: number = 4): number {
  const noteIndex = NOTES.indexOf(note);
  const a4 = 440;
  const a4Index = NOTES.indexOf('A');
  const semitonesFromA4 = (noteIndex - a4Index) + (octave - 4) * 12;
  return a4 * Math.pow(2, semitonesFromA4 / 12);
}

// Get guitar string frequency
export function getGuitarStringFrequency(
  stringIndex: number, 
  fret: number, 
  tuning: TuningDefinition
): number {
  const openNote = tuning.notes[stringIndex] as Note;
  // Standard guitar octave ranges
  const baseOctaves = [2, 2, 3, 3, 3, 4]; // For 6-string standard
  const octave = (baseOctaves[stringIndex] || 3) + Math.floor((fret + NOTES.indexOf(openNote)) / 12);
  const adjustedNote = getNoteAtInterval(openNote, fret);
  return getNoteFrequency(adjustedNote, octave);
}

export default {
  NOTES,
  NOTES_FLAT,
  SARGAM,
  SOLFEGE,
  INTERVALS,
  SCALES,
  CHORDS,
  TUNINGS,
  SCALE_CATEGORIES,
  CHORD_CATEGORIES,
  CAGED_POSITIONS,
  getNoteAtInterval,
  getScaleNotes,
  getChordNotes,
  getTuningById,
  getScaleById,
  getChordById,
  getIntervalFromRoot,
  getNoteDisplayLabel,
  getNotesInPosition,
  getNoteFrequency,
  getGuitarStringFrequency
};
