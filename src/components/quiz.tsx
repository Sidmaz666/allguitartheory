'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  NOTES,
  SCALES,
  CHORDS,
  type Note,
  type ScaleDefinition,
  type ChordDefinition,
} from '@/lib/music-theory';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Trophy, RefreshCw, Star, Zap, Sparkles, HelpCircle, LogOut } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: Difficulty;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const diffIcon: Record<Difficulty, any> = { easy: Star, medium: Zap, hard: Sparkles, expert: HelpCircle };
const diffLabel: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert' };

function generateQuestions(d: Difficulty): QuizQuestion[] {
  const scalePool = d === 'easy' ? SCALES.filter(s => s.difficulty <= 1).slice(0, 6)
    : d === 'medium' ? SCALES.filter(s => s.difficulty <= 2).slice(0, 12)
    : d === 'hard' ? SCALES.filter(s => s.difficulty <= 3).slice(0, 20)
    : SCALES;

  const chordPool = d === 'easy' ? CHORDS.filter(c => c.difficulty <= 1).slice(0, 6)
    : d === 'medium' ? CHORDS.filter(c => c.difficulty <= 2).slice(0, 10)
    : d === 'hard' ? CHORDS.filter(c => c.difficulty <= 3).slice(0, 16)
    : CHORDS;

  const allS: ScaleDefinition[] = scalePool;
  const allC: ChordDefinition[] = chordPool;
  const questions: QuizQuestion[] = [];

  // Scale identification
  for (const s of shuffle(allS).slice(0, 3)) {
    const wrong = shuffle(allS.filter(x => x.id !== s.id)).slice(0, 3);
    const opts = shuffle([s.name, ...wrong.map(x => x.name)]);
    questions.push({
      question: `Which scale has the intervals: ${s.intervals.slice(0, 7).join(', ')}${s.intervals.length > 7 ? '...' : ''}?`,
      options: opts,
      correct: opts.indexOf(s.name),
      explanation: `The ${s.name} has intervals ${s.intervals.join(', ')}. ${s.description}`,
      difficulty: s.difficulty <= 2 ? 'easy' : s.difficulty <= 3 ? 'medium' : 'hard',
    });
  }

  // Chord identification
  for (const c of shuffle(allC).slice(0, 3)) {
    const wrong = shuffle(allC.filter(x => x.id !== c.id)).slice(0, 3);
    const cName = c.symbol || 'Major';
    const opts = shuffle([cName, ...wrong.map(x => x.symbol || 'Major')]);
    questions.push({
      question: `Which chord type has intervals: ${c.intervals.join(', ')}?`,
      options: opts,
      correct: opts.indexOf(cName),
      explanation: `A ${c.name} (${c.symbol || 'Major'}) contains intervals ${c.intervals.join(', ')}. ${c.description}`,
      difficulty: c.difficulty <= 2 ? 'easy' : c.difficulty <= 3 ? 'medium' : 'hard',
    });
  }

  // Construction questions
  questions.push({
    question: 'How many notes are in a standard Major Scale (Ionian)?',
    options: ['5', '6', '7', '8'],
    correct: 2,
    explanation: 'The Major Scale has 7 notes: 1, 2, 3, 4, 5, 6, 7 (Root, Major 2nd, Major 3rd, Perfect 4th, Perfect 5th, Major 6th, Major 7th).',
    difficulty: 'easy',
  });

  questions.push({
    question: 'What is the interval between the 1st and 3rd note of a Major Triad?',
    options: ['Minor 3rd (3 semitones)', 'Major 3rd (4 semitones)', 'Perfect 5th (7 semitones)', 'Major 2nd (2 semitones)'],
    correct: 1,
    explanation: 'A Major Triad has a Major 3rd (4 semitones) between the root and the third, giving it a bright, happy sound.',
    difficulty: 'easy',
  });

  const nOfA = NOTES.indexOf('A');
  const relMin = NOTES[(nOfA - NOTES.indexOf('C') + 12) % 12] || 'A';
  const enharmonics: [string, string][] = [['C#', 'Db'], ['D#', 'Eb'], ['F#', 'Gb'], ['G#', 'Ab'], ['A#', 'Bb']];
  const enh = enharmonics[Math.floor(Math.random() * enharmonics.length)];

  questions.push({
    question: 'What is the relative minor of C Major?',
    options: ['E Minor', 'D Minor', 'A Minor', 'G Minor'],
    correct: 2,
    explanation: 'The relative minor of C Major is A Minor. They share the same key signature (no sharps/flats). The relative minor is found a minor 3rd below the major key.',
    difficulty: 'easy',
  });

  questions.push({
    question: 'A Dominant 7th chord is built from which intervals?',
    options: ['1, 3, 5, 7', '1, 3, 5, b7', '1, b3, 5, b7', '1, 3, #5, b7'],
    correct: 1,
    explanation: 'A Dominant 7th chord is 1, 3, 5, b7 — a major triad with a minor 7th. It creates strong tension that resolves to the tonic.',
    difficulty: 'medium',
  });

  questions.push({
    question: `In which key does the chord progression ii-V-I resolve to?`,
    options: ['C Major', 'G Major', 'D Major', 'F Major'],
    correct: 0,
    explanation: 'The ii-V-I progression (Dm-G-C) resolves to C Major. In C: ii = Dm, V = G, I = C. This is the most common jazz cadence.',
    difficulty: 'medium',
  });

  questions.push({
    question: 'What is the interval between the root and the 6th degree of a scale called?',
    options: ['Minor 6th (8 semitones)', 'Major 6th (9 semitones)', 'Augmented 6th (10 semitones)', 'Perfect 6th (9 semitones)'],
    correct: 1,
    explanation: 'The interval from the root to the 6th degree is a Major 6th (9 semitones). In a natural minor scale, this is a Minor 6th (8 semitones).',
    difficulty: 'medium',
  });

  if (d !== 'easy') {
    questions.push({
      question: 'What distinguishes the Dorian mode from the natural minor scale?',
      options: ['Flat 2nd', 'Major 6th', 'Sharp 4th', 'Flat 7th'],
      correct: 1,
      explanation: 'Dorian has a Major 6th (natural 6) while natural minor (Aeolian) has a minor 6th (b6). Dorian = 1, 2, b3, 4, 5, 6, b7.',
      difficulty: 'medium',
    });

    questions.push({
      question: 'What is a "tritone" interval?',
      options: ['3 semitones (Minor 3rd)', '5 semitones (Perfect 4th)', '6 semitones (Augmented 4th/Diminished 5th)', '7 semitones (Perfect 5th)'],
      correct: 2,
      explanation: 'A tritone is 6 semitones (Augmented 4th or Diminished 5th). It divides the octave equally and creates maximum dissonance, essential in dominant chords.',
      difficulty: 'hard',
    });

    questions.push({
      question: 'The Blues Scale adds which "blue note" to the Minor Pentatonic?',
      options: ['Major 3rd', 'Flat 5th', 'Major 7th', 'Flat 9th'],
      correct: 1,
      explanation: 'The Blues Scale adds a b5 (flat 5th) to the Minor Pentatonic, creating the characteristic bluesy tension. Minor Pentatonic = 1, b3, 4, 5, b7; Blues adds b5.',
      difficulty: 'medium',
    });

    const modeScale = shuffle(allS.filter(s => s.modeNumber && s.parentScale)).slice(0, 1)[0];
    if (modeScale) {
      questions.push({
        question: `${modeScale.name} is which mode of the ${modeScale.parentScale}?`,
        options: shuffle([
          `Mode ${modeScale.modeNumber} (${['I','II','III','IV','V','VI','VII'][(modeScale.modeNumber||1)-1]})`,
          `Mode ${((modeScale.modeNumber||2) % 7) + 1}`,
          `Mode ${((modeScale.modeNumber||3) % 7) + 1}`,
          `Mode ${((modeScale.modeNumber||4) % 7) + 1}`,
        ]),
        correct: 0,
        explanation: `${modeScale.name} is mode ${modeScale.modeNumber} of ${modeScale.parentScale}. The modes are numbered sequentially from the parent scale.`,
        difficulty: 'hard',
      });
    }
  }

  if (d === 'expert') {
    questions.push({
      question: 'The Whole Tone Scale contains how many unique pitches?',
      options: ['5', '6', '7', '8'],
      correct: 1,
      explanation: 'The Whole Tone Scale has 6 notes, each separated by a whole step (2 semitones). It creates a dreamy, ambiguous sound with no leading tone.',
      difficulty: 'hard',
    });

    questions.push({
      question: 'A Diminished 7th chord (dim7) uses which interval for its 7th?',
      options: ['Minor 7th (b7)', 'Major 7th (7)', 'Diminished 7th (bb7)', 'Dominant 7th (b7)'],
      correct: 2,
      explanation: 'A dim7 chord uses a diminished 7th (bb7 = double-flat 7th = 9 semitones from root). The intervals are 1, b3, b5, bb7, equally spaced 3 semitones apart.',
      difficulty: 'hard',
    });

    questions.push({
      question: 'The Super Locrian (Altered Scale) is the 7th mode of which parent scale?',
      options: ['Major Scale', 'Harmonic Minor', 'Melodic Minor', 'Whole Tone'],
      correct: 2,
      explanation: 'Super Locrian (Altered Scale) is the 7th mode of Melodic Minor (Jazz Minor). Its intervals: 1, b2, #2, 3, b5, #5, b7 — all possible alterations.',
      difficulty: 'expert',
    });
  }

  return shuffle(questions);
}

