import type { NextRequest } from 'next/server';
import { handleCompareRequest } from '@/app/_controllers/leetcodeController';

export async function GET(req: NextRequest) {
  return handleCompareRequest(req);
}
