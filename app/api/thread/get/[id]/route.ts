import { NextRequest, NextResponse } from 'next/server';
import { getThread } from '@/services/llm/thread';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const thread = await getThread(params.id);
  return NextResponse.json(thread);
}

