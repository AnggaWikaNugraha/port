import { db } from "@/lib/db";

export async function GET() {
  const [rows]: any = await db.query(`
    SELECT id, company, company_logo_url AS companyLogoUrl, location
    FROM experience
    WHERE user_id = 1
    ORDER BY created_at ASC
  `);

  for (const exp of rows) {
    const [roles]: any = await db.query(`
      SELECT 
        id, title, employment_type AS employmentType, start_date AS startDate,
        end_date AS endDate, duration, description
      FROM roles
      WHERE experience_id = ?
      ORDER BY start_date DESC
    `, [exp.id]);

    exp.roles = roles;
  }

  return Response.json(rows);
}
