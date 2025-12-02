export const runtime = "nodejs";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT 
        id,
        title,
        issuer,
        issue_date,
        expiration_date,
        credential_url
      FROM certificates
      ORDER BY issue_date DESC
    `);

    return Response.json(rows);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
