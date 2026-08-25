import { useMemo, useState } from 'react';

type ImportPreview = {
  families: number;
  words: number;
  uses: number;
};

function getPreview(raw: string): { preview: ImportPreview | null; error: string | null; payload: unknown } {
  try {
    const payload = JSON.parse(raw) as {
      families?: Array<{ words?: Array<{ uses?: unknown[] }> }>;
      wordsWithoutFamily?: Array<{ uses?: unknown[] }>;
    };
    const familyWords = payload.families?.flatMap((family) => family.words || []) || [];
    const standaloneWords = payload.wordsWithoutFamily || [];
    const words = [...familyWords, ...standaloneWords];

    return {
      payload,
      error: words.length ? null : 'Tambahkan minimal satu word ke JSON.',
      preview: {
        families: payload.families?.length || 0,
        words: words.length,
        uses: words.reduce((total, word) => total + (word.uses?.length || 0), 0),
      },
    };
  } catch {
    return { payload: null, preview: null, error: 'JSON belum valid.' };
  }
}

export function useBulkVocabularyImport() {
  const [raw, setRaw] = useState('');
  const result = useMemo(() => getPreview(raw), [raw]);

  return {
    raw,
    setRaw,
    ...result,
    reset: () => setRaw(''),
  };
}
