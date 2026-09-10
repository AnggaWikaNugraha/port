export const runtime = "nodejs";

import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];

    const user: any = jwt.verify(token!, process.env.JWT_SECRET!);

    const [rows]: any = await db.query(
      "SELECT id, name, sort_order AS sortOrder FROM skill_categories WHERE user_id = ? ORDER BY sort_order ASC, id ASC",
      [user.id]
    );

    return Response.json(rows);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
