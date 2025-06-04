import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { PosSessionsStats } from "@/components/admin/pos/pos-sessions-stats"
import { PosSessionsTable } from "@/components/admin/pos/pos-sessions-table"

export const metadata: Metadata = {
  title: "POS Sessions | The Mana Restaurant Admin",
  description: "Manage POS sessions for The Mana Restaurant",
}

export default function PosSessionsPage() {
  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Sessions</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Session
        </Button>
      </div>

      <PosSessionsStats />
      <PosSessionsTable />
    </div>
  )
}
