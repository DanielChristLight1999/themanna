"use client"

import { LogOutOAuth } from "@/actions/authactions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"

const ProfileDropdown = ({name}: {name: string}) => {
    const router = useRouter()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-emerald-50">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900">{name}</p>
                        <p className="text-xs text-gray-600">Affiliate Partner</p>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => LogOutOAuth("/auth/login")} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ProfileDropdown