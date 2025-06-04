import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { CustomersTable } from "@/components/admin/customers/customers-table"
import { CustomersFilter } from "@/components/admin/customers/customers-filter"
import { getCustomers } from "@/lib/getData"

export const metadata: Metadata = {
  title: "Customers | The Mana Restaurant Admin",
  description: "Manage customers for The Mana Restaurant",
}

export default async function CustomersPage() {
  const customers = await getCustomers()
  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <CustomersFilter />
      <CustomersTable customers={customers} />
    </div>
  )
}
