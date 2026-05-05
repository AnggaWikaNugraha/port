import jwt from "jsonwebtoken";

export function verifyAdminRequest(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = cookie
    ?.split(";")
    .find((x) => x.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    throw new Error("Unauthorized");
  }

  jwt.verify(token, process.env.JWT_SECRET!);
}
