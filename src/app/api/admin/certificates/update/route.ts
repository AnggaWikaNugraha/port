export const runtime = "nodejs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const cert = await req.json();

    await db.query(
      `
      UPDATE certificates
      SET title = ?, issuer = ?, issue_date = ?, expiration_date = ?, credential_url = ?
      WHERE id = ?
    `,
      [
        cert.title,
        cert.issuer,
        cert.issue_date,
        cert.expiration_date,
        cert.credential_url,
        cert.id,
      ]
    );

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
