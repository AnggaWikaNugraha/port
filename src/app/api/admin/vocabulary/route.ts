export const runtime = "nodejs";

import { verifyAdminRequest } from "@/lib/admin-auth";
import { getVocabularyFamilies, getVocabularyWords } from "@/lib/vocabulary";

export async function GET(req: Request) {
  try {
    verifyAdminRequest(req);
    const words = await getVocabularyWords(1);
    const families = await getVocabularyFamilies(1);
    return Response.json({ words, families });
  } catch (error: any) {
    const status = error.message === "Unauthorized" ? 401 : 500;
    return Response.json({ error: error.message || "Unable to load vocabulary." }, { status });
  }
}
