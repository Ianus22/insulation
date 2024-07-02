async function APICreateThread(image: File, prompt: string) {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('image', image);

  const req = await fetch('/api/thread/create', {
    method: 'POST',
    body: formData
  });

  if (!req.ok) return null;

  return await req.text();
}

async function APIRunThread(threadId: string, extraPrompt: string | null, onText: (text: string) => void) {
  const req = await fetch('/api/thread/run', {
    method: 'POST',
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

async function APIDeleteThread(threadId: string | null) {
  if (threadId == null) return;

  const req = await fetch('/api/thread/delete', {
    method: 'DELETE',
    body: JSON.stringify({
      threadId
    })
  });

  return req.ok;
}

async function APIKeepaliveThread(threadId: string | null) {
  if (threadId === null) return;

  const req = await fetch('/api/thread/keepalive', {
    method: 'POST',
    body: JSON.stringify({
      threadId
    })
  });

  return req.ok;
}

export { APICreateThread, APIRunThread, APIDeleteThread, APIKeepaliveThread };
