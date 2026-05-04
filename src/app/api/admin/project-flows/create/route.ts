export const runtime = "nodejs";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];
    jwt.verify(token!, process.env.JWT_SECRET!);

    const body = await req.json();
    const id = `flow_${Date.now()}`;

    await db.query(
      "INSERT INTO project_flows (id, project_id, title, description, image_url) VALUES (?, ?, ?, ?, ?)",
      [id, body.projectId, body.title || null, body.description || null, body.imageUrl || null]
    );

    return Response.json({ success: true, id });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
