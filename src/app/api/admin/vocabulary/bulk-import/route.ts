export const runtime = 'nodejs';

import { verifyAdminRequest } from '@/lib/admin-auth';
import {
  importVocabularyWords,
  parseVocabularyBulkImport,
  VocabularyValidationError,
} from '@/lib/vocabulary';

export async function POST(req: Request) {
  try {
    verifyAdminRequest(req);
    const imported = await importVocabularyWords(parseVocabularyBulkImport(await req.json()), 1);
    return Response.json({ success: true, imported }, { status: 201 });
  } catch (error: any) {
    const status = error.message === 'Unauthorized'
      ? 401
      : error instanceof VocabularyValidationError
        ? 400
        : error?.code === 'ER_DUP_ENTRY'
          ? 409
          : 500;
    return Response.json({ error: error.message || 'Unable to import vocabulary.' }, { status });
  }
}
