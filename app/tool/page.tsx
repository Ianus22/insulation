'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Markdown from 'react-markdown';
import Spinner from '@/components/ui/Spinner';
import MyNavbar from '@/components/myNavbar';
import Footer from '@/components/myFooter';
import { APICreateThread, APIRunThread } from '@/frontend-api/thread';
import { transcribeAudio } from '../api/whisperApi/whisper';
import { getAuth } from 'firebase/auth';
import { getUser, createChat, getChats } from '@/services/database';
import { FaMicrophone } from 'react-icons/fa';
import { HiOutlineChatBubbleBottomCenterText } from 'react-icons/hi2';

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
  const [oldChats, setOldChats] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const selectorRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  let isImageValidFlag = false;
  let textStart: string = '';

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
  }, [image]);

  useEffect(() => {
    const fetchChats = async () => {
      const currUser = getAuth().currentUser;
      if (currUser) {
        const chats = await getChats(currUser.uid);
        setOldChats(chats || []);
      }
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
    if (!canClickButton || !image) return;
    setIsGenerating(true);
    setIsImageValid(false);
    setIsValidating(true);

    let threadId: string | null = null;
    const currUser = getAuth().currentUser;
    if (currUser == null) {
      threadId = await APICreateThread(image, prompt);
    } else {
      await getUser(currUser.uid).then(async user => {
        if (user != null) {
          console.log('TODO: Check for max chat capacity');
        }

        threadId = await APICreateThread(image, prompt);
        await createChat(currUser!.uid, threadId!);
      });
    }

    if (threadId == null) {
      setIsGenerating(false);
      return;
    }

    await APIRunThread(threadId, prompt, text => {
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
    });

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

  const handleAudioButton = () => {
    if (isRecording) handleAudioStop();
    else handleAudioStart();
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
      <div className='relative flex flex-col items-center justify-center min-h-screen'>
        <div className='absolute top-4 left-4'>
          <button onClick={() => setIsSidebarOpen(true)} className='text-gray-700 focus:outline-none'>
            <HiOutlineChatBubbleBottomCenterText className='text-5xl text-[#c5ece0]' />
          </button>
        </div>
        <div className='flex w-full'>
          <div
            className={`absolute top-0 left-0 h-full bg-gray-100 p-4 transition-transform transform ${
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
            <ul>
              {oldChats.map((chat, index) => (
                <li key={index} className='mb-2 p-2 bg-white rounded shadow'>
                  {chat.title}
                </li>
              ))}
            </ul>
          </div>
          <div className='flex flex-col items-center w-11/12 max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md ml-auto z-10'>
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
                <button className='mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700' onClick={removeImage}>
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
                style={{ color: '#C5ECE0' }}
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
              style={{ color: isRecording ? '#D2122E' : '#C5ECE0' }}
              // onMouseDown={handleAudioStart}
              // onMouseUp={handleAudioStop}
              onClick={handleAudioButton}
            />
            {isValidating && (
              <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75'>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ImageUploadComponent;
