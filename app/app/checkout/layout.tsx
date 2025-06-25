import React, { Suspense } from 'react'
import "@/app/globals.css";
import { Toaster } from '@/components/ui/sonner';
import LoadingComponent from '@/components/Apps/common/loading';
const Layout = (
    { children } : Readonly<{children: React.ReactNode}>
) => {
  return (
    <html lang='en'>
      <body className=''>
          <Suspense fallback={<LoadingComponent className='min-h-screen' variant="pulse" size="lg" message="Loading..." showProgress={true} /> }>
            {children}
            <Toaster richColors position="top-left" />
          </Suspense>
      </body>
    </html>
  )
}

export default Layout