'use client';
import { useState } from 'react';
import Image from 'next/image';
import Footer from '@/components/myFooter';
import { auth } from '@/services/llm/firebase';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const router = useRouter();

  const onEmailReset = () => {
    var emailAddress = email;
    console.log('Clicked');

    sendPasswordResetEmail(auth, emailAddress)
      .then(() => {
        router.push('/password-reset-request-sent');
      })
      .catch(function (error) {
        // An error happened.
      });
  };

  return (
    <>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 mt-6 mx-auto py-12 lg:px-8 max-w-lg bg-gray-100 shadow-lg ,'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <div className='flex items-center justify-center'>
            <Image src='/images/logo1.png' alt='Logo' width={150} height={40} />
          </div>
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black'>Forgot Password</h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <div className='space-y-6'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium leading-6 text-black'>
                Email address
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  onChange={e => setEmail(e.target.value)}
                  required
                  className='block w-full rounded-md border-0 bg-white py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-2'
                />
              </div>
            </div>

            <div>
              <button
                disabled={!email}
                className=' flex w-full justify-center rounded-md bg-[#c5ece0] px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                onClick={onEmailReset}
              >
                Send Forgot Password Email
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
