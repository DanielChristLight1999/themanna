import React from 'react'
import "@/app/globals.css";
import { Toaster } from '@/components/ui/sonner';
const Layout = (
    { children } : Readonly<{children: React.ReactNode}>
) => {
  return (
    <html lang='en'>
      <body className='h-screen border'>
          {children}
          <Toaster richColors position="top-left" />
      </body>
    </html>
  )
}

export default Layout