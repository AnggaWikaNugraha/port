import "server-only";

import { randomUUID } from "crypto";
import { db } from "@/lib/db";

export const LANGUAGE_CODES = ["en", "id"] as const;
export const PARTS_OF_SPEECH = [
  "Noun",
  "Verb",
  "Adjective",
  "Adverb",
  "Pronoun",
  "Preposition",
  "Conjunction",
  "Interjection",
] as const;
export const MASTERY_STATUSES = ["new", "learning", "familiar", "mastered"] as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[number];
export type PartOfSpeech = (typeof PARTS_OF_SPEECH)[number];
export type MasteryStatus = (typeof MASTERY_STATUSES)[number];

export type VocabularyUseInput = {
  id?: string;
  partOfSpeech: PartOfSpeech;
  meaning: string;
  example: string;
  exampleTranslation?: string | null;
  masteryStatus?: MasteryStatus;
};

export type VocabularyWordInput = {
  sourceText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  uses: VocabularyUseInput[];
};

export type VocabularyFamilyInput = {
  familyId?: string;
  rootText?: string;
} | null;

export type VocabularyFamily = {
  id: string;
  rootText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  memberIds: string[];
};

export type VocabularyBulkImport = {
  entries: Array<{
    word: VocabularyWordInput;
    family: VocabularyFamilyInput;
  }>;
};

