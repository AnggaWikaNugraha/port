export const runtime = "nodejs";

import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];

    const user: any = jwt.verify(token!, process.env.JWT_SECRET!);

    const { id, skill, categoryId } = await req.json();

    const sets: string[] = [];
    const values: any[] = [];

    if (skill !== undefined) {
      if (!skill?.trim()) {
        return Response.json({ error: "Skill is required" }, { status: 400 });
      }
      sets.push("skill = ?");
      values.push(skill.trim());
    }

    if (categoryId !== undefined) {
      let resolvedCategoryId: number | null = null;
      if (categoryId) {
        const [owned]: any = await db.query(
          "SELECT id FROM skill_categories WHERE id = ? AND user_id = ?",
          [categoryId, user.id]
        );
        resolvedCategoryId = owned.length ? owned[0].id : null;
      }
      sets.push("category_id = ?");
      values.push(resolvedCategoryId);
    }

    if (!sets.length) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db.query(
      `UPDATE user_skills SET ${sets.join(", ")} WHERE id = ? AND user_id = ?`,
      [...values, id, user.id]
    );

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
