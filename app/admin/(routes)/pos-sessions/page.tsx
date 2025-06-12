import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { PosSessionsTable } from "@/components/admin/pos/pos-sessions-table"
import { PosSessionsStats } from "@/components/admin/pos/pos-sessions-stats"
import { getAllPOSSessions } from "@/lib/getData"

export const metadata: Metadata = {
  title: "POS Sessions | The Mana Restaurant Admin",
  description: "Manage POS sessions for The Mana Restaurant",
}

export default async function PosSessionsPage() {
  const allSessions = await getAllPOSSessions()
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
      <PosSessionsTable sessions={allSessions} />
    </div>
  )
}
