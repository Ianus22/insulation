import { createNextRouteHandler } from '@/lib/nextUtils';
import { NextRequest, NextResponse } from 'next/server';
import { deleteThread } from '@/services/llm/thread';

export async function DELETE(req: NextRequest) {
  let data: any = null;
  try {
    data = await req.json();
  } catch {}

  if (data == null || typeof data !== 'object' || typeof data?.threadId !== 'string')
    return new NextResponse('Invalid body.', { status: 400 });

  await deleteThread(data.threadId);

  return new NextResponse();
}

export default createNextRouteHandler({ DELETE });

