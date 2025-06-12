import { getActivePOSSession } from "@/lib/pos-data/getposdata"
import { DashboardContent } from "./dashboard-content"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const ActiveposSession = await getActivePOSSession()
  if (!ActiveposSession) {
    redirect('/start-session')
  }
  return (
      <DashboardContent />
  )
}
