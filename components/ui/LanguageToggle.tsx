'use client';

import { useGlobalState } from '@/hooks/globalState';
import React, { useState, useEffect } from 'react';
import { languageState } from '@/lang/language';
import Image from 'next/image';

const LanguageToggle: React.FC = () => {
  const language = useGlobalState(languageState);

  const isEnglish = language.value == 'en';

  const toggleLanguage = () => (language.value = isEnglish ? 'de' : 'en');

  return (
    <div
      className='relative w-16 h-8 flex items-center bg-slate-300 rounded-full p-1 cursor-pointer select-none'
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

