import { useCallback, useEffect, useState } from 'react';
import { Mastery, VocabularyWord, WordFamily, WordFamilySelection } from '../types';

type ApiVocabularyWord = {
  id: string;
  sourceText: string;
  sourceLang: 'en' | 'id';
  targetLang: 'en' | 'id';
  createdAt: string;
  uses: Array<{
    id: string;
    partOfSpeech: VocabularyWord['uses'][number]['partOfSpeech'];
    meaning: string;
    example: string;
    exampleTranslation?: string;
    masteryStatus: 'new' | 'learning' | 'familiar' | 'mastered';
  }>;
};

type ApiWordFamily = {
  id: string;
  rootText: string;
  sourceLang: 'en' | 'id';
  targetLang: 'en' | 'id';
  memberIds: string[];
};

const masteryFromApi: Record<ApiVocabularyWord['uses'][number]['masteryStatus'], Mastery> = {
  new: 'New',
  learning: 'Learning',
  familiar: 'Familiar',
  mastered: 'Mastered',
};

const masteryToApi: Record<Mastery, ApiVocabularyWord['uses'][number]['masteryStatus']> = {
  New: 'new',
  Learning: 'learning',
  Familiar: 'familiar',
  Mastered: 'mastered',
};

function formatAddedDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function mapApiWord(word: ApiVocabularyWord): VocabularyWord {
  return {
    id: word.id,
    word: word.sourceText,
    sourceLang: word.sourceLang,
    targetLang: word.targetLang,
    addedAt: formatAddedDate(word.createdAt),
    createdAt: word.createdAt,
    uses: word.uses.map((use) => ({
      id: use.id,
      partOfSpeech: use.partOfSpeech,
      meaning: use.meaning,
      example: use.example,
      exampleTranslation: use.exampleTranslation || '',
      mastery: masteryFromApi[use.masteryStatus],
    })),
  };
}

function mapApiFamily(family: ApiWordFamily): WordFamily {
  return {
    id: family.id,
    rootText: family.rootText,
    sourceLang: family.sourceLang,
    targetLang: family.targetLang,
    memberIds: family.memberIds,
  };
}

async function readResponse(response: Response) {
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error || 'Something went wrong.');
  }
  return body;
}

export function useLanguageLab() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [families, setFamilies] = useState<WordFamily[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [wordToEdit, setWordToEdit] = useState<VocabularyWord | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<WordFamily | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [canManage, setCanManage] = useState(false);

  const refreshWords = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await fetch('/api/public/vocabulary');
      const body = await readResponse(response);
      setWords(Array.isArray(body.words) ? body.words.map(mapApiWord) : []);
      setFamilies(Array.isArray(body.families) ? body.families.map(mapApiFamily) : []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load vocabulary.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshWords();
  }, [refreshWords]);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch('/api/profile');
        setCanManage(response.ok);
      } catch {
        setCanManage(false);
      }
    }

    void checkSession();
  }, []);

  const createWord = async (word: VocabularyWord, family: WordFamilySelection) => {
    const response = await fetch('/api/admin/vocabulary/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceText: word.word,
        sourceLang: word.sourceLang,
        targetLang: word.targetLang,
        uses: word.uses.map((use) => ({
          partOfSpeech: use.partOfSpeech,
          meaning: use.meaning,
          example: use.example,
          exampleTranslation: use.exampleTranslation || null,
          masteryStatus: masteryToApi[use.mastery],
        })),
        family: family.mode === 'none'
          ? null
          : family.mode === 'existing'
            ? { familyId: family.familyId }
            : { rootText: family.rootText },
      }),
    });

    await readResponse(response);
    await refreshWords();
  };

  const updateWord = async (id: string, word: VocabularyWord, family: WordFamilySelection) => {
    const response = await fetch('/api/admin/vocabulary/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        sourceText: word.word,
        sourceLang: word.sourceLang,
        targetLang: word.targetLang,
        uses: word.uses.map((use) => ({
          partOfSpeech: use.partOfSpeech,
          meaning: use.meaning,
          example: use.example,
          exampleTranslation: use.exampleTranslation || null,
          masteryStatus: masteryToApi[use.mastery],
        })),
        family: family.mode === 'none'
          ? null
          : family.mode === 'existing'
            ? { familyId: family.familyId }
            : { rootText: family.rootText },
      }),
    });

    await readResponse(response);
    await refreshWords();
  };

  const importWords = async (payload: unknown) => {
    const response = await fetch('/api/admin/vocabulary/bulk-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    await readResponse(response);
    await refreshWords();
  };

  return {
    words,
    families,
    isLoading,
    loadError,
    canManage,
    isAddModalOpen,
    wordToEdit,
    selectedFamily,
    openAddModal: () => {
      setWordToEdit(null);
      setIsAddModalOpen(true);
    },
    openEditModal: (word: VocabularyWord) => {
      setWordToEdit(word);
      setIsAddModalOpen(true);
    },
    openFamilyModal: (family: WordFamily) => setSelectedFamily(family),
    closeFamilyModal: () => setSelectedFamily(null),
    closeAddModal: () => {
      setWordToEdit(null);
      setIsAddModalOpen(false);
    },
    createWord,
    updateWord,
    importWords,
    refreshWords,
  };
}
