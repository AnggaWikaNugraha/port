import { useEffect, useState } from 'react';
import { LanguageDirection, Mastery, PartOfSpeech, VocabularyUse, VocabularyWord, WordFamily, WordFamilySelection } from '../../../types';

type DraftUse = Omit<VocabularyUse, 'id'>;
const blankUse = (partOfSpeech: PartOfSpeech): DraftUse => ({ partOfSpeech, meaning: '', example: '', exampleTranslation: '', mastery: 'New' });

function getInitialValues(initialWord?: VocabularyWord | null) {
  return {
    word: initialWord?.word || '',
    direction: initialWord?.sourceLang === 'id' ? 'id-en' as const : 'en-id' as const,
    uses: initialWord?.uses.map(({ id: _id, ...use }) => use) || [],
  };
}

export function useVocabularyForm(initialWord?: VocabularyWord | null, initialFamily?: WordFamily | null) {
  const initialValues = getInitialValues(initialWord);
  const [word, setWord] = useState(initialValues.word);
  const [direction, setDirection] = useState<LanguageDirection>(initialValues.direction);
  const [uses, setUses] = useState<DraftUse[]>(initialValues.uses);
  const [familyMode, setFamilyMode] = useState<WordFamilySelection['mode']>(initialFamily ? 'existing' : 'none');
  const [familyId, setFamilyId] = useState(initialFamily?.id || '');
  const [familyRoot, setFamilyRoot] = useState('');

  useEffect(() => {
    const values = getInitialValues(initialWord);
    setWord(values.word);
    setDirection(values.direction);
    setUses(values.uses);
    setFamilyMode(initialFamily ? 'existing' : 'none');
    setFamilyId(initialFamily?.id || '');
    setFamilyRoot('');
  }, [initialWord, initialFamily]);
  const updateUse = (index: number, field: keyof DraftUse, value: string) => setUses((current) => current.map((use, useIndex) => useIndex === index ? { ...use, [field]: value as PartOfSpeech | Mastery } : use));
  const addUse = (partOfSpeech: PartOfSpeech) => setUses((current) => [...current, blankUse(partOfSpeech)]);
  const removeUse = (index: number) => setUses((current) => current.filter((_, useIndex) => useIndex !== index));
  const buildWord = (): VocabularyWord | null => {
    if (!word.trim() || uses.length === 0 || uses.some((use) => !use.meaning.trim() || !use.example.trim())) return null;
    const id = `${word.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    return {
      id,
      word: word.trim(),
      sourceLang: direction === 'en-id' ? 'en' : 'id',
      targetLang: direction === 'en-id' ? 'id' : 'en',
      addedAt: new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()),
      uses: uses.map((use, index) => ({ ...use, id: `${id}-${index}` })),
    };
  };
  const buildFamilySelection = (): WordFamilySelection | null => {
    if (familyMode === 'none') return { mode: 'none' };
    if (familyMode === 'existing' && familyId) return { mode: 'existing', familyId };
    if (familyMode === 'new' && familyRoot.trim()) return { mode: 'new', rootText: familyRoot.trim() };
    return null;
  };
  const chooseFamilyMode = (mode: WordFamilySelection['mode']) => {
    setFamilyMode(mode);
    if (mode === 'new' && !familyRoot.trim()) setFamilyRoot(word.trim());
  };
  const reset = () => {
    const values = getInitialValues(initialWord);
    setWord(values.word);
    setDirection(values.direction);
    setUses(values.uses);
    setFamilyMode(initialFamily ? 'existing' : 'none');
    setFamilyId(initialFamily?.id || '');
    setFamilyRoot('');
  };
  return { word, setWord, direction, setDirection, uses, updateUse, addUse, removeUse, familyMode, chooseFamilyMode, familyId, setFamilyId, familyRoot, setFamilyRoot, buildWord, buildFamilySelection, reset };
}
