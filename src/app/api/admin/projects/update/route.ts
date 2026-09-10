export const runtime = "nodejs";
import { db } from "@/lib/db";
import { setProjectSkills } from "@/lib/projectSkills";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];
    jwt.verify(token!, process.env.JWT_SECRET!);

    const body = await req.json();

    await db.query(`
      UPDATE projects SET title=?, description=?, role=?, company=?,
        year=?, status=?, featured=?, is_private=?, demo_url=?, repo_url=?, cover_image=?
      WHERE id=?
    `, [
      body.title, body.description || null, body.role || null, body.company || null,
      body.year || null,
      body.status || "completed", body.featured ? 1 : 0, body.isPrivate ? 1 : 0,
      body.demoUrl || null, body.repoUrl || null, body.coverImage || null,
      body.id,
    ]);

    if (body.skillIds !== undefined) {
      await setProjectSkills(body.id, body.skillIds);
    }

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
