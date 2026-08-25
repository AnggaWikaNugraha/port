import { VocabularyWord } from './types';

export const DUMMY_WORDS: VocabularyWord[] = [
  {
    id: 'benefit', word: 'Benefit', sourceLang: 'en', targetLang: 'id', addedAt: '22 Aug 2026',
    uses: [
      { id: 'benefit-noun', partOfSpeech: 'Noun', meaning: 'Manfaat', example: 'Regular exercise has many health benefits.', exampleTranslation: 'Olahraga teratur memiliki banyak manfaat bagi kesehatan.', mastery: 'Familiar' },
      { id: 'benefit-verb', partOfSpeech: 'Verb', meaning: 'Menguntungkan; memberi manfaat', example: 'This change will benefit all students.', exampleTranslation: 'Perubahan ini akan menguntungkan semua murid.', mastery: 'Learning' },
    ],
  },
  {
    id: 'book', word: 'Book', sourceLang: 'en', targetLang: 'id', addedAt: '23 Aug 2026',
    uses: [
      { id: 'book-noun', partOfSpeech: 'Noun', meaning: 'Buku', example: 'I bought a new book yesterday.', exampleTranslation: 'Saya membeli buku baru kemarin.', mastery: 'Mastered' },
      { id: 'book-verb', partOfSpeech: 'Verb', meaning: 'Memesan', example: 'We booked a table for dinner.', exampleTranslation: 'Kami memesan meja untuk makan malam.', mastery: 'Learning' },
    ],
  },
  {
    id: 'light', word: 'Light', sourceLang: 'en', targetLang: 'id', addedAt: '21 Aug 2026',
    uses: [
      { id: 'light-noun', partOfSpeech: 'Noun', meaning: 'Cahaya', example: 'The morning light filled the room.', exampleTranslation: 'Cahaya pagi memenuhi ruangan.', mastery: 'Familiar' },
      { id: 'light-adjective', partOfSpeech: 'Adjective', meaning: 'Ringan', example: 'This jacket is warm and light.', exampleTranslation: 'Jaket ini hangat dan ringan.', mastery: 'Learning' },
      { id: 'light-verb', partOfSpeech: 'Verb', meaning: 'Menyalakan', example: 'Please light the candle.', exampleTranslation: 'Tolong nyalakan lilinnya.', mastery: 'New' },
    ],
  },
  {
    id: 'run', word: 'Run', sourceLang: 'en', targetLang: 'id', addedAt: '18 Aug 2026',
    uses: [
      { id: 'run-verb', partOfSpeech: 'Verb', meaning: 'Berlari', example: 'She runs in the park every morning.', exampleTranslation: 'Dia berlari di taman setiap pagi.', mastery: 'Familiar' },
      { id: 'run-noun', partOfSpeech: 'Noun', meaning: 'Sesi berlari', example: 'I went for a short run before work.', exampleTranslation: 'Saya pergi berlari sebentar sebelum bekerja.', mastery: 'Learning' },
    ],
  },
  {
    id: 'curious', word: 'Curious', sourceLang: 'en', targetLang: 'id', addedAt: '12 Aug 2026',
    uses: [
      { id: 'curious-adjective', partOfSpeech: 'Adjective', meaning: 'Penasaran', example: 'The child was curious about the stars.', exampleTranslation: 'Anak itu penasaran tentang bintang-bintang.', mastery: 'Mastered' },
    ],
  },
  {
    id: 'establish', word: 'Establish', sourceLang: 'en', targetLang: 'id', addedAt: '08 Aug 2026',
    uses: [
      { id: 'establish-verb', partOfSpeech: 'Verb', meaning: 'Mendirikan; menetapkan', example: 'They plan to establish a new office.', exampleTranslation: 'Mereka berencana mendirikan kantor baru.', mastery: 'New' },
    ],
  },
  {
    id: 'berlari', word: 'Berlari', sourceLang: 'id', targetLang: 'en', addedAt: '06 Aug 2026',
    uses: [
      { id: 'berlari-verb', partOfSpeech: 'Verb', meaning: 'Run', example: 'Saya berlari setiap pagi.', exampleTranslation: 'I run every morning.', mastery: 'Familiar' },
    ],
  },
  {
    id: 'buku', word: 'Buku', sourceLang: 'id', targetLang: 'en', addedAt: '04 Aug 2026',
    uses: [
      { id: 'buku-noun', partOfSpeech: 'Noun', meaning: 'Book', example: 'Saya membaca sebuah buku.', exampleTranslation: 'I am reading a book.', mastery: 'Mastered' },
    ],
  },
  {
    id: 'cahaya', word: 'Cahaya', sourceLang: 'id', targetLang: 'en', addedAt: '02 Aug 2026',
    uses: [
      { id: 'cahaya-noun', partOfSpeech: 'Noun', meaning: 'Light', example: 'Cahaya masuk melalui jendela.', exampleTranslation: 'Light came through the window.', mastery: 'Learning' },
    ],
  },
  {
    id: 'maju', word: 'Maju', sourceLang: 'id', targetLang: 'en', addedAt: '29 Jul 2026',
    uses: [
      { id: 'maju-adjective', partOfSpeech: 'Adjective', meaning: 'Advanced', example: 'Teknologinya sudah maju.', exampleTranslation: 'The technology is advanced.', mastery: 'New' },
      { id: 'maju-verb', partOfSpeech: 'Verb', meaning: 'Move forward', example: 'Silakan maju satu langkah.', exampleTranslation: 'Please move forward one step.', mastery: 'Learning' },
    ],
  },
];

export const MONTHLY_PROGRESS = [
  { month: 'Mar', count: 4 }, { month: 'Apr', count: 7 },
  { month: 'May', count: 6 }, { month: 'Jun', count: 11 },
  { month: 'Jul', count: 14 }, { month: 'Aug', count: 21 },
];
