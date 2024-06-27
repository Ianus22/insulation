import { NextRequest, NextResponse } from 'next/server';
import { beginThread } from '@/services/llm/thread';

async function POST(req: NextRequest) {
  let formData: FormData | null = null;
  try {
    formData = await req.formData();
  } catch {}

  if (formData == null) return new NextResponse('Invalid body.', { status: 400 });

  const image = formData.get('image') as File | undefined;
  if (image == null) return new NextResponse('No files received.', { status: 400 });

  const prompt = (formData.get('prompt') as string | undefined) ?? '';

  const threadId = await beginThread(image, prompt);

  return new NextResponse(threadId);
}

export { POST };

