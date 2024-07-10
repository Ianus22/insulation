import { NextRequest, NextResponse } from 'next/server';
import { getImage } from '@/services/llm/thread';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const [body, headers] = await getImage(params.id);

  return new NextResponse(body, { headers });
}

