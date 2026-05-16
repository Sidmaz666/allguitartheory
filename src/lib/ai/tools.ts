import type { Tool } from './types';
import {
  SCALES,
  CHORDS,
  TUNINGS,
  INTERVALS,
  NOTES,
  getScaleNotes,
  getChordNotes,
  getTuningById,
  getScaleById,
  getChordById,
} from '@/lib/music-theory';

function formatScaleData(id: string, root?: string) {
  const scale = getScaleById(id);
  if (!scale) return null;
  const notes = root ? getScaleNotes(root as any, scale) : [];
  return {
    name: scale.name,
    aliases: scale.aliases.join(', '),
    category: scale.category,
    intervals: scale.intervals.join(' - '),
    description: scale.description,
    notes: notes.length > 0 ? notes.join(', ') : undefined,
    construction: scale.theory.construction,
    characteristics: scale.theory.characteristics,
    chordQuality: scale.theory.chordQuality.join(', '),
    usageExamples: scale.theory.usageExamples.join(', '),
    difficulty: scale.difficulty,
    parentScale: scale.parentScale,
  };
}

function formatChordData(id: string, root?: string) {
  const chord = getChordById(id);
  if (!chord) return null;
  const notes = root ? getChordNotes(root as any, chord) : [];
  return {
    name: chord.name,
    symbol: chord.symbol,
    category: chord.category,
    intervals: chord.intervals.join(' - '),
    description: chord.description,
    notes: notes.length > 0 ? notes.join(', ') : undefined,
    construction: chord.theory.construction,
    function: chord.theory.function,
    scaleSources: chord.theory.scaleSources.join(', '),
    voiceLeading: chord.theory.voiceLeading,
    substitutions: chord.theory.substitutions.join(', '),
    difficulty: chord.difficulty,
  };
}

function searchScales(query: string) {
  query = query.toLowerCase();
  const results = SCALES.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.aliases.some(a => a.toLowerCase().includes(query)) ||
    s.category.toLowerCase().includes(query)
  ).slice(0, 5);
  return results.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    description: s.description,
    intervals: s.intervals.join(', '),
  }));
}

function searchChords(query: string) {
  query = query.toLowerCase();
  const results = CHORDS.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.symbol.toLowerCase().includes(query) ||
    c.category.toLowerCase().includes(query)
  ).slice(0, 5);
  return results.map(c => ({
    id: c.id,
    name: c.name,
    symbol: c.symbol,
    category: c.category,
    description: c.description,
    intervals: c.intervals.join(', '),
  }));
}

function getTuningDetails(idOrName: string) {
  const tuning = getTuningById(idOrName) || TUNINGS.find(t =>
    t.name.toLowerCase().includes(idOrName.toLowerCase())
  );
  if (!tuning) return null;
  return {
    name: tuning.name,
    notes: tuning.notes.join(', '),
    strings: tuning.strings,
    category: tuning.category,
    description: tuning.description,
  };
}

function getIntervalDetails(name: string) {
  name = name.toLowerCase();
  const entry = Object.entries(INTERVALS).find(([key, val]) =>
    key === name || val.name.toLowerCase().includes(name) || val.short === name
  );
  if (!entry) return null;
  const [key, val] = entry;
  return {
    notation: key,
    name: val.name,
    short: val.short,
    semitones: val.semitones,
  };
}

function getNoteInfo(noteName: string) {
  const upper = noteName.toUpperCase();
  const idx = NOTES.indexOf(upper as any);
  if (idx === -1) return null;
  return {
    name: NOTES[idx],
    flat: ['C', 'D', 'F', 'G', 'A'].includes(NOTES[idx]) ? NOTES[idx] : undefined,
    index: idx,
    frequency: 440 * Math.pow(2, (idx - 9) / 12),
  };
}

