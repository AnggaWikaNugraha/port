export const runtime = "nodejs";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];
    jwt.verify(token!, process.env.JWT_SECRET!);

    const body = await req.json();
    const id = `proj_${Date.now()}`;

    await db.query(`
      INSERT INTO projects (id, user_id, title, description, role, company, tech_stack,
        year, status, featured, is_private, demo_url, repo_url, cover_image)
      VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, body.title, body.description || null, body.role || null, body.company || null,
      JSON.stringify(body.techStack || []), body.year || null,
      body.status || "completed", body.featured ? 1 : 0, body.isPrivate ? 1 : 0,
      body.demoUrl || null, body.repoUrl || null, body.coverImage || null,
    ]);

    return Response.json({ success: true, id });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
