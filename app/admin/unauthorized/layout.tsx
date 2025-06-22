import React from 'react'
import "@/app/globals.css";
import { Toaster } from 'sonner';
import { RBACProvider } from '@/lib/permissions/rbac-context';
import { getUserPermissions } from '@/lib/permissions/check-permissions';
const Layout = async (
    { children } : Readonly<{children: React.ReactNode}>
) => {
    const access = await getUserPermissions()
  return (
    <html lang='en'>
      <body className='h-screen'>
          <RBACProvider permissions={access?.permissions}>
            {children}
            <Toaster richColors />
          </RBACProvider>
      </body>
    </html>
  )
}

export default Layout