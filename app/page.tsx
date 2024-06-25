'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Loading...');

  useEffect(
    () =>
      void fetch('/api/hello')
        .then(req => req.text())
        .then(setMessage),
    []
  );

  return (
    <>
      <h1 className='text-5xl'>{message}</h1>
    </>
  );
}
