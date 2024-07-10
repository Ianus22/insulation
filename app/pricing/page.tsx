'use client';

import {
  APICancelSubscription,
  APIGetSubscriptionStatus,
  APIPurchaseSubscription,
  SubscriptionType
} from '@/frontend-api/stripe';
import React, { useEffect, useState } from 'react';
import MyNavbar from '@/components/myNavbar';
import { auth } from '@/services/firebase';
import { useRouter } from 'next/navigation';
import Footer from '@/components/myFooter';
import Spinner from '@/components/ui/Spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

import { useLocalization } from '@/lang/language';

const formatNumber = (n: number) => (n < 10 ? `0${n}` : n.toString());

const formatDate = (date: Date) =>
  `${formatNumber(date.getDate())}.${formatNumber(date.getMonth())}.${date.getFullYear()}`;

const formatSubscriptionDate = (date: number) => formatDate(new Date(date * 1000));

const Pricing = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loc = useLocalization();
  const router = useRouter();

  const loadSubscription = async () => {
    await auth.authStateReady();

    if (auth.currentUser == null) return;

    const subscription = await APIGetSubscriptionStatus(auth.currentUser);

    setSubscription(subscription);
  };

  useEffect(() => {
    auth
      .authStateReady()
      .then(loadSubscription)
      .finally(() => setLoading(false));
  }, []);

  const buy = async (type: SubscriptionType) => {
    await auth.authStateReady();

    if (auth.currentUser == null) {
      router.push('/sign-in');
      return;
    }

    if (type === SubscriptionType.Free) {
      router.push('/tool');
      return;
    }

    setLoading(true);

    const redirect = await APIPurchaseSubscription(auth.currentUser, type);
    await redirect();
  };

  const cancel = async () => {
    if (auth.currentUser == null) return;

    setLoading(true);

    await APICancelSubscription(auth.currentUser);

    await loadSubscription();

    setLoading(false);
  };

  return (
    <div className='flex flex-col justify-between h-screen'>
      <MyNavbar></MyNavbar>
      <div className='max-w-7x w-screen l mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center flex-col'>
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900 sm:text-4xl'>{loc('lb_Subscriptions')}</h2>
        </div>
        {loading ? (
          <Spinner className='mt-16' />
        ) : subscription != null ? (
          <div className='mt-16 sm:flex-row flex-col rounded-sm border-solid border-gray-300 border flex justify-between items-center py-6 sm:py-4 px-6 gap-8'>
            <p className='text-lg'>
              Activated on: <span className='font-bold text-lg'>{formatSubscriptionDate(subscription.start)}</span>
            </p>
            <p className='text-lg'>
              Renews on: <span className='font-bold text-lg'>{formatSubscriptionDate(subscription.end)}</span>
            </p>
            <p className='text-lg'>
              Bills: <span className='font-bold text-lg'>{subscription.isMonthly ? 'Monthly' : 'Yearly'}</span>
            </p>
            <AlertDialog>
              <AlertDialogTrigger className='bg-red-500 text-xl py-2 px-4 square-lg rounded-lg'>
                {loc('dlbx_CancelSubscrioptionOption')}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{loc('dlbxTitle_LogoutConfirmation')}</AlertDialogTitle>
                  <AlertDialogDescription>{loc('dlbx_SubscriptionConformation')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{loc('dlbx_ConfirmSubscitptionOption')}</AlertDialogCancel>
                  <AlertDialogAction onClick={cancel} className='bg-red-500 text-black'>
                    {loc('dlbx_CancelSubscrioptionOption')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <div className='mt-10 flex flex-row flex-wrap gap-6 justify-center items-stretch'>
            <div className='min-w-[300px] gap-6 flex flex-col justify-between bg-white shadow-lg rounded-lg overflow-hidden w-full sm:w-1/3 p-6 flex-1 border'>
              <div>
                <h3 className='text-xl font-semibold text-gray-900'>{loc('lb_sb1_Title')}</h3>
                <p className='mt-4 text-4xl font-extrabold text-gray-900'>
                  {loc('lb_sb1_Price')} <span className='text-lg font-medium text-gray-500'>{loc('lb_sb1_Duration')}</span>
                </p>
                <ul className='mt-6 space-y-4 text-gray-600'>
                  <li>{loc('lb_sb1_FirstChar')}</li>
                  <li>{loc('lb_sb1_SecondChar')}</li>
                </ul>
              </div>
              <button className=' text-black py-2 px-4 rounded bg-[#c5ece0]' onClick={() => buy(SubscriptionType.Free)}>
                {loc('lb_sb_SelectButton')}
              </button>
            </div>
            <div className='min-w-[300px] flex flex-col gap-6 justify-between bg-white shadow-lg rounded-lg overflow-hidden w-full sm:w-1/3 p-6 flex-1 border'>
              <div>
                <h3 className='text-xl font-semibold text-gray-900'>{loc('lb_sb2_Title')}</h3>
                <p className='mt-4 text-4xl font-extrabold text-gray-900'>
                  {loc('lb_sb2_Price')} <span className='text-lg font-medium text-gray-500'>{loc('lb_sb2_Duration')}</span>
                </p>
                <ul className='mt-6 space-y-4 text-gray-600'>
                  <li>{loc('lb_sb2_sb3_FirstChar')}</li>
                  <li>{loc('lb_sb2_sb3_SecondChar')}</li>
                  <li>{loc('lb_sb2_sb3_ThirdChar')}</li>
                  <li>{loc('lb_sb2_sb3_FourthChar')}</li>
                </ul>
              </div>
              <button
                className=' text-black py-2 px-4 rounded bg-[#c5ece0]'
                onClick={() => buy(SubscriptionType.Monthly)}
              >
                {loc('lb_sb_SelectButton')}
              </button>
            </div>
            <div className='min-w-[300px] gap-6 pb-6 flex flex-col justify-between bg-white shadow-lg rounded-lg overflow-hidden w-full sm:w-1/3 p-6 flex-1 border'>
              <div>
                <h3 className='text-xl font-semibold text-gray-900'>{loc('lb_sb3_Title')}</h3>
                <p className='mt-4 text-4xl font-extrabold text-gray-900'>
                  {loc('lb_sb3_Price')} <span className='text-lg font-medium text-gray-500'>{loc('lb_sb3_Duration')}</span>
                </p>
                <ul className='mt-6 space-y-4 text-gray-600'>
                  <li>{loc('lb_sb2_sb3_FirstChar')}</li>
                  <li>{loc('lb_sb2_sb3_SecondChar')}</li>
                  <li>{loc('lb_sb2_sb3_ThirdChar')}</li>
                  <li>{loc('lb_sb2_sb3_FourthChar')}</li>
                </ul>
              </div>
              <button
                className=' text-black py-2 px-4 rounded bg-[#c5ece0]'
                onClick={() => buy(SubscriptionType.Yearly)}
              >
                {loc('lb_sb_SelectButton')}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Pricing;

