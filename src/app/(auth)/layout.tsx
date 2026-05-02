import Navbar from '@/components/ui/navbar/page';
import '../../../src/app/globals.css';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import SessionWrapper from '@/components/ui/Session/SessionWrapper';
export default function AuthLayout ({   children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (


    <SessionWrapper>
      
 <section className='flex flex-row'>
      <Toaster position="top-center" reverseOrder={false} />
    <Navbar/>
      {children} 
    </section>

    </SessionWrapper>
 


  

  );
}