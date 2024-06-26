import { promptInsulationAssistant } from '../services/openai';
import { NextRequest, NextResponse } from 'next/server';

async function POST(req: NextRequest) {
  const formData = await req.formData();

  const image: any = formData.get('image');
  if (!image) return new NextResponse('No files received.', { status: 400 });

  const imageBuffer = Buffer.from(await image.arrayBuffer());

  const extraPrompt = (formData.get('extraPrompt') as string) ?? '';
  const mimeType = (formData.get('mimeType') as string) ?? '';

  const stream = await promptInsulationAssistant(imageBuffer, mimeType, extraPrompt);

  return new NextResponse(stream);
}

export { POST };

