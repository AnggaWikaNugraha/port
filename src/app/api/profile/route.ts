export const runtime = "nodejs";

import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
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

    const [rows]: any = await db.query(
      "SELECT id, name, username, bio, email, phone, location, avatar_url, job_title, company, website FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!rows.length) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(rows[0]);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
