export const runtime = "nodejs";

import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie
      ?.split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const body = await req.json();

    await db.query(
      `
      UPDATE users 
      SET name = ?, username = ?, bio = ?, email = ?, phone = ?, location = ?, avatar_url = ?, job_title = ?, company = ?, website = ?
      WHERE id = ?
      `,
      [
        body.name,
        body.username,
        body.bio,
        body.email,
        body.phone,
        body.location,
        body.avatar_url,
        body.job_title,
        body.company,
        body.website,
        decoded.id,
      ]
    );

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
