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
  const file = formData.get('file') as File;
  if (!file) return new NextResponse('File is required.', { status: 400 });
  try {
    const result = await OPENAI.audio.transcriptions.create({
      file,
      model: 'whisper-1'
    });
    return new NextResponse(result.text);
  } catch (error) {
    console.error('Error processing transcription:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
