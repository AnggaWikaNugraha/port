import 'server-only';

import { db } from "@/lib/db";

/**
 * Tulis ulang relasi skill sebuah project. Hanya skill milik user yang
 * diterima, dan urutan mengikuti urutan skillIds yang dikirim.
 */
export async function setProjectSkills(projectId: string, skillIds: any[], userId = 1) {
  await db.query("DELETE FROM project_skills WHERE project_id = ?", [projectId]);

  const ids = (Array.isArray(skillIds) ? skillIds : [])
    .map(Number)
    .filter(id => Number.isInteger(id));

  if (ids.length === 0) return;

  const [owned]: any = await db.query(
    "SELECT id FROM user_skills WHERE user_id = ? AND id IN (?)",
    [userId, ids]
  );
  const ownedIds = new Set(owned.map((row: any) => row.id));

  // urutan asli dipertahankan, skill yang bukan milik user diabaikan
  const values = ids.filter(id => ownedIds.has(id)).map((id, index) => [projectId, id, index]);
  if (values.length === 0) return;

  await db.query(
    "INSERT INTO project_skills (project_id, skill_id, sort_order) VALUES ?",
    [values]
  );
}
