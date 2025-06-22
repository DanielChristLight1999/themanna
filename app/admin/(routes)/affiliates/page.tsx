import type { Metadata } from "next"
import { AffiliatesStats } from "@/components/admin/affiliates/affiliates-stats"
import { AffiliatesTable } from "@/components/admin/affiliates/affiliates-table"
import { AffiliateApplications } from "@/components/admin/affiliates/affiliate-applications"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserPermissions } from "@/lib/permissions/check-permissions"

export const metadata: Metadata = {
  title: "Affiliates | The Mana Restaurant Admin",
  description: "Manage affiliates for The Mana Restaurant",
}

export default async function AffiliatesPage() {
  const session = await auth()
  if (!session) return redirect("/auth/login")
  const access = await getUserPermissions()
  const canViewAffiliates = access?.permissions?.affiliates?.view ?? false
  if (!canViewAffiliates) return redirect("/unauthorized")
  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Affiliates</h1>
      </div>

      <AffiliatesStats />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <AffiliateApplications />
        </div>
        <div className="md:col-span-2">
          <AffiliatesTable />
        </div>
      </div>
    </div>
  )
}
