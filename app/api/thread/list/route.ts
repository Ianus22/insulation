import { databaseAdmin } from '@/services/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/services/auth';

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);

  if (userId == null) return new Response('Unauthorized', { status: 401 });

  const ref = await databaseAdmin.ref(`/Users/${userId}/Chats`).get();

  return NextResponse.json((await ref.val()) ?? {});
}

