'use client';

import { APICreateThread, APIDeleteThread, APIRunThread } from '@/api/thread';
import React, { useEffect, useRef, useState } from 'react';
import MyNavbar from '@/components/myNavbar';
import Footer from '@/components/myFooter';
import Markdown from 'react-markdown';
import Image from 'next/image';

const ImageUploadComponent: React.FC = () => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [response, setResponse] = useState<string>('');
  const [prompt, setPrompt] = useState('');

  const selectorRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (image == null) {
      setImagePreviewUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(image!);

    const onImageLoaded = () => setImagePreviewUrl(reader.result as string);

    reader.addEventListener('load', onImageLoaded, { once: true });

    return () => reader.removeEventListener('load', onImageLoaded);
  }, [image]);

  const submit = async () => {
    if (image == null || isGenerating) return;
    setIsGenerating(true);

    const threadId = await APICreateThread(image, prompt);
    if (threadId == null) {
      setIsGenerating(false);
      return;
    }

    await APIRunThread(threadId, null, text => setResponse(res => res + text));

    setIsGenerating(false);
  };

  return (
    <>
      <MyNavbar></MyNavbar>
      <div className='flex flex-col items-center w-full max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md'>
        <input
          type='file'
          accept='image/png, image/jpeg, image/jpg'
          ref={selectorRef}
          onChange={e => setImage(e.target.files![0])}
          className='hidden'
        />
        <div
          className='w-full p-8 mb-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer'
          onClick={() => selectorRef.current!.click()}
        >
          {imagePreviewUrl == null ? (
            <Image src='/images/downloadSign.png' alt='download' height={120} width={120}></Image>
          ) : (
            <img src={imagePreviewUrl} height={120} width={120} />
          )}
          <p className='text-gray-400 mt-4'>Drag and drop or click here to upload image</p>
        </div>
        <textarea
          placeholder='Additional prompt'
          className='w-full p-4 mb-8 border border-gray-300 rounded-lg focus:outline-none'
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button
          className='w-full py-3 mb-8 bg-[#C5ECE0] text-white rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50'
          onClick={submit}
        >
          Submit
        </button>
        <div className='w-full p-6 border border-gray-300 rounded-lg bg-gray-50'>
          <h2 className='text-black text-lg font-semibold mb-4'>Result</h2>
          <div className='w-full p-4 border border-gray-300 rounded-lg bg-white'>
            <Markdown className='text-gray-400'>{response == '' ? 'Returned result' : response}</Markdown>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};
export default ImageUploadComponent;

