import { NextRequest, NextResponse } from 'next/server';
import { OPENAI } from '@/services/llm/openai';

export async function POST(req: NextRequest) {
  let formData: FormData | null = null;
  try {
    formData = await req.formData();
  } catch (error) {
    console.log(error);
  }

  if (formData == null) return new NextResponse('Invalid body.', { status: 400 });

  const result = await OPENAI.audio.transcriptions.create({
    file: formData.get('file') as File,
    model: 'whisper-1',
    language: 'en'
  });

  return new NextResponse(result.text);
}

