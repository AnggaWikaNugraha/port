import { useMemo } from 'react';
import { VocabularyWord } from '../../../types';

export function useOverviewSection(words: VocabularyWord[]) {
  return useMemo(() => {
    const uses = words.flatMap((word) => word.uses);
    const today = new Date();
    const monthlyProgress = Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
      const wordsInMonth = words.filter((word) => {
        const addedAt = new Date(word.createdAt || word.addedAt);
        return !Number.isNaN(addedAt.getTime())
          && addedAt.getFullYear() === monthDate.getFullYear()
          && addedAt.getMonth() === monthDate.getMonth();
      });

      return {
        month: new Intl.DateTimeFormat('en', { month: 'short' }).format(monthDate),
        label: new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(monthDate),
        wordCount: wordsInMonth.length,
        useCount: wordsInMonth.reduce((total, word) => total + word.uses.length, 0),
      };
    });

    return {
      totalWords: words.length,
      totalUses: uses.length,
      newCount: uses.filter((use) => use.mastery === 'New').length,
      learningCount: uses.filter((use) => use.mastery === 'Learning').length,
      familiarCount: uses.filter((use) => ['Familiar', 'Mastered'].includes(use.mastery)).length,
      monthlyProgress,
    };
  }, [words]);
}