function searchAll(query: string) {
  const scales = searchScales(query);
  const chords = searchChords(query);
  const intervalKeys = Object.keys(INTERVALS).filter(k =>
    k.includes(query) || INTERVALS[k].name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
  const intervals = intervalKeys.map(k => ({
    notation: k,
    name: INTERVALS[k].name,
    semitones: INTERVALS[k].semitones,
  }));
  const matchingTunings = TUNINGS.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.notes.some(n => n.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 3).map(t => ({
    name: t.name,
    notes: t.notes.join(', '),
  }));
  return { scales, chords, intervals, tunings: matchingTunings };
}

export const TOOLS: Tool[] = [
  {
    name: 'getScaleInfo',
    description: 'Get detailed information about a musical scale by its ID or name',
    parameters: {
      id: { type: 'string', description: 'Scale ID (e.g., "ionian", "dorian", "minor-pentatonic")', required: true },
      root: { type: 'string', description: 'Optional root note (e.g., "C", "G", "D#")', required: false },
    },
    execute: (params) => {
      const data = formatScaleData(params.id, params.root);
      return data ? JSON.stringify(data, null, 2) : `Scale "${params.id}" not found`;
    },
  },
  {
    name: 'getChordInfo',
    description: 'Get detailed information about a chord by its ID or name',
    parameters: {
      id: { type: 'string', description: 'Chord ID (e.g., "major", "minor", "dom7")', required: true },
      root: { type: 'string', description: 'Optional root note (e.g., "C", "G", "D#")', required: false },
    },
    execute: (params) => {
      const data = formatChordData(params.id, params.root);
      return data ? JSON.stringify(data, null, 2) : `Chord "${params.id}" not found`;
    },
  },
  {
    name: 'searchScales',
    description: 'Search for scales by name, alias, or category',
    parameters: {
      query: { type: 'string', description: 'Search keyword matching scale name or alias', required: true },
    },
    execute: (params) => {
      const results = searchScales(params.query);
      return results.length > 0
        ? JSON.stringify(results, null, 2)
        : `No scales found matching "${params.query}"`;
    },
  },
  {
    name: 'searchChords',
    description: 'Search for chords by name, symbol, or category',
    parameters: {
      query: { type: 'string', description: 'Search keyword matching chord name or symbol', required: true },
    },
    execute: (params) => {
      const results = searchChords(params.query);
      return results.length > 0
        ? JSON.stringify(results, null, 2)
        : `No chords found matching "${params.query}"`;
    },
  },
  {
    name: 'getTuningInfo',
    description: 'Get details about a guitar tuning',
    parameters: {
      id: { type: 'string', description: 'Tuning ID or name (e.g., "standard", "drop-d", "open-g")', required: true },
    },
    execute: (params) => {
      const data = getTuningDetails(params.id);
      return data ? JSON.stringify(data, null, 2) : `Tuning "${params.id}" not found`;
    },
  },
  {
    name: 'getIntervalInfo',
    description: 'Get information about a musical interval',
    parameters: {
      name: { type: 'string', description: 'Interval name, notation, or short form (e.g., "3", "Major 3rd", "b7")', required: true },
    },
    execute: (params) => {
      const data = getIntervalDetails(params.name);
      return data ? JSON.stringify(data, null, 2) : `Interval "${params.name}" not found`;
    },
  },
  {
    name: 'getNoteInfo',
    description: 'Get information about a musical note',
    parameters: {
      name: { type: 'string', description: 'Note name (e.g., "C", "F#", "Bb")', required: true },
    },
    execute: (params) => {
      const data = getNoteInfo(params.name);
      return data ? JSON.stringify(data, null, 2) : `Note "${params.name}" not found`;
    },
  },
  {
    name: 'searchMusicTheory',
    description: 'Search across all music theory data (scales, chords, tunings, intervals)',
    parameters: {
      query: { type: 'string', description: 'Search keyword to find across all music theory content', required: true },
    },
    execute: (params) => {
      const results = searchAll(params.query);
      if (results.scales.length === 0 && results.chords.length === 0 &&
          results.intervals.length === 0 && results.tunings.length === 0) {
        return `No results found for "${params.query}"`;
      }
      return JSON.stringify(results, null, 2);
    },
  },
];

export const TOOL_MAP = new Map(TOOLS.map(t => [t.name, t]));

export {
  formatScaleData,
  formatChordData,
  searchScales,
  searchChords,
  getTuningDetails,
  getIntervalDetails,
  getNoteInfo,
  searchAll,
};
