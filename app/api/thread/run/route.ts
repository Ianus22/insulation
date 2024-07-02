import { NextRequest, NextResponse } from 'next/server';
import { runThread } from '@/services/llm/thread';

export async function POST(req: NextRequest) {
  let data: any = null;
  try {
    data = await req.json();
  } catch {}

  if (
    data == null ||
    typeof data !== 'object' ||
    typeof data?.threadId !== 'string' ||
    (data?.extraPrompt !== null && typeof data?.extraPrompt !== 'string')
  )
    return new NextResponse('Invalid body.', { status: 400 });

  const stream = await runThread(data.threadId, data.extraPrompt);

  return new NextResponse(stream);
}

