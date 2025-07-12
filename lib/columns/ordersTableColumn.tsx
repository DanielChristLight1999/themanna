"use client"
import { ColumnDef } from "@tanstack/react-table"
import { OrderStatus, PaymentMethod } from "../generated/prisma"
import { format } from "date-fns"
import { extractorderId, formatPrice } from "../utils"
import { EyeIcon } from "lucide-react"
import useUIStore from "@/stores/uistore"


export type Order = {
    id: string,
    customer: string | null,
    phone: string | null,
    date: Date,
    status: OrderStatus,
    total: number,
    deliveryFee: number | null,
    type: string,
    paymentMethod?: PaymentMethod,
    items: {
        id: number,
        name: string,
        quantity: number,
        price: number
    }[],
    address: string
}

export const ordersTableColumn: ColumnDef<Order>[] = [
    {
        accessorKey: "id",
        header: "Order ID",
        cell: ({ row }) => {
            return (
                <span className="uppercase font-medium">
                    ORD-{extractorderId(row.original.id as string)}
                </span>
            )
        }
    },
    {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.customer || "N/A"}</span>
                    <span className="text-xs text-muted-foreground">{row.original.phone || "N/A"}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            return format(new Date(row.original.date), "dd/MM/yyyy HH:mm")
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return (
                <span className={`badge badge-${row.original.status.toLowerCase()}`}>
                    {row.original.status.replace("_", " ")}
                </span>
            )
        }
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            return row.original.type
        },
        meta: {
            filterOptions: ["ONLINE", "POS"]
        }
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment",
        cell: ({ row }) => {
            return row.original.paymentMethod || "N/A"
        }
    },
    {
        accessorKey: "total",
        header: "Amount",
        cell: ({ row }) => {
            return `${formatPrice(row.original.total)}`
        }
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: function CellComponent({ row }) {
            const order = row.original
            const setSelectedOrder = useUIStore((state) => state.setSelectedOrder)
            const setIsDetailsOpen = useUIStore((state) => state.setIsOrderDetailsDialogOpen)
            const handleViewDetails = (order: Order) => {
                setSelectedOrder(order)
                setIsDetailsOpen(true)
            }

            return (
                <div>
                    <EyeIcon onClick={() => handleViewDetails(order)} size={18} className="text-right w-full cursor-pointer" />
                </div>
            )
        }
    }
]