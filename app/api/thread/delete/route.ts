import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/services/auth';
import { deleteThread } from '@/services/llm/thread';
import { databaseAdmin } from '@/services/firebaseAdmin';

export async function DELETE(req: NextRequest) {
  let data: any = null;
  try {
    data = await req.json();
  } catch {}

  if (data == null || typeof data !== 'object' || typeof data.threadId !== 'string')
    return new NextResponse('Invalid body.', { status: 400 });

  const userId = await getUserIdFromRequest(req);

  if (userId == null) return new Response('Unauthorized', { status: 401 });

  const ref = databaseAdmin.ref(`/Users/${userId}/Chats/${data.threadId}`);

  if ((await (await ref.get()).val()) == null) return new Response('Unauthorized', { status: 401 });

  await deleteThread(data.threadId);

  ref.remove();

  return new NextResponse();
}

