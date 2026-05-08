'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, Languages, Search } from 'lucide-react';
import { LanguageCode, LanguageEntry, LanguageStats } from '../../pages/language/types';

type LanguageLabMode = 'admin' | 'public';

type EntryFormState = {
  sourceText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  meaningsText: string;
  exampleSource: string;
  exampleTarget: string;
  notes: string;
  tagsText: string;
};

const EMPTY_FORM: EntryFormState = {
  sourceText: '',
  sourceLang: 'en',
  targetLang: 'id',
  meaningsText: '',
  exampleSource: '',
  exampleTarget: '',
  notes: '',
  tagsText: '',
};

function parseLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseTags(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function directionLabel(sourceLang: LanguageCode, targetLang: LanguageCode) {
  return `${sourceLang.toUpperCase()} -> ${targetLang.toUpperCase()}`;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950/80 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.22em] text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{label}</label>
      {children}
    </div>
  );
}

function PublicEntryCard({ entry }: { entry: LanguageEntry }) {
  return (
    <article className="rounded-3xl border border-gray-800 bg-gray-900/60 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          {directionLabel(entry.sourceLang, entry.targetLang)}
        </span>
        {entry.tags.length > 0 && (
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-gray-400">
            {entry.tags.join(', ')}
          </span>
        )}
      </div>

      <h2 className="mt-4 text-lg font-semibold text-white">{entry.sourceText}</h2>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Meaning</p>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-gray-300">
            {entry.meanings.map((meaning, index) => (
              <li key={`${entry.id}-meaning-${index}`} className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                <span>{meaning}</span>
              </li>
            ))}
          </ul>
        </div>

        {entry.exampleSource && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Example Source</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300">{entry.exampleSource}</p>
          </div>
        )}

        {entry.exampleTarget && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Example Target</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300">{entry.exampleTarget}</p>
          </div>
        )}

        {entry.notes && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Notes</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-400">{entry.notes}</p>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Updated {new Date(entry.updatedAt || entry.createdAt).toLocaleString('id-ID')}
      </p>
    </article>
  );
}

