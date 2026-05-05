export const runtime = "nodejs";

import { verifyAdminRequest } from "@/lib/admin-auth";
import { createLanguageEntry } from "@/lib/language";

export async function POST(req: Request) {
  try {
    verifyAdminRequest(req);
    const body = await req.json();
    const id = `lang_${Date.now()}`;

    await createLanguageEntry({
      id,
      userId: 1,
      sourceText: body.sourceText,
      sourceLang: body.sourceLang,
      targetLang: body.targetLang,
      meanings: Array.isArray(body.meanings) ? body.meanings : [],
      exampleSource: body.exampleSource || null,
      exampleTarget: body.exampleTarget || null,
      notes: body.notes || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
    });

    return Response.json({ success: true, id });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
