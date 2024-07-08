'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Markdown from 'react-markdown';
import Spinner from '@/components/ui/Spinner';
import MyNavbar from '@/components/myNavbar';
import Footer from '@/components/myFooter';
import { APICreateThread, APIGetThread, APIRunThread } from '@/frontend-api/thread';
import { transcribeAudio } from '../api/whisperApi/whisper';
import { getAuth } from 'firebase/auth';
import { getUser, createChat, getChats, getChat } from '@/services/database';
import { FaMicrophone } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { auth, database } from '@/services/firebase';
import { HiOutlineChatBubbleBottomCenterText } from 'react-icons/hi2';
import { error } from 'console';
import { getThread } from '@/services/llm/thread';

interface ChatData {
  imageId: string;
  texts: string[];
}

const ImageUploadComponent: React.FC = () => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isImageValid, setIsImageValid] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [response, setResponse] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [oldChats, setOldChats] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [showOldChat, setShowOldChat] = useState(false);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const selectorRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const placeholder = '/images/placeholder.png';

  const router = useRouter();

  const threadId = useRef<string | null>(null);

  let isImageValidFlag = false;
  let textStart: string = '';

  useEffect(() => {
    if (auth.currentUser != null) return;
    router.push('/sign-up');
  }, []);

  useEffect(() => {
    if (image == null) {
      setImagePreviewUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(image);
    const onImageLoaded = () => setImagePreviewUrl(reader.result as string);
    reader.addEventListener('load', onImageLoaded, { once: true });
    setIsValidating(true);
    const timer = setTimeout(() => {
      setIsValidating(false);
      setIsImageValid(true);
      if (prompt == null || prompt.length == 0)
        setPrompt('What is the best way to insulate and fireproof the area shown in the image given above?');
    }, 500);

    return () => reader.removeEventListener('load', onImageLoaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  useEffect(() => {
    const fetchChats = async () => {
      console.log('fetching chats');
      const currUser = getAuth().currentUser;
      if (currUser != null) {
        const chats = await getChats(currUser.uid);
        setOldChats(chats || {});
      } else console.log('User is null');
    };
    fetchChats();
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreviewUrl(null);
    setIsImageValid(false);
    setIsValidating(false);
    setErrorMessage('');
  };

  const submit = async () => {
    const isFirstMessage = threadId.current == null;

    console.log('submiting');

    if (threadId.current == null) {
      console.log('thread is null');
      if (!canClickButton || !image) return;

      setIsGenerating(true);
      setIsImageValid(false);
      setIsValidating(true);

      threadId.current = await APICreateThread(image, prompt);
      if (getAuth().currentUser != null)
        createChat(
          getAuth().currentUser!.uid,
          threadId.current!,
          await getCreationTime(getAuth().currentUser!.uid, threadId.current!)
        );
    } else {
      console.log('thread is not null');
      chatData?.texts.push(prompt);

      setIsGenerating(true);
      setIsImageValid(false);
      setIsValidating(true);
    }

    if (threadId == null || threadId.current == null) {
      console.log('Thread is somehow null');
      setIsGenerating(false);
      return;
    }

    console.log('submiting prompt');
    await APIRunThread(threadId.current, isFirstMessage ? null : prompt, text => {
      onTextCollected(text);
    }).then(x => {
      if (!x) return;

      setResponse(res => {
        // chatData?.texts.push(res);
        return '';
      });
    });

    console.log('result over');
    setIsGenerating(false);
  };

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
          setIsValidating(true);
          const transcribedText = await transcribeAudio(audioBlob);
          setPrompt(prev => `${prev} ${transcribedText}`);
          setIsValidating(false);
        } catch (error) {
          if (error instanceof Error) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage('An unknown error occurred');
          }
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

  function onTextCollected(text: string) {
    if (textStart.length < 12) {
      textStart += text;
      if (textStart.length >= 12) {
        if (textStart.startsWith('Bad Request:')) {
          setIsImageValid(false);
          setIsValidating(false);
          isImageValidFlag = false;
        } else {
          setIsImageValid(true);
          setIsValidating(false);
          isImageValidFlag = true;
          setResponse(res => res + textStart);
        }
      }
    } else {
      if (isImageValidFlag) setResponse(res => res + text);
      else setErrorMessage(error => error + text);
    }
  }

  const handleAudioButton = () => {
    if (isRecording) handleAudioStop();
    else handleAudioStart();
  };

  const loadChat = async (chatId: string) => {
    setChatData(await APIGetThread(chatId));
  };

  const imageBorderColor = useMemo(() => {
    return dragOver
      ? 'border-blue-500'
      : imagePreviewUrl == null || isValidating
      ? 'border-gray-300'
      : isImageValid
      ? 'border-green-300'
      : 'border-red-300';
  }, [imagePreviewUrl, isImageValid, isValidating, dragOver]);

  const canClickButton = useMemo(
    () => image != null && !isGenerating && isImageValid,
    [image, isGenerating, isImageValid]
  );

  return (
    <>
      <MyNavbar />
      <div className='relative flex flex-col items-center justify-center h-1/2'>
        <div className='absolute top-4 left-4'>
          <button onClick={() => setIsSidebarOpen(true)} className='text-gray-700 focus:outline-none'>
            <HiOutlineChatBubbleBottomCenterText className='text-5xl text-[#c5ece0]' />
          </button>
        </div>
        <div className='flex w-full my-20'>
          <div
            className={`absolute top-0 left-0 h-full bg-gray-100 p-4 transition-transform transform border border-[#c5ece0] rounded-lg ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } z-20`}
            style={{ width: '250px' }}
          >
            <button
              className='absolute top-2 right-4 hover:bg-green-200 bg-[#c5ece0] text-black p-2 border-2 border-gray-400 rounded-lg'
              onClick={() => setIsSidebarOpen(false)}
            >
              Close
            </button>
            <h2 className='text-xl font-semibold mb-4'>Previous Chats</h2>

            <button
              className='w-full mt-4 py-2 px-4 hover:bg-green-200 bg-[#c5ece0] text-black p-2 border-2 border-gray-400 rounded-lg'
              onClick={() => {
                threadId.current = null;
                setSelectedChat(null);
                setShowOldChat(false);
              }}
            >
              New Chat
            </button>

            <ul>
              {Object.keys(oldChats).map((chatId, i) => (
                <button
                  key={i}
                  className='w-full mt-4 py-2 px-4 hover:bg-green-200 bg-gray-200 text-black p-2 border-2 border-gray-400 rounded-lg'
                  onClick={() => {
                    setSelectedChat(chatId);
                    threadId.current = chatId;
                    setChatData(null);
                    loadChat(chatId);
                    setShowOldChat(true);
                  }}
                >
                  {oldChats[chatId]}
                </button>
              ))}
            </ul>
          </div>
          <div
            className={`flex flex-col items-center ${
              showOldChat
                ? `w-10/12 border border-gray-200 overflow-y-scroll h-[35rem] ${isSidebarOpen ? 'md:ml-64' : ''}`
                : 'w-11/12 max-w-2xl'
            } mx-auto p-8 rounded-lg shadow-md ml-auto  overflow-y-auto`}
          >
            {showOldChat ? (
              <>
                {/*Base Image*/}
                <div className='ml-auto md:ml-auto'>
                  <div className='flex flex-col space-y-4 items-end'>
                    <div className='relative'>
                      <img
                        src={`/api/thread/image/${chatData?.imageId}`}
                        alt='placeholder'
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
                      {/*User's messages*/}
                      {i % 2 == 0 && (
                        <div className='flex flex-col space-y-4 items-end mb-5 mt-5'>
                          <div className='bg-[#c5ece0] p-2 md:p-4 rounded-s-xl rounded-se-xl w-8/12 border border-black'>
                            <h1>{x}</h1>
                          </div>
                        </div>
                      )}

                      {/*AI's responses*/}
                      {i % 2 == 1 && (
                        <div className='bg-gray-200 p-2 md:p-4 rounded-ss-xl rounded-e-xl border border-black mb-5 mt-5 w-8/12'>
                          <h1>{x}</h1>
                        </div>
                      )}
                    </div>
                  ))}

                  {/*Current responce*/}
                  {response.length > 0 && (
                    <div className='bg-gray-200 p-2 md:p-4 rounded-ss-xl rounded-e-xl border border-black mb-5 mt-5 w-8/12'>
                      <h1>{response}</h1>
                    </div>
                  )}
                </div>

                {/*Text input and submit button*/}
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
              </>
            ) : (
              <>
                <input
                  type='file'
                  accept='image/png, image/jpeg'
                  ref={selectorRef}
                  onChange={e => setImage(e.target.files![0])}
                  className='hidden'
                />
                <div
                  className={`w-full p-8 mb-8 border-2 border-dashed ${imageBorderColor} rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer`}
                  onClick={() => selectorRef.current!.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreviewUrl == null ? (
                    <Image src='/images/downloadSign.png' alt='download' height={120} width={120} />
                  ) : (
                    <Image src={imagePreviewUrl} alt='Uploaded Image' height={120} width={120} />
                  )}
                  <p className='text-gray-400 mt-4'>Drag and drop or click here to upload image</p>
                  {errorMessage && <div className='mt-4 p-3 bg-red-100 text-red-600 rounded'>{errorMessage}</div>}
                  {image && (
                    <button
                      className='mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700'
                      onClick={removeImage}
                    >
                      Remove Image
                    </button>
                  )}
                </div>
                <div className='w-full relative mb-8'>
                  <textarea
                    placeholder='Additional prompt'
                    className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none pr-10'
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                  />
                  <FaMicrophone
                    className='absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer'
                    size={32}
                    onClick={handleAudioButton}
                    style={{ color: isRecording ? '#f01e2c' : '#C5ECE0' }}
                  />
                  {isValidating && (
                    <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75'>
                      <Spinner />
                    </div>
                  )}
                </div>
                <button
                  className={`w-full py-3 mb-8 bg-[#C5ECE0] text-black rounded-lg${
                    canClickButton ? ' hover:bg-green-200 cursor-pointer' : ' hover:bg-[#C5ECE0] cursor-default'
                  }`}
                  onClick={submit}
                >
                  Submit
                </button>
                <div className='w-full p-6 border border-gray-300 rounded-lg bg-gray-50'>
                  <h2 className='text-black text-lg font-semibold mb-4'>Result</h2>
                  <div className='w-full p-4 border border-gray-300 rounded-lg bg-white'>
                    <Markdown className='text-gray-400'>{response === '' ? 'Returned result' : response}</Markdown>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ImageUploadComponent;

async function getCreationTime(uId: string, threadId: string) {
  const timestamp = Date.now();
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
  const day = date.getDate().toString().padStart(2, '0');

  let formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate); // Example: 2024-07-08

  const chatNames = Object.values((await getChats(uId)) ?? {});

  while (chatNames.includes(formattedDate)) {
    if (formattedDate.indexOf('(') == -1) {
      formattedDate = formattedDate + ' (1)';
    } else {
      formattedDate = formattedDate.replace(/\((\d+)\)/, (_, n) => `(${parseInt(n) + 1})`);
    }
  }

  return formattedDate;
}
