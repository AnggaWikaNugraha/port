export const runtime = "nodejs";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];
    jwt.verify(token!, process.env.JWT_SECRET!);

    const body = await req.json();
    await db.query(
      "UPDATE project_flows SET title=?, description=?, image_url=? WHERE id=?",
      [body.title || null, body.description || null, body.imageUrl || null, body.id]
    );

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
