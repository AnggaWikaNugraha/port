import { db } from "@/lib/db";

export async function POST(req: any) {
  const { id }: any = await req.json();

  await db.query("DELETE FROM user_interests WHERE id = ?", [id]);

  return Response.json({ success: true });
}
