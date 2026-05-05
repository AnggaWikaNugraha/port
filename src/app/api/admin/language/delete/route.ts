export const runtime = "nodejs";

import { verifyAdminRequest } from "@/lib/admin-auth";
import { deleteLanguageEntry } from "@/lib/language";

export async function POST(req: Request) {
  try {
    verifyAdminRequest(req);
    const { id } = await req.json();
    await deleteLanguageEntry(id, 1);
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
