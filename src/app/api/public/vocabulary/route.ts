export const runtime = "nodejs";

import { getVocabularyFamilies, getVocabularyWords } from "@/lib/vocabulary";

export async function GET() {
  try {
    const words = await getVocabularyWords(1);
    const families = await getVocabularyFamilies(1);
    return Response.json({ words, families });
  } catch (error: any) {
    return Response.json({ error: error.message || "Unable to load vocabulary." }, { status: 500 });
  }
}
