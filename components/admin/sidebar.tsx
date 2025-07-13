"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  ChefHat,
  ClipboardList,
  CreditCard,
  Home,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { LogOutOAuth } from "@/actions/authactions"
import Image from "next/image"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ClipboardList,
  },
  {
    title: "Menu & Inventory",
    href: "/menu",
    icon: ChefHat,
  },
  {
    title: "Foods of the Day",
    href: "/foods-of-the-day",
    icon: Package,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Affiliates",
    href: "/affiliates",
    icon: ShoppingBag,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "POS Sessions",
    href: "/pos-sessions",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export default function AdminSidebar() {
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
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle className="text-left flex items-center gap-2">
              <Link href={"/"} className="">
                <Image src={"/images/themanalogonew.png"} alt="logo" width={150} height={150} />
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
            <Button onClick={async () => await LogOutOAuth()} variant="ghost" className="mt-auto justify-start gap-3">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r bg-background">
        <div className="p-4 border-b flex items-center gap-2 font-semibold">
          <Link href={"/"} className="">
            <Image src={"/images/themanalogonew.png"} alt="logo" width={150} height={150} />
          </Link>
        </div>
        <div className="flex flex-col gap-1 p-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
        <div className="p-2 border-t mt-auto">
          <Button onClick={async () => await LogOutOAuth()} variant="ghost" className="w-full justify-start gap-3">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  )
}
