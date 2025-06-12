import React from 'react'
import "@/app/globals.css";
import { Toaster } from '@/components/ui/sonner';
import { auth } from '@/auth';
import StartSessionTopbar from '@/components/pos/layout/start-session-topbar';
const  Layout = async (
    { children } : Readonly<{children: React.ReactNode}>
) => {
  const session = await auth()
  return (
    <html lang='en'>
      <body className='h-screen relative'>
        <StartSessionTopbar name={session?.user?.name as string} email={session?.user?.email as string} />
          {children}
          <Toaster richColors position="top-left" />
      </body>
    </html>
  )
}

export default Layout