'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const LanguageToggle: React.FC = () => {
  const [isEnglish, setIsEnglish] = useState(true);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setIsEnglish(storedLanguage === 'en');
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = isEnglish ? 'de' : 'en';
    setIsEnglish(!isEnglish);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <div
      className='relative w-16 h-8 flex items-center bg-slate-300 rounded-full p-1 cursor-pointer'
      onClick={toggleLanguage}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform ${
          isEnglish ? 'translate-x-0' : 'translate-x-8'
        } transition-transform duration-300 flex items-center justify-center`}
      >
        {isEnglish ? (
          <Image src='/images/flag-en.png' alt='English Flag' width={26} height={26} quality={100} />
        ) : (
          <Image src='/images/flag-de.png' alt='German Flag' width={26} height={26} quality={100} />
        )}
      </div>
    </div>
  );
};

export default LanguageToggle;
