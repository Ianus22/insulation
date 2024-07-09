'use client';

import React from 'react';
import Image from 'next/image';
import MyNavbar from '@/components/myNavbar';
import Footer from '@/components/myFooter';
import { useLocalization } from '@/lang/language';

const HowToUse = () => {
  const loc = useLocalization();

  return (
    <>
      <MyNavbar></MyNavbar>
      <div className='p-4 flex flex-col items-center'>
        <div className='max-w-4xl w-full bg-white p-6'>
          <h1 className='text-3xl font-bold mb-6'>How to use!</h1>
          <p className='mb-6 font-bold'>
            On this page, you&apos;ll find a simple guide on how to use our AI to achieve your goals efficiently. Follow
            the steps below to get started:
          </p>
          <div className='space-y-6'>
            <div className='bg-gray-50 p-4 rounded-lg shadow-inner'>
              <h2 className='text-xl font-semibold mb-2'>Step 1: Upload Image</h2>
              <p>
                To begin, take a clear photo of the building or wall you wish to insulate. Next, easily upload the image
                using our drag-and-drop or upload feature.
              </p>
            </div>
            <div className=''>
              <Image src='/images/howToUseUpload.png' alt='howto' width={825} height={537} />
            </div>
            <div className='bg-gray-50 p-4 rounded-lg shadow-inner'>
              <h2 className='text-xl font-semibold mb-2'>Step 2: AI Analysis</h2>
              <p>
                Now, we begin the process. Our advanced AI model will analyze the image to determine the best insulation
                solution tailored to your specific needs. Rest assured, we&apos;re dedicated to providing you with the
                most effective and efficient results.
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg shadow-inner'>
              <h2 className='text-xl font-semibold mb-2'>Step 3: Receive Solution</h2>
              <p>
                Once our work is complete, you will receive a comprehensive solution from our advanced AI model,
                detailing the optimal insulation options and installation recommendations. We appreciate your trust in
                our services and look forward to delivering exceptional results for improved energy efficiency and
                comfort.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};
export default HowToUse;

