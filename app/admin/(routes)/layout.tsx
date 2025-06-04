import type React from "react"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import "@/app/globals.css";
import AdminSidebar from "@/components/admin/sidebar";
import { PrintProvider } from "@/lib/usecontext.tsx/print-context";

export const metadata = {
  title: "The Mana Restaurant - Admin Dashboard",
  description: "Admin dashboard for The Mana Restaurant",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body  >
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex h-screen min-h-screen">
            <AdminSidebar />
            <div className="flex-1 h-full overflow-auto">
              <PrintProvider>
                <main className="flex-1 h-full">{children}</main>
              </PrintProvider>
            </div>
            <Toaster richColors={true} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
