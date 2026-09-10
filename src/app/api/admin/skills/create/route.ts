export const runtime = "nodejs";

import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];

    const user: any = jwt.verify(token!, process.env.JWT_SECRET!);

    const { skill, categoryId } = await req.json();
    if (!skill?.trim()) {
      return Response.json({ error: "Skill is required" }, { status: 400 });
    }

    // kategori harus milik user yang sama, kalau tidak dianggap uncategorized
    let resolvedCategoryId: number | null = null;
    if (categoryId) {
      const [owned]: any = await db.query(
        "SELECT id FROM skill_categories WHERE id = ? AND user_id = ?",
        [categoryId, user.id]
      );
      resolvedCategoryId = owned.length ? owned[0].id : null;
    }

    const [max]: any = await db.query(
      `SELECT COALESCE(MAX(sort_order), -1) + 1 AS next
       FROM user_skills
       WHERE user_id = ? AND category_id <=> ?`,
      [user.id, resolvedCategoryId]
    );

    await db.query(
      "INSERT INTO user_skills (user_id, skill, category_id, sort_order) VALUES (?, ?, ?, ?)",
      [user.id, skill.trim(), resolvedCategoryId, max[0].next]
    );

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
