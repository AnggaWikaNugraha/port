export const runtime = "nodejs";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];
    jwt.verify(token!, process.env.JWT_SECRET!);

    const [projects]: any = await db.query(`
      SELECT id, title, description, role, company,
             year, status, featured, sort_order AS sortOrder, is_private AS isPrivate,
             demo_url AS demoUrl, repo_url AS repoUrl, cover_image AS coverImage,
             created_at AS createdAt, updated_at AS updatedAt
      FROM projects WHERE user_id = 1
      ORDER BY sort_order ASC, created_at DESC
    `);

    for (const p of projects) {
      const [flows]: any = await db.query(`
        SELECT id, title, description, image_url AS imageUrl, sort_order AS sortOrder
        FROM project_flows WHERE project_id = ?
        ORDER BY sort_order ASC
      `, [p.id]);
      p.flows = flows;

      // skill diambil dari master user_skills lewat project_skills
      const [skills]: any = await db.query(`
        SELECT s.id, s.skill, s.category_id AS categoryId, c.name AS categoryName
        FROM project_skills ps
        JOIN user_skills s ON s.id = ps.skill_id
        LEFT JOIN skill_categories c ON c.id = s.category_id
        WHERE ps.project_id = ?
        ORDER BY c.sort_order IS NULL, c.sort_order ASC, c.id ASC, ps.sort_order ASC, ps.id ASC
      `, [p.id]);

      p.skills = skills;
      p.skillIds = skills.map((s: any) => s.id);
      p.techStack = skills.map((s: any) => s.skill);
    }

    return Response.json(projects);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
