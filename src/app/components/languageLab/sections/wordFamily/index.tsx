'use client';

import { Network, X } from 'lucide-react';
import PartOfSpeechBadge from '../../shared/PartOfSpeechBadge';
import { VocabularyWord, WordFamily } from '../../types';

type WordFamilyModalProps = {
  family: WordFamily;
  words: VocabularyWord[];
  onClose: () => void;
};

export default function WordFamilyModal({ family, words, onClose }: WordFamilyModalProps) {
  const members = words.filter((word) => family.memberIds.includes(word.id));

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#163e44]/35 p-4 backdrop-blur-sm sm:p-8" onMouseDown={onClose}>
      <section className="w-full max-w-4xl overflow-hidden rounded-[28px] border border-[#cbdede] bg-[#f4f8f8] shadow-[0_28px_80px_rgba(20,61,66,.28)]" onMouseDown={(event) => event.stopPropagation()}>
        <header className="flex items-start justify-between border-b border-[#d9e5e5] bg-white p-5 sm:p-6">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#dceef0] text-[#236f78]"><Network className="h-5 w-5" /></span>
            <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#718a8d]">Word family</p><h2 className="mt-1 font-[Georgia,serif] text-2xl font-bold text-[#214f57]">{family.rootText}</h2><p className="mt-1 text-sm text-[#71888b]">{members.length} related {members.length === 1 ? 'word' : 'words'} · {family.sourceLang.toUpperCase()} → {family.targetLang.toUpperCase()}</p></div>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border border-[#d4e2e2] bg-white text-[#53767b]"><X className="h-5 w-5" /></button>
        </header>
        <div className="max-h-[60vh] overflow-auto p-5 sm:p-6">
          <p className="mb-4 rounded-xl border border-[#d7e7e7] bg-[#eef6f6] px-4 py-3 text-sm leading-6 text-[#56777b]">Word Family menampilkan satu fungsi utama untuk setiap turunan kata. Semua arti lain tetap ada di detail vocabulary word.</p>
          <div className="overflow-x-auto rounded-2xl border border-[#d5e3e3] bg-white">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead className="bg-[#e7f1f1] text-[10px] font-bold uppercase tracking-[.14em] text-[#66868a]"><tr><th className="px-4 py-3">Word</th><th className="px-3 py-3">Part of speech</th><th className="px-3 py-3">Meaning</th></tr></thead>
              <tbody className="divide-y divide-[#e1ebeb]">
                {members.map((word) => {
                  const mainUse = word.uses[0];
                  if (!mainUse) return null;
                  return <tr key={word.id}><td className="border-r border-[#e1ebeb] px-4 py-3"><span className="font-[Georgia,serif] text-lg font-bold text-[#214f57]">{word.word}</span></td><td className="border-r border-[#e1ebeb] px-3 py-3"><PartOfSpeechBadge partOfSpeech={mainUse.partOfSpeech} /></td><td className="px-3 py-3 font-semibold text-[#315b62]">{mainUse.meaning}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
