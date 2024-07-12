'use client';

import { APICreateThread, APIDeleteThread, APIRunThread } from '@/frontend-api/thread';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { APITranscribeAudio } from '@/frontend-api/whisper';
import { languageState } from '@/lang/language';
import { FaMicrophone } from 'react-icons/fa6';
import Spinner from '@/components/ui/Spinner';
import { ToolDataContext } from './toolData';
import { useRouter } from 'next/navigation';
import { auth } from '@/services/firebase';
import Image from 'next/image';

import { useLocalization } from '@/lang/language';
import { useGlobalState } from '@/hooks/globalState';
import { useAudioRecorder } from '@/services/audio';

export default function CreateThread() {
  const loc = useLocalization();

  const language = useGlobalState(languageState);
  const toolData = useContext(ToolDataContext);
  const router = useRouter();

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImageValid, setIsImageValid] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const selectorRef = useRef<HTMLInputElement | null>(null);

  const recorder = useAudioRecorder();

  useEffect(() => {
    if (image == null) {
      setImagePreviewUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(image);

    const onImageLoaded = () => {
      setImagePreviewUrl(reader.result as string);
      setIsValidating(false);
    };

    reader.addEventListener('load', onImageLoaded, { once: true });

    setIsValidating(true);

    if (prompt.trim().length == 0)
      setPrompt(
        language.value === 'en'
          ? 'What is the best way to insulate and fireproof the area shown in the image given above?'
          : 'Wie lässt sich der im Bild oben gezeigte Bereich am besten isolieren und feuerfest machen?'
      );

    return () => reader.removeEventListener('load', onImageLoaded);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

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
    if (!canClickButton || !image || auth.currentUser == null) return;

    setIsImageValid(false);
    setIsValidating(true);

    const [thread, error] = await APICreateThread(auth.currentUser, image, prompt);

    if (thread == null) {
      setIsValidating(false);
      setIsImageValid(false);
      setErrorMessage(error);
      return;
    }

    setErrorMessage('');

    let isDoneValidating = false;
    let isImageValid = true;
    let text = '';

    await APIRunThread(auth.currentUser, thread.id, null, chunk => {
      text += chunk;

      if (!isImageValid) setErrorMessage(text);

      if (!isDoneValidating && text.length >= 12) {
        if (text.startsWith('Bad Request:')) {
          setIsImageValid(false);
          isImageValid = false;
        } else {
          setIsImageValid(true);
          toolData.addChat(thread);
          router.push(`/tool/${thread.id}`);
          // Add data
        }

        isDoneValidating = true;
      }

      if (isDoneValidating && isImageValid)
        toolData.setTransferredChat({
          id: thread.id,
          imagePreviewUrl: imagePreviewUrl!,
          prompt,
          response: text,
          isDone: false
        });
    }).finally(async () => {
      if (!isImageValid) await APIDeleteThread(auth.currentUser!, thread.id);
      else
        toolData.setTransferredChat({
          id: thread.id,
          imagePreviewUrl: imagePreviewUrl!,
          prompt,
          response: text,
          isDone: true
        });

      setIsValidating(false);
    });
  };

  const handleAudioButton = async () => {
    if (recorder.isRecording) {
      const audioBlob = await recorder.stop();

      setIsValidating(true);
      const transcribedText = await APITranscribeAudio(audioBlob);
      setPrompt(prev => `${prev} ${transcribedText}`);
      setIsValidating(false);

      return;
    }

    await recorder.start();
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

  const canClickButton = useMemo(() => image != null && !isValidating, [image, isValidating]);

  return (
    <div className='flex flex-col items-center w-11/12 max-w-2xl mx-auto p-8 rounded-lg shadow-md ml-auto  overflow-y-auto'>
      <input
        type='file'
        accept='image/png, image/jpeg'
        ref={selectorRef}
        onChange={e => !isValidating && setImage(e.target.files![0])}
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
        <p className='text-gray-400 mt-4'>{loc('lb_tlF_ImageUpload')}</p>
        {errorMessage && <div className='mt-4 p-3 bg-red-100 text-red-600 rounded'>{errorMessage}</div>}
        {image && (
          <button className='mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700' onClick={removeImage}>
            {loc('lb_tlF_RemoveImage')}
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
          style={{ color: recorder.isRecording ? '#f01e2c' : '#C5ECE0' }}
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
        {loc('btn_tlF_Submit')}
      </button>
    </div>
  );
}

