import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/affiliate/app-sidebar"
import { TopBar } from "@/components/affiliate/top-bar"
import "@/app/globals.css"
import { Toaster } from "sonner"

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gradient-to-br from-emerald-50 to-white">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <TopBar />
              <main className="flex-1 p-6">{children}</main>
              <Toaster richColors position="bottom-right" />
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
