'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Footer from '@/components/myFooter';
import Link from 'next/link';
import { signIn } from '@/services/firebase';
import MyNavbar from '@/components/myNavbar';

import { useLocalization } from '@/lang/language';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loc = useLocalization();
  const router = useRouter();

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await signIn(email, password);
      router.back();
    } catch (error: any) {
      setError(error.message.includes('verified') ? error.message : 'Invalid email or password.');
    }
  };

  return (
    <>
      <MyNavbar></MyNavbar>
      <div className='flex min-h-full flex-1 mt-6 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-100 rounded-lg shadow-lg max-w-lg mx-auto mb-6'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm '>
          <div className='flex items-center justify-center'>
            <Image src='/images/logo1.png' alt='Logo' width={150} height={40} />
          </div>

          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black'>
            {loc('lb_sgi_Title')}
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={onSignIn}>
            <div className='space-y-6'>
              <div>
                <label htmlFor='email' className='block text-sm font-medium leading-6 text-black'>
                  {loc('lb_sgu_sgi_F_Email')}
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
                <div className='flex items-center justify-between'>
                  <label htmlFor='password' className='block text-sm font-medium leading-6 text-black'>
                    {loc('lb_sgu_sgi_F_Password')}
                  </label>
                  <div className='text-sm'>
                    <div
                      onClick={() => router.push('/forgot-password')}
                      className='cursor-pointer font-semibold text-indigo-400 hover:text-indigo-300'
                    >
                      {loc('lb_sgi_Ahref_ForgotPassword')}
                    </div>
                  </div>
                </div>
                <div className='mt-2'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    onChange={e => setPassword(e.target.value)}
                    required
                    className='block w-full rounded-md border-0 bg-white py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-2'
                  />
                </div>
              </div>

              {error && <p className='text-red-500 text-sm text-center mt-2'>{error}</p>}

              <div>
                <button
                  disabled={!email || !password}
                  className='disabled:cursor-default flex w-full justify-center rounded-md bg-[#c5ece5] px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                  type='submit'
                >
                  {loc('btn_sgu_SignInButton')}
                </button>
              </div>
            </div>
          </form>

          <p className='mt-10 text-center text-sm text-gray-400'>
            {loc('lb_sgi_NotAMember')}&nbsp;
            <Link href='/sign-up' className='font-semibold leading-6 text-indigo-400 hover:text-indigo-300'>
              {loc('lb_sgi_Ahref_SignUp')}
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

