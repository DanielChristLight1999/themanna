"use client"

import { Button } from "@/components/ui/button"
import { usePOSStore } from "@/stores/usePOSStore"
import { format } from "date-fns"
import { Clock, User } from "lucide-react"

export function Topbar() {
  const cashierName = usePOSStore((state) => state.cashierName)
  const startTime = usePOSStore((state) => state.startTime)
  const isActive = usePOSStore((state) => state.isActive)
  const endSession = usePOSStore((state) => state.endSession)
  const handleCloseSession = () => {
    if (confirm("Are you sure you want to close this session?")) {
      endSession()
      alert("Session closed successfully.")
    }
  }

  return (
    <div className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-500" />
          <span className="font-medium">{cashierName}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">Session started: {format(new Date(startTime as Date), "HH:mm")}</span>
        </div>
      </div>

      <Button variant="outline" onClick={handleCloseSession} disabled={!isActive}>
        Close Session
      </Button>
    </div>
  )
}