function EditableEntryCard({
  entry,
  onSave,
  onDelete,
}: {
  entry: LanguageEntry;
  onSave: (entry: LanguageEntry) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(entry);
  const [meaningsText, setMeaningsText] = useState(entry.meanings.join('\n'));
  const [tagsText, setTagsText] = useState(entry.tags.join(', '));
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDraft(entry);
    setMeaningsText(entry.meanings.join('\n'));
    setTagsText(entry.tags.join(', '));
  }, [entry]);

  return (
    <>
      <article className="rounded-3xl border border-gray-800 bg-gray-900/60 p-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full flex-col items-start gap-3 text-left"
        >
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                {directionLabel(draft.sourceLang, draft.targetLang)}
              </span>
              {draft.tags.length > 0 && (
                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-gray-500">
                  {draft.tags.slice(0, 2).join(', ')}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-white">{draft.sourceText}</h2>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-300">
                {parseLines(meaningsText).join(' • ')}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Updated {new Date(draft.updatedAt || draft.createdAt).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </button>
      </article>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-gray-800 bg-gray-900 p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex flex-col gap-4 border-b border-gray-800 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    {directionLabel(draft.sourceLang, draft.targetLang)}
                  </span>
                  {draft.tags.length > 0 && (
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-gray-400">
                      {draft.tags.join(', ')}
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-xl font-semibold text-white">{draft.sourceText}</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Updated {new Date(draft.updatedAt || draft.createdAt).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={async () => {
                    setSaving(true);
                    await onSave({
                      ...draft,
                      meanings: parseLines(meaningsText),
                      tags: parseTags(tagsText),
                    });
                    setSaving(false);
                    setOpen(false);
                  }}
                  className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={async () => {
                    await onDelete(draft.id);
                    setOpen(false);
                  }}
                  className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/20"
                >
                  Delete
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-gray-800 bg-gray-950 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-700"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Teks Sumber">
                <textarea
                  rows={3}
                  value={draft.sourceText}
                  onChange={(event) => setDraft((prev) => ({ ...prev, sourceText: event.target.value }))}
                  className="min-h-[96px] w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Dari">
                  <select
                    value={draft.sourceLang}
                    onChange={(event) => setDraft((prev) => ({ ...prev, sourceLang: event.target.value as LanguageCode }))}
                    className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="en">English</option>
                    <option value="id">Indonesia</option>
                  </select>
                </FormField>
                <FormField label="Ke">
                  <select
                    value={draft.targetLang}
                    onChange={(event) => setDraft((prev) => ({ ...prev, targetLang: event.target.value as LanguageCode }))}
                    className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="id">Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Arti / Terjemahan">
                <textarea
                  rows={5}
                  value={meaningsText}
                  onChange={(event) => setMeaningsText(event.target.value)}
                  className="min-h-[140px] w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </FormField>

              <FormField label="Tags">
                <input
                  value={tagsText}
                  onChange={(event) => setTagsText(event.target.value)}
                  className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </FormField>

              <FormField label="Contoh Sumber">
                <textarea
                  rows={3}
                  value={draft.exampleSource || ''}
                  onChange={(event) => setDraft((prev) => ({ ...prev, exampleSource: event.target.value }))}
                  className="min-h-[88px] w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </FormField>

              <FormField label="Contoh Target">
                <textarea
                  rows={3}
                  value={draft.exampleTarget || ''}
                  onChange={(event) => setDraft((prev) => ({ ...prev, exampleTarget: event.target.value }))}
                  className="min-h-[88px] w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </FormField>
            </div>

            <div className="mt-4 space-y-4">
              <FormField label="Catatan">
                <textarea
                  rows={4}
                  value={draft.notes || ''}
                  onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
                  className="min-h-[110px] w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </FormField>

              {parseLines(meaningsText).length > 0 && (
                <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Preview Meanings</p>
                  <div className="flex flex-wrap gap-2">
                    {parseLines(meaningsText).map((meaning, index) => (
                      <span
                        key={`${draft.id}-${index}`}
                        className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-gray-300"
                      >
                        {index + 1}. {meaning}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function LanguageLab({ mode }: { mode: LanguageLabMode }) {
  const isAdmin = mode === 'admin';
  const [entries, setEntries] = useState<LanguageEntry[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [stats, setStats] = useState<LanguageStats>({ entries: 0, meanings: 0, tags: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState<'all' | 'en-id' | 'id-en'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<EntryFormState>(EMPTY_FORM);

  useEffect(() => {
    refreshEntries();
  }, [isAdmin]);

  async function refreshEntries() {
    setLoading(true);
    const res = await fetch(isAdmin ? '/api/admin/language' : '/api/public/language');
    const data = await res.json();
    setEntries(Array.isArray(data?.entries) ? data.entries : []);
    setAvailableTags(Array.isArray(data?.availableTags) ? data.availableTags : []);
    setStats(
      data?.stats && typeof data.stats === 'object'
        ? data.stats
        : { entries: 0, meanings: 0, tags: 0 },
    );
    setLoading(false);
  }

  async function handleCreate() {
    if (!isAdmin || !form.sourceText.trim()) return;

    const meanings = parseLines(form.meaningsText);
    if (meanings.length === 0) return;

    setSaving(true);
    await fetch('/api/admin/language/create', {
      method: 'POST',
      body: JSON.stringify({
        sourceText: form.sourceText.trim(),
        sourceLang: form.sourceLang,
        targetLang: form.targetLang,
        meanings,
        exampleSource: form.exampleSource.trim(),
        exampleTarget: form.exampleTarget.trim(),
        notes: form.notes.trim(),
        tags: parseTags(form.tagsText),
      }),
    });
    setForm(EMPTY_FORM);
    await refreshEntries();
    setCreateOpen(false);
    setSaving(false);
  }

  async function handleUpdate(entry: LanguageEntry) {
    if (!isAdmin) return;

    setSaving(true);
    await fetch('/api/admin/language/update', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
    await refreshEntries();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!isAdmin) return;

    await fetch('/api/admin/language/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
    await refreshEntries();
  }

  const filteredEntries = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesDirection =
        direction === 'all' || `${entry.sourceLang}-${entry.targetLang}` === direction;
      const matchesTag = selectedTag === 'all' || entry.tags.includes(selectedTag);

      if (!matchesDirection || !matchesTag) {
        return false;
      }

      if (!lowerQuery) {
        return true;
      }

      const haystack = [
        entry.sourceText,
        ...entry.meanings,
        entry.exampleSource,
        entry.exampleTarget,
        entry.notes,
        ...entry.tags,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(lowerQuery);
    });
  }, [direction, entries, query, selectedTag]);

  return (
    <section className="flex-1 min-h-screen bg-gray-950 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-gray-800 bg-gray-900/70 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-emerald-300">
              <Languages className="h-3.5 w-3.5" />
              {isAdmin ? 'Private Language Lab' : 'Public Language Lab'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {isAdmin ? 'Manage Bahasa' : 'Language'}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">
                {isAdmin
                  ? 'Simpan kata, frasa, atau kalimat untuk belajar English lebih rapi. Satu entri bisa punya banyak arti dan contoh dua arah.'
                  : 'Kumpulan kosakata, frasa, dan contoh pemakaian English-Indonesia yang bisa dibuka publik.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:min-w-[420px]">
            <StatCard label="Entries" value={stats.entries} />
            <StatCard label="Meanings" value={stats.meanings} />
            <StatCard label="Tags" value={stats.tags} />
          </div>
        </div>

        <section className="space-y-4">
          <div className="rounded-3xl border border-gray-800 bg-gray-900/60 p-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari source text, arti, notes, atau tags"
                    className="w-full rounded-2xl border border-gray-800 bg-gray-950 py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </label>

                <select
                  value={direction}
                  onChange={(event) => setDirection(event.target.value as 'all' | 'en-id' | 'id-en')}
                  className="rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  <option value="all">All directions</option>
                  <option value="en-id">EN to ID</option>
                  <option value="id-en">ID to EN</option>
                </select>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                  >
                    Add Entry
                  </button>
                )}
              </div>

              {availableTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTag('all')}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      selectedTag === 'all'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-gray-800 bg-gray-950 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    All tags
                  </button>
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        selectedTag === tag
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          : 'border-gray-800 bg-gray-950 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-gray-800 bg-gray-900/60 p-6 text-sm text-gray-500">
              Loading entries...
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-800 bg-gray-900/40 p-8 text-center">
              <BookOpenText className="mx-auto mb-3 h-8 w-8 text-gray-600" />
              <p className="text-sm text-gray-400">Belum ada entri yang cocok.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredEntries.map((entry) =>
                isAdmin ? (
                  <EditableEntryCard
                    key={entry.id}
                    entry={entry}
                    onSave={handleUpdate}
                    onDelete={handleDelete}
                  />
                ) : (
                  <PublicEntryCard key={entry.id} entry={entry} />
                ),
              )}
            </div>
          )}
        </section>
      </div>

      {isAdmin && createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setCreateOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-gray-800 bg-gray-900 p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-gray-800 pb-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-white">Add Entry</h2>
                <p className="text-sm text-gray-500">Tulis entri baru tanpa mengganggu fokus list di halaman utama.</p>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-2xl border border-gray-800 bg-gray-950 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-700"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <FormField label="Teks Sumber">
                <textarea
                  value={form.sourceText}
                  onChange={(event) => setForm((prev) => ({ ...prev, sourceText: event.target.value }))}
                  rows={3}
                  placeholder="Contoh: I need to catch up with my work."
                  className="min-h-[96px] w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Dari">
                  <select
                    value={form.sourceLang}
                    onChange={(event) => setForm((prev) => ({ ...prev, sourceLang: event.target.value as LanguageCode }))}
                    className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="en">English</option>
                    <option value="id">Indonesia</option>
                  </select>
                </FormField>
                <FormField label="Ke">
                  <select
                    value={form.targetLang}
                    onChange={(event) => setForm((prev) => ({ ...prev, targetLang: event.target.value as LanguageCode }))}
                    className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="id">Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Arti / Terjemahan">
                <textarea
                  value={form.meaningsText}
                  onChange={(event) => setForm((prev) => ({ ...prev, meaningsText: event.target.value }))}
                  rows={5}
                  placeholder={'Tulis satu arti per baris\nmengejar pekerjaan yang tertunda\nmenyusul ketertinggalan'}
                  className="min-h-[140px] w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </FormField>

              <FormField label="Contoh Sumber">
                <textarea
                  value={form.exampleSource}
                  onChange={(event) => setForm((prev) => ({ ...prev, exampleSource: event.target.value }))}
                  rows={3}
                  placeholder="Kalimat tambahan dari bahasa sumber"
                  className="min-h-[88px] w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </FormField>

              <FormField label="Contoh Target">
                <textarea
                  value={form.exampleTarget}
                  onChange={(event) => setForm((prev) => ({ ...prev, exampleTarget: event.target.value }))}
                  rows={3}
                  placeholder="Versi terjemahan / penjelasan target"
                  className="min-h-[88px] w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </FormField>

              <FormField label="Tags">
                <input
                  value={form.tagsText}
                  onChange={(event) => setForm((prev) => ({ ...prev, tagsText: event.target.value }))}
                  placeholder="daily, idiom, work, meeting"
                  className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </FormField>

              <FormField label="Catatan">
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                  rows={4}
                  placeholder="Bedanya dengan phrase lain, konteks formal/non-formal, dll."
                  className="min-h-[112px] w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </FormField>

              <button
                onClick={handleCreate}
                disabled={saving}
                className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