export type VocabularyUse = Required<Omit<VocabularyUseInput, "id">> & {
  id: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type VocabularyWord = Omit<VocabularyWordInput, "uses"> & {
  id: string;
  userId: number;
  uses: VocabularyUse[];
  createdAt: string;
  updatedAt: string;
};

export class VocabularyValidationError extends Error {}

type VocabularyWordRow = {
  wordId: string;
  userId: number;
  sourceText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  wordCreatedAt: Date | string;
  wordUpdatedAt: Date | string;
  useId: string;
  partOfSpeech: PartOfSpeech;
  meaning: string;
  example: string;
  exampleTranslation: string | null;
  masteryStatus: MasteryStatus;
  sortOrder: number;
  useCreatedAt: Date | string;
  useUpdatedAt: Date | string;
};

function toIsoDate(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function requireString(value: unknown, field: string, maxLength: number) {
  if (typeof value !== "string" || !value.trim()) {
    throw new VocabularyValidationError(`${field} is required.`);
  }

  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new VocabularyValidationError(`${field} is too long.`);
  }

  return normalized;
}

function isOneOf<T extends readonly string[]>(value: unknown, options: T): value is T[number] {
  return typeof value === "string" && options.includes(value as T[number]);
}

export function parseVocabularyInput(value: unknown): VocabularyWordInput {
  if (!value || typeof value !== "object") {
    throw new VocabularyValidationError("Invalid request body.");
  }

  const body = value as Record<string, unknown>;
  const sourceText = requireString(body.sourceText, "sourceText", 255);

  if (!isOneOf(body.sourceLang, LANGUAGE_CODES) || !isOneOf(body.targetLang, LANGUAGE_CODES)) {
    throw new VocabularyValidationError("sourceLang and targetLang must be en or id.");
  }

  if (body.sourceLang === body.targetLang) {
    throw new VocabularyValidationError("sourceLang and targetLang must be different.");
  }

  if (!Array.isArray(body.uses) || body.uses.length === 0 || body.uses.length > 30) {
    throw new VocabularyValidationError("uses must contain between 1 and 30 entries.");
  }

  const uses = body.uses.map((item) => {
    if (!item || typeof item !== "object") {
      throw new VocabularyValidationError("Invalid use entry.");
    }

    const use = item as Record<string, unknown>;
    if (!isOneOf(use.partOfSpeech, PARTS_OF_SPEECH)) {
      throw new VocabularyValidationError("Invalid partOfSpeech.");
    }

    const masteryStatus = use.masteryStatus ?? "new";
    if (!isOneOf(masteryStatus, MASTERY_STATUSES)) {
      throw new VocabularyValidationError("Invalid masteryStatus.");
    }

    const exampleTranslation = use.exampleTranslation == null
      ? null
      : requireString(use.exampleTranslation, "exampleTranslation", 1000);

    return {
      partOfSpeech: use.partOfSpeech,
      meaning: requireString(use.meaning, "meaning", 500),
      example: requireString(use.example, "example", 1500),
      exampleTranslation,
      masteryStatus,
    };
  });

  return { sourceText, sourceLang: body.sourceLang, targetLang: body.targetLang, uses };
}

export function parseVocabularyFamilyInput(value: unknown): VocabularyFamilyInput {
  if (!value || typeof value !== "object") return null;
  const family = (value as Record<string, unknown>).family;
  if (family == null) return null;
  if (typeof family !== "object") throw new VocabularyValidationError("Invalid family.");

  const input = family as Record<string, unknown>;
  if (typeof input.familyId === "string" && input.familyId.trim()) {
    return { familyId: input.familyId.trim() };
  }
  if (typeof input.rootText === "string" && input.rootText.trim()) {
    return { rootText: requireString(input.rootText, "family rootText", 255) };
  }

  throw new VocabularyValidationError("familyId or family rootText is required.");
}

export function parseVocabularyBulkImport(value: unknown): VocabularyBulkImport {
  if (!value || typeof value !== "object") {
    throw new VocabularyValidationError("Invalid import JSON.");
  }

  const body = value as Record<string, unknown>;
  if (!isOneOf(body.sourceLang, LANGUAGE_CODES) || !isOneOf(body.targetLang, LANGUAGE_CODES) || body.sourceLang === body.targetLang) {
    throw new VocabularyValidationError("sourceLang and targetLang must be different and use en or id.");
  }

  const entries: VocabularyBulkImport["entries"] = [];
  const seenWords = new Set<string>();
  const addWord = (rawWord: unknown, family: VocabularyFamilyInput) => {
    if (!rawWord || typeof rawWord !== "object") throw new VocabularyValidationError("Invalid word in import.");
    const item = rawWord as Record<string, unknown>;
    const word = parseVocabularyInput({
      sourceText: item.word,
      sourceLang: body.sourceLang,
      targetLang: body.targetLang,
      uses: item.uses,
    });
    const key = normalizeSourceText(word.sourceText);
    if (seenWords.has(key)) throw new VocabularyValidationError(`Duplicate word in import: ${word.sourceText}.`);
    seenWords.add(key);
    entries.push({ word, family });
  };

  if (body.families != null) {
    if (!Array.isArray(body.families)) throw new VocabularyValidationError("families must be an array.");
    for (const rawFamily of body.families) {
      if (!rawFamily || typeof rawFamily !== "object") throw new VocabularyValidationError("Invalid family in import.");
      const family = rawFamily as Record<string, unknown>;
      const rootText = requireString(family.root, "family root", 255);
      if (!Array.isArray(family.words) || family.words.length === 0) throw new VocabularyValidationError("A family must contain at least one word.");
      for (const rawWord of family.words) addWord(rawWord, { rootText });
    }
  }

  if (body.wordsWithoutFamily != null) {
    if (!Array.isArray(body.wordsWithoutFamily)) throw new VocabularyValidationError("wordsWithoutFamily must be an array.");
    for (const rawWord of body.wordsWithoutFamily) addWord(rawWord, null);
  }

  if (entries.length === 0 || entries.length > 200) {
    throw new VocabularyValidationError("Import must contain between 1 and 200 words.");
  }

  return { entries };
}

export async function ensureVocabularyTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS vocabulary_words (
      id VARCHAR(64) PRIMARY KEY,
      user_id INT NOT NULL,
      source_text VARCHAR(255) NOT NULL,
      source_text_normalized VARCHAR(255) NOT NULL,
      source_lang CHAR(2) NOT NULL,
      target_lang CHAR(2) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_vocabulary_words_user_direction_text (
        user_id, source_lang, target_lang, source_text_normalized
      ),
      KEY idx_vocabulary_words_user_direction (user_id, source_lang, target_lang)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS vocabulary_uses (
      id VARCHAR(64) PRIMARY KEY,
      word_id VARCHAR(64) NOT NULL,
      part_of_speech VARCHAR(32) NOT NULL,
      meaning TEXT NOT NULL,
      example TEXT NOT NULL,
      example_translation TEXT NULL,
      mastery_status VARCHAR(16) NOT NULL DEFAULT 'new',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_vocabulary_uses_word
        FOREIGN KEY (word_id) REFERENCES vocabulary_words(id) ON DELETE CASCADE,
      KEY idx_vocabulary_uses_word_order (word_id, sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS vocabulary_word_families (
      id VARCHAR(64) PRIMARY KEY,
      user_id INT NOT NULL,
      root_text VARCHAR(255) NOT NULL,
      root_text_normalized VARCHAR(255) NOT NULL,
      source_lang CHAR(2) NOT NULL,
      target_lang CHAR(2) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_vocabulary_families_user_direction_root (
        user_id, source_lang, target_lang, root_text_normalized
      )
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS vocabulary_word_family_members (
      family_id VARCHAR(64) NOT NULL,
      word_id VARCHAR(64) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (family_id, word_id),
      KEY idx_vocabulary_family_members_word (word_id),
      CONSTRAINT fk_vocabulary_family_members_family
        FOREIGN KEY (family_id) REFERENCES vocabulary_word_families(id) ON DELETE CASCADE,
      CONSTRAINT fk_vocabulary_family_members_word
        FOREIGN KEY (word_id) REFERENCES vocabulary_words(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

function normalizeSourceText(sourceText: string) {
  return sourceText.trim().toLocaleLowerCase();
}

export async function getVocabularyWords(userId = 1): Promise<VocabularyWord[]> {
  await ensureVocabularyTables();

  const [rows] = await db.query(`
    SELECT
      w.id AS wordId,
      w.user_id AS userId,
      w.source_text AS sourceText,
      w.source_lang AS sourceLang,
      w.target_lang AS targetLang,
      w.created_at AS wordCreatedAt,
      w.updated_at AS wordUpdatedAt,
      u.id AS useId,
      u.part_of_speech AS partOfSpeech,
      u.meaning,
      u.example,
      u.example_translation AS exampleTranslation,
      u.mastery_status AS masteryStatus,
      u.sort_order AS sortOrder,
      u.created_at AS useCreatedAt,
      u.updated_at AS useUpdatedAt
    FROM vocabulary_words w
    INNER JOIN vocabulary_uses u ON u.word_id = w.id
    WHERE w.user_id = ?
    ORDER BY w.source_text_normalized ASC, u.sort_order ASC
  `, [userId]);

  const words = new Map<string, VocabularyWord>();
  for (const row of rows as VocabularyWordRow[]) {
    const word = words.get(row.wordId) ?? {
      id: row.wordId,
      userId: row.userId,
      sourceText: row.sourceText,
      sourceLang: row.sourceLang,
      targetLang: row.targetLang,
      createdAt: toIsoDate(row.wordCreatedAt),
      updatedAt: toIsoDate(row.wordUpdatedAt),
      uses: [],
    };

    word.uses.push({
      id: row.useId,
      partOfSpeech: row.partOfSpeech,
      meaning: row.meaning,
      example: row.example,
      exampleTranslation: row.exampleTranslation ?? "",
      masteryStatus: row.masteryStatus,
      sortOrder: row.sortOrder,
      createdAt: toIsoDate(row.useCreatedAt),
      updatedAt: toIsoDate(row.useUpdatedAt),
    });
    words.set(row.wordId, word);
  }

  return [...words.values()];
}

export async function getVocabularyFamilies(userId = 1): Promise<VocabularyFamily[]> {
  await ensureVocabularyTables();
  const [rows] = await db.query(`
    SELECT
      f.id AS familyId,
      f.root_text AS rootText,
      f.source_lang AS sourceLang,
      f.target_lang AS targetLang,
      m.word_id AS wordId
    FROM vocabulary_word_families f
    LEFT JOIN vocabulary_word_family_members m ON m.family_id = f.id
    WHERE f.user_id = ?
    ORDER BY f.root_text_normalized ASC
  `, [userId]);

  const families = new Map<string, VocabularyFamily>();
  for (const row of rows as Array<VocabularyFamily & { familyId: string; wordId: string | null }>) {
    const family = families.get(row.familyId) ?? {
      id: row.familyId,
      rootText: row.rootText,
      sourceLang: row.sourceLang,
      targetLang: row.targetLang,
      memberIds: [],
    };
    if (row.wordId) family.memberIds.push(row.wordId);
    families.set(row.familyId, family);
  }

  return [...families.values()];
}

async function attachWordToFamily(
  connection: Awaited<ReturnType<typeof db.getConnection>>,
  wordId: string,
  word: VocabularyWordInput,
  familyInput: VocabularyFamilyInput,
  userId: number,
) {
  if (!familyInput) return;
  let familyId = familyInput.familyId;

  if (familyId) {
    const [rows] = await connection.query<any[]>(`
      SELECT id FROM vocabulary_word_families
      WHERE id = ? AND user_id = ? AND source_lang = ? AND target_lang = ?
    `, [familyId, userId, word.sourceLang, word.targetLang]);
    if (!rows.length) throw new VocabularyValidationError("Word family not found.");
  } else if (familyInput.rootText) {
    const normalizedRoot = normalizeSourceText(familyInput.rootText);
    const [existing] = await connection.query<any[]>(`
      SELECT id FROM vocabulary_word_families
      WHERE user_id = ? AND source_lang = ? AND target_lang = ? AND root_text_normalized = ?
    `, [userId, word.sourceLang, word.targetLang, normalizedRoot]);

    familyId = existing[0]?.id;
    if (!familyId) {
      familyId = `family_${randomUUID()}`;
      await connection.query(`
        INSERT INTO vocabulary_word_families (
          id, user_id, root_text, root_text_normalized, source_lang, target_lang
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [familyId, userId, familyInput.rootText, normalizedRoot, word.sourceLang, word.targetLang]);
    }
  }

  if (familyId) {
    await connection.query(`
      INSERT INTO vocabulary_word_family_members (family_id, word_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE family_id = VALUES(family_id)
    `, [familyId, wordId]);
  }
}

async function insertVocabularyWord(
  connection: Awaited<ReturnType<typeof db.getConnection>>,
  input: VocabularyWordInput,
  userId: number,
  familyInput: VocabularyFamilyInput,
) {
  const id = `vocab_${randomUUID()}`;
  await connection.query(`
    INSERT INTO vocabulary_words (
      id, user_id, source_text, source_text_normalized, source_lang, target_lang
    ) VALUES (?, ?, ?, ?, ?, ?)
  `, [id, userId, input.sourceText, normalizeSourceText(input.sourceText), input.sourceLang, input.targetLang]);

  for (const [index, use] of input.uses.entries()) {
    await connection.query(`
      INSERT INTO vocabulary_uses (
        id, word_id, part_of_speech, meaning, example,
        example_translation, mastery_status, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      `use_${randomUUID()}`,
      id,
      use.partOfSpeech,
      use.meaning,
      use.example,
      use.exampleTranslation || null,
      use.masteryStatus || "new",
      index,
    ]);
  }

  await attachWordToFamily(connection, id, input, familyInput, userId);
  return id;
}

export async function createVocabularyWord(input: VocabularyWordInput, userId = 1, familyInput: VocabularyFamilyInput = null) {
  await ensureVocabularyTables();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const id = await insertVocabularyWord(connection, input, userId, familyInput);

    await connection.commit();
    return id;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function importVocabularyWords(importData: VocabularyBulkImport, userId = 1) {
  await ensureVocabularyTables();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    for (const entry of importData.entries) {
      await insertVocabularyWord(connection, entry.word, userId, entry.family);
    }
    await connection.commit();
    return importData.entries.length;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateVocabularyWord(id: string, input: VocabularyWordInput, userId = 1, familyInput: VocabularyFamilyInput = null) {
  await ensureVocabularyTables();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const [result] = await connection.query<any>(`
      UPDATE vocabulary_words
      SET source_text = ?, source_text_normalized = ?, source_lang = ?, target_lang = ?
      WHERE id = ? AND user_id = ?
    `, [input.sourceText, normalizeSourceText(input.sourceText), input.sourceLang, input.targetLang, id, userId]);

    if (result.affectedRows === 0) {
      throw new VocabularyValidationError("Vocabulary word not found.");
    }

    await connection.query("DELETE FROM vocabulary_uses WHERE word_id = ?", [id]);
    for (const [index, use] of input.uses.entries()) {
      await connection.query(`
        INSERT INTO vocabulary_uses (
          id, word_id, part_of_speech, meaning, example,
          example_translation, mastery_status, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        `use_${randomUUID()}`,
        id,
        use.partOfSpeech,
        use.meaning,
        use.example,
        use.exampleTranslation || null,
        use.masteryStatus || "new",
        index,
      ]);
    }

    await connection.query("DELETE FROM vocabulary_word_family_members WHERE word_id = ?", [id]);
    await attachWordToFamily(connection, id, input, familyInput, userId);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteVocabularyWord(id: string, userId = 1) {
  await ensureVocabularyTables();
  await db.query("DELETE FROM vocabulary_words WHERE id = ? AND user_id = ?", [id, userId]);
}
