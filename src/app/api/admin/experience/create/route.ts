import { db } from "@/lib/db";

export async function POST(req: any) {
  const body = await req.json();

  await db.query(
    "INSERT INTO experience (id, user_id, company, company_logo_url, location) VALUES (?, ?, ?, ?, ?)",
    [`exp_${Date.now()}`, 1, body.company, body.companyLogoUrl, body.location]
  );

  return Response.json({ success: true });
}
