'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Globe, Music, Info } from 'lucide-react';

interface ScaleSection {
  title: string;
  icon: string;
  content: React.ReactNode;
}

const sections: ScaleSection[] = [
  {
    title: 'Indian Classical (Raga System)',
    icon: '🇮🇳',
    content: (
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>Uses <strong className="text-foreground">Sargam</strong> notation: Sa (tonic), Re (2nd), Ga (3rd), Ma (4th), Pa (5th), Dha (6th), Ni (7th). Each note can be <strong className="text-foreground">shuddha</strong> (natural), <strong className="text-foreground">komal</strong> (flat), or <strong className="text-foreground">tivra</strong> (sharp).</p>
        <p>Ragas have specific ascending (<strong className="text-foreground">aroha</strong>) and descending (<strong className="text-foreground">avaroha</strong>) patterns, characteristic phrases (<strong className="text-foreground">pakad</strong>), and are associated with time of day, season, and mood (<strong className="text-foreground">rasa</strong>). Over 400 ragas in Hindustani system; 72 parent ragas in Carnatic system.</p>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Raga Yaman</strong>: N R G M# D N S — evening, romantic, devotional</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Raga Bhairav</strong>: S r G M d N S — morning, solemn, meditative</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Raga Kafi</strong>: S R g M P D n S — late night, bluesy, folk-like</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Raga Todi</strong>: S r g M# d N S — morning, intense, complex</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Raga Bhimpalasi</strong>: S R g M P D n S — afternoon, yearning, romantic</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Raga Darbari</strong>: S R g M P d N S — late night, majestic, serious</div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><Info className="w-3 h-3" /><span><strong className="text-foreground">Rasa Theory:</strong> Each raga evokes a specific rasa (emotion): Shringara (love), Karuna (pathos), Veera (heroism), Shanta (peace), Hasya (humor), Adbhuta (wonder), Raudra (anger), Bhayanaka (fear), Vibhatsa (disgust).</span></div>
      </div>
    ),
  },
  {
    title: 'Middle Eastern (Maqam System)',
    icon: '🌙',
    content: (
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>Arabic and Turkish maqamat use <strong className="text-foreground">quarter tones</strong> and microtones. A maqam includes characteristic melodic phrases, modulation paths, and emotional affect (<strong className="text-foreground">tarab</strong>). Primary instruments: <strong className="text-foreground">oud</strong> (fretless lute), ney (flute), qanun (zither), violin.</p>
        <p>The <strong className="text-foreground">Ajnas</strong> (trichords/tetrachords) are the building blocks of maqamat. Each maqam is built by combining two or more ajnas. Modulation between maqamat during a performance (sayr) is expected and creates musical interest.</p>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Maqam Rast</strong>: C D E½ F G A B½ C — bright, stately, the primary maqam</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Maqam Hijaz</strong>: D E½ F# G A B½ C# D — exotic, mournful, Spanish influence</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Maqam Saba</strong>: D E½ F G A Bb C# D — sad, yearning, melodically complex</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Maqam Bayati</strong>: D E½ F G A Bb C D — melancholic, most common in Quranic recitation</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Maqam Nahawand</strong>: C D Eb F G Ab Bb C — similar to natural minor, emotional</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Maqam Hijaz Kar</strong>: D E½ F# G A Bb C# D — Hijaz with altered upper tetrachord</div>
        </div>
        <p className="text-[10px]"><strong className="text-foreground">Quarter Tone Notation:</strong> E½ = quarter-flat (halfway between E and Eb). In Arabic music theory, this is called &quot;half-flat&quot; or &quot;mui&quot; — a microtone approximately 50 cents below the natural note.</p>
      </div>
    ),
  },
  {
    title: 'East Asian Pentatonics',
    icon: '🗾',
    content: (
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>Traditional music from China, Japan, and Korea uses <strong className="text-foreground">anhemitonic pentatonic</strong> scales (five notes with no semitones). Each culture has developed unique variants with specific expressive qualities.</p>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Hirajoshi</strong>: E F A B C — Japanese, koto tuning, contemplative</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Kumoi</strong>: E F# A B C# — Japanese, brighter, cheerful</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">In-Sen</strong>: E F A B C — Japanese, minor-flavored, theatrical (kabuki)</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Yo Scale</strong>: D E G A B — Japanese folk (min'yo), pentatonic</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Chinese Pentatonic</strong>: C D E G A — the basis of all traditional Chinese harmony (gongche notation)</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Pelog</strong>: C D E F# G A# (Javanese/Balinese gamelan, 5 of 7 tones available)</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Slendro</strong>: C D E G A (Javanese gamelan, roughly equidistant 5-tone)</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Akebono</strong>: C Db F G Ab — Japanese, similar to Western minor pentatonic</div>
        </div>
        <p className="text-[10px]"><strong className="text-foreground">Instruments:</strong> koto (13-string zither), shamisen (3-string lute), shakuhachi (bamboo flute), erhu (Chinese fiddle), pipa (Chinese lute), guzheng (Chinese zither), gamelan (Javanese/Balinese percussion orchestra of gongs, metallophones, drums).</p>
      </div>
    ),
  },
  {
    title: 'African American — Blues & Gospel',
    icon: '🎸',
    content: (
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>The blues scale adds <strong className="text-foreground">blue notes</strong> (b3, b5, b7) over a major/minor pentatonic framework, creating expressive microtonal tension. Originated from <strong className="text-foreground">field hollers</strong>, <strong className="text-foreground">work songs</strong>, and <strong className="text-foreground">spirituals</strong> of enslaved Africans in the Mississippi Delta (circa 1870s-1900).</p>
        <div className="space-y-1 text-[10px] mb-2">
          <p><strong className="text-foreground">12-Bar Blues Form:</strong> I-I-I-I / IV-IV-I-I / V-IV-I-I — the most common harmonic structure</p>
          <p><strong className="text-foreground">Call and Response:</strong> Fundamental West African tradition; lead voice answered by group</p>
          <p><strong className="text-foreground">Bent Notes:</strong> Blue notes are microtonally bent for maximum emotional impact — the essence of blues expression</p>
          <p><strong className="text-foreground">Blues Scale:</strong> 1 b3 4 b5 5 b7 — adds the #4/b5 "blue note" to the minor pentatonic</p>
          <p><strong className="text-foreground">Gospel Harmony:</strong> Uses Maj7, sus4, and #4 (Lydian) chords for uplifting, spiritual sound</p>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Delta Blues</strong>: Acoustic, slide guitar, Robert Johnson, Son House, Charley Patton</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Chicago Blues</strong>: Electric, amplified, Muddy Waters, Howlin' Wolf, Buddy Guy</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Texas Blues</strong>: Stevie Ray Vaughan, Albert Collins, T-Bone Walker — cleaner, jazzier</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Piedmont Blues</strong>: Fingerpicking, ragtime-influenced, Blind Blake, Rev. Gary Davis</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Jump Blues</strong>: Louis Jordan, Big Joe Turner — upbeat, horn-driven, precursor to R&B</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Gospel</strong>: Mahalia Jackson, Thomas A. Dorsey — Maj7 chords, soaring vocals, ecstatic joy</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Western Classical Modes',
    icon: '🎼',
    content: (
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>The seven diatonic modes are the foundation of Western music. Each has a unique <strong className="text-foreground">tonal character</strong> determined by its whole/half step pattern. Originated in <strong className="text-foreground">Ancient Greek theory</strong>, codified by medieval church musicians for Gregorian chant.</p>
        <p>Modes are grouped by <strong className="text-foreground">tonal quality</strong>: Major modes (Ionian, Lydian, Mixolydian), Minor modes (Dorian, Phrygian, Aeolian, Locrian). The <strong className="text-foreground">modal theory</strong> expanded during the Renaissance and saw a major revival in 20th-century jazz (Miles Davis's &quot;Kind of Blue&quot;).</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-[10px]">
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-green-400">Ionian</strong> (Maj): W-W-H-W-W-W-H — Happy, stable, the major scale</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-green-400">Dorian</strong>: W-H-W-W-W-H-W — Minor w/ raised 6th, soulful/jazz</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-green-400">Phrygian</strong>: H-W-W-W-H-W-W — Dark Spanish flavor, flamenco</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-green-400">Lydian</strong>: W-W-W-H-W-W-H — Dreamy, floating, #4 sounds ethereal</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-green-400">Mixolydian</strong>: W-W-H-W-W-H-W — Bluesy dominant, rock and roll</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-green-400">Aeolian</strong>: W-H-W-W-H-W-W — Sad, dark, natural minor</div>
          <div className="p-1.5 rounded bg-muted/20 col-span-full"><strong className="text-green-400">Locrian</strong>: H-W-W-H-W-W-W — Unstable, diminished, extremely rare as tonal center</div>
        </div>
        <div className="text-[10px]"><strong className="text-foreground">Modern Modal Usage:</strong> Dorian = Carlos Santana, Phrygian = Metallica (&quot;Wherever I May Roam&quot;), Lydian = Joe Satriani (&quot;Flying in a Blue Dream&quot;), Mixolydian = The Beatles (&quot;Norwegian Wood&quot;).</div>
      </div>
    ),
  },
  {
    title: 'Flamenco (Andalusian)',
    icon: '💃',
    content: (
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>From southern Spain (Andalusia), flamenco uses the <strong className="text-foreground">Phrygian dominant</strong> scale: 1 b2 3 4 5 b6 b7. The <strong className="text-foreground">rasgueado</strong> (strumming) and <strong className="text-foreground">picado</strong> (single-note runs) define the guitar style. Strong Romani (Gitanos) and Moorish influences.</p>
        <p>The flamenco <strong className="text-foreground">compás</strong> (rhythmic cycle) is central — each palo has a specific compás pattern. Flamenco harmony uses <strong className="text-foreground">Andalusian cadence</strong>: Am-G-F-E (bVI-bV-bIV-III).</p>
        <div className="text-[10px] space-y-1">
          <p><strong className="text-foreground">Flamenco &quot;Palos&quot;</strong> (subgenres):</p>
          <div className="grid grid-cols-2 gap-1">
            <div className="p-1 rounded bg-muted/20"><strong>Bulerías</strong>: Fast 12-beat, festive, complex compás</div>
            <div className="p-1 rounded bg-muted/20"><strong>Soleá</strong>: Slow 12-beat, profound, solemn</div>
            <div className="p-1 rounded bg-muted/20"><strong>Alegrías</strong>: Happy 12-beat, bright, from Cádiz</div>
            <div className="p-1 rounded bg-muted/20"><strong>Farruca</strong>: Minor 4-beat, masculine, demanding</div>
            <div className="p-1 rounded bg-muted/20"><strong>Tangos</strong>: 4-beat, lively, from Málaga</div>
            <div className="p-1 rounded bg-muted/20"><strong>Sevillanas</strong>: 3/4, folk dance, annual ferias</div>
            <div className="p-1 rounded bg-muted/20"><strong>Fandango</strong>: 3/4, medium tempo, improvisatory</div>
            <div className="p-1 rounded bg-muted/20"><strong>Granainas</strong>: From Granada, highly ornamented</div>
          </div>
          <p className="mt-1"><strong className="text-foreground">Techniques:</strong> Rasgueado (5-finger fan strum), golpe (tap soundboard), alzapúa (thumb roll), picado (rest-stroke scales), tremolo (p-i-a-m-i pattern), arpeggio (p-i-m-a-m-i).</p>
        </div>
      </div>
    ),
  },
  {
    title: 'Nordic & Celtic Folk Modes',
    icon: '🏔️',
    content: (
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>Northern European folk music (Irish, Scottish, Scandinavian) is built on <strong className="text-foreground">Dorian</strong> and <strong className="text-foreground">Mixolydian</strong> modes plus the <strong className="text-foreground">pentatonic</strong> scale. Irish music features rapid ornamentation: <strong className="text-foreground">cuts</strong>, <strong className="text-foreground">rolls</strong>, and <strong className="text-foreground">crans</strong>.</p>
        <p>Celtic music uses characteristic <strong className="text-foreground">droning</strong> (open strings) and <strong className="text-foreground">double stops</strong>. Scottish music incorporates the <strong className="text-foreground">bagpipe scale</strong> (Mixolydian with raised 4th in some traditions). The <strong className="text-foreground">harp</strong> and <strong className="text-foreground">fiddle</strong> are traditional instruments.</p>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Irish Dorian</strong>: D E F G A B C D — the most common Irish mode</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Scottish Mixolydian</strong>: A B C# D E F# G A — bagpipe scale</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Norwegian</strong>: Uses melodic minor with characteristic leap intervals</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Swedish</strong>: Often uses Lydian mode (#4) for bright folk melodies</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Shepherd's Call</strong>: Norwegian, based on natural harmonics (overtone singing)</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Jigs</strong>: 6/8 time, lively dance, accent on beats 1 and 4</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Reels</strong>: 4/4 or 2/2, very fast, the main Irish dance form</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Hornpipe</strong>: 4/4, swung rhythm, dotted feel, slower than reel</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Balkan & Eastern European',
    icon: '🌍',
    content: (
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>Balkan music uses <strong className="text-foreground">asymmetric time signatures</strong> (7/8, 9/8, 11/8, 13/8) and Byzantine-derived scales. The <strong className="text-foreground">Hungarian minor</strong> (1 2 b3 #4 5 b6 7) and <strong className="text-foreground">Romanian minor</strong> (1 2 b3 #4 5 6 b7) scales are characteristic. Instruments: tamburica, gaida (bagpipe), kaval (flute), gadulka (rebec).</p>
        <div className="text-[10px] space-y-1">
          <p><strong className="text-foreground">Asymmetric Rhythms:</strong></p>
          <div className="grid grid-cols-2 gap-1">
            <div className="p-1 rounded bg-muted/20"><strong>Bulgarian 7/8</strong>: 2+2+3 (<em>rachenitsa</em>) or 2+3+2 or 3+2+2</div>
            <div className="p-1 rounded bg-muted/20"><strong>Bulgarian 9/8</strong>: 2+2+2+3 (<em>kopanitsa</em>)</div>
            <div className="p-1 rounded bg-muted/20"><strong>Greek 9/8</strong>: 3+2+2+2 (<em>zeibekiko</em>) or 2+2+2+3</div>
            <div className="p-1 rounded bg-muted/20"><strong>Macedonian 11/8</strong>: 2+2+3+2+2 — complex, driving</div>
            <div className="p-1 rounded bg-muted/20"><strong>Serbian 7/8</strong>: 3+2+2 — dance (<em>kolo</em>) rhythm</div>
            <div className="p-1 rounded bg-muted/20"><strong>Romanian 5/8</strong>: 2+3 — limping dance feel</div>
            <div className="p-1 rounded bg-muted/20"><strong>Bulgarian 13/8</strong>: 3+2+2+3+3 — very complex</div>
            <div className="p-1 rounded bg-muted/20"><strong>Greek 5/4</strong>: 3+2 (<em>kalamatianos</em>) — folk dance</div>
          </div>
          <p className="mt-1"><strong className="text-foreground">Klezmer</strong> (Jewish folk music): Uses Freygish mode (Phrygian dominant: 1 b2 3 4 5 b6 b7) with characteristic ornamentation (kneytchn — crying note, tshoks — barking, dreydlekh — trills). Scales often include the <strong className="text-foreground">Ukrainian Dorian</strong> (Dorian with #4) and <strong className="text-foreground">Misheberakh</strong> mode.</p>
        </div>
      </div>
    ),
  },
  {
    title: 'African Scales & Polyrhythms',
    icon: '🪘',
    content: (
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>Sub-Saharan African music uses <strong className="text-foreground">pentatonic</strong> and <strong className="text-foreground">hexatonic</strong> scales with <strong className="text-foreground">polyrhythmic</strong> structures. The <strong className="text-foreground">mbira</strong> (thumb piano) tuning systems define the scales. African harmony is often based on parallel fourths and fifths.</p>
        <div className="text-[10px] space-y-1">
          <p><strong className="text-foreground">Key Characteristics:</strong></p>
          <div className="grid grid-cols-2 gap-1">
            <div className="p-1 rounded bg-muted/20"><strong>West African Pentatonic</strong>: C D F G Bb — kora (harp-lute) tuning</div>
            <div className="p-1 rounded bg-muted/20"><strong>Central African</strong>: C D E G A — similar to major pentatonic</div>
            <div className="p-1 rounded bg-muted/20"><strong>Mbira Tuning (Zimbabwe)</strong>: Variable, often C D E G A B or C Eb F G Bb</div>
            <div className="p-1 rounded bg-muted/20"><strong>Ethiopian Qenet</strong>: Tetrachord-based modes, 4 main scales (Tizita, Bati, Ambassel, Anchihoye)</div>
          </div>
          <p className="mt-1"><strong className="text-foreground">Polyrhythm:</strong> 3:2 (hemiola) is the fundamental African rhythm — three equal pulses against two. 4:3, 5:4, 6:5 are common. The <strong className="text-foreground">timeline pattern</strong> (bell pattern, e.g., the standard West African 12/8 pattern) anchors the ensemble.</p>
          <p className="mt-1"><strong className="text-foreground">Instruments:</strong> kora (21-string harp-lute, West Africa), mbira (thumb piano, Zimbabwe), djembe (goblet drum, West Africa), balafon (wooden xylophone, Mali), talking drum (hourglass drum, Nigeria), kudu horn (antelope horn trumpet).</p>
        </div>
      </div>
    ),
  },
  {
    title: 'Indonesian Gamelan Scales',
    icon: '🎭',
    content: (
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>Gamelan music from Java and Bali uses two primary tuning systems: <strong className="text-foreground">Slendro</strong> (five roughly equidistant tones per octave) and <strong className="text-foreground">Pelog</strong> (seven tones, with only five used at a time). These scales do not match Western equal temperament.</p>
        <p>Gamelan orchestras consist of <strong className="text-foreground">metallophones</strong> (saron, gender, slenthem), <strong className="text-foreground">gongs</strong> (gong ageng, kempul), <strong className="text-foreground">drums</strong> (kendang), and sometimes <strong className="text-foreground">singers</strong> (pesindhen). The music is cyclical with a <strong className="text-foreground">gong cycle</strong> (gongan) marking structural phrases.</p>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Slendro</strong>: C D E G A (roughly — exact pitches vary per village)</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Pelog (pathet)</strong>: C D E F# G A# (3 modes: nem, sanga, manyura)</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Balinese Pelog</strong>: C D# E F# A — distinct from Javanese variant</div>
          <div className="p-1.5 rounded bg-muted/20"><strong className="text-foreground">Degung</strong>: Sundanese (West Java) scale, E F# A B C# — similar to Dorian</div>
        </div>
        <p className="text-[10px]"><strong className="text-foreground">Cultural Context:</strong> Gamelan accompanies dance (<em>bedhaya</em>), shadow puppetry (<em>wayang kulit</em>), and ritual ceremonies. The music is deeply spiritual — the gong ageng is believed to house spirits. <strong className="text-foreground">Kebyar</strong> (Balinese): 20th-century style, dramatic, flashy, virtuosic.</p>
      </div>
    ),
  },
  {
    title: 'Latin American Scales',
    icon: '🌴',
    content: (
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>Latin American music blends Indigenous, African, and European (primarily Spanish and Portuguese) traditions. Scales are primarily <strong className="text-foreground">major</strong> and <strong className="text-foreground">minor</strong> with heavy use of the <strong className="text-foreground">Phrygian dominant</strong> (from Spanish influence) and <strong className="text-foreground">blues pentatonic</strong> (from African influence).</p>
        <div className="text-[10px] space-y-1">
          <p><strong className="text-foreground">Characteristic Rhythms & Genres:</strong></p>
          <div className="grid grid-cols-2 gap-1">
            <div className="p-1 rounded bg-muted/20"><strong>Samba</strong>: Brazil, 2/4, fast syncopated, surdo + tamborim</div>
            <div className="p-1 rounded bg-muted/20"><strong>Bossa Nova</strong>: Brazil, 2/4, relaxed samba, João Gilberto</div>
            <div className="p-1 rounded bg-muted/20"><strong>Salsa</strong>: Cuba/NYC, 4/4, clave-based, montuno piano</div>
            <div className="p-1 rounded bg-muted/20"><strong>Son Cubano</strong>: Cuba, 2/4, son clave + tres guitar</div>
            <div className="p-1 rounded bg-muted/20"><strong>Rumba</strong>: Afro-Cuban, 4/4, clave + congas + call-response</div>
            <div className="p-1 rounded bg-muted/20"><strong>Cumbia</strong>: Colombia, 2/4 or 4/4, gaita + accordion + llamador</div>
            <div className="p-1 rounded bg-muted/20"><strong>Bachata</strong>: Dominican, 4/4, bongó + guitar + requinto</div>
            <div className="p-1 rounded bg-muted/20"><strong>Nueva Canción</strong>: Andean, charango + quena + zampoñas</div>
          </div>
          <p className="mt-1"><strong className="text-foreground">Clave Rhythm:</strong> The 3-2 or 2-3 son clave is the foundational rhythm of Cuban music. All other parts relate to the clave. Tresillo (3+3+2) is the basic rhythmic cell of Latin music.</p>
        </div>
      </div>
    ),
  },
];

export function ScalesAroundTheWorld({ className }: { className?: string }) {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(sections.length / perPage);
  const paged = sections.slice(page * perPage, (page + 1) * perPage);

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-base mb-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <CardTitle className="text-base">Scales Around the World</CardTitle>
          <Badge variant="secondary" className="text-[10px] ml-auto">{sections.length} traditions</Badge>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i)} className={cn("cursor-pointer w-2 h-2 rounded-full transition-all", page === i ? "bg-primary w-4" : "bg-muted-foreground/30 hover:bg-muted-foreground/50")} />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">{page + 1} / {totalPages}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {paged.map((s, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border/40">
              <h4 className="font-medium text-sm mb-2 text-emerald-400 flex items-center gap-1.5">
                <span>{s.icon}</span>
                {s.title}
              </h4>
              {s.content}
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-3">
            <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="h-7 w-7 p-0 cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
            <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="h-7 w-7 p-0 cursor-pointer">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ScalesAroundTheWorld;
