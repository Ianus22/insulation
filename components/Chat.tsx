'use client';

import { APICreateThread, APIDeleteThread, APIKeepaliveThread, APIRunThread } from '@/api/thread';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';

const KEEPALIVE_INTERVAL = 30 * 1000;

function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isPrompting, setIsPrompting] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [response, setResponse] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

  const threadId = useRef<string | null>(null);

  useEffect(() => {
    const keepaliveInterval = setInterval(() => APIKeepaliveThread(threadId.current), KEEPALIVE_INTERVAL);

    return () => {
      clearInterval(keepaliveInterval);
      APIDeleteThread(threadId.current);
    };
  }, []);

  const startPrompt = async () => {
    if (isPrompting || image == null) return;
    setIsPrompting(true);

    const isFirstMessage = threadId.current == null;

    if (isFirstMessage) {
      threadId.current = await APICreateThread(image, prompt);

      if (threadId.current == null) {
        setIsPrompting(false);
        return;
      }
    }

    setMessages(messages => [...messages, prompt]);
    setPrompt('');

    let response = '';

    await APIRunThread(threadId.current!, isFirstMessage ? null : prompt, text => {
      response += text;
      setResponse(res => res + text);
    });

    setMessages(messages => [...messages, response]);
    setResponse('');

    setIsPrompting(false);
  };

  return (
    <div>
      <input type='file' accept='image/png, image/jpeg, image/jpg' onChange={e => setImage(e.target.files![0])} />
      <br />
      <input
        type='text'
        placeholder='Prompt'
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        disabled={isPrompting}
      />
      <br />
      <button onClick={startPrompt} disabled={isPrompting}>
        Prompt
      </button>
      <br />
      {messages.map((message, i) => (
        <div key={i}>
          <b>{i % 2 == 0 ? 'User' : 'Assistant'}: </b>
          <Markdown>{message}</Markdown>
          <br />
        </div>
      ))}
      <pre>{response}</pre>
    </div>
  );
}

export { Chat };

