export const runtime = "nodejs";

import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];

    const user: any = jwt.verify(token!, process.env.JWT_SECRET!);

    const { id } = await req.json();

    // skill di dalamnya tidak ikut terhapus, hanya jadi Uncategorized
    await db.query(
      "UPDATE user_skills SET category_id = NULL WHERE category_id = ? AND user_id = ?",
      [id, user.id]
    );

    await db.query(
      "DELETE FROM skill_categories WHERE id = ? AND user_id = ?",
      [id, user.id]
    );

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
