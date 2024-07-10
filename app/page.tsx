'use client';

import Image from 'next/image';
import MyNavbar from '@/components/myNavbar';
import Footer from '@/components/myFooter';
import Link from 'next/link';

import { useLocalization } from '@/lang/language';

const wall = '/images/stud-wall_.png';
const img1 = '/images/img1_.png';
const sketch = '/images/sketch.png';
const placeholder = '/images/placeholder.png';

export default function Home() {

  const loc = useLocalization();

  return (
    <>
      <MyNavbar></MyNavbar>

      <div className='relative flex md:min-h-screen items-center justify-center p-24 bg-gray-50'>
        <div className='absolute inset-45 z-90'>
          <Image
            src={sketch}
            alt='Brushstroke Background'
            height={800}
            width={800}
            quality={100}
            className='scale-100 md:scale-75 mb-8'
          />
        </div>
        <div className='relative z-10 text-center'> 
          <h1 className='text-3xl md:text-4xl font-varta text-black mt-24'>{loc('moto')}</h1>
          <p className='mt-2 text-lg text-gray-600 mb-24'>{loc('sub_moto')}</p>
          <div className=''>
            <Link href='/tool'>
              <button className='px-6 py-3 font-bold text-black rounded-full bg-[#C5ECE0]  hover:bg-green-200 border border-black'>
                {loc('btn_TryItOut')}
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* --- See it Clearly --- Nikolay */}
      <div className='flex flex-col items-center justify-center py-16 px-4 sm:px-8 max-w-5xl mx-auto'>
        <h1 className='text-2xl font-semibold mb-4 text-gray-800'>{loc('lb_SeeItClearly')}</h1>
        <div className='flex flex-col sm:grid sm:grid-cols-5 gap-4 items-center'>
          <div className='flex flex-col items-center mt-0 md:mt-4'>
            <Image src={wall} alt='wall' width={220} height={200} className='rounded-lg shadow-lg' />
            <p className='text-gray-600 mt-2 text-center'>{loc('lb_ImgInputExample')}</p>
          </div>

          <div className='text-4xl text-center text-gray-500'>+</div>

          <div className='flex flex-col items-center bg-[#C5ECE0] rounded-lg px-8 py-2 shadow-md max-w-sm'>
            <h2 className='text-xs md:text-base text-gray-800 font-medium text-center '>
              {loc('txt_AdditionalPromtExample')}
            </h2>
            <p className='text-sm md:text-base text-gray-600 mt-2 text-center'>{loc('lb_AdditionalPromt')}</p>
          </div>

          <div className='text-4xl text-center text-gray-500'>=</div>

          <div className='flex flex-col items-center bg-[#C5ECE0] rounded-lg px-8 py-2 shadow-md max-w-sm'>
            <h2 className='text-xs md:text-base text-gray-800 font-medium text-center'>
              {loc('txt_Output')}
            </h2>
            <p className='text-gray-600 mt-2 text-center text-sm md:text-base'>{loc('lb_Output')}</p>
          </div>
        </div>
      </div>
      {/* --- See it Clearly --- */}
      {/* --- About us --- Nikolay */}
      <div className='relative w-full h-64 rounded-lg shadow-md overflow-hidden max-w-sm sm:max-w-5xl mx-auto mb-10'>
        <Image src={img1} alt='img1' layout='fill' objectFit='cover' className='rounded-lg shadow-lg' />
        <div className='absolute inset-0 flex items-center justify-center md:justify-end md:p-8'>
          <div className=' w-full md:w-1/2 p-8 md:p-2 rounded-lg shadow-lg bg-white bg-opacity-55 max-w-xs'>
            <h1 className='text-gray-800 text-center text-sm md:text-xl lg:text-2xl font-semibold'>
              {loc('txt_ContentDescription')}
            </h1>
          </div>
        </div>
      </div>
      <Footer></Footer>

      {/* --- About us --- */}
    </>
  );
}
