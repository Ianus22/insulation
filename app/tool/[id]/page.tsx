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

export default function ChatThread() {
  const toolData = useContext(ToolDataContext);
  const { id: chatId }: { id: string } = useParams();
  const [chatData, setChatData] = useState<ThreadData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState('');
  const [prompt, setPrompt] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [chatSpinner, setChatSpinner] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatSpinner(true);
    auth.authStateReady().then(() => {
      if (toolData.transferredChat?.id === chatId || auth.currentUser == null) return;

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

  const handleAudioStart = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Audio recording is not supported in your browser.');
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];
        try {
          const transcribedText = await APITranscribeAudio(audioBlob);
          setPrompt(prev => `${prev} ${transcribedText}`);
        } catch (error) {
          console.error('Transcription error:', error);
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
    });
  };

  const handleAudioStop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center ${`w-10/12  ${
        toolData.isSidebarOpen ? 'md:ml-64' : 'w-full p-6 mx-auto'
      }`}`}
    >
      <div
        ref={chatContainerRef}
        className='border border-gray-200 overflow-y-scroll h-[45rem] mx-auto p-8 rounded-lg shadow-md ml-auto mb-4'
      >
        {chatSpinner ? (
          <Spinner className='w-full h-full' />
        ) : (
          <>
            <div className='ml-auto md:ml-auto mix-blend-color-burn'>
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

            <div className='ml-auto md:ml-auto'>
              {chatData?.texts.map((x, i) => (
                <div key={i}>
                  {i % 2 === 0 && (
                    <div className='flex flex-col space-y-4 items-end mb-5 mt-5'>
                      <div className='bg-[#c5ece0] p-2 md:p-4 rounded-s-xl rounded-se-xl w-8/12 border border-black'>
                        <h1>{x}</h1>
                      </div>
                    </div>
                  )}

                  {i % 2 === 1 && (
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
          </>
        )}
      </div>
      <div className='flex mt-auto space-x-2 w-full items-end'>
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
            isRecording ? 'text-red-500' : 'text-[#C5ECE0]'
          }`}
          size={32}
          onClick={isRecording ? handleAudioStop : handleAudioStart}
        />
        <button className='py-2 px-4 bg-[#C5ECE0] rounded-lg hover:bg-green-200 text-black' onClick={submit}>
          Send
        </button>
      </div>
    </div>
  );
}
