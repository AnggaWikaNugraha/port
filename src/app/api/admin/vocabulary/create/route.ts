export const runtime = "nodejs";

import { verifyAdminRequest } from "@/lib/admin-auth";
import {
  createVocabularyWord,
  parseVocabularyFamilyInput,
  parseVocabularyInput,
  VocabularyValidationError,
} from "@/lib/vocabulary";

export async function POST(req: Request) {
  try {
    verifyAdminRequest(req);
    const body = await req.json();
    const input = parseVocabularyInput(body);
    const id = await createVocabularyWord(input, 1, parseVocabularyFamilyInput(body));
    return Response.json({ success: true, id }, { status: 201 });
  } catch (error: any) {
    const status = error.message === "Unauthorized"
      ? 401
      : error instanceof VocabularyValidationError
        ? 400
        : error?.code === "ER_DUP_ENTRY"
          ? 409
          : 500;
    return Response.json({ error: error.message || "Unable to create vocabulary." }, { status });
  }
}
