'use client';

import React from 'react';
import { stripe } from '@/services/stripe';
import MyNavbar from '@/components/myNavbar';
import { auth } from '@/services/firebase';
import { useRouter } from 'next/navigation';
import Footer from '@/components/myFooter';

const Pricing = () => {
  const router = useRouter();

  const buy = async () => {
    if (auth.currentUser == null) {
      router.push('/sign-in');
      return;
    }

    const req = await fetch('/api/subscription/purchase', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await auth.currentUser.getIdToken())
      }
    });

    const result = await req.json();

    await (await stripe)!.redirectToCheckout({
      sessionId: result.id
    });
  };

  const check = async () => {
    const req = await fetch('/api/subscription/status', {
      headers: {
        Authorization: 'Bearer ' + (await auth.currentUser!.getIdToken())
      }
    });

    const subscriptions = await req.json();

    console.log(subscriptions);
  };

  return (
    <>
      <MyNavbar></MyNavbar>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900 sm:text-4xl'>Subscriptions</h2>
          <button onClick={check}>Click</button>
        </div>
        <div className='mt-10 flex flex-col sm:flex-row justify-center items-center sm:space-x-6 space-y-6 sm:space-y-0'>
          <div className='flex flex-col bg-white shadow-lg rounded-lg overflow-hidden w-full sm:w-1/3 p-6 flex-1 py-9 border'>
            <h3 className='text-xl font-semibold text-gray-900'>Free trial*</h3>
            <p className='mt-4 text-4xl font-extrabold text-gray-900'>
              €0 <span className='text-lg font-medium text-gray-500'>/ month</span>
            </p>
            <ul className='mt-6 space-y-4 text-gray-600'>
              <li>3 free tries</li>
              <li>limited result</li>
            </ul>
            <button className=' text-black py-2 px-4 rounded bg-[#c5ece0] mt-20' onClick={buy}>
              Select
            </button>
          </div>
          <div className='flex flex-col bg-white shadow-lg rounded-lg overflow-hidden w-full sm:w-1/3 p-6 flex-1 border'>
            <h3 className='text-xl font-semibold text-gray-900'>Monthly subscription</h3>
            <p className='mt-4 text-4xl font-extrabold text-gray-900'>
              €14.99 <span className='text-lg font-medium text-gray-500'>/ month</span>
            </p>
            <ul className='mt-6 space-y-4 text-gray-600'>
              <li>Unlimited conversations</li>
              <li>Accurate and full answers</li>
              <li>Chat history</li>
              <li>Continuing old chats</li>
            </ul>
            <button className='mt-6 text-black py-2 px-4 rounded bg-[#c5ece0]'>Select</button>
          </div>
          <div className='flex flex-col bg-white shadow-lg rounded-lg overflow-hidden w-full sm:w-1/3 p-6 flex-1 border'>
            <h3 className='text-xl font-semibold text-gray-900'>Annual subscription</h3>
            <p className='mt-4 text-4xl font-extrabold text-gray-900'>
              €99 <span className='text-lg font-medium text-gray-500'>/ year</span>
            </p>
            <ul className='mt-6 space-y-4 text-gray-600'>
              <li>Unlimited conversations</li>
              <li>Accurate and full answers</li>
              <li>Chat history</li>
              <li>Continuing old chats</li>
            </ul>
            <button className='mt-6 text-black py-2 px-4 rounded bg-[#c5ece0]'>Select</button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};
export default Pricing;

