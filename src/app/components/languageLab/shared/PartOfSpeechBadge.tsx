import { PartOfSpeech } from '../types';
import { partOfSpeechStyle } from './partOfSpeechStyle';

const partOfSpeechDescription: Record<PartOfSpeech, string> = {
  Noun: 'Nama benda, orang, tempat, atau konsep.',
  Verb: 'Aksi, kegiatan, atau keadaan.',
  Adjective: 'Menjelaskan noun.',
  Adverb: 'Menjelaskan verb, adjective, atau adverb.',
  Pronoun: 'Menggantikan noun.',
  Preposition: 'Menunjukkan hubungan posisi, waktu, atau arah.',
  Conjunction: 'Menghubungkan kata atau kalimat.',
  Interjection: 'Ungkapan spontan atau emosi.',
};

type PartOfSpeechBadgeProps = {
  partOfSpeech: PartOfSpeech;
  size?: 'sm' | 'md';
};

export default function PartOfSpeechBadge({ partOfSpeech, size = 'sm' }: PartOfSpeechBadgeProps) {
  const padding = size === 'md' ? 'px-2.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <span className="group relative inline-flex">
      <span className={`cursor-help rounded-full font-semibold ${padding} ${partOfSpeechStyle[partOfSpeech]}`}>
        {partOfSpeech}
      </span>
      <span role="tooltip" className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 w-56 -translate-x-1/2 rounded-lg bg-[#163e44] px-3 py-2 text-center text-xs font-medium leading-5 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        {partOfSpeechDescription[partOfSpeech]}
      </span>
    </span>
  );
}
