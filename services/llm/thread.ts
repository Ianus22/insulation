import { ASSISTANTS, THREAD_TEMPERATURE, THREAD_TIMEOUT, OPENAI } from './openai';

interface Message {
  id: string;
  object: string;
  created_at: number;
  assistant_id: string | null;
  thread_id: string;
  run_id: null;
  role: 'user' | 'assistant';
  content: any[];
  attachments: any[];
  metadata: any;
}

async function beginThread(image: File, prompt: string) {
  const uploadedImage = await OPENAI.files.create({
    file: image,
    purpose: 'vision'
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
            text: prompt
          }
        ]
      }
    ]
  });

  return thread.id;
}

async function runThread(threadId: string, extraPrompt?: string) {
  const run = OPENAI.beta.threads.runs.stream(threadId, {
    assistant_id: ASSISTANTS.Insulation,
    temperature: THREAD_TEMPERATURE,
    additional_messages:
      extraPrompt == null
        ? []
        : [
            {
              role: 'user',
              content: extraPrompt
            }
          ]
  });

  let controller: ReadableStreamDefaultController<string>;

  const stream = new ReadableStream({
    pull: _controller => void (controller = _controller)
  });

  run.on('messageDelta', delta =>
    controller.enqueue((delta.content ?? []).map(part => (part.type !== 'text' ? '' : part.text?.value ?? '')).join(''))
  );

  run.on('messageDone', () => controller.close());

  return stream;
}

async function deleteThread(threadId: string) {
  const { imageId } = await getThread(threadId);

  await OPENAI.files.del(imageId);
  await OPENAI.beta.threads.del(threadId);
}

async function getThread(threadId: string) {
  const thread = await OPENAI.beta.threads.messages.list(threadId);

  const messages = [...thread.data].reverse();

  const firstMessage = messages[0].content;
  if (firstMessage[0].type !== 'image_file') throw new Error('Invalid thread!');

  const imageId = firstMessage[0].image_file.file_id;

  const texts = [
    firstMessage[1].type === 'text' ? firstMessage[1].text.value : '',
    ...messages
      .slice(1)
      .filter(message => message.content.length > 0)
      .map(({ content: [message] }) => (message.type === 'text' ? message.text.value : ''))
  ];

  return { imageId, texts };
}

async function getImage(imageId: string) {
  const res = await OPENAI.files.content(imageId);
  return [await res.arrayBuffer(), res.headers] as const;
}

export { beginThread, runThread, deleteThread, getThread, getImage };

