"use client"
import { DataTable } from "../common/data-table"
import { Customer, customersTableColumn } from "@/lib/columns/customersTableColumn"
import { CustomerDetailsDialog } from "./customer-details-dialog"
import useUIStore from "@/stores/uistore"

export function CustomersTable({customers}: { customers: Customer[] }) {

const customer = useUIStore((state) => state.selectedCustomer)

  return (
    <div>
      <DataTable data={customers} columns={customersTableColumn}  />
      <CustomerDetailsDialog customer={customer}/>
    </div>
  )
}
