import { db } from "@/lib/db";

export async function POST(req: any) {
  const { interest }: any = await req.json();

  await db.query(
    "INSERT INTO user_interests (id, user_id, interest) VALUES (?, ?, ?)",
    [`int_${Date.now()}`, 1, interest]
  );

  return Response.json({ success: true });
}
