import type { Metadata } from "next"
import { ReportsOverview } from "@/components/admin/reports/reports-overview"
import { EnhancedReportsGenerator } from "@/components/admin/reports/enhanced-reports-generator"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserPermissions } from "@/lib/permissions/check-permissions"

export const metadata: Metadata = {
  title: "Reports & Analytics | The Mana Restaurant Admin",
  description: "View reports and analytics for The Mana Restaurant",
}

export default async function ReportsPage() {
  const session = await auth()
  if (!session) return redirect("/auth/login")
  const access = await getUserPermissions()
  const canViewReports = access?.permissions?.reports?.view ?? false
  if (!canViewReports) return redirect("/unauthorized")
  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      </div>

      <ReportsOverview />
      <EnhancedReportsGenerator />
    </div>
  )
}
