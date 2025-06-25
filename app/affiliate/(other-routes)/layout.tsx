import React from 'react'
import "@/app/globals.css";
const Layout = (
    { children } : Readonly<{children: React.ReactNode}>
) => {
  return (
    <html lang='en'>
      <body className='h-screen relative'>
          {children}
      </body>
    </html>
  )
}

export default Layout