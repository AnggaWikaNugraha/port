import { useMemo, useState } from 'react';
import { LanguageDirection, Mastery, VocabularyWord } from '../../../types';

export function useVocabularyTable(words: VocabularyWord[]) {
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState<LanguageDirection>('en-id');
  const [mastery, setMastery] = useState<'All' | Mastery>('All');
  const [collapsedLetters, setCollapsedLetters] = useState<string[]>([]);

  const filteredWords = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return words.filter((word) => {
      const matchesDirection = `${word.sourceLang}-${word.targetLang}` === direction;
      const matchesText = !needle || [word.word, ...word.uses.flatMap((use) => [use.meaning, use.example, use.partOfSpeech])].join(' ').toLowerCase().includes(needle);
      const matchesMastery = mastery === 'All' || word.uses.some((use) => use.mastery === mastery);
      return matchesDirection && matchesText && matchesMastery;
    }).sort((a, b) => a.word.localeCompare(b.word));
  }, [direction, mastery, query, words]);

  const groups = useMemo(() => filteredWords.reduce<Record<string, VocabularyWord[]>>((result, word) => {
    const letter = word.word.charAt(0).toUpperCase() || '#';
    (result[letter] ??= []).push(word);
    return result;
  }, {}), [filteredWords]);

  const toggleLetter = (letter: string) => setCollapsedLetters((current) => current.includes(letter) ? current.filter((item) => item !== letter) : [...current, letter]);

  return { query, setQuery, direction, setDirection, mastery, setMastery, collapsedLetters, toggleLetter, groups, filteredWords };
}

