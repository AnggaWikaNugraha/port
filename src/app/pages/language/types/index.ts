export type LanguageCode = "en" | "id";

export type LanguageEntry = {
  id: string;
  sourceText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  meanings: string[];
  exampleSource?: string | null;
  exampleTarget?: string | null;
  notes?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
};

export type LanguageStats = {
  entries: number;
  meanings: number;
  tags: number;
};

export type LanguagePayload = {
  entries: LanguageEntry[];
  availableTags: string[];
  stats: LanguageStats;
};
