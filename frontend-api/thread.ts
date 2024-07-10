import { User } from 'firebase/auth';

async function APICreateThread(user: User, image: File, prompt: string) {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('image', image);

  const req = await fetch('/api/thread/create', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + (await user.getIdToken())
    },
    body: formData
  });

  if (!req.ok) return [null, await req.text()] as const;

  return [
    (await req.json()) as {
      name: string;
      id: string;
    },
    null
  ] as const;
}

async function APIRunThread(user: User, threadId: string, extraPrompt: string | null, onText: (text: string) => void) {
  const req = await fetch('/api/thread/run', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + (await user.getIdToken())
    },
    body: JSON.stringify({
      threadId,
      extraPrompt
    })
  });

  if (!req.ok) return false;

  const reader = req.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    onText(decoder.decode(value));
  }

  return true;
}

async function APIDeleteThread(user: User, threadId: string | null) {
  if (threadId == null) return;

  const req = await fetch('/api/thread/delete', {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + (await user.getIdToken())
    },
    body: JSON.stringify({
      threadId
    })
  });

  return req.ok;
}

interface ThreadData {
  imageId: string;
  texts: string[];
}

async function APIGetThread(user: User, threadId: string | null) {
  const req = await fetch(`/api/thread/get/${threadId}`, {
    headers: {
      Authorization: 'Bearer ' + (await user.getIdToken())
    }
  });

  return (await req.json()) as ThreadData;
}

async function APIListThreads(user: User) {
  const req = await fetch(`/api/thread/list`, {
    headers: {
      Authorization: 'Bearer ' + (await user.getIdToken())
    }
  });

  return (await req.json()) as Record<string, string>;
}

export { APICreateThread, APIRunThread, APIDeleteThread, APIGetThread, APIListThreads };
export type { ThreadData };

