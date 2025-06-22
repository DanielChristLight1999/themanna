"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Plus, Clock, History, LogOut, Store, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { LogOutOAuth } from "@/actions/authactions"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "New Order", href: "/new-order", icon: Plus },
  { name: "Active Orders", href: "/active-orders", icon: Clock },
  { name: "Past Orders", href: "/past-orders", icon: History },
  { name: "End Session", href: "/end-session", icon: LogOut },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Package className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64  bg-gray-900 text-white p-0">
          <SheetHeader className="flex h-16 items-center justify-center border-b border-gray-700">
            <SheetTitle className="flex items-center space-x-2">
              <Store className="text-orange-500" />
              <span className="text-xl text-white font-bold">The Manna POS</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors",
                    isActive ? "bg-orange-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-6 w-6 flex-shrink-0",
                      isActive ? "text-white" : "text-gray-400 group-hover:text-white",
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="hidden md:flex h-full w-64 flex-col bg-gray-900 text-white">
        <div className="flex h-16 items-center justify-center border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold">The Manna POS</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive ? "bg-orange-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-6 w-6 flex-shrink-0",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white",
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
