export type PartOfSpeech =
  | 'Noun'
  | 'Verb'
  | 'Adjective'
  | 'Adverb'
  | 'Pronoun'
  | 'Preposition'
  | 'Conjunction'
  | 'Interjection';

export type Mastery = 'New' | 'Learning' | 'Familiar' | 'Mastered';
export type LanguageCode = 'en' | 'id';
export type LanguageDirection = 'en-id' | 'id-en';

export type VocabularyUse = {
  id: string;
  partOfSpeech: PartOfSpeech;
  meaning: string;
  example: string;
  exampleTranslation?: string;
  mastery: Mastery;
};

export type VocabularyWord = {
  id: string;
  word: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  addedAt: string;
  createdAt?: string;
  uses: VocabularyUse[];
};

export type WordFamily = {
  id: string;
  rootText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  memberIds: string[];
};

export type WordFamilySelection =
  | { mode: 'none' }
  | { mode: 'existing'; familyId: string }
  | { mode: 'new'; rootText: string };
