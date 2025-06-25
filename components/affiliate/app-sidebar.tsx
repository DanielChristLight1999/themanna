"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Users, DollarSign, LinkIcon, Settings } from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Referrals",
    url: "/referrals",
    icon: Users,
  },
  {
    title: "Commissions",
    url: "/commissions",
    icon: DollarSign,
  },
  {
    title: "Referral Link",
    url: "/referral-link",
    icon: LinkIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-emerald-200">
      <SidebarHeader className="border-b border-emerald-200 p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TM</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">TheMana</h2>
            <p className="text-xs text-emerald-600">Affiliate Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`w-full justify-start px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
