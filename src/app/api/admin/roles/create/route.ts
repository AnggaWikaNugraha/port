export const runtime = "nodejs";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const id = `role_${Date.now()}`;

    await db.query(
      `
      INSERT INTO roles (
        id,
        experience_id,
        title,
        employment_type,
        start_date,
        end_date,
        duration,
        description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        body.experienceId,
        body.title,
        body.employmentType,
        body.startDate,
        body.endDate || null,
        body.duration || null,
        body.description || "",
      ]
    );

    return Response.json({ success: true, id });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