export function Quiz({ className }: { className?: string }) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [started, setStarted] = useState(false);

  const startQuiz = () => {
    const qs = generateQuestions(difficulty);
    setQuestions(qs);
    setCurrentQ(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setTotal(0);
    setStarted(true);
    setQuizDone(false);
  };

  const handleSelect = (i: number) => {
    if (submitted || !started) return;
    setSelected(i);
    handleSubmit(i);
  };

  const handleSubmit = (i: number) => {
    setSubmitted(true);
    setTotal(t => t + 1);
    if (i === questions[currentQ].correct) setScore(s => s + 1);
  };

  const [quizDone, setQuizDone] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const finishQuiz = (s: number, t: number) => {
    setQuizDone(true);
    setStarted(false);
    setFinalScore(s);
    setFinalTotal(t);
  };

  const quit = () => {
    finishQuiz(score, total);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      finishQuiz(score, total);
      return;
    }
    setCurrentQ(q => q + 1);
    setSelected(null);
    setSubmitted(false);
  };

  const q = questions[currentQ];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            Theory Quiz
          </CardTitle>
          {started && (
            <div className="flex items-center gap-2">
              <button onClick={quit} className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-all">
                <LogOut className="w-3 h-3" /> Quit
              </button>
              <Badge variant="secondary" className="text-xs gap-1"><Trophy className="w-3 h-3" /> {score}/{total}</Badge>
            </div>
          )}
        </div>
        {!started && (
          <div className="flex items-center gap-1.5 mt-2">
            {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map(d => {
              const Icon = diffIcon[d];
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "cursor-pointer flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium border transition-all",
                    difficulty === d ? "bg-muted text-foreground border-border" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              );
            })}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!started && !quizDone ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="text-sm text-muted-foreground text-center max-w-md">
              Test your music theory knowledge with questions about scales, chords, intervals, and progressions.
              {score > 0 && total > 0 && (
                <div className="mt-2 font-semibold text-foreground">Last session: {score}/{total} correct</div>
              )}
            </div>
            <Button onClick={startQuiz} className="gap-2">
              <Brain className="w-4 h-4" /> Start Quiz
            </Button>
          </div>
        ) : quizDone ? (
          <div className="py-6 text-center">
            <Trophy className="w-10 h-10 text-primary mx-auto mb-3" />
            <div className="text-lg font-bold text-primary mb-1">Quiz Complete</div>
            <div className="text-sm text-muted-foreground mb-1">
              You answered <strong className="text-foreground">{finalScore}</strong> out of <strong className="text-foreground">{finalTotal}</strong> correctly
            </div>
            <div className="text-2xl font-bold text-primary mb-4">
              {finalTotal > 0 ? Math.round(finalScore / finalTotal * 100) : 0}%
            </div>
            <Button onClick={startQuiz} className="gap-2">
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </Button>
          </div>
        ) : !q ? (
          <div className="text-center py-4 text-muted-foreground text-sm">No questions generated for this difficulty.</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Question {currentQ + 1} of {questions.length}</span>
              <span className={cn("font-medium", difficulty === 'easy' ? 'text-emerald-400' : difficulty === 'medium' ? 'text-amber-400' : difficulty === 'hard' ? 'text-orange-400' : 'text-rose-400')}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </div>

            <div className="w-full bg-muted/30 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
            </div>

            <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
              <p className="text-sm font-medium">{q.question}</p>
            </div>

            <div className="space-y-1.5">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={cn(
                    "cursor-pointer w-full text-left px-3 py-2 rounded-md text-sm border transition-all",
                    submitted && i === q.correct && "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
                    submitted && i === selected && i !== q.correct && "bg-rose-500/20 border-rose-500/50 text-rose-400",
                    !submitted && selected === i && "bg-primary/20 border-primary/50 text-primary",
                    !submitted && selected !== i && "bg-muted/20 border-border/40 hover:bg-muted/30 hover:border-border/60 text-muted-foreground hover:text-foreground",
                    submitted && "cursor-default"
                  )}
                  disabled={submitted}
                >
                  <span className="font-mono text-xs text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              ))}
            </div>

            {submitted && (
              <div className={cn(
                "p-3 rounded-lg border text-sm",
                selected === q.correct ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30"
              )}>
                <div className={cn("font-bold mb-1", selected === q.correct ? "text-emerald-400" : "text-rose-400")}>
                  {selected === q.correct ? '✓ Correct!' : '✗ Incorrect'}
                </div>
                <div className="text-xs text-muted-foreground">{q.explanation}</div>
                <Button onClick={nextQuestion} className="mt-3 gap-2" size="sm">
                  {currentQ + 1 >= questions.length ? (
                    <><Trophy className="w-3.5 h-3-5" /> See Results</>
                  ) : (
                    <><RefreshCw className="w-3.5 h-3.5" /> Next Question</>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {started && currentQ + 1 >= questions.length && submitted && (
          <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/30 text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-lg font-bold text-primary">Quiz Complete!</div>
            <div className="text-sm text-muted-foreground">Score: {score}/{total} ({total > 0 ? Math.round(score / total * 100) : 0}%)</div>
            <Button onClick={startQuiz} className="mt-3 gap-2" size="sm">
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Quiz;
