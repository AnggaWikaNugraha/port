export const runtime = "nodejs";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];
    jwt.verify(token!, process.env.JWT_SECRET!);

    const [projects]: any = await db.query(`
      SELECT id, title, description, role, company, tech_stack AS techStack,
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
      p.techStack = p.techStack ? JSON.parse(p.techStack) : [];
    }

    return Response.json(projects);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
