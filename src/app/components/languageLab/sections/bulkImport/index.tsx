'use client';

import { useMemo, useState } from 'react';
import PartOfSpeechBadge from '../../shared/PartOfSpeechBadge';
import { PartOfSpeech } from '../../types';
import { useBulkVocabularyImport } from './hooks/useBulkVocabularyImport';

type BulkImportPanelProps = {
  onCancel: () => void;
  onComplete: () => void;
  onImport: (payload: unknown) => Promise<void>;
};

type PreviewUse = {
  partOfSpeech: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
};

type PreviewWord = {
  family: string;
  word: string;
  uses: PreviewUse[];
};

const JSON_TEMPLATE = `{
  "sourceLang": "en",
  "targetLang": "id",
  "families": [{
    "root": "breeze",
    "words": [{
      "word": "breeze",
      "uses": [{
        "partOfSpeech": "Noun",
        "meaning": "angin sepoi-sepoi; angin ringan",
        "example": "A cool breeze came through the open window.",
        "exampleTranslation": "Angin sepoi-sepoi yang sejuk masuk melalui jendela yang terbuka."
      }, {
        "partOfSpeech": "Verb",
        "meaning": "menyelesaikan sesuatu dengan mudah",
        "example": "She breezed through the interview.",
        "exampleTranslation": "Dia menjalani wawancara itu dengan mudah."
      }]
    }, {
      "word": "breezy",
      "uses": [{
        "partOfSpeech": "Adjective",
        "meaning": "berangin sepoi-sepoi",
        "example": "It was a breezy afternoon by the beach.",
        "exampleTranslation": "Saat itu sore yang berangin sepoi-sepoi di tepi pantai."
      }]
    }, {
      "word": "breezily",
      "uses": [{
        "partOfSpeech": "Adverb",
        "meaning": "dengan santai dan ringan",
        "example": "He breezily said that everything would be fine.",
        "exampleTranslation": "Dia berkata dengan santai bahwa semuanya akan baik-baik saja."
      }]
    }]
  }],
  "wordsWithoutFamily": []
}`;

function getPreviewWords(payload: unknown): PreviewWord[] {
  if (!payload || typeof payload !== 'object') return [];
  const source = payload as {
    families?: Array<{ root?: string; words?: Array<{ word?: string; uses?: Array<Partial<PreviewUse>> }> }>;
    wordsWithoutFamily?: Array<{ word?: string; uses?: Array<Partial<PreviewUse>> }>;
  };
  const toPreviewWord = (family: string, word: { word?: string; uses?: Array<Partial<PreviewUse>> }): PreviewWord => ({
    family,
    word: word.word || '—',
    uses: (word.uses || []).map((use) => ({
      partOfSpeech: use.partOfSpeech || '—',
      meaning: use.meaning || '—',
      example: use.example || '—',
      exampleTranslation: use.exampleTranslation || '—',
    })),
  });

  return [
    ...(source.families || []).flatMap((family) => (family.words || []).map((word) => toPreviewWord(family.root || 'No word family', word))),
    ...(source.wordsWithoutFamily || []).map((word) => toPreviewWord('No word family', word)),
  ];
}

