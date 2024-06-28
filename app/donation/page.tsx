'use client';
import React, { useState } from 'react';
import MyNavbar from '@/components/myNavbar';
import Footer from '@/components/myFooter';

const Donate: React.FC = () => {
  const [amount, setAmount] = useState<number>(25);

  const handleDonateClick = () => {
    window.location.href = 'https://paypal.me/NIKILELE';
  };

  return (
    <>
      <MyNavbar></MyNavbar>
      <div className='flex items-center justify-center min-h-screen w-full max-w-xl mx-auto'>
        <div className='bg-white p-8 rounded-lg shadow-lg w-full'>
          <h1 className='text-2xl font-semibold text-center mb-4'>Donate and Help Us Grow</h1>
          <p className='text-center text-gray-600 mb-8'>Your donation makes a difference</p>
          <div className='mb-4'>
            <label className='block text-gray-700 text-center mb-2'>Select amount</label>
            <input
              type='range'
              min='10'
              max='100'
              step='5'
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className='w-full'
            />
            <div className='flex justify-between mt-2 text-gray-700'>
              <span>10€</span>
              <span>100€</span>
            </div>
          </div>
          <div className='text-center mb-4'>
            <span className='text-lg font-semibold'>{amount}€</span>
          </div>
          <button
            onClick={handleDonateClick}
            className='w-full bg-[#C5ece0] hover:bg-green-200 text-black font-semibold py-2 px-4 rounded'
          >
            Donate
          </button>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Donate;
