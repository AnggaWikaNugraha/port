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

    // GET SKILLS (beserta kategorinya)
    const [skillsRows]: any = await db.query(
      `SELECT
         s.skill,
         s.category_id AS categoryId,
         c.name AS categoryName
       FROM user_skills s
       LEFT JOIN skill_categories c ON c.id = s.category_id
       WHERE s.user_id = ?
       ORDER BY c.sort_order IS NULL, c.sort_order ASC, c.id ASC, s.sort_order ASC, s.id ASC`,
      [user.id]
    );

    const skills = skillsRows.map((s: any) => s.skill);

    // Kelompokkan jadi [{ id, name, skills: [] }] sesuai urutan kategori
    const skillGroups: { id: number | null; name: string; skills: string[] }[] = [];
    for (const row of skillsRows) {
      const id = row.categoryId ?? null;
      let group = skillGroups.find(g => g.id === id);
      if (!group) {
        group = { id, name: row.categoryName || "Other", skills: [] };
        skillGroups.push(group);
      }
      group.skills.push(row.skill);
    }

    // GET INTERESTS
    const [interestRows]: any = await db.query(
      "SELECT interest FROM user_interests WHERE user_id = ? ORDER BY sort_order ASC, id ASC",
      [user.id]
    );
    const interests = interestRows.map((i: any) => i.interest);

    // ============================
    //     GET EXPERIENCE
    // ============================
    const [expRows]: any = await db.query(`
      SELECT
        id,
        company,
        company_logo_url AS companyLogoUrl,
        location,
        created_at
      FROM experience
      WHERE user_id = 1
      ORDER BY created_at ASC
    `);    

    // ============================
    //     GET ROLES PER EXPERIENCE
    // ============================
    for (const exp of expRows) {
      const [rolesRows]: any = await db.query(
        `
        SELECT
          id,
          title,
          employment_type AS employmentType,
          start_date AS startDate,
          end_date AS endDate,
          duration,
          description,
          product_link AS productLink,
          product_title AS productTitle
        FROM roles
        WHERE experience_id = ?
        ORDER BY start_date DESC
        `,
        [exp.id]
      );

      exp.roles = rolesRows; // ⬅ masukkan roles ke experience
    }

    // GET CERTIFICATES
    const [certRows]: any = await db.query(`
      SELECT
        id,
        title,
        issuer,
        issue_date AS issueDate,
        expiration_date AS expirationDate,
        credential_url AS credentialUrl
      FROM certificates
      WHERE user_id = ?
      ORDER BY issue_date DESC
    `, [user.id]);

    return Response.json({
      ...user,
      social: {
        github: user.github || null,
        linkedin: user.linkedin || null,
        twitter: user.twitter || null,
        instagram: user.instagram || null,
        website: user.website || null,
      },
      skills,
      skillGroups,
      interests,
      experience: expRows,
      education: [],
      certificates: certRows,
    });

  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
