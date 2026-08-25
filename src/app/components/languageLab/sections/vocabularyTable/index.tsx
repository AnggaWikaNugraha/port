'use client';

import { ChevronDown, ChevronRight, Pencil, Search, Volume2 } from 'lucide-react';
import PartOfSpeechBadge from '../../shared/PartOfSpeechBadge';
import { Mastery, VocabularyWord, WordFamily } from '../../types';
import { useVocabularyTable } from './hooks/useVocabularyTable';

type VocabularyTableSectionProps = {
  words: VocabularyWord[];
  families: WordFamily[];
  canEdit: boolean;
  onEdit: (word: VocabularyWord) => void;
  onOpenFamily: (family: WordFamily) => void;
};

export default function VocabularyTableSection({
  words,
  families,
  canEdit,
  onEdit,
  onOpenFamily,
}: VocabularyTableSectionProps) {
  const table = useVocabularyTable(words);
  const sourceLabel = table.direction === 'en-id' ? 'English word' : 'Kata Indonesia';
  const meaningLabel = table.direction === 'en-id' ? 'Arti Indonesia' : 'English meaning';

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#d8e5e5] bg-white shadow-[0_14px_38px_rgba(52,99,104,.06)]">
      <div className="flex flex-col gap-4 border-b border-[#dce7e7] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#789093]">Word collection</p>
          <h2 className="mt-1 font-[Georgia,serif] text-2xl font-bold text-[#214f57]">Read & remember</h2>
          <p className="mt-1 text-sm text-[#789093]">Arti dan contoh kalimat langsung terlihat.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ba0a2]" />
            <input value={table.query} onChange={(event) => table.setQuery(event.target.value)} placeholder="Search a word..." className="w-full rounded-xl border border-[#d5e2e2] bg-[#f7fafa] py-2.5 pl-10 pr-4 text-sm text-[#244f56] outline-none focus:border-[#4e8b92] sm:w-56" />
          </label>
          <select value={table.direction} onChange={(event) => table.setDirection(event.target.value as 'en-id' | 'id-en')} className="rounded-xl border border-[#b8d1d3] bg-[#e4f1f1] px-3 py-2.5 text-sm font-bold text-[#276973] outline-none focus:border-[#4e8b92]">
            <option value="en-id">EN → ID</option>
            <option value="id-en">ID → EN</option>
          </select>
          <select value={table.mastery} onChange={(event) => table.setMastery(event.target.value as 'All' | Mastery)} className="rounded-xl border border-[#d5e2e2] bg-[#f7fafa] px-3 py-2.5 text-sm text-[#46666b] outline-none focus:border-[#4e8b92]">
            {['All', 'New', 'Learning', 'Familiar', 'Mastered'].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-7 p-5 sm:p-6">
        {Object.entries(table.groups).map(([letter, groupWords]) => {
          const letterOpen = !table.collapsedLetters.includes(letter);

          return (
            <section key={letter}>
              <button onClick={() => table.toggleLetter(letter)} className="flex w-full items-center gap-4 pb-3 text-left">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#b8d5d5] bg-[#e1f0f0] font-[Georgia,serif] text-xl font-bold text-[#176b72]">{letter}</span>
                <span className="h-px flex-1 bg-[#d7e5e5]" />
                <span className="text-xs font-semibold text-[#7a9295]">{groupWords.length} {groupWords.length === 1 ? 'word' : 'words'}</span>
                {letterOpen ? <ChevronDown className="h-4 w-4 text-[#789093]" /> : <ChevronRight className="h-4 w-4 text-[#789093]" />}
              </button>

              {letterOpen && (
                <div className="overflow-x-auto rounded-2xl border border-[#dce8e8]">
                  <table className="w-full min-w-[680px] border-collapse text-left">
                    <thead className="bg-[#e6f1f1] text-[10px] font-bold uppercase tracking-[.14em] text-[#5c7c80]">
                      <tr>
                        <th className="px-4 py-3">{sourceLabel}</th>
                        <th className="px-3 py-3">Part of Speech</th>
                        <th className="px-3 py-3">{meaningLabel}</th>
                        <th className="px-3 py-3">Example</th>
                        <th className="px-3 py-3">Added date</th>
                        {canEdit && <th className="px-3 py-3 text-right">Action</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7eeee] bg-white">
                      {groupWords.flatMap((word) => word.uses.map((use, useIndex) => (
                        <tr key={use.id} className="transition hover:bg-[#f8fbfb]">
                          {useIndex === 0 && (
                            <td rowSpan={word.uses.length} className="border-r border-[#e2ecec] px-4 py-4 align-top">
                              <div className="flex items-center gap-2">
                                <span className="font-[Georgia,serif] text-lg font-bold text-[#214f57]">{word.word}</span>
                                <button className="text-[#77999d] hover:text-[#1f6e78]" aria-label={`Listen to ${word.word}`}>
                                  <Volume2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {families.filter((family) => family.memberIds.includes(word.id)).map((family) => (
                                  <button key={family.id} onClick={() => onOpenFamily(family)} className="rounded-full bg-[#e5f2df] px-2 py-1 text-[10px] font-bold text-[#527545] transition hover:bg-[#d6ead0]">
                                    Family · {family.rootText}
                                  </button>
                                ))}
                              </div>
                            </td>
                          )}
                          <td className="border-r border-[#e2ecec] px-3 py-3"><PartOfSpeechBadge partOfSpeech={use.partOfSpeech} /></td>
                          <td className="border-r border-[#e2ecec] px-3 py-3 font-semibold text-[#315b62]">{use.meaning}</td>
                          <td className="border-r border-[#e2ecec] px-3 py-3 leading-6">
                            <p className="text-[#61797d]">{use.example}</p>
                            {use.exampleTranslation && <p className="mt-1 border-t border-[#e7eeee] pt-1 text-sm text-[#93a5a7]">{use.exampleTranslation}</p>}
                          </td>
                          {useIndex === 0 && <td rowSpan={word.uses.length} className="px-3 py-4 align-top text-sm text-[#6e8588]">{word.addedAt}</td>}
                          {canEdit && useIndex === 0 && (
                            <td rowSpan={word.uses.length} className="px-3 py-4 text-right align-top">
                              <button onClick={() => onEdit(word)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#cbdede] bg-white px-2.5 py-2 text-xs font-bold text-[#3f6d73] transition hover:bg-[#edf5f5]">
                                <Pencil className="h-3.5 w-3.5" /> Edit
                              </button>
                            </td>
                          )}
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
        {table.filteredWords.length === 0 && <div className="p-10 text-center text-sm text-[#789093]">No vocabulary matches your search.</div>}
      </div>
    </section>
  );
}
