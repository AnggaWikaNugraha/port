export const runtime = "nodejs";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split(";").find(x => x.trim().startsWith("token="))?.split("=")[1];
    jwt.verify(token!, process.env.JWT_SECRET!);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return Response.json({ error: "No file provided" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "portfolio", resource_type: "image" },
        (err, res) => {
          if (err || !res) return reject(err);
          resolve(res as { secure_url: string });
        }
      );
      stream.end(buffer);
    });

    return Response.json({ url: result.secure_url });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
