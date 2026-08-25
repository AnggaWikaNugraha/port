'use client';

import { useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import PartOfSpeechBadge from '../../shared/PartOfSpeechBadge';
import { partOfSpeechStyle } from '../../shared/partOfSpeechStyle';
import { PartOfSpeech, VocabularyWord, WordFamily, WordFamilySelection } from '../../types';
import BulkImportPanel from '../bulkImport';
import { useVocabularyForm } from './hooks/useVocabularyForm';

type AddVocabularyModalProps = {
  families: WordFamily[];
  wordToEdit?: VocabularyWord | null;
  onClose: () => void;
  onAdd: (word: VocabularyWord, family: WordFamilySelection) => Promise<void>;
  onUpdate: (id: string, word: VocabularyWord, family: WordFamilySelection) => Promise<void>;
  onImport: (payload: unknown) => Promise<void>;
};

export default function AddVocabularyModal({
  families,
  wordToEdit,
  onClose,
  onAdd,
  onUpdate,
  onImport,
}: AddVocabularyModalProps) {
  const initialFamily = useMemo(
    () => wordToEdit ? families.find((family) => family.memberIds.includes(wordToEdit.id)) || null : null,
    [families, wordToEdit],
  );
  const form = useVocabularyForm(wordToEdit, initialFamily);
  const [isSaving, setIsSaving] = useState(false);
  const [entryMode, setEntryMode] = useState<'manual' | 'bulk'>('manual');
  const [saveError, setSaveError] = useState<string | null>(null);
  const meaningLabel = form.direction === 'en-id' ? 'Arti Indonesia' : 'English meaning';
  const translationLabel = form.direction === 'en-id' ? 'Terjemahan example' : 'Example translation';
  const partsOfSpeech = Object.keys(partOfSpeechStyle) as PartOfSpeech[];
  const compatibleFamilies = families.filter((family) => (
    family.sourceLang === (form.direction === 'en-id' ? 'en' : 'id')
    && family.targetLang === (form.direction === 'en-id' ? 'id' : 'en')
  ));

  const handleSave = async () => {
    const word = form.buildWord();
    const family = form.buildFamilySelection();
    if (!word) {
      setSaveError('Isi word, minimal satu part of speech, arti, dan example.');
      return;
    }
    if (!family) {
      setSaveError('Pilih word family atau isi root word untuk family baru.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      if (wordToEdit) {
        await onUpdate(wordToEdit.id, word, family);
      } else {
        await onAdd(word, family);
      }
      form.reset();
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save vocabulary.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#163e44]/35 p-4 backdrop-blur-sm sm:p-8" onMouseDown={onClose}>
      <aside className="max-h-[90vh] w-full max-w-[1240px] overflow-y-auto rounded-[28px] border border-[#cbdede] bg-[#f4f8f8] p-5 shadow-[0_28px_80px_rgba(20,61,66,.28)] sm:p-7" onMouseDown={(event) => event.stopPropagation()}>
        <header className="flex items-start justify-between">
          <div>
            <h2 className="font-[Georgia,serif] text-3xl font-bold text-[#214f57]">{wordToEdit ? 'Edit vocabulary' : 'Add vocabulary'}</h2>
            <p className="mt-1 text-sm text-[#71888b]">Isi setiap arti dan contoh secara manual agar materinya akurat.</p>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border border-[#d4e2e2] bg-white text-[#53767b]"><X className="h-5 w-5" /></button>
        </header>

        {!wordToEdit && <div className="mt-5 inline-flex rounded-xl border border-[#cbdede] bg-white p-1"><button onClick={() => setEntryMode('manual')} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${entryMode === 'manual' ? 'bg-[#155e6c] text-white' : 'text-[#668286]'}`}>Manual input</button><button onClick={() => setEntryMode('bulk')} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${entryMode === 'bulk' ? 'bg-[#155e6c] text-white' : 'text-[#668286]'}`}>Bulk JSON</button></div>}

        <div className={entryMode === 'manual' ? '' : 'hidden'}>
        <section className="mt-7 rounded-2xl border border-[#d5e3e3] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold uppercase tracking-[.14em] text-[#6e888b]">{form.direction === 'en-id' ? 'English word' : 'Kata Indonesia'}</label>
            <select value={form.direction} onChange={(event) => form.setDirection(event.target.value as 'en-id' | 'id-en')} className="rounded-lg border border-[#b8d1d3] bg-[#e4f1f1] px-3 py-1.5 text-xs font-bold text-[#276973] outline-none"><option value="en-id">EN → ID</option><option value="id-en">ID → EN</option></select>
          </div>
          <input autoFocus value={form.word} onChange={(event) => form.setWord(event.target.value)} placeholder={form.direction === 'en-id' ? 'Contoh: book' : 'Contoh: buku'} className="mt-2 w-full rounded-xl border border-[#d3e1e1] bg-[#f8fbfb] px-4 py-3 text-[#244f56] outline-none focus:border-[#42818a]" />
        </section>

        <section className="mt-4 rounded-2xl border border-[#d5e3e3] bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h3 className="font-[Georgia,serif] text-lg font-bold text-[#315c63]">Word family <span className="font-sans text-sm font-normal text-[#7b9294]">(optional)</span></h3><p className="text-sm text-[#71888b]">Hubungkan kata yang masih satu turunan.</p></div>
            <select value={form.familyMode === 'existing' ? form.familyId : form.familyMode} onChange={(event) => {
              const value = event.target.value;
              if (value === 'none' || value === 'new') form.chooseFamilyMode(value);
              else { form.chooseFamilyMode('existing'); form.setFamilyId(value); }
            }} className="rounded-xl border border-[#cbdede] bg-[#f8fbfb] px-3 py-2.5 text-sm text-[#315b62] outline-none">
              <option value="none">No word family</option>
              <option value="new">Create new family</option>
              {compatibleFamilies.map((family) => <option key={family.id} value={family.id}>{family.rootText} · {family.memberIds.length} words</option>)}
            </select>
          </div>
          {form.familyMode === 'new' && <input value={form.familyRoot} onChange={(event) => form.setFamilyRoot(event.target.value)} placeholder="Family root, contoh: success" className="mt-3 w-full rounded-xl border border-[#d3e1e1] bg-[#f8fbfb] px-4 py-3 text-sm text-[#244f56] outline-none focus:border-[#42818a]" />}
        </section>

        <section className="mt-5">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div><h3 className="font-[Georgia,serif] text-lg font-bold text-[#315c63]">Uses</h3><p className="text-sm text-[#71888b]">Pilih jenis kata untuk menambah row baru.</p></div>
            <div className="flex flex-wrap gap-1.5">{partsOfSpeech.map((part) => <button key={part} onClick={() => form.addUse(part)} className="inline-flex items-center rounded-full transition hover:opacity-75"><Plus className="mr-1 h-3 w-3 text-[#46666b]" /><PartOfSpeechBadge partOfSpeech={part} /></button>)}</div>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#d5e3e3] bg-white">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead className="bg-[#e7f1f1] text-[10px] font-bold uppercase tracking-[.14em] text-[#66868a]"><tr><th className="px-3 py-3">Part of Speech</th><th className="px-3 py-3">{meaningLabel}</th><th className="px-3 py-3">Example</th><th className="px-3 py-3">{translationLabel}</th><th className="px-3 py-3" /></tr></thead>
              <tbody className="divide-y divide-[#e1ebeb]">
                {form.uses.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#7d9598]">Pilih jenis kata di atas untuk mulai mengisi vocabulary.</td></tr> : form.uses.map((use, index) => <tr key={index} className="align-top"><td className="border-r border-[#e1ebeb] p-3"><PartOfSpeechBadge partOfSpeech={use.partOfSpeech} size="md" /></td><td className="border-r border-[#e1ebeb] p-3"><textarea value={use.meaning} onChange={(event) => form.updateUse(index, 'meaning', event.target.value)} rows={3} placeholder={meaningLabel} className="w-48 resize-none rounded-lg border border-[#d5e2e2] bg-[#f8fbfb] px-3 py-2.5 text-sm leading-6 text-[#315b62] outline-none" /></td><td className="border-r border-[#e1ebeb] p-3"><textarea value={use.example} onChange={(event) => form.updateUse(index, 'example', event.target.value)} rows={3} placeholder="Example sentence" className="w-64 resize-none rounded-lg border border-[#d5e2e2] bg-[#f8fbfb] px-3 py-2.5 text-sm leading-6 text-[#315b62] outline-none" /></td><td className="border-r border-[#e1ebeb] p-3"><textarea value={use.exampleTranslation || ''} onChange={(event) => form.updateUse(index, 'exampleTranslation', event.target.value)} rows={3} placeholder={translationLabel} className="w-64 resize-none rounded-lg border border-[#d5e2e2] bg-[#f8fbfb] px-3 py-2.5 text-sm leading-6 text-[#315b62] outline-none" /></td><td className="p-3 text-right"><button onClick={() => form.removeUse(index)} className="rounded-lg px-2 py-2 text-xs font-semibold text-[#b4685b] hover:bg-[#fff0ec]">Remove</button></td></tr>)}
              </tbody>
            </table>
          </div>
        </section>

        {saveError && <p className="mt-4 rounded-xl border border-[#f0c7bd] bg-[#fff4f0] px-4 py-3 text-sm text-[#a45143]">{saveError}</p>}
        <footer className="mt-7 flex gap-3 border-t border-[#d8e5e5] pt-5"><button onClick={onClose} disabled={isSaving} className="flex-1 rounded-xl border border-[#cedede] bg-white px-4 py-3 text-sm font-bold text-[#55767b] disabled:opacity-50">Cancel</button><button onClick={handleSave} disabled={isSaving} className="flex-[1.5] rounded-xl bg-[#155e6c] px-4 py-3 text-sm font-bold text-white hover:bg-[#1d707e] disabled:opacity-50">{isSaving ? 'Saving...' : wordToEdit ? 'Save changes' : 'Save vocabulary'}</button></footer>
        </div>

        {!wordToEdit && entryMode === 'bulk' && <BulkImportPanel onCancel={() => setEntryMode('manual')} onComplete={onClose} onImport={onImport} />}
      </aside>
    </div>
  );
}
