"use client"

import { LogOutOAuth } from "@/actions/authactions"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"


export default function StartSessionTopbar({ name, email }: { name?: string, email?: string }) {
    const handleLogout = async () => {
        await LogOutOAuth()
    }
    return (
        <div className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                        <span className="font-medium">{name}</span>
                        <span className="block text-sm text-gray-600">{email}</span>
                    </div>
                </div>

                {/* <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">Session started: {format(new Date(startTime as Date), "HH:mm")}</span>
        </div> */}
            </div>

            <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-5 w-5" />
                Logout
            </Button>
        </div>
    )
}