import 'server-only';

import { db } from "@/lib/db";

/**
 * Migration 003 bisa saja belum dijalankan saat kode ini sudah live.
 * Kalau tabelnya memang belum ada, fitur kategori diam saja — alur
 * project yang lama tetap jalan seperti sebelumnya.
 */
function isMissingTable(err: any) {
  return err?.code === "ER_NO_SUCH_TABLE";
}

/**
 * Set kategori sebuah project. categoryId null/kosong = lepas kategorinya,
 * dan project itu otomatis hilang dari section "Project types".
 */
export async function setProjectCategory(projectId: string, categoryId: any, userId = 1) {
  const id = Number(categoryId);

  try {
    if (!Number.isInteger(id) || id <= 0) {
      await db.query("DELETE FROM project_category_map WHERE project_id = ?", [projectId]);
      return;
    }

    // kategori milik user lain diabaikan
    const [owned]: any = await db.query(
      "SELECT id FROM project_categories WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    if (owned.length === 0) return;

    await db.query(
      `INSERT INTO project_category_map (project_id, category_id) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE category_id = VALUES(category_id)`,
      [projectId, id]
    );
  } catch (err: any) {
    if (isMissingTable(err)) {
      console.warn("[project-types] migrations/003_project_categories.sql belum dijalankan");
      return;
    }
    throw err;
  }
}

/**
 * Kategori tiap project, untuk ditempelkan ke daftar project di admin.
 * Sengaja query terpisah supaya query project utama tidak perlu diubah.
 */
export async function getProjectCategoryMap(projectIds: string[]) {
  const map = new Map<string, { categoryId: number; categoryName: string }>();
  if (projectIds.length === 0) return map;

  try {
    const [rows]: any = await db.query(
      `SELECT m.project_id AS projectId, c.id AS categoryId, c.name AS categoryName
       FROM project_category_map m
       JOIN project_categories c ON c.id = m.category_id
       WHERE m.project_id IN (?)`,
      [projectIds]
    );

    for (const row of rows) {
      map.set(row.projectId, { categoryId: row.categoryId, categoryName: row.categoryName });
    }
  } catch (err: any) {
    if (!isMissingTable(err)) throw err;
    console.warn("[project-types] migrations/003_project_categories.sql belum dijalankan");
  }

  return map;
}
