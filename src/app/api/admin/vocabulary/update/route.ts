export const runtime = "nodejs";

import { verifyAdminRequest } from "@/lib/admin-auth";
import {
  parseVocabularyInput,
  parseVocabularyFamilyInput,
  updateVocabularyWord,
  VocabularyValidationError,
} from "@/lib/vocabulary";

export async function POST(req: Request) {
  try {
    verifyAdminRequest(req);
    const body = await req.json();
    if (typeof body.id !== "string" || !body.id.trim()) {
      throw new VocabularyValidationError("id is required.");
    }

    await updateVocabularyWord(body.id, parseVocabularyInput(body), 1, parseVocabularyFamilyInput(body));
    return Response.json({ success: true });
  } catch (error: any) {
    const status = error.message === "Unauthorized"
      ? 401
      : error instanceof VocabularyValidationError
        ? 400
        : error?.code === "ER_DUP_ENTRY"
          ? 409
          : 500;
    return Response.json({ error: error.message || "Unable to update vocabulary." }, { status });
  }
}
