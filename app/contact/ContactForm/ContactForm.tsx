import React from 'react';

const ContactForm: React.FC = () => {
  return (
    <div className='mt-4 md:mt-0 md:ml-4 flex flex-col w-full max-w-md'>
      <h2 className='text-xl font-semibold text-black'>Leave us a message</h2>
      <form className='flex flex-col mt-4'>
        <input type='text' placeholder='Name' className='p-2 border border-teal-400 rounded-md mb-2' />
        <input type='email' placeholder='Email' className='p-2 border border-teal-400 rounded-md mb-2' />
        <textarea placeholder='Write us a message here' className='p-2 border border-teal-400 rounded-md mb-2 h-32' />
        <button type='submit' className='bg-[#C5ECE0] opacity-100 text-white p-2 rounded-md mt-2 hover:bg-[#84C4B1]'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
