export const runtime = "nodejs";

import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];

    const user: any = jwt.verify(token!, process.env.JWT_SECRET!);

    const { ids }: { ids: string[] } = await req.json();

    await Promise.all(
      ids.map((id, index) =>
        db.query(
          "UPDATE skill_categories SET sort_order = ? WHERE id = ? AND user_id = ?",
          [index, id, user.id]
        )
      )
    );

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
