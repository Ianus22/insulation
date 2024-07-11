import React from 'react';

import { useLocalization } from '@/lang/language';

const Spinner = ({ className }: { className?: string }) => {
  const loc = useLocalization();

  return (
    <div className={'flex justify-center items-center space-x-4 ' + (className ?? '')}>
      <div className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full' role='status'></div>
      <span className='visually-hidden text-lg'>{loc('lb_sp_Title')}</span>
    </div>
  );
};

export default Spinner;

