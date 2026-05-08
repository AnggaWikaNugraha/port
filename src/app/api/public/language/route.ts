export const runtime = "nodejs";

import { getLanguageAdminPayload } from "@/lib/language";

export async function GET() {
  try {
    const payload = await getLanguageAdminPayload(1);
    return Response.json(payload);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
