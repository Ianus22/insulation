import MyNavbar from '@/components/myNavbar';

export default function passwordResetRequestSent() {
  return (
    <>
      <MyNavbar></MyNavbar>
      <div className='mx-auto items-center text-center mt-12'>
        <h1 className='text-2xl'>Message has been sent. Please check your email.</h1>
      </div>
    </>
  );
}
