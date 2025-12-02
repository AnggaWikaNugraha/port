import { db } from "@/lib/db";

export async function POST(req: any) {
  const { id } = await req.json();

  await db.query("DELETE FROM roles WHERE experience_id = ?", [id]);
  await db.query("DELETE FROM experience WHERE id = ?", [id]);

  return Response.json({ success: true });
}
