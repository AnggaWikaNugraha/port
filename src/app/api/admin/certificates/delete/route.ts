export const runtime = "nodejs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    await db.query(`DELETE FROM certificates WHERE id = ?`, [id]);

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
