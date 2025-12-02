import { db } from "@/lib/db";

export async function GET() {
  const [rows]: any = await db.query(
    "SELECT id, interest FROM user_interests WHERE user_id = 1 ORDER BY id ASC"
  );
  return Response.json(rows);
}
