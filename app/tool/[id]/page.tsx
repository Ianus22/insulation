/* eslint-disable @next/next/no-img-element */
'use client';
import { APIGetThread, APIRunThread, ThreadData } from '@/frontend-api/thread';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useContext, useEffect, useMemo, useState, useRef } from 'react';
import { ToolDataContext } from '../toolData';
import { useParams } from 'next/navigation';
import { auth } from '@/services/firebase';
import { FaMicrophone } from 'react-icons/fa6';
import { APITranscribeAudio } from '@/frontend-api/whisper';
import Image from 'next/image';
import Spinner from '@/components/ui/Spinner';
import { useAudioRecorder } from '@/services/audio';

export default function ChatThread() {
  const toolData = useContext(ToolDataContext);
  const { id: chatId }: { id: string } = useParams();
  const [chatData, setChatData] = useState<ThreadData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState('');
  const [prompt, setPrompt] = useState('');
  const [chatSpinner, setChatSpinner] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const recorder = useAudioRecorder();

  useEffect(() => {
    setChatSpinner(true);

    auth.authStateReady().then(() => {
      setChatSpinner(false);

      if (toolData.transferredChat?.id === chatId || auth.currentUser == null) return;
      setChatSpinner(true);

      APIGetThread(auth.currentUser, chatId).then(x => {
        setChatData(x);
        setChatSpinner(false);
      });
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatData, response]);

  const handleAudioButton = async () => {
    if (recorder.isRecording) {
      const audioBlob = await recorder.stop();

      const transcribedText = await APITranscribeAudio(audioBlob);
      setPrompt(prev => `${prev} ${transcribedText}`);

      return;
    }

    await recorder.start();
  };

  return (
    <div className={`flex flex-col items-center ${` w-full ${toolData.isSidebarOpen ? 'md:ml-64' : ' p-1 mx-auto'}`}`}>
      <div
        ref={chatContainerRef}
        className='border border-gray-200 overflow-y-scroll h-[45rem] mx-auto p-8 rounded-lg shadow-md ml-auto mb-4'
      >
        {chatSpinner ? (
          <Spinner className='w-full h-full' />
        ) : (
          <>
            <div className='ml-auto  mix-blend-color-burn'>
              <div className='flex flex-col space-y-4 items-end'>
                <div className='relative'>
                  <img
                    src={imageUrl}
                    alt='input image'
                    width={180}
                    height={150}
                    className='rounded-lg shadow-lg border border-black w-24 md:w-52'
                  />
                </div>
              </div>
            </div>

            <div className='ml-8'>
              {chatData?.texts.map((x, i) => (
                <div key={i}>
                  {i % 2 === 0 && (
                    <div className='flex flex-col space-y-4 items-end mb-5 mt-5 '>
                      <div className='bg-[#c5ece0] p-2 md:p-4 rounded-s-xl rounded-se-xl max-w-sm border border-black ml-auto items-end text-right'>
                        <h1>{x}</h1>
                      </div>
                    </div>
                  )}

                  {i % 2 === 1 && (
                    <div className='bg-gray-200 p-2 md:p-4 rounded-ss-xl rounded-e-xl border border-black mb-5 mt-5 md:w-8/12'>
                      <ReactMarkdown>{x}</ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}

              {response.length > 0 && (
                <div className='bg-gray-200 p-2 md:p-4 rounded-ss-xl rounded-e-xl border border-black my-5 max-w-sm'>
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <div className='flex mt-auto space-x-2 w-full items-end max-w-full'>
        <input
          value={prompt}
          type='text'
          placeholder='Type your message here...'
          className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none'
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <FaMicrophone
          className={`flex right-4 transform -translate-y-1/4 cursor-pointer ${
            recorder.isRecording ? 'text-red-500' : 'text-[#C5ECE0]'
          }`}
          size={32}
          onClick={handleAudioButton}
        />
        <button className='py-2 px-4 bg-[#C5ECE0] rounded-lg hover:bg-green-200 text-black' onClick={submit}>
          Send
        </button>
      </div>
    </div>
  );
}

