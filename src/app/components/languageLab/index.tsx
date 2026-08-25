'use client';

import AddVocabularyModal from './sections/addVocabulary';
import OverviewSection from './sections/overview';
import VocabularyTableSection from './sections/vocabularyTable';
import WordFamilyModal from './sections/wordFamily';
import { useLanguageLab } from './hooks/useLanguageLab';

export default function LanguageLab() {
  const lab = useLanguageLab();

  return (
    <main className="min-h-screen bg-[#edf4f4] px-4 py-6 text-[#264f56] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-[1380px] space-y-5">
        <OverviewSection
          words={lab.words}
          onAdd={lab.canManage ? lab.openAddModal : undefined}
        />

        {lab.isLoading ? (
          <section className="rounded-[28px] border border-[#d8e5e5] bg-white p-8 text-sm text-[#789093]">
            Loading vocabulary...
          </section>
        ) : lab.loadError ? (
          <section className="rounded-[28px] border border-[#edc9c0] bg-[#fff5f1] p-8 text-sm text-[#a45143]">
            {lab.loadError}
          </section>
        ) : (
          <VocabularyTableSection
            words={lab.words}
            families={lab.families}
            canEdit={lab.canManage}
            onEdit={lab.openEditModal}
            onOpenFamily={lab.openFamilyModal}
          />
        )}
      </div>

      {lab.isAddModalOpen && (
        <AddVocabularyModal
          families={lab.families}
          wordToEdit={lab.wordToEdit}
          onClose={lab.closeAddModal}
          onAdd={lab.createWord}
          onUpdate={lab.updateWord}
          onImport={lab.importWords}
        />
      )}

      {lab.selectedFamily && (
        <WordFamilyModal
          family={lab.selectedFamily}
          words={lab.words}
          onClose={lab.closeFamilyModal}
        />
      )}
    </main>
  );
}
