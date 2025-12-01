export const runtime = "nodejs";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "email & password required" },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hash, email]
    );

    return Response.json({ success: true, message: "Password updated" });
  } catch (error: any) {
    console.error("SET PASSWORD ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
