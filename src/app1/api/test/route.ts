export const runtime = "nodejs";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    return Response.json(rows);
  } catch (err: any) {
    console.error("DB Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
