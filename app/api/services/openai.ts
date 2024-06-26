import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
});

export const dynamic = 'force-dynamic';

const TEMPERATURE = 0.3;

const PROMPT_TEMPLATE = (extraPrompt: string) =>
  `
  Extra information: ${extraPrompt}
  
  What is the best way to insolate and fireproof the area shown in the image?
`.trim();

async function promptInsulationAssistant(image: ArrayBuffer, imageMimeType: string, extraPrompt: string) {
  const req = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          "You're a professional in insolation and fireproofing all kinds of surfaces and areas. You will be given an image and information about a place/surface and you will give a detailed description of what the best way to isolate and fireproof it is."
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${imageMimeType};base64,${Buffer.from(image).toString('base64')}`,
              detail: 'high'
            }
          },
          {
            type: 'text',
            text: PROMPT_TEMPLATE(extraPrompt)
          }
        ]
      }
    ],
    temperature: TEMPERATURE,
    stream: true
  });

  const stream = req.toReadableStream() as ReadableStream<Uint8Array>;
  const reader = stream.getReader();

  const decoder = new TextDecoder();

  return new ReadableStream<string>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }

      const data: OpenAI.Chat.ChatCompletionChunk = JSON.parse(decoder.decode(value));

      controller.enqueue(data.choices[0]?.delta?.content ?? '');
    }
  });
}

export { promptInsulationAssistant };

