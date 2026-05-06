import type { NextRequest } from 'next/server';
import { handleLeetcodeRequest } from '@/app/_controllers/leetcodeController';

export async function GET(req: NextRequest) {
  return handleLeetcodeRequest(req);
}
