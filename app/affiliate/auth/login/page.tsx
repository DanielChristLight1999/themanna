import { AffiliateLoginForm } from '@/components/affiliate/affiliate-login-form'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Branding */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">M</span>
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">Welcome back, Affiliate</h1>
            <p className="mt-2 text-sm text-slate-600">Login to manage your affiliate account</p>
          </div>

          {/* Login Form */}
          <AffiliateLoginForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-slate-500">© 2025 The Mana Restaurant. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default page