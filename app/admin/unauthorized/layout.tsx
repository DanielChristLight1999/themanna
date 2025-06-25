import React, { Suspense } from 'react'
import "@/app/globals.css";
import { Toaster } from 'sonner';
import { RBACProvider } from '@/lib/permissions/rbac-context';
import { getUserPermissions } from '@/lib/permissions/check-permissions';
import LoadingComponent from '@/components/Apps/common/loading';
const Layout = async (
    { children } : Readonly<{children: React.ReactNode}>
) => {
    const access = await getUserPermissions()
  return (
    <html lang='en'>
      <body className='h-screen'>
          <Suspense fallback={<LoadingComponent className='min-h-screen' variant="pulse" size="lg" message="Loading..." showProgress={true} />}>
            <RBACProvider permissions={access?.permissions}>
              {children}
              <Toaster richColors />
            </RBACProvider>
          </Suspense>
      </body>
    </html>
  )
}

export default Layout