export default function BulkImportPanel({ onCancel, onComplete, onImport }: BulkImportPanelProps) {
  const importer = useBulkVocabularyImport();
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const previewWords = useMemo(() => getPreviewWords(importer.payload), [importer.payload]);

  const handleImport = async () => {
    if (!importer.payload || importer.error) {
      setImportError(importer.error || 'JSON belum valid.');
      return;
    }

    setIsImporting(true);
    setImportError(null);
    try {
      await onImport(importer.payload);
      importer.reset();
      onComplete();
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Unable to import vocabulary.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="mt-6">
      <section className="rounded-2xl border border-[#c9dedf] bg-[#e8f3f3] p-4">
        <h3 className="font-bold text-[#24555d]">Guide untuk ChatGPT</h3>
        <p className="mt-1 text-sm leading-6 text-[#53767b]">Minta ChatGPT hanya mengubah catatanmu ke format ini—jangan membuat arti, contoh, atau word baru. Satu arti/POS berbeda harus menjadi satu object <code>uses</code>. Jika terjemahan contoh belum ada, hapus field <code>exampleTranslation</code>.</p>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-[#163e44] p-4 text-xs leading-5 text-[#def1f1]">{JSON_TEMPLATE}</pre>
      </section>

      <section className="mt-5">
        <div className="mb-2 flex items-center justify-between"><label className="text-xs font-bold uppercase tracking-[.14em] text-[#6e888b]">Import JSON</label>{importer.preview && <span className="text-xs font-semibold text-[#3e7378]">{importer.preview.families} families · {importer.preview.words} words · {importer.preview.uses} uses</span>}</div>
        <textarea value={importer.raw} onChange={(event) => importer.setRaw(event.target.value)} placeholder="Paste JSON di sini..." spellCheck={false} className="min-h-52 w-full resize-y rounded-2xl border border-[#cbdede] bg-[#163e44] p-4 font-mono text-sm leading-6 text-[#e4f4f4] outline-none focus:border-[#52929a]" />
        {importer.error && <p className="mt-2 text-sm text-[#a45143]">{importer.error}</p>}
      </section>

      {previewWords.length > 0 && (
        <section className="mt-5 space-y-5">
          <div><h3 className="font-[Georgia,serif] text-xl font-bold text-[#315c63]">Filled vocabulary</h3><p className="text-sm text-[#71888b]">Data JSON langsung mengisi table Create di bawah. Periksa sebelum import.</p></div>
          {previewWords.map((item, wordIndex) => (
            <section key={`${item.word}-${wordIndex}`} className="overflow-hidden rounded-2xl border border-[#d5e3e3] bg-white">
              <div className="flex flex-col gap-3 border-b border-[#dce8e8] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#6e888b]">English word</p><p className="mt-1 text-xl font-[Georgia,serif] font-bold text-[#244f56]">{item.word}</p></div>
                <div className="rounded-xl border border-[#cbdede] bg-[#f8fbfb] px-3 py-2 text-sm font-semibold text-[#52747a]">{item.family}</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] border-collapse text-left">
                  <thead className="bg-[#e7f1f1] text-[10px] font-bold uppercase tracking-[.14em] text-[#66868a]"><tr><th className="px-3 py-3">Part of Speech</th><th className="px-3 py-3">Arti Indonesia</th><th className="px-3 py-3">Example</th><th className="px-3 py-3">Terjemahan Example</th></tr></thead>
                  <tbody className="divide-y divide-[#e1ebeb]">{item.uses.map((use, useIndex) => <tr key={`${use.partOfSpeech}-${useIndex}`} className="align-top"><td className="border-r border-[#e1ebeb] p-3"><PartOfSpeechBadge partOfSpeech={use.partOfSpeech as PartOfSpeech} size="md" /></td><td className="border-r border-[#e1ebeb] p-3"><textarea readOnly value={use.meaning} rows={3} className="w-48 resize-none rounded-lg border border-[#d5e2e2] bg-[#f8fbfb] px-3 py-2.5 text-sm leading-6 text-[#315b62] outline-none" /></td><td className="border-r border-[#e1ebeb] p-3"><textarea readOnly value={use.example} rows={3} className="w-64 resize-none rounded-lg border border-[#d5e2e2] bg-[#f8fbfb] px-3 py-2.5 text-sm leading-6 text-[#315b62] outline-none" /></td><td className="p-3"><textarea readOnly value={use.exampleTranslation} rows={3} className="w-64 resize-none rounded-lg border border-[#d5e2e2] bg-[#f8fbfb] px-3 py-2.5 text-sm leading-6 text-[#315b62] outline-none" /></td></tr>)}</tbody>
                </table>
              </div>
            </section>
          ))}
        </section>
      )}

      {importError && <p className="mt-3 rounded-xl border border-[#f0c7bd] bg-[#fff4f0] px-4 py-3 text-sm text-[#a45143]">{importError}</p>}
      <footer className="mt-6 flex gap-3 border-t border-[#d8e5e5] pt-5"><button onClick={onCancel} disabled={isImporting} className="flex-1 rounded-xl border border-[#cedede] bg-white px-4 py-3 text-sm font-bold text-[#55767b] disabled:opacity-50">Back to manual</button><button onClick={handleImport} disabled={isImporting || Boolean(importer.error)} className="flex-[1.5] rounded-xl bg-[#155e6c] px-4 py-3 text-sm font-bold text-white hover:bg-[#1d707e] disabled:opacity-50">{isImporting ? 'Importing...' : 'Import vocabulary'}</button></footer>
    </div>
  );
}
