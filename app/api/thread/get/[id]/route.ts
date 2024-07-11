import { databaseAdmin } from '@/services/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/services/auth';
import { getThread } from '@/services/llm/thread';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserIdFromRequest(req);

  if (userId == null) return new Response('Unauthorized', { status: 401 });

  const ref = databaseAdmin.ref(`/Users/${userId}/Chats/${params.id}`);

  if ((await (await ref.get()).val()) == null) return new Response('Unauthorized', { status: 401 });

  const thread = await getThread(params.id);

  return NextResponse.json(thread);
}
