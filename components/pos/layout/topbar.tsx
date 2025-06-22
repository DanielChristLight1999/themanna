"use client"

import { Button } from "@/components/ui/button"
import { usePOSStore } from "@/stores/usePOSStore"
import { format } from "date-fns"
import { Clock, PanelRightClose, User } from "lucide-react"
import Link from "next/link"

export function Topbar() {
  const cashierName = usePOSStore((state) => state.cashierName)
  const startTime = usePOSStore((state) => state.startTime)
  const isActive = usePOSStore((state) => state.isActive)
  const endSession = usePOSStore((state) => state.endSession)


  return (
    <div className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-500" />
          <span className="font-medium">{cashierName}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600"><span className="hidden md:block">Session started:</span> {format(new Date(startTime as Date), "HH:mm")}</span>
        </div>
      </div>

      <Button variant="ghost" asChild disabled={!isActive}>
        <Link href={"/end-session"}>
          <span className="hidden md:block">Close Session</span>
          <PanelRightClose className="block !size-6 md:hidden" />
        </Link>
      </Button>
    </div>
  )
}
