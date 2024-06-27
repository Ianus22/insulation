import { ValidatorResponse } from '@/services/llm/validator';

async function ValidateImage(image: File, prompt: string): Promise<ValidatorResponse> {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('image', image);

  const req = await fetch('/api/validate', {
    method: 'POST',
    body: formData
  });

  const responseData: ValidatorResponse = await req.json();

  return responseData;
}

export { ValidateImage };
