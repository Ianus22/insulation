import { ValidatorResponse, runValidation } from '@/services/llm/validator';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse<ValidatorResponse>> {
  let formData: FormData | null = null;
  try {
    formData = await req.formData();
  } catch {}

  if (formData == null)
    return NextResponse.json({
      is_valid: false,
      reason: 'no data provided',
      reworked_prompt: ''
    });

  const image = formData.get('image') as File | undefined;
  if (image == null)
    return NextResponse.json({
      is_valid: false,
      reason: 'no image provided',
      reworked_prompt: ''
    });

  const prompt = (formData.get('prompt') as string | undefined) ?? '';

  const response = await runValidation(image, prompt);

  return NextResponse.json(response);
}

