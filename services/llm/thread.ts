import { ASSISTANTS, THREAD_TEMPERATURE, THREAD_TIMEOUT, OPENAI } from './openai';

const attachedImages = new Map<string, string>();

const threadTimeouts = new Map<string, NodeJS.Timeout>();

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

function resetThreadTimeout(threadId: string) {
  clearTimeout(threadTimeouts.get(threadId));

  threadTimeouts.set(
    threadId,
    setTimeout(() => deleteThread(threadId), THREAD_TIMEOUT)
  );
}

async function beginThread(image: File, prompt: string) {
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
            text: prompt
          }
        ]
      }
    ]
  });

  attachedImages.set(thread.id, uploadedImage.id);
  resetThreadTimeout(thread.id);

  return thread.id;
}

async function runThread(threadId: string, extraPrompt?: string) {
  resetThreadTimeout(threadId);

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
  clearTimeout(threadTimeouts.get(threadId));
  threadTimeouts.delete(threadId);

  await OPENAI.files.del(attachedImages.get(threadId)!);
  await OPENAI.beta.threads.del(threadId);
}

async function getMessages(threadId: string): Promise<Message[]> {
  const threadMessages = await OPENAI.beta.threads.messages.list(threadId);
  return Object.values(threadMessages);
}

export { resetThreadTimeout, beginThread, runThread, deleteThread, getMessages };
