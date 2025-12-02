export const runtime = "nodejs";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await db.query(
      `
        UPDATE experience 
        SET company = ?, company_logo_url = ?, location = ?
        WHERE id = ?
      `,
      [body.company, body.companyLogoUrl, body.location, body.id]
    );

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
