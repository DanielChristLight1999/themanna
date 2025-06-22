import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { Sidebar } from "@/components/pos/layout/sidebar"
import { Topbar } from "@/components/pos/layout/topbar"
import { Toaster } from "@/components/ui/sonner"
import { getActivePOSSession } from "@/lib/pos-data/getposdata"
import { POSHydrator } from "@/components/pos/layout/hydrator"
import { getRestaurantSettingsNoAdmin } from "@/lib/getsettingsData"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Manna POS",
  description: "Point of Sale System for The Manna Restaurant",
  generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const session = await getActivePOSSession()
    const settingsData = await getRestaurantSettingsNoAdmin()
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Topbar />
            {session && <POSHydrator settingsData={settingsData} session={session} />}
            <main className="flex-1 overflow-auto p-6">{children}</main>
            <Toaster richColors position="top-left" />
          </div>
        </div>
      </body>
    </html>
  )
}
