import React from 'react';

const Spinner = ({ className }: { className?: string }) => {
  return (
    <div className={'flex justify-center items-center space-x-4 ' + (className ?? '')}>
      <div className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full' role='status'></div>
      <span className='visually-hidden text-lg'>Loading...</span>
    </div>
  );
};

export default Spinner;

