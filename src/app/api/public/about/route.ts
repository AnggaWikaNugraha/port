export const runtime = "nodejs";

import { db } from "@/lib/db";

export async function GET() {
  try {
    // GET USER
    const [rows]: any = await db.query(`
      SELECT 
        id,
        name,
        username,
        bio,
        email,
        phone,
        location,
        avatar_url,
        job_title,
        company,
        website,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM users
      LIMIT 1;
    `);

    if (!rows.length) {
      return Response.json({ error: "No user found" }, { status: 404 });
    }

    const user = rows[0];

    // GET SKILLS
    const [skillsRows]: any = await db.query(
      "SELECT skill FROM user_skills WHERE user_id = ? ORDER BY id ASC",
      [user.id]
    );

    const skills = skillsRows.map((s: any) => s.skill);

    return Response.json({
      ...user,
      social: {
        github: user.github || null,
        linkedin: user.linkedin || null,
        twitter: user.twitter || null,
        instagram: user.instagram || null,
        website: user.website || null,
      },
      skills,           // ⬅ SKILLS REAL
      interests: [],    // nanti diisi
      experience: [],   // nanti diisi
      education: [],    // nanti diisi
      certificates: [], // nanti diisi
    });

  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
