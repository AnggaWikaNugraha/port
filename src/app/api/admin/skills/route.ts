export const runtime = "nodejs";

import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];

    const user: any = jwt.verify(token!, process.env.JWT_SECRET!);

    const [rows]: any = await db.query(
      `SELECT
         s.id,
         s.skill,
         s.category_id AS categoryId,
         c.name AS categoryName
       FROM user_skills s
       LEFT JOIN skill_categories c ON c.id = s.category_id
       WHERE s.user_id = ?
       ORDER BY c.sort_order IS NULL, c.sort_order ASC, s.sort_order ASC, s.id ASC`,
      [user.id]
    );

    return Response.json(rows);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
