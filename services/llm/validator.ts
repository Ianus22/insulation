import { ASSISTANTS, THREAD_TEMPERATURE, OPENAI, VALIDATOR_TEMPLATE } from './openai';

interface ValidatorResponse {
  is_valid: boolean;
  reason: string;
  reworked_prompt: string;
}

async function runValidation(image: File, extraPrompt: string): Promise<ValidatorResponse> {
  const uploadedImage = await OPENAI.files.create({
    file: image,
    purpose: 'assistants'
  });

  const thread = await OPENAI.beta.threads.create({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_file',
            image_file: {
              file_id: uploadedImage.id,
              detail: 'high'
            }
          },
          {
            type: 'text',
            text: VALIDATOR_TEMPLATE(extraPrompt)
          }
        ]
      }
    ]
  });

  const run = OPENAI.beta.threads.runs.stream(thread.id, {
    assistant_id: ASSISTANTS.Validator,
    temperature: THREAD_TEMPERATURE
  });

  let response = '';

  run.on('messageDelta', delta => {
    response += (delta.content ?? []).map(part => (part.type !== 'text' ? '' : part.text?.value ?? '')).join('');
  });

  await new Promise(resolve => run.once('messageDone', resolve));

  let aiData: Partial<ValidatorResponse> = JSON.parse(response);

  let data: ValidatorResponse;

  if (aiData.is_valid == null)
    data = {
      is_valid: false,
      reason: 'Validator responded with wrong format',
      reworked_prompt: ''
    };
  else
    data = {
      is_valid: aiData.is_valid,
      reason: aiData.reason ?? '',
      reworked_prompt: aiData.reworked_prompt ?? ''
    };

  await OPENAI.files.del(uploadedImage.id);
  await OPENAI.beta.threads.del(thread.id);

  return data;
}

export type { ValidatorResponse };
export { runValidation };

