import { db } from "@/lib/db";

export async function POST(req: any) {
  const body = await req.json();

  await db.query(
    `INSERT INTO roles 
      (id, experience_id, title, employment_type, start_date, end_date, duration, description) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      `role_${Date.now()}`,
      body.experienceId,
      body.title,
      body.employmentType,
      body.startDate,
      body.endDate,
      body.duration,
      body.description
    ]
  );

  return Response.json({ success: true });
}
