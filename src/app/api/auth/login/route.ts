export const runtime = "nodejs";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const [rows]: any = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];

    if (!user.password) {
      return Response.json({ error: "User has no password set" }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return Response.json({ error: "Wrong password" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Set-Cookie":
          `token=${token}; HttpOnly; SameSite=Strict; Secure; Path=/; Max-Age=86400`,
        "Content-Type": "application/json",
      },
    });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
