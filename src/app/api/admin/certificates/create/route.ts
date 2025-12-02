export const runtime = "nodejs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await db.query(
      `
      INSERT INTO certificates 
      (id, user_id, title, issuer, issue_date, expiration_date, credential_url)
      VALUES (UUID(), 1, ?, ?, ?, ?, ?)
      `,
      [
        body.title,
        body.issuer,
        body.issue_date,
        body.expiration_date,
        body.credential_url,
      ]
    );

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
