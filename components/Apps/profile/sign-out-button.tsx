"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogOutOAuth } from "@/actions/authactions"

export default function SignOutButton() {
  // const handleSignOut = () => {
  //   // In a real app, you would call your authentication service to sign out
  //   console.log("Signing out...")
  //   // Redirect to login page or home page
  // }

  return (
    <Button
      onClick={async () => await LogOutOAuth()}
      variant="outline"
      className="w-full sm:w-auto border-orange-200 hover:bg-orange-50 hover:text-orange-700"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  )
}
