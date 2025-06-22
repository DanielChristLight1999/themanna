import React from 'react'
import "@/app/globals.css";
import { Toaster } from '@/components/ui/sonner';
const Layout = (
    { children } : Readonly<{children: React.ReactNode}>
) => {
  return (
    <html lang='en'>
      <body className='min-h-screen '>
          {children}
          <Toaster position="top-left" richColors />
      </body>
    </html>
  )
}

export default Layout