// utils/report-columns.ts
import { ColumnDef } from "@tanstack/react-table"
import { extractorderId } from "../utils"
import { format } from "date-fns"

export function getReportColumns(reportType: string): ColumnDef<any>[] {
  switch (reportType) {
    case "sales":
      return [
        { 
            accessorKey: "id", 
            header: "Order ID",
            cell: ({row}) => {
                const orderid =extractorderId(row.original.id)
                return (
                    <div className="uppercase">
                        #ORD-{orderid}
                    </div>
                )
            }
         },
        { 
            accessorKey: "placedAt", 
            header: "Date",
            cell: ({row}) => {
                const date = new Date(row.original.placedAt)
                return (
                    <div className="uppercase">
                        {format(date, "dd/MM/yyyy HH:mm")}
                    </div>
                )
            }
         },
        { 
            accessorKey: "customer", 
            header: "Customer",
            cell: ({row}) => {
                const customer = row.original.customer
                return (
                    <div className="capitalize">
                        {customer.name}
                    </div>
                )
            }
        },
        { accessorKey: "amount", header: "Amount (₦)" },
        { accessorKey: "paymentMethod", header: "Payment Method" },
        { accessorKey: "location", header: "Location" },
      ]
    case "products":
      return [
        { accessorKey: "name", header: "Product" },
        { accessorKey: "sku", header: "SKU" },
        { accessorKey: "price", header: "Unit Price" },
        { accessorKey: "sold", header: "Units Sold" },
        { accessorKey: "revenue", header: "Total Revenue" },
      ]
    case "orders":
      return [
        { accessorKey: "id", header: "Order ID" },
        { accessorKey: "status", header: "Status" },
        { accessorKey: "customer", header: "Customer" },
        { accessorKey: "date", header: "Date" },
        { accessorKey: "total", header: "Total Amount" },
        { accessorKey: "deliveryType", header: "Delivery Type" },
      ]
    default:
      return []
  }
}
