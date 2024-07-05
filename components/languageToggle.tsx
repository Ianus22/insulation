'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const LanguageToggle: React.FC = () => {
  const [isEnglish, setIsEnglish] = useState(true);

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  return (
    <div onClick={toggleLanguage} className='cursor-pointer ml-4'>
      {isEnglish ? (
        <Image src='/images/flag-en.png' alt='English Flag' width={40} height={30} quality={100} />
      ) : (
        <Image src='/images/flag-de.png' alt='German Flag' width={40} height={30} quality={100} />
      )}
    </div>
  );
};

export default LanguageToggle;
