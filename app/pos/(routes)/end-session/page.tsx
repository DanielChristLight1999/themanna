import { getActivePOSSession } from "@/lib/pos-data/getposdata"
import { EndSessionContent } from "./end-session-content"

export default async function EndSession() {
  const session = await getActivePOSSession()
  if (!session) {
    return <div className="p-6">No active session found.</div>
  }
  return (
      <EndSessionContent />
  )
}
