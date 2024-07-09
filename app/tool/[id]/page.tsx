'use client';

import { APIGetThread, APIRunThread, ThreadData } from '@/frontend-api/thread';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ToolDataContext } from '../toolData';
import { useParams } from 'next/navigation';
import { auth } from '@/services/firebase';
import Image from 'next/image';

export default function ChatThread() {
  const toolData = useContext(ToolDataContext);

  const { id: chatId }: { id: string } = useParams();

  const [chatData, setChatData] = useState<ThreadData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState('');
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    auth.authStateReady().then(() => {
      if (toolData.transferredChat?.id === chatId || auth.currentUser == null) return;

      APIGetThread(auth.currentUser, chatId).then(setChatData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    const chat = toolData.transferredChat;
    if (chat == null || chat.id !== chatId) return;

    setIsGenerating(!chat.isDone);
    setResponse(chat.response);

    setChatData({
      imageId: '',
      texts: [chat.prompt]
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolData.transferredChat]);

  const imageUrl = useMemo(
    () =>
      toolData.transferredChat?.id === chatId
        ? toolData.transferredChat.imagePreviewUrl
        : `/api/thread/image/${chatData?.imageId}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toolData.transferredChat, chatData]
  );

  const submit = async () => {
    if (isGenerating || auth.currentUser == null) return;

    setIsGenerating(true);
    setPrompt('');

    setChatData(data => ({
      imageId: data?.imageId ?? '',
      texts: [...(data?.texts ?? []), prompt]
    }));

    await APIRunThread(auth.currentUser, chatId, prompt, text => setResponse(res => res + text));

    setIsGenerating(false);
  };

  useEffect(() => {
    if (isGenerating) return;

    setResponse('');

    setChatData(data => ({
      imageId: data?.imageId ?? '',
      texts: [...(data?.texts ?? []), response]
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerating]);

  return (
    <div
      className={`flex flex-col items-center ${`w-10/12 border border-gray-200 overflow-y-scroll h-[35rem] ${
        toolData.isSidebarOpen ? 'md:ml-64' : ''
      }`} mx-auto p-8 rounded-lg shadow-md ml-auto  overflow-y-auto`}
    >
      <div className='ml-auto md:ml-auto'>
        <div className='flex flex-col space-y-4 items-end'>
          <div className='relative'>
            <Image
              src={imageUrl}
              alt='placeholder'
              width={180}
              height={150}
              className='rounded-lg shadow-lg border border-black w-24 md:w-52'
            ></Image>
          </div>
        </div>
      </div>
      <div className='ml-auto md:ml-auto'>
        {chatData?.texts.map((x, i) => (
          <div key={i}>
            {i % 2 == 0 && (
              <div className='flex flex-col space-y-4 items-end mb-5 mt-5'>
                <div className='bg-[#c5ece0] p-2 md:p-4 rounded-s-xl rounded-se-xl w-8/12 border border-black'>
                  <h1>{x}</h1>
                </div>
              </div>
            )}

            {i % 2 == 1 && (
              <div className='bg-gray-200 p-2 md:p-4 rounded-ss-xl rounded-e-xl border border-black mb-5 mt-5 w-8/12'>
                <ReactMarkdown>{x}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {response.length > 0 && (
          <div className='bg-gray-200 p-2 md:p-4 rounded-ss-xl rounded-e-xl border border-black mb-5 mt-5 w-8/12'>
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className='flex mt-auto space-x-2 w-full items-end'>
        <input
          value={prompt}
          type='text'
          placeholder='Type your message here...'
          className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none'
          onChange={e => setPrompt(e.target.value)}
        />
        <button className='py-2 px-4 bg-[#c5ece0] rounded-lg hover:bg-green-200 text-black' onClick={submit}>
          Send
        </button>
      </div>
    </div>
  );
}
