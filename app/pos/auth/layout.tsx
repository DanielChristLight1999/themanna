import React from 'react'
import "@/app/globals.css";
import { Toaster } from 'sonner';
const Layout = (
    { children } : Readonly<{children: React.ReactNode}>
) => {
  return (
    <html lang='en'>
      <body className='h-screen relative'>
          {children}
          <Toaster richColors />
      </body>
    </html>
  )
}

export default Layout