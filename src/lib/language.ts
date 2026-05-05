import "server-only";

import { db } from "@/lib/db";

export type LanguageCode = "en" | "id";

export type LanguageEntry = {
  id: string;
  userId?: number;
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

export type LanguageAdminPayload = {
  entries: LanguageEntry[];
  availableTags: string[];
  stats: LanguageStats;
};

type LanguageRow = Omit<LanguageEntry, "meanings" | "tags" | "userId"> & {
  userId?: number;
  meanings: string | null;
  tags: string | null;
};

function parseStringArray(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : [];
  } catch {
    return [];
  }
}

function normalizeEntry(row: LanguageRow): LanguageEntry {
  return {
    ...row,
    meanings: parseStringArray(row.meanings),
    tags: parseStringArray(row.tags),
  };
}

export async function ensureLanguageEntriesTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS language_entries (
      id VARCHAR(64) PRIMARY KEY,
      user_id INT NOT NULL,
      source_text TEXT NOT NULL,
      source_lang VARCHAR(8) NOT NULL,
      target_lang VARCHAR(8) NOT NULL,
      meanings LONGTEXT NOT NULL,
      example_source TEXT NULL,
      example_target TEXT NULL,
      notes TEXT NULL,
      tags LONGTEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_language_entries_user_id (user_id),
      INDEX idx_language_entries_source_lang (source_lang),
      INDEX idx_language_entries_target_lang (target_lang)
    )
  `);
}

export async function getLanguageEntries(userId = 1): Promise<LanguageEntry[]> {
  await ensureLanguageEntriesTable();

  const [rows]: any = await db.query(
    `
      SELECT
        id,
        user_id AS userId,
        source_text AS sourceText,
        source_lang AS sourceLang,
        target_lang AS targetLang,
        meanings,
        example_source AS exampleSource,
        example_target AS exampleTarget,
        notes,
        tags,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM language_entries
      WHERE user_id = ?
      ORDER BY updated_at DESC, created_at DESC
    `,
    [userId]
  );

  return rows.map((row: LanguageRow) => normalizeEntry(row));
}

export async function getLanguageAdminPayload(userId = 1): Promise<LanguageAdminPayload> {
  const entries = await getLanguageEntries(userId);
  const availableTags = [...new Set(entries.flatMap((entry) => entry.tags.map((tag) => tag.trim())).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));

  return {
    entries,
    availableTags,
    stats: {
      entries: entries.length,
      meanings: entries.reduce((acc, entry) => acc + entry.meanings.length, 0),
      tags: availableTags.length,
    },
  };
}

export async function createLanguageEntry(
  entry: Omit<LanguageEntry, "createdAt" | "updatedAt">,
) {
  await ensureLanguageEntriesTable();

  await db.query(
    `
      INSERT INTO language_entries (
        id, user_id, source_text, source_lang, target_lang, meanings,
        example_source, example_target, notes, tags
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      entry.id,
      entry.userId ?? 1,
      entry.sourceText,
      entry.sourceLang,
      entry.targetLang,
      JSON.stringify(entry.meanings),
      entry.exampleSource || null,
      entry.exampleTarget || null,
      entry.notes || null,
      JSON.stringify(entry.tags ?? []),
    ],
  );
}

export async function updateLanguageEntry(
  entry: Omit<LanguageEntry, "createdAt" | "updatedAt">,
) {
  await ensureLanguageEntriesTable();

  await db.query(
    `
      UPDATE language_entries
      SET
        source_text = ?,
        source_lang = ?,
        target_lang = ?,
        meanings = ?,
        example_source = ?,
        example_target = ?,
        notes = ?,
        tags = ?
      WHERE id = ? AND user_id = ?
    `,
    [
      entry.sourceText,
      entry.sourceLang,
      entry.targetLang,
      JSON.stringify(entry.meanings),
      entry.exampleSource || null,
      entry.exampleTarget || null,
      entry.notes || null,
      JSON.stringify(entry.tags ?? []),
      entry.id,
      entry.userId ?? 1,
    ],
  );
}

export async function deleteLanguageEntry(id: string, userId = 1) {
  await ensureLanguageEntriesTable();
  await db.query("DELETE FROM language_entries WHERE id = ? AND user_id = ?", [id, userId]);
}
