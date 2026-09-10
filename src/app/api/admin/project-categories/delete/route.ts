export const runtime = "nodejs";

import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];

    const user: any = jwt.verify(token!, process.env.JWT_SECRET!);

    const { id } = await req.json();

    // Baris di project_category_map ikut terhapus lewat FK ON DELETE CASCADE,
    // jadi project-nya sendiri tidak tersentuh — hanya kehilangan kategori
    // dan otomatis hilang dari section "Project types".
    await db.query(
      "DELETE FROM project_categories WHERE id = ? AND user_id = ?",
      [id, user.id]
    );

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
