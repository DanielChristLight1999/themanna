"use client"
import { DataTable } from "../common/data-table"
import { Customer, customersTableColumn } from "@/lib/columns/customersTableColumn"
import { CustomerDetailsDialog } from "./customer-details-dialog"
import useUIStore from "@/stores/uistore"
import { CustomerNew } from "@/lib/getData"

export function CustomersTable({customers}: { customers: CustomerNew[] }) {

const customer = useUIStore((state) => state.selectedCustomer)

  return (
    <div>
      <DataTable data={customers} columns={customersTableColumn}  />
      <CustomerDetailsDialog customer={customer}/>
    </div>
  )
}
