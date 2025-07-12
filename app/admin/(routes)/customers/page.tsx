import type { Metadata } from "next"

import { CustomersTable } from "@/components/admin/customers/customers-table"
import { getCustomers } from "@/lib/getData"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getUserPermissions } from "@/lib/permissions/check-permissions"

export const metadata: Metadata = {
  title: "Customers | The Mana Restaurant Admin",
  description: "Manage customers for The Mana Restaurant",
}

export default async function CustomersPage() {
  const session = await auth()
  if (!session) return redirect("/auth/login")
  const access = await getUserPermissions()
  const canViewCustomers = access?.permissions?.customers?.view ?? false
  if (!canViewCustomers) return redirect("/unauthorized")
  const customers = await getCustomers()
  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
       
      </div>

      <CustomersTable customers={customers} />
    </div>
  )
}
