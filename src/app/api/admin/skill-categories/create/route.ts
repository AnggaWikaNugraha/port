export const runtime = "nodejs";

import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];

    const user: any = jwt.verify(token!, process.env.JWT_SECRET!);

    const { name } = await req.json();
    if (!name?.trim()) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const [max]: any = await db.query(
      "SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM skill_categories WHERE user_id = ?",
      [user.id]
    );

    await db.query(
      "INSERT INTO skill_categories (user_id, name, sort_order) VALUES (?, ?, ?)",
      [user.id, name.trim(), max[0].next]
    );

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
