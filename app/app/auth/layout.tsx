import React from 'react'
import "@/app/globals.css";
import Image from 'next/image';
import { Toaster } from '@/components/ui/sonner';
const Layout = (
    { children } : Readonly<{children: React.ReactNode}>
) => {
  return (
    <html lang='en'>
      <body className='bg-[#121223]'>
          {children}
          <Toaster position="top-left" richColors />
      </body>
    </html>
  )
}

export default Layout