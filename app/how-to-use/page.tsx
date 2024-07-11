'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import MyNavbar from '@/components/myNavbar';
import Footer from '@/components/myFooter';

import { languageState, useLocalization } from '@/lang/language';

const HowToUse = () => {
  const loc = useLocalization();

  return (
    <>
      <MyNavbar></MyNavbar>
      <div className='p-4 flex flex-col items-center'>
        <div className='max-w-4xl w-full bg-white p-6'>
          <h1 className='text-3xl font-bold mb-6'>{loc('lb_htu_Title')}</h1>
          <p className='mb-6 font-bold'>{loc('lb_htu_Description')}</p>
          <div className='space-y-6'>
            <div className='bg-gray-50 p-4 rounded-lg shadow-inner'>
              <h2 className='text-xl font-semibold mb-2'>{loc('lb_htu_step1_Title')}</h2>
              <p>{loc('lb_htu_step1_Description')}</p>
            </div>
            <div className=''>
              <Image src='/images/howToUseUpload.png' alt='howto' width={825} height={537} />
            </div>
            <div className='bg-gray-50 p-4 rounded-lg shadow-inner'>
              <h2 className='text-xl font-semibold mb-2'>{loc('lb_htu_step2_Title')}</h2>
              <p>{loc('lb_htu_step2_Description')}</p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg shadow-inner'>
              <h2 className='text-xl font-semibold mb-2'>{loc('lb_htu_step3_Title')}</h2>
              <p>{loc('lb_htu_step3_Description')}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};
export default HowToUse;

