import type React from "react"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import "@/app/globals.css";
import AdminSidebar from "@/components/admin/sidebar";
import { PrintProvider } from "@/lib/usecontext.tsx/print-context";
import { auth } from "@/auth";
import { canAccess, getUserPermissions } from "@/lib/permissions/check-permissions";
import { redirect } from "next/navigation";
import { RBACProvider } from "@/lib/permissions/rbac-context";

export const metadata = {
  title: "The Mana Restaurant - Admin Dashboard",
  description: "Admin dashboard for The Mana Restaurant",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const access = await getUserPermissions()
  return (
    <html suppressHydrationWarning lang="en">
      <body className="min-h-screen"  >
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex h-screen h-full">
            <AdminSidebar />
            <div className="flex-1 h-full overflow-auto">
              <RBACProvider permissions={access?.permissions}>
                <PrintProvider>
                  <main className="flex-1 h-full">{children}</main>
                </PrintProvider>
              </RBACProvider>
            </div>
            <Toaster richColors={true} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
