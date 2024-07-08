import React from 'react';
import MyNavbar from '@/components/myNavbar';
import Footer from '@/components/myFooter';
import Map from './Map/Map';
import ContactForm from './ContactForm/ContactForm';

const ContactPage: React.FC = () => {
  return (
    <>
      <MyNavbar />
      <div className='flex flex-col items-center min-h-screen mt-6'>
        <div className='bg-gray-100 shadow-md rounded-lg p-6 w-full max-w-4xl'>
          <h1 className='text-2xl font-semibold text-center text-black'>Get in Touch</h1>
          <div className='flex flex-col md:flex-row justify-between items-center mt-6'>
            <div className='flex flex-col items-start mb-4 md:mb-0 md:mr-4'>
              <div className='flex items-center mb-4'>
                <svg
                  data-testid='geist-icon'
                  height='16'
                  strokeLinejoin='round'
                  viewBox='0 0 16 16'
                  width='12'
                  className='text-gray-700'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M11.5253 10.2634L8 13.8578L4.47471 10.2634C2.50843 8.25857 2.50843 4.99627 4.47471 2.99144C6.42507 1.00285 9.57493 1.00285 11.5253 2.99144C13.4916 4.99627 13.4916 8.25857 11.5253 10.2634ZM12.5962 11.3137L9.05051 14.9289L8 16L6.94949 14.9289L3.40381 11.3137C0.865397 8.72554 0.865399 4.52929 3.40381 1.94113C5.94222 -0.647042 10.0578 -0.647042 12.5962 1.94113C15.1346 4.52929 15.1346 8.72554 12.5962 11.3137ZM9 6.5C9 7.05228 8.55228 7.5 8 7.5C7.44772 7.5 7 7.05228 7 6.5C7 5.94772 7.44772 5.5 8 5.5C8.55228 5.5 9 5.94772 9 6.5ZM8 9C9.38071 9 10.5 7.88071 10.5 6.5C10.5 5.11929 9.38071 4 8 4C6.61929 4 5.5 5.11929 5.5 6.5C5.5 7.88071 6.61929 9 8 9Z'
                    fill='currentColor'
                  ></path>
                </svg>
                <span className='ml-2 text-gray-700'>Rienößlgasse 3, Wien</span>
              </div>
              <div className='flex items-center mb-4'>
                <svg
                  data-testid='geist-icon'
                  height='16'
                  strokeLinejoin='round'
                  viewBox='0 0 16 16'
                  width='16'
                  className='text-gray-700'
                >
                  <path
                    d='M5.5 1H2.87785C1.63626 1 0.694688 2.11946 0.907423 3.34268L1.14841 4.72836C1.96878 9.4455 5.51475 13.2235 10.1705 14.3409L12.5333 14.908C13.7909 15.2098 15 14.2566 15 12.9632V10.5L11.75 8.25L9.25 10.75L5.25 6.75L7.75 4.25L5.5 1Z'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    fill='transparent'
                  ></path>
                </svg>
                <span className='ml-2 text-gray-700'>+359 58 331 24</span>
              </div>
              <Map />
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
