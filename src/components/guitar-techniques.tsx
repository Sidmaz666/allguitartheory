'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Zap, Sparkles, Flame, Waves, Wind, ArrowUpDown, Shuffle, Hand, Music, Ear } from 'lucide-react';
import type { Note, ChordDefinition } from '@/lib/music-theory';

interface Technique {
  name: string;
  symbol: string;
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
  howTo: string;
  notation: string;
  songs: string;
  tips: string;
  youtubeId: string;
  icon: React.ReactNode;
}

const TECHNIQUES: Technique[] = [
  {
    name: 'Hammer-On',
    symbol: 'H',
    category: 'Legato',
    difficulty: 2,
    description: 'A hammer-on is played by picking a note and then slamming a finger down on a higher fret on the same string without picking again. The string is already vibrating from the first pick, and the second finger adds a new pitch.',
    howTo: 'Pick the first note firmly. While the string is still ringing, bring your next finger down HARD on the target fret like a small hammer. The finger must hit the fret wire precisely with enough force to make the note speak clearly without an additional pick stroke.',
    notation: 'Written as a slur (curved line) between two notes with "H" above it, e.g., 5h7 (pick fret 5, hammer-on to fret 7).',
    songs: 'Beat It (Michael Jackson / Eddie Van Halen) - tapping intro uses hammer-ons, Stairway to Heaven (Led Zeppelin) - ascending intro line',
    tips: 'Use the tip of your finger. Keep it close to the fret wire. Practice on all four fingers: 1h2, 2h3, 3h4. Build finger strength gradually.',
    youtubeId: 'wdT39wMIla0',
    icon: <Zap className="w-4 h-4" />,
  },
  {
    name: 'Pull-Off',
    symbol: 'P',
    category: 'Legato',
    difficulty: 2,
    description: 'A pull-off is the opposite of a hammer-on. You pick a higher fretted note, then pull your finger off the string to let the lower fretted note (or open string) sound without picking again.',
    howTo: 'Fret both notes initially. Pick the higher note. While the string rings, pull your finger off the string with a slight downward plucking motion. The string should vibrate at the lower fret position. The pulling motion is important \u2014 don\'t just lift your finger straight up.',
    notation: 'Written as a slur with "P" above it, e.g., 7p5 (pick fret 7, pull-off to fret 5).',
    songs: 'Smoke on the Water (Deep Purple) - main riff uses pull-offs, Nothing Else Matters (Metallica) - intro melody',
    tips: 'Flick the string slightly downward as you pull off. Keep fingertip strength. Combine H and P for fluid legato runs.',
    youtubeId: 'wdT39wMIla0',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    name: 'Slide',
    symbol: '\\ or /',
    category: 'Legato',
    difficulty: 1,
    description: 'A slide involves picking a note and sliding your finger along the string to a different fret without lifting. The pitch continuously changes as you slide. Slides can go up (/) or down (\\) the neck.',
    howTo: 'Fret the starting note with firm pressure. Pick the string. While maintaining pressure, slide your finger smoothly along the string to the target fret. Keep constant pressure \u2014 if you press too hard, the slide will be jerky; too light and the note will stop sounding. Use the pad of your finger, not the tip.',
    notation: 'Written with a line between notes: 5/7 (slide up from 5 to 7), 7\\5 (slide down from 7 to 5). A ghost slide (no destination fret written) means slide off the fretboard.',
    songs: 'Johnny B. Goode (Chuck Berry) - iconic slide intro, Comfortably Numb (Pink Floyd) - slide solos',
    tips: 'Use lighter gauge strings for easier slides. Oil your fretboard occasionally for smoother slides. Keep consistent finger pressure.',
    youtubeId: 'ZMvpmjeNvK0',
    icon: <ArrowUpDown className="w-4 h-4" />,
  },
  {
    name: 'Bend',
    symbol: '^ or B',
    category: 'Expression',
    difficulty: 3,
    description: 'A bend is when you push (or pull) a string across the fretboard to raise its pitch. This is one of the most expressive guitar techniques, allowing microtonal pitch changes similar to a singer\'s vibrato.',
    howTo: 'Fret the note firmly. Use multiple fingers for support (stack index on middle, middle on ring, ring on pinky). Push the string UP (toward the ceiling for low E, A, D; pull DOWN for G, B, high E). The pitch should rise smoothly. A full bend raises the pitch by one whole step (two frets). Train your ear to hear the target pitch.',
    notation: '7^9 means bend the string at fret 7 up to sound like fret 9. Full = whole step (2 frets), 1/2 = half step (1 fret), 1 1/2 = one and a half steps (3 frets). Pre-bend: pick already bent, then release (also called a release bend).',
    songs: 'Purple Haze (Jimi Hendrix) - signature bends, Sweet Child O\' Mine (Guns N\' Roses) - intro bends',
    tips: 'Use 2-3 fingers for bigger bends. Bend from the wrist, not just fingers. Practice bending to pitch with a tuner. Pre-hear the target note before you play it.',
    youtubeId: 'v7hTZgHtI9Q',
    icon: <Wind className="w-4 h-4" />,
  },
  {
    name: 'Vibrato',
    symbol: '~~~~',
    category: 'Expression',
    difficulty: 3,
    description: 'Vibrato is a subtle, rapid variation in pitch created by rocking your fretting finger back and forth. It adds warmth, emotion, and sustain to sustained notes. Good vibrato is a hallmark of great guitarists.',
    howTo: 'Fret the note and begin playing it. Rock your wrist back and forth smoothly, bending and releasing the string slightly. The motion comes from the wrist, NOT the finger. Aim for even width and speed \u2014 about 4-6 oscillations per second. Classical vibrato is side-to-side (parallel to strings); blues/rock vibrato is up-and-down (perpendicular).',
    notation: 'A wavy line above the note (~~~~) or "Vib." written above. Wider waves = wider vibrato. Sometimes marked with a specific width: "vib. largo" (wide) or "vib. stretto" (narrow).',
    songs: 'Sultans of Swing (Dire Straits) - Mark Knopfler\'s signature vibrato, Voodoo Child (Jimi Hendrix) - wide, dramatic vibrato',
    tips: 'Practice next to a fret (e.g., 7th fret on B string, 3rd fret on G string). Record yourself \u2014 your vibrato should sound vocal, not mechanical. Wrist only, arm relaxed.',
    youtubeId: 'v7hTZgHtI9Q',
    icon: <Waves className="w-4 h-4" />,
  },
  {
    name: 'Palm Muting',
    symbol: 'P.M.',
    category: 'Rhythm',
    difficulty: 1,
    description: 'Palm muting involves resting the edge of your picking hand lightly on the strings near the bridge to create a chunky, percussive, dampened sound. It\'s essential for rock, metal, and funk rhythm playing.',
    howTo: 'Rest the fleshy part of your picking hand (the side below your pinky) on the strings right where they cross the bridge saddles. Pick the strings normally. The palm dampens the sustain, creating a short, percussive "chunk" sound. Move your palm closer to the neck for less muting (more ring) or closer to the bridge for more muting (more chunk).',
    notation: '"P.M." written above the staff with a dashed line covering the muted notes. Sometimes abbreviated as "PM" in tablature. In Guitar Pro and tab software, notes are marked with "PM" below the staff.',
    songs: 'Enter Sandman (Metallica) - iconic palm-muted riff, Break Stuff (Limp Bizkit) - heavy palm muting',
    tips: 'Don\'t press too hard \u2014 you want the strings to still ring slightly. Mute only the strings you\'re picking, not adjacent strings. Vary palm position for different amounts of mute.',
    youtubeId: 'pqQDIKNIfpc',
    icon: <Hand className="w-4 h-4" />,
  },
  {
    name: 'Muting / Ghost Notes',
    symbol: 'X',
    category: 'Rhythm',
    difficulty: 2,
    description: 'Ghost notes (also called dead notes or muted strums) are percussive sounds created by strumming or picking strings that are lightly muted by the fretting hand. They create rhythmic texture and drive.',
    howTo: 'Lightly lay your fretting hand fingers across the strings without pressing down to any fret. Strum or pick the muted strings. The result should be a percussive "chk" sound with no discernible pitch. In funk and reggae, ghost notes are the essential rhythmic "glue" between chords.',
    notation: 'An "X" on the staff or tab indicates a ghost note. In chord diagrams, an "X" above a string means it should not be played (muted). In strumming notation, ghost strums are often not written but implied between chord strums.',
    songs: 'Superstition (Stevie Wonder) - funk guitar ghost notes, Bust a Move (Young MC) - percussive muted strums',
    tips: 'Keep the fretting hand very light \u2014 barely touching the strings. Use ghost notes between chord changes for rhythmic momentum. Practice muting selectively (some strings open, some muted).',
    youtubeId: 'pqQDIKNIfpc',
    icon: <Shuffle className="w-4 h-4" />,
  },
  {
    name: 'Natural Harmonic',
    symbol: 'NH \\ < >',
    category: 'Tone',
    difficulty: 3,
    description: 'Natural harmonics are bell-like, chimey tones produced by lightly touching a string at specific nodal points (frets 12, 7, 5, 4, 3) without pressing it down. The string vibrates in divided segments.',
    howTo: 'Lightly rest your fingertip directly over the fret wire (NOT between frets) at the 12th, 7th, or 5th fret. Pick the string firmly and immediately lift your finger. The note should ring out as a clear, bell-like chime. The 12th fret harmonic is one octave above the open string; 7th is an octave + a fifth; 5th is two octaves.',
    notation: 'A diamond-shaped notehead on the staff or "< >" around the fret number in tablature. Sometimes "Harm." written above. The fret where you touch is indicated, not the sounding pitch.',
    songs: 'Harold (Guitar) (Neil Young) - acoustic harmonics, Classical Gas (Mason Williams) - harmonic passage',
    tips: 'Touch directly over the fret wire, not between frets. Use the fleshy pad of your fingertip for warmer harmonics, nail for brighter. Experiment at frets 3, 4, 7, 8, 9, 12 for different harmonics.',
    youtubeId: 'HmvpsS7D-1Q',
    icon: <Music className="w-4 h-4" />,
  },
  {
    name: 'Pinch Harmonic / Artificial Harmonic',
    symbol: 'PH \\ < >',
    category: 'Tone',
    difficulty: 4,
    description: 'Pinch harmonics (also called squealies or artificial harmonics) are created by picking the string and simultaneously touching it with your picking hand\'s thumb or finger. They produce high-pitched, squealing notes.',
    howTo: 'Hold the pick so only a small tip protrudes. Pick the string firmly, and immediately after the pick passes through, let your thumb\'s fleshy part barely graze the string. The contact point matters \u2014 try different distances from the bridge. Closer to the bridge = higher pitch. The perfect spot varies by string and fret. Use high gain for best results.',
    notation: '\'< >\' around the fret number with "PH" or "AH" above. In standard notation, a diamond or "o" above the note indicates artificial harmonics.',
    songs: 'Walk This Way (Aerosmith) - Joe Perry\'s pinch harmonics, Crazy Train (Ozzy Osbourne) - Randy Rhoads\' squeals',
    tips: 'Start on the 3rd fret of the A string (C note) \u2014 a very accessible spot. Use medium-pick thickness (0.73-0.88mm). Roll some picking-hand thumb flesh onto the string. Gain helps but isn\'t required.',
    youtubeId: 'arcdh1a0gjA',
    icon: <Zap className="w-4 h-4" />,
  },
  {
    name: 'Tapping',
    symbol: 'T',
    category: 'Extended',
    difficulty: 4,
    description: 'Tapping uses the picking hand to hammer-on (and pull-off) notes on the fretboard, typically on higher frets. This allows for fast, fluid passages that wouldn\'t be possible with one hand alone.',
    howTo: 'Use your picking-hand index or middle finger to hammer onto a fret (usually high on the neck \u2014 12th fret or higher) while your fretting hand holds a chord or plays lower notes. The tapping finger should hit the fret wire firmly like a hammer-on. For two-handed tapping, alternate between hands for rapid scale passages. Keep both hands relaxed.',
    notation: 'A "T" above the tab indicates a tapped note. The picking-hand finger number (usually "a" or "m" in classical notation) may also be indicated. Tapped harmonics are marked "T.H."',
    songs: 'Eruption (Van Halen) - the song that invented tapping, One Winged Angel (Nobuo Uematsu) - guitar cover tapping',
    tips: 'Use the bridge pickup position for clarity. Light touch on the tapping finger \u2014 let the fretting hand do the work. Practice chromatic tapping patterns (1-3-2-4 on fretting hand, 12-15 on tapping hand).',
    youtubeId: '268PcyxU4kE',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    name: 'Tremolo Picking',
    symbol: 'TR',
    category: 'Rhythm',
    difficulty: 3,
    description: 'Tremolo picking is playing a single note very rapidly using alternating down-up-down-up strokes. It creates a sustained, shimmering effect and is used extensively in classical, metal, and flamenco.',
    howTo: 'Hold the pick firmly but not tensely. Alternate down-up strokes as fast as possible on a single note. The motion comes from the wrist, not the arm. Start slow and gradually increase speed. The pick should barely escape the string \u2014 tiny movements. Rest your picking-hand palm lightly on the bridge for control.',
    notation: '"TR" or "trem." written above the note. Three slanted lines through the note stem indicate tremolo. In tab, the note value indicates the overall duration with "trem." marking.',
    songs: 'The House of the Rising Sun (The Animals) - arpeggiated tremolo, ...And Justice for All (Metallica) - tremolo riffs',
    tips: 'Use a thicker pick (1.0mm+) for better control. Practice with a metronome \u2014 start at 60 BPM playing 16th notes. Economy of motion is key; don\'t let the pick travel far from the string.',
    youtubeId: 'pqQDIKNIfpc',
    icon: <Wind className="w-4 h-4" />,
  },
  {
    name: 'Sweep Picking',
    symbol: 'SW',
    category: 'Extended',
    difficulty: 5,
    description: 'Sweep picking is a technique for playing rapid arpeggios across multiple strings using a single, smooth picking motion (downstroke across string, then upstroke back). The pick "sweeps" across the strings in one direction.',
    howTo: 'Start with a simple three-string arpeggio (e.g., Am: 5th A, 4th E, 3rd C). Use one DOWN stroke across all three strings, letting each note ring briefly as your fretting hand shapes each note. Then use one UP stroke across all three strings back down. The key is synchronizing the picking hand (one fluid sweep) with the fretting hand (each finger lifts at the right moment).',
    notation: 'Usually not specially marked \u2014 the pick direction arrows are shown above or below the tab (V = down, ^ = up). The chord shape is often written as an arpeggio. "SW" sometimes marked.',
    songs: 'Alive (Paco de Lucía) - flamenco sweeps, The Forgotten (Tosin Abasi) - modern sweep arpeggios',
    tips: 'Start with 3-string arpeggios at slow tempo. Mute strings you\'re not playing. Use a metronome \u2014 sweep picking highlights timing issues. Practice raking: let the pick drag across multiple strings.',
    youtubeId: 'gKoRIKNxkc0',
    icon: <Shuffle className="w-4 h-4" />,
  },
  {
    name: 'String Skipping',
    symbol: 'SK',
    category: 'Extended',
    difficulty: 4,
    description: 'String skipping involves playing notes on non-adjacent strings, "skipping" over one or more strings in between. It creates wide melodic intervals and angular phrases that sound distinctive.',
    howTo: 'Pick a note on the low E string, then pick a note on the G string (skipping A and D). The picking hand must jump over the skipped strings without touching them. Use your fretting hand to mute the skipped strings to prevent unwanted string noise. Practice pentatonic string-skipping patterns across the neck.',
    notation: 'Not specifically marked \u2014 the tablature shows which frets are played on which strings. The wide interval visually indicates string skipping. Common in technical metal and fusion.',
    songs: 'Juice (Steve Vai), For the Love of God (Steve Vai) - wide string-skipping phrases, Classical Thump (Victor Wooten) - bass string skipping',
    tips: 'Mute skipped strings with fretting hand fingers. Start with simple patterns (e.g., low E, then D). Use alternate picking. Slow practice is essential \u2014 the hand must learn to "jump" accurately.',
    youtubeId: '0RvRqKnQ0PA',
    icon: <ArrowUpDown className="w-4 h-4" />,
  },
  {
    name: 'Raking',
    symbol: '\u2571',
    category: 'Rhythm',
    difficulty: 2,
    description: 'Raking is a technique where the pick drags across multiple strings but only the last (or first) string in the rake is fretted. The other strings are muted, creating a percussive swoosh sound leading into a note.',
    howTo: 'Lightly rest your fretting hand across several strings (muting them all). Then, starting from a lower string, drag your pick across the strings toward the target string. Just as the pick reaches the target string, reveal that note by lifting your fretting hand finger. The mute creates a "shhh" sound that explodes into the fretted note.',
    notation: 'A diagonal line across the strings before a note in tab indicates a rake. Sometimes "Rake" is written above. The muted strings may be written as "X" notes connected by a beam to the target note.',
    songs: 'Johnny B. Goode (Chuck Berry) - the classic rake intro, You Shook Me All Night Long (AC/DC) - rhythm rakes',
    tips: 'Keep the rake short \u2014 2-3 strings maximum. The mute-to-open transition must be instant. Practice raking into a bend or vibrato for maximum expression.',
    youtubeId: '0RvRqKnQ0PA',
    icon: <Hand className="w-4 h-4" />,
  },
  {
    name: 'Fingerpicking / Fingerstyle',
    symbol: 'P I M A',
    category: 'Extended',
    difficulty: 3,
    description: 'Fingerpicking (also called fingerstyle) uses the fingertips or fingernails of the picking hand instead of a pick. The thumb plays bass strings while index (i), middle (m), and ring (a) play treble strings. This allows playing melody, bass, and chords simultaneously.',
    howTo: 'Assign your thumb to E, A, D strings; index (i) to G string; middle (m) to B string; ring (a) to high E string. Keep your wrist relaxed and slightly arched. The thumb moves independently from the fingers. Pluck with a slight rolling motion \u2014 the fingertip pushes through the string toward your palm. Classical players grow nails on the right hand for a brighter tone.',
    notation: 'p = thumb (pulgar), i = index (indice), m = middle (medio), a = ring (anular), c = pinky (chico). These letters are written above or below the staff to indicate which finger plays each note.',
    songs: 'Dust in the Wind (Kansas) - Travis picking, Blackbird (The Beatles) - iconic fingerpicking pattern',
    tips: 'Start with Travis picking: thumb alternates between bass strings while fingers play melody. Keep a steady thumb rhythm. Grow your picking-hand nails slightly for better tone. Practice without looking at your hands.',
    youtubeId: '0RvRqKnQ0PA',
    icon: <Hand className="w-4 h-4" />,
  },
  {
    name: 'Slap / Percussive',
    symbol: 'SLP',
    category: 'Extended',
    difficulty: 4,
    description: 'Slap technique involves striking the strings with the picking-hand thumb (slap) or snapping them with the fingers (pop). The thumb hits the lower strings for a thumpy bass sound; fingers snap the higher strings for a sharp, bright pop.',
    howTo: 'For the slap: rotate your forearm so your thumb strikes the string perpendicularly right over the fretboard (around 12th fret). The thumb should bounce off the string immediately. For the pop: hook your fingertip UNDER the string and pull it upward so it snaps back against the fretboard. Practice alternating slap (thumb on E string) and pop (middle finger on G string).',
    notation: 'An "X" with "SLP" above for slaps, "POP" above for pops. In bass tab, slap is marked "S" and pop is "P". Slap notation is often used in modern guitar music for percussive effects.',
    songs: 'Them Changes (Thundercat) - slap bass, Animals (Joe Pass) - acoustic slap guitar, Classical Thump (Victor Wooten)',
    tips: 'Let the thumb bounce \u2014 don\'t keep it pressed on the string. Use a light touch; the snap comes from the string\'s rebound. Practice the slap-pop alternation at slow tempos.',
    youtubeId: '0RvRqKnQ0PA',
    icon: <Zap className="w-4 h-4" />,
  },
  {
    name: 'Volume Swell',
    symbol: '< >',
    category: 'Expression',
    difficulty: 2,
    description: 'A volume swell is created by rolling the guitar\'s volume knob from off to full while picking the string, or by using a volume pedal. The note appears to "swell in" from silence, creating a violin-like, ethereal effect.',
    howTo: 'Pick the note or chord while your guitar\'s volume knob is at zero (pinky finger on the knob). Immediately roll the knob up to 10. The note should start silently and swell in smoothly. With a volume pedal: start with pedal heel-down, pick, then rock the pedal to toe-down. For multiple notes, adjust the knob/pedal for each swell. Use the neck pickup for the smoothest swells.',
    notation: 'A crescendo hairpin (<) is typically used, or "vol." written above the note. In tab, "swell" or "vol." is written. The note may have an "<" before it getting wider.',
    songs: 'Lenny (Stevie Ray Vaughan) - beautiful volume swell intro, Where the Streets Have No Name (U2) - The Edge\'s signature swells',
    tips: 'Use the neck pickup for warmer swells. Add delay/reverb for ethereal effects. Pick slightly after you start turning the knob. Practice using the pinky to adjust the knob while fingering chords.',
    youtubeId: 'ZMvpmjeNvK0',
    icon: <Waves className="w-4 h-4" />,
  },
  {
    name: 'Whammy Bar / Tremolo Arm',
    symbol: '~ / \\',
    category: 'Expression',
    difficulty: 3,
    description: 'The whammy bar (also called vibrato arm or tremolo arm) is a lever attached to the guitar bridge that changes string tension, lowering or raising the pitch of all strings simultaneously.',
    howTo: 'For dive bombs: push the bar down toward the guitar body to lower pitch. For lift: pull the bar up away from the body to raise pitch. Start with gentle, subtle wobbles and progress to dramatic dives. The bar should be held between your ring and pinky fingers while your index/middle fingers pick. Floating bridges (Floyd Rose) allow both dive and lift; vintage tremolos mainly dive.',
    notation: 'A wavy line with up/down arrows. "Dive" = push bar down, "Lift" = pull up. Numbers indicate half-step intervals (1 = half step, 2 = whole step, etc.). "Dive bomb" = extreme pitch drop.',
    songs: 'Eruption (Van Halen), Sweet Child O\' Mine (Guns N\' Roses) - subtle whammy, Rumble (Link Wray) - early whammy use',
    tips: 'Check tuning constantly \u2014 whammy bars knock guitars out of tune. Stretch your strings before using the whammy. Lubricate the nut for better tuning stability. Start with subtle vibrato before attempting dives.',
    youtubeId: 'pqQDIKNIfpc',
    icon: <Wind className="w-4 h-4" />,
  },
  {
    name: 'Rest Stroke (Apoyando)',
    symbol: 'Ap.',
    category: 'Classical',
    difficulty: 2,
    description: 'A classical guitar technique where the finger plucks a string and comes to rest on the adjacent string. This produces a louder, fuller, and more projecting tone compared to free stroke. The foundation of classical scale playing.',
    howTo: 'Place your finger (i, m, or a) on the string. Pluck through the string, allowing your finger to land on the next string (e.g., pluck B string, rest on G string). The finger should not lift off \u2014 it rests. The motion comes from the large knuckle joint (metacarpophalangeal), not the fingertip. Keep the nail contact consistent and the stroke follows through naturally.',
    notation: 'Marked "ap." or "apoyando" above notes. In classical notation, rest stroke is the default for melody lines. Free stroke (tirando) is used for arpeggios. Some editions indicate rest stroke with a dot above the note.',
    songs: 'Recuerdos de la Alhambra (Tárrega) - tremolo uses rest stroke, Asturias (Albéniz) - rapid scale passages',
    tips: 'Start on a single string (G string with m finger). Keep the nail filed smoothly \u2014 rough edges catch. The resting finger should feel natural, not forced. Practice i-m alternation slowly.',
    youtubeId: 'HmvpsS7D-1Q',
    icon: <Hand className="w-4 h-4" />,
  },
  {
    name: 'Free Stroke (Tirando)',
    symbol: 'Tir.',
    category: 'Classical',
    difficulty: 1,
    description: 'The finger plucks the string and continues moving away from the soundboard without touching adjacent strings. Used for arpeggios, chords, and simultaneous voices. The standard stroke for classical guitar arpeggio playing.',
    howTo: 'Place fingertip on the string. Pluck outward (away from the soundboard), following through into the palm of your hand. The finger does not stop on the next string. Keep the motion relaxed and circular \u2014 imagine scooping water toward you. The thumb (p) plays downward (toward the floor), while i-m-a play upward (toward the ceiling).',
    notation: 'Marked "tir." or "tirando" above arpeggio passages. The default stroke for chord strumming and arpeggio patterns. Almost all non-classical fingerpicking uses free stroke.',
    songs: 'Classical Gas (Mason Williams) - free stroke arpeggios, Dust in the Wind (Kansas) - Travis picking (free stroke)',
    tips: 'Keep nails smooth and shaped. The free stroke is quieter than rest stroke \u2014 use it for accompaniment. Practice arpeggio patterns: p-i-m-a-m-i on each string set.',
    youtubeId: 'HmvpsS7D-1Q',
    icon: <Music className="w-4 h-4" />,
  },
  {
    name: 'Classical Tremolo',
    symbol: 'Trem.',
    category: 'Classical',
    difficulty: 5,
    description: 'A challenging classical technique where the thumb plays a bass note followed by three rapid melody notes (p-a-m-i) creating the illusion of a sustained singing melody over an arpeggiated accompaniment. Each finger plays the same string sequentially.',
    howTo: 'The thumb (p) plays a bass string, then a-m-i play the same melody string in quick succession: p-a-m-i on a repeating cycle. The a-m-i should be as even as possible \u2014 each note at exactly the same volume and timing. The thumb melody note sustains through the three finger notes. Practice slowly with a metronome: set the tempo so p is on beat 1 and a-m-i fill beat 2 as triplets.',
    notation: 'Marked "trem." or "tremolo" above the staff. Three beams on the note stem indicate the rapid subdivision. In tablature, the melody note is shown once with "trem." written above. The thumb notes (bass) are written as separate voices.',
    songs: 'Recuerdos de la Alhambra (Tárrega) - the definitive tremolo piece, Una Limosna (Barrios) - challenging tremolo étude',
    tips: 'Use rest stroke for a-m-i for maximum projection. Start at 40 BPM (p on beat 1, a-m-i as triplet on beat 2). Gradually increase tempo. The goal is 120 BPM for the full triplet. Record yourself \u2014 evenness is more important than speed.',
    youtubeId: '268PcyxU4kE',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    name: 'Crosspicking',
    symbol: 'XP',
    category: 'Bluegrass',
    difficulty: 4,
    description: 'A bluegrass technique that uses a flatpick to mimic the rolling banjo style. The pick plays a constant eighth-note pattern across three strings, usually G, B, and high E, creating a flowing, rolling arpeggio effect.',
    howTo: 'Hold the pick firmly and use strict alternate picking (D-U-D-U). The pattern typically goes: low string (D), middle (U), high (D), middle (U), low (D) \u2014 repeating across the strings. The pick should never stop moving. The left hand frets chord shapes while the right hand maintains the rolling pattern. Start with G major shape: frets 3-0-0-0-3-3 (E-A-D-G-B-E).',
    notation: 'Not specifically marked in standard notation \u2014 the rolling arpeggio pattern is implied by the style marking "crosspicking" or "bluegrass style." In tab, the continuous eighth-note pattern across strings is visible.',
    songs: 'Foggy Mountain Breakdown (Flatt & Scruggs), Jerusalem Ridge (Bill Monroe) - bluegrass crosspicking',
    tips: 'Use a medium-heavy pick (0.88-1.0mm) for crisp attack. Keep the right hand relaxed \u2014 tension kills speed. Practice the pattern open (no left hand) first. Start at 60 BPM eighth notes.',
    youtubeId: '0RvRqKnQ0PA',
    icon: <Shuffle className="w-4 h-4" />,
  },
  {
    name: 'Hybrid Picking (Chicken Picking)',
    symbol: 'H.P.',
    category: 'Country',
    difficulty: 4,
    description: 'Combines a flatpick (held between thumb and index) with middle and ring fingers plucking strings simultaneously. This allows playing multiple voices at once \u2014 bass notes with the pick and melody with fingers. Essential for country, rockabilly, and modern bluegrass.',
    howTo: 'Hold the pick normally between thumb and index finger. Use the pick for downstrokes on lower strings (E, A, D). Use middle (m) and ring (a) fingers to pluck higher strings (G, B, E) upward. Common pattern: pick plays bass note on beat, m plays B string, a plays high E. For chicken picking: use the pick to snap the string against the fretboard for a sharp, percussive "cluck" sound.',
    notation: 'Marked "H.P." or "hybrid" above the staff. In tab, pick notes are shown normally, finger-pulled notes may have "m" or "a" above them. The chicken pick "snap" is marked "pop" or with an X notehead.',
    songs: 'Mystery Train (Scotty Moore), Café 1930 (Piazzolla), Sweet Dreams (Don Gibson)',
    tips: 'Start with simple patterns: pick bass notes on beats 1 and 3, pluck chord on beats 2 and 4. Use fingerpicks or grow nails on m and a for better volume. Practice the snap by pulling the string away from the fretboard and releasing.',
    youtubeId: '0RvRqKnQ0PA',
    icon: <Zap className="w-4 h-4" />,
  },
  {
    name: 'Arpeggio',
    symbol: 'Arp.',
    category: 'Classical',
    difficulty: 2,
    description: 'Playing the notes of a chord sequentially rather than simultaneously. The most fundamental fingerstyle technique. Arpeggios form the basis of classical guitar, fingerstyle, and many pop/rock accompaniment patterns.',
    howTo: 'For fingerstyle: p (thumb) plays bass strings (E, A, D), i plays G, m plays B, a plays high E. Pluck in sequence: p-i-m-a or p-a-m-i for ascending arpeggios. For pick: use a sweeping motion (sweep picking) across the strings. Keep each note distinct \u2014 don\'t let them ring into each other unless desired. The thumb maintains a steady rhythm while fingers add melodic interest.',
    notation: 'A wavy vertical line before a chord indicates arpeggio (strum slowly). In classical notation, arpeggio patterns are written as individual notes. "Arp." written above indicates arpeggiated chord. In guitar TAB, the individual string numbers show the arpeggio pattern.',
    songs: 'Romance Anónimo (Spanish Romance) - iconic arpeggio piece, The Water Is Wide (traditional fingerstyle)',
    tips: 'Practice p-i-m-a-m-i pattern on each string set. Keep the thumb independent \u2014 it should not speed up or slow down with the fingers. Use a metronome with the thumb playing beats.',
    youtubeId: '268PcyxU4kE',
    icon: <Music className="w-4 h-4" />,
  },
  {
    name: 'Rasgueado (Flamenco Strum)',
    symbol: 'Ras.',
    category: 'Flamenco',
    difficulty: 4,
    description: 'A flamenco strumming technique using rapid finger flicks to create a powerful, percussive chordal sound. Multiple fingers (index through pinky) "explode" outward across the strings in rapid succession. The signature sound of flamenco guitar.',
    howTo: 'Start with the hand in a fist, nails facing the strings. Extend the pinky (e), then ring (a), then middle (m), then index (i) in rapid succession \u2014 each finger flicks across all six strings. The motion is like flicking water off your fingers. The thumb (p) can be used for upward rasgueado (from high to low strings). For quintuple rasgueado: e-a-m-i-p in one fluid motion.',
    notation: 'Marked "ras." or "rasgueado" above the chord. Diagonal lines through the chord stem indicate rasgueado. The number of lines indicates the number of finger strokes. In flamenco notation, specific finger patterns are notated above the staff.',
    songs: 'Entre Dos Aguas (Paco de Lucía), Bulerías (any flamenco guitarist)',
    tips: 'Start with two-finger rasgueado (i-m). Keep fingernails slightly longer on the right hand. The motion comes from opening the hand, not from finger strength. Practice over a table to develop the flicking motion.',
    youtubeId: 'ZMvpmjeNvK0',
    icon: <Flame className="w-4 h-4" />,
  },
  {
    name: 'Golpe (Tap Soundboard)',
    symbol: 'Golpe',
    category: 'Flamenco',
    difficulty: 3,
    description: 'A percussive tap on the guitar soundboard (body) using the picking-hand fingers or thumb. Creates a sharp drum-like accent that punctuates the rhythm. Essential flamenco technique that turns the guitar into a percussion instrument.',
    howTo: 'Using the ring finger (a) or middle finger (m), tap the soundboard above the soundhole (or on the golpeador \u2014 a protective plastic plate on flamenco guitars). The tap should be sharp and clean \u2014 like knocking on a door. Combine with rasgueado: strum with i-m while simultaneously tapping with a. The golpe often falls on beat 2 or 4 of the compás.',
    notation: 'Marked "golpe" or "G.P." above the staff. In flamenco notation, "g" above the staff indicates golpe. Sometimes notated with percussion notation (X notehead on an auxiliary staff line).',
    songs: 'Bulerías (Paco de Lucía), Soleá (traditional flamenco)',
    tips: 'Use the nail of the ring finger for a sharper sound. Practice the combined motion: golpe on the soundboard + rasgueado on strings. The timing must be precise \u2014 the golpe is part of the rhythm.',
    youtubeId: 'ZMvpmjeNvK0',
    icon: <Hand className="w-4 h-4" />,
  },
  {
    name: 'Tambora (Drum Effect)',
    symbol: 'Tamb.',
    category: 'Classical',
    difficulty: 3,
    description: 'A percussive effect where the picking hand strikes the strings near the bridge to produce a drum-like sound. The hand hits multiple strings simultaneously, creating a rhythmic thump. Often used in classical and flamenco pieces for rhythmic punctuation.',
    howTo: 'Using the side of your picking hand (the fleshy part below the pinky), strike the strings right at the bridge. The strings should slap against the fretboard. For a deeper sound, strike closer to the soundhole. For a sharper sound, strike closer to the bridge. The thumb can also be used to slap the bass strings for a similar effect (similar to slap bass technique).',
    notation: 'Marked "tamb." or "tambora" above the staff. The notehead is often an X or diamond shape. In tab, "Tamb" is written above with the fret numbers indicating which strings to strike.',
    songs: 'Asturias (Albéniz) - tambora passages, La Catedral (Barrios) - percussive sections',
    tips: 'Keep the hand relaxed \u2014 a tense hand produces a thin sound. Let the hand bounce off the strings. Practice alternating between tambora and normal playing for rhythmic effects.',
    youtubeId: 'HmvpsS7D-1Q',
    icon: <Wind className="w-4 h-4" />,
  },
  {
    name: 'Harmonic Tapping',
    symbol: 'T.H.',
    category: 'Extended',
    difficulty: 4,
    description: 'Tapping the string at a harmonic node point with the picking hand to produce bell-like harmonics. Unlike natural harmonics (touched by fretting hand), harmonic tapping uses the picking hand to both excite and dampen the string at nodal points.',
    howTo: 'Use your picking-hand index finger to tap firmly directly over the fret wire at the 12th, 7th, or 5th fret (or other harmonic nodes). The finger must hit precisely on the fret wire and lift off immediately. The fretting hand can hold a chord shape or notes below. For tapped harmonics at the 12th fret, the result is one octave above the open string. At the 19th fret, it\'s two octaves up.',
    notation: 'Marked "T.H." or "Har." above the tab. The fret tapped is indicated with "< >" around the number. A diamond notehead is used in standard notation.',
    songs: 'Eruption (Van Halen) - iconic tapped harmonics, The Faded (Alice in Chains) - acoustic tapped harmonics',
    tips: 'Tap directly over the fret wire, not between frets. Use a very firm, fast attack. Mute strings you don\'t want ringing. Experiment with tapped harmonics at frets 3, 4, 5, 7, 9, 12, 16, 19.',
    youtubeId: '268PcyxU4kE',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    name: 'Feedback',
    symbol: '\u221E',
    category: 'Electric',
    difficulty: 3,
    description: 'When a guitar amplifies its own sound through the pickups, creating a sustained, often high-pitched howl or drone. Controlled feedback is a hallmark of electric guitar expression, pioneered by Jimi Hendrix and perfected by countless rock guitarists.',
    howTo: 'Stand close to your amplifier (within 1-3 feet). Face the guitar\'s pickups toward the speaker. Strike a note and let it ring \u2014 the amp picks up the sound and re-amplifies it, creating a loop. Move your guitar position relative to the amp to control pitch and intensity. Closer to the amp = more feedback. Angle the guitar to emphasize specific frequencies. Use high gain and volume.',
    notation: '"feedback" written above the sustained note. A "\u221E" (infinity) symbol sometimes indicates indefinite feedback sustain. A wavy line represents the howling quality of feedback.',
    songs: 'Purple Haze (Jimi Hendrix) - controlled feedback, Fade to Black (Metallica) - feedback intro, I Love Rock N Roll (Joan Jett)',
    tips: 'Use the bridge pickup for easier feedback. Stand at the right distance \u2014 experiment. Mute strings you don\'t want feeding back. Use a noise gate for control. Start with single notes before attempting chords.',
    youtubeId: 'pqQDIKNIfpc',
    icon: <Wind className="w-4 h-4" />,
  },
  {
    name: 'Wah-Wah',
    symbol: 'Wah',
    category: 'Electric',
    difficulty: 2,
    description: 'A wah-wah pedal creates a vowel-like "wah" sound by sweeping a bandpass filter across the frequency spectrum. Rocking the pedal forward = higher frequencies (bright), backward = lower frequencies (dark). The rhythmic rocking creates the signature "wah-wah-wah" effect.',
    howTo: 'Rock the wah pedal with your foot: toe down = treble/bright, heel down = bass/dark. For classic funk: sync the rocking with your strumming (down = toe, up = heel). For rock solos: sweep the pedal slowly for dramatic filter sweeps. Half-cocked wah (pedal fixed in one position) creates a fixed filter tone favored by Mark Knopfler and Kirk Hammett.',
    notation: '"Wah" written above the staff. The pedal position may be indicated with lines going up (toe) or down (heel). Frequency markings: "open" = toe down, "closed" = heel down.',
    songs: 'Voodoo Child (Jimi Hendrix) - definitive wah solo, Enter Sandman (Metallica) - half-cocked wah rhythm',
    tips: 'Set the pedal on a non-slip surface. Keep the cable short. For rhythm wah, match the pedal to the strumming pattern. For solo wah, sweep slowly for expressive leads.',
    youtubeId: 'pqQDIKNIfpc',
    icon: <Waves className="w-4 h-4" />,
  },
  {
    name: 'E-Bow (Sustainer)',
    symbol: 'EB',
    category: 'Electric',
    difficulty: 3,
    description: 'An electronic device held over the guitar pickups that creates an electromagnetic field, making the string vibrate indefinitely. Produces an infinite sustain like a bowed violin or cello. Creates ethereal, singing sounds impossible with standard playing.',
    howTo: 'Hold the E-Bow over the string directly above the pickups (not the neck). Press the E-Bow\'s button to activate it. The device should be parallel to the string and about 1-2mm above it. Move the E-Bow slightly closer to the bridge for higher harmonics. For note changes: fret normally with the left hand \u2014 the E-Bow sustains through changes. Tilt the E-Bow for harmonic shifts.',
    notation: 'Marked "E-Bow" or "e-bow" above the sustained notes. A long horizontal line (\u2014) indicates extended sustain. "Harm." with E-Bow indicates harmonic mode. Direction arrows: "\u2192" toward bridge = bright harmonics.',
    songs: 'With or Without You (U2) - The Edge\'s sustained notes, Streets Have No Name (U2) - ethereal swells',
    tips: 'Use the bridge pickup for best results. Adjust amp gain \u2014 too much gain causes feedback, too little loses sustain. Start on the high E string (easiest). Experiment with pick-hand muting for pulsing effects.',
    youtubeId: 'pqQDIKNIfpc',
    icon: <Zap className="w-4 h-4" />,
  },
  {
    name: 'Pick Scrape',
    symbol: '\u2707',
    category: 'Electric',
    difficulty: 1,
    description: 'Dragging the edge of a guitar pick along the wound strings (usually low E or A) to create a screeching, scraping sound. Used as a dramatic effect in rock and metal for transitions, endings, or aggressive accents.',
    howTo: 'Use the edge (not the tip) of the pick. Firmly drag it along the winding of the low E or A string, from the bridge toward the neck (or vice versa). The slower the scrape, the more dramatic the sound. For a more aggressive sound, use the sharp edge of a metal pick or coin. The effect is most audible on wound strings (E, A, D).',
    notation: 'An X notehead or "scrape" above the staff. In tab, a wavy line between string numbers with "scrape" or "pick scrape" written above. Sometimes notated with "\u2707" symbol.',
    songs: 'Enter Sandman (Metallica) - opening pick scrape, Walk (Pantera) - Dimebag Darrell signature scrapes',
    tips: 'Use a thick pick (1.0mm+) for a louder scrape. Drag slowly for maximum effect. Don\'t scrape unwound strings (B, high E) \u2014 they won\'t produce the same sound. Keep the pick perpendicular to the string.',
    youtubeId: 'pqQDIKNIfpc',
    icon: <Zap className="w-4 h-4" />,
  },
  {
    name: 'Two-Handed Tapping',
    symbol: '2H',
    category: 'Extended',
    difficulty: 5,
    description: 'Both hands tap notes on the fretboard simultaneously, creating rapid, polyphonic passages impossible with one hand. Popularized by Eddie Van Halen (who used one hand on the fretboard), Stanley Jordan (who uses both hands equally), and modern virtuosos.',
    howTo: 'Both hands approach the fretboard from above (like playing piano). The fretboard is treated as a single 12-fret range per hand. The low hand (fretting hand, now playing a "second" role) taps lower pitches; the high hand (picking hand) taps higher pitches. Both hands use hammer-on/pull-off motions. For two independent lines: practice alternating hands in sequence. For chordal tapping: both hands tap different notes simultaneously.',
    notation: 'Multiple voices on one staff. The tapping hand\'s notes have "T" above them. Two staves are sometimes used (one per hand). In tab, tapped notes have "T" above, and the staff may split into two for each hand.',
    songs: 'Eruption (Van Halen) - the original tapping piece, When the Sun Goes Down (Eric Johnson)',
    tips: 'Start with simple one-hand tapping patterns. Add the second hand on the 12th fret. Practice scales with both hands alternating. Keep both hands relaxed and above the fretboard. Use light gauge strings.',
    youtubeId: '268PcyxU4kE',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    name: 'Whistle / Flageolet',
    symbol: 'Flag.',
    category: 'Classical',
    difficulty: 3,
    description: 'Also called flageolet tones, these are very high, pure harmonics produced by lightly touching the string at fractional divisions (1/3, 1/4, 1/5 of the string length). Different from standard natural harmonics.',
    howTo: 'Lightly touch the string at precise fractional points: 1/3 (ca. 7th fret on most strings, actually 7.2), 1/4 (at the 5th fret but touch slightly toward the neck), 1/5 (at the 4th fret). These produce harmonics not available at standard 12th/7th/5th positions. The touch must be extremely light \u2014 barely grazing the string. Pick firmly and lift finger immediately.',
    notation: 'A diamond or "o" notehead. "Flag." or "flageolet" written above. The sounding pitch is notated (much higher than the touched fret would suggest). The fret where you touch is indicated in a small circle.',
    songs: 'Capricho Árabe (Tárrega) - delicate flageolet passages, Carnival of Venice (traditional variations)',
    tips: 'These harmonics are fragile \u2014 they require precise finger placement. Experiment with the exact position \u2014 it varies slightly by guitar and string. Use the fleshy fingertip, not the nail.',
    youtubeId: 'HmvpsS7D-1Q',
    icon: <Waves className="w-4 h-4" />,
  },
  {
    name: 'Pizzicato (Left-Hand Mute)',
    symbol: 'Pizz.',
    category: 'Classical',
    difficulty: 2,
    description: 'Plucking the string with the right hand while the left hand lightly mutes it (or plucking very near the bridge). Produces a thin, nasal, harp-like sound. Used for contrast in classical pieces. Not to be confused with palm muting (which is a different sound).',
    howTo: 'For left-hand pizzicato: lightly touch the string(s) with the left hand (anywhere on the fretboard) while the right hand plucks normally. For right-hand pizzicato: rest the side of your right hand on the strings right at the bridge and pluck with thumb or fingers. The sound should be thin and slightly percussive, like a harp or harpsichord.',
    notation: '"pizz." written above the staff. "arco" or "norm." cancels it. In guitar music, "pizz." often means right-hand pizzicato (palm at bridge).',
    songs: 'Danza del Molinero (Falla), El Noi de la Mare (Llobet) - classical pizzicato',
    tips: 'For a clear pizzicato, the right hand must be precisely at the bridge. Experiment with the exact position. Left-hand pizzicato is easier on strings with less tension.',
    youtubeId: 'HmvpsS7D-1Q',
    icon: <Hand className="w-4 h-4" />,
  },
  {
    name: 'Octave Playing',
    symbol: '8va',
    category: 'Jazz',
    difficulty: 3,
    description: 'Playing two notes an octave apart simultaneously, typically with the pick on the lower note and the middle/ring finger on the upper note. A signature technique of jazz guitarists like Wes Montgomery. Creates a full, rich sound that cuts through a band.',
    howTo: 'For octaves with a pick: hold the pick normally and pick the lower string (e.g., D string). Simultaneously pluck the octave-higher string (e.g., B string, 2 frets higher) with your middle or ring finger. The two notes must sound together perfectly. Move this shape across the fretboard to play melodic lines in octaves. Common on D-G-B string set (lower octave) and A-D-G (higher octave).',
    notation: '"8va" above a passage indicates to play in octaves. The passage may be written with both pitches shown, or single melody with "8va" indicating it\'s doubled at the octave. In jazz charts, "octaves" or "8va" above the staff.',
    songs: 'West Coast Blues (Wes Montgomery), Bumpin\' (Wes Montgomery) - definitive octave playing',
    tips: 'Use a wound G string for better octave clarity. Keep the hand shape consistent. Practice pentatonic scales in octaves. Mute strings between the octave with the fretting hand.',
    youtubeId: '0RvRqKnQ0PA',
    icon: <ArrowUpDown className="w-4 h-4" />,
  },
  {
    name: 'Chord Melody',
    symbol: 'C.M.',
    category: 'Jazz',
    difficulty: 5,
    description: 'Arranging a melody with accompanying chords played simultaneously on the same guitar. The melody notes are typically on the top strings while chord tones fill in below. A hallmark of jazz guitar solo playing (Joe Pass, Lenny Breau).',
    howTo: 'Identify the melody notes of a song. For each melody note, find a chord shape that: (1) has the melody note on the top string, and (2) includes appropriate harmony for that moment. Common approach: use drop-2 and drop-3 voicings on the middle strings. The thumb can play bass notes while fingers handle chord+melody. Practice with simple melodies like "Autumn Leaves" on the B and E strings with chord tones on D and G strings.',
    notation: 'A single staff with both melody (up-stem) and chord (down-stem) voices. Chord symbols written above. "C.M." or "chord melody" indicates the arrangement style.',
    songs: 'Misty (Joe Pass), Round Midnight (Thelonious Monk - Joe Pass version)',
    tips: 'Start with simple 3-note voicings on the top three strings. Learn drop-2 and drop-3 voicings in all keys. Use voice leading \u2014 minimize movement between chords. Record yourself and listen for balance.',
    youtubeId: '0RvRqKnQ0PA',
    icon: <Music className="w-4 h-4" />,
  },
];

