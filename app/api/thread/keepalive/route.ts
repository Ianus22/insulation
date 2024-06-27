import { resetThreadTimeout } from '@/services/llm/thread';
import { NextRequest, NextResponse } from 'next/server';

async function POST(req: NextRequest) {
  let data: any = null;
  try {
    data = await req.json();
  } catch {}

  if (data == null || typeof data !== 'object' || typeof data?.threadId !== 'string')
    return new NextResponse('Invalid body.', { status: 400 });

  resetThreadTimeout(data.threadId);

  return new NextResponse();
}

export { POST };

