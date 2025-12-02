export const runtime = "nodejs";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const role = await req.json();

    await db.query(
      `
      UPDATE roles
      SET 
        title = ?, 
        employment_type = ?, 
        start_date = ?, 
        end_date = ?, 
        duration = ?, 
        description = ?
      WHERE id = ?
      `,
      [
        role.title,
        role.employmentType,
        role.startDate,
        role.endDate || null,
        role.duration,
        role.description,
        role.id,
      ]
    );

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
