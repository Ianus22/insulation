'use client';

import { useEffect, useState } from 'react';

async function promptAssistantRequest(file: File, extraPrompt: string, onText: (text: string) => void) {
  const formData = new FormData();
  formData.append('extraPrompt', extraPrompt);
  formData.append('mimeType', file.type);
  formData.append('image', file);

  const req = await fetch('/api/prompt', {
    method: 'POST',
    body: formData
  });

  const reader = req.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value: chunk } = await reader.read();
    if (done) return;

    onText(decoder.decode(chunk));
  }
}

export default function Home() {
  const [extraPrompt, setExtraPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const promptAssistant = () => promptAssistantRequest(file!, extraPrompt, text => setResponse(res => res + text));

  return (
    <>
      {file?.name}
      <input type='file' accept='image/png, image/jpeg' onChange={e => setFile(e.target.files!.item(0))} />
      <input type='text' onChange={e => setExtraPrompt(e.target.value)} />
      <button onClick={promptAssistant}>Prompt</button>
      {response}
    </>
  );
}