const TECHNIQUE_CATEGORIES = ['All', ...new Set(TECHNIQUES.map(t => t.category))];

type TechProps = { className?: string; root?: Note; chord?: ChordDefinition };

export function GuitarTechniques({ className, root = 'C', chord = { id: 'major', name: 'Major Triad', symbol: '', intervals: ['1', '3', '5'], category: 'Triad', difficulty: 1 as const, description: '', theory: { construction: '', function: '', scaleSources: [], voiceLeading: '', substitutions: [] } } }: TechProps) {
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<number | null>(null);
  const filtered = filter === 'All' ? TECHNIQUES : TECHNIQUES.filter(t => t.category === filter);

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-base mb-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <CardTitle className="text-base">Guitar Techniques</CardTitle>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {TECHNIQUE_CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "cursor-pointer text-[10px] px-2 py-0.5 rounded-full border transition-all",
                filter === c ? "bg-primary/20 border-primary/40 text-foreground" : "bg-muted/20 border-border/30 text-muted-foreground hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filtered.map((t, idx) => (
            <div
              key={idx}
              className={cn(
                "p-3 rounded-lg border transition-all cursor-pointer",
                expanded === idx ? "bg-muted/30 border-primary/30" : "bg-muted/20 border-border/30 hover:border-border/60"
              )}
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                    {t.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm">{t.name}</h4>
                      <Badge variant="outline" className="text-[9px] h-4 px-1 font-mono">{t.symbol}</Badge>
                      <Badge variant="secondary" className="text-[8px] h-4 px-1">{t.category}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{t.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge className={cn("text-[9px] h-4 px-1.5 shrink-0",
                    t.difficulty <= 1 ? "bg-green-500/10 text-green-400" :
                    t.difficulty <= 2 ? "bg-emerald-500/10 text-emerald-400" :
                    t.difficulty <= 3 ? "bg-amber-500/10 text-amber-400" :
                    t.difficulty <= 4 ? "bg-orange-500/10 text-orange-400" :
                    "bg-red-500/10 text-red-400"
                  )}>{t.difficulty * 2}/10</Badge>
                  <a
                    href={`https://www.youtube.com/watch?v=${t.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 w-7 p-0 shrink-0 cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              {expanded === idx && (
                <div className="mt-3 pt-3 border-t border-border/30 space-y-2 text-[11px]">
                  <div>
                    <span className="font-medium text-foreground">How to Play: </span>
                    <span className="text-muted-foreground">{t.howTo}</span>
                  </div>
                  <div>
                    <span className="font-medium text-amber-400">Notation: </span>
                    <span className="text-muted-foreground">{t.notation}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Ear className="w-3 h-3 mt-0.5 text-primary shrink-0" />
                    <span className="text-muted-foreground">{t.songs}</span>
                  </div>
                  <div className="p-2 rounded bg-primary/5 border border-primary/10">
                    <span className="font-medium text-primary">Pro Tip: </span>
                    <span className="text-muted-foreground">{t.tips}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default GuitarTechniques;
