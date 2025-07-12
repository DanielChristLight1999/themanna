import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Address } from "../generated/prisma";
import { formatPrice } from "../utils";
import { format } from "date-fns";
import useUIStore from "@/stores/uistore";
import { Order } from "./ordersTableColumn";
import { CustomerNew } from "../getData";



export interface Customer {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    orders: Order[]
    totalOrders: number;
    totalSpent: number;
    lastOrder: Date;
    status: string;
    addresses: Address[];
    joinDate: Date;
}

export const customersTableColumn: ColumnDef<CustomerNew>[] =[
    {
        id: "Customer",
        header: "Customer",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col items-start gap-2">
                    <span className="font-medium">{row.original.name}</span>
                    <span className="text-sm text-muted-foreground">{row.original.email}</span>
                </div>
            );
        }
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => {
            return <span className="text-sm">{row.original.phone || "N/A"}</span>;
        }
    },
    {
        accessorKey: "totalOrders",
        header: "Total Orders",
        cell: ({ row }) => {
            return <span className="text-sm">{row.original.totalOrders}</span>;
        }
    },
    {
        accessorKey: "totalSpent",
        header: "Total Spent",
        cell: ({ row }) => {
            return <span className="text-sm">{formatPrice(row.original.totalSpent)}</span>;
        }
    },
    {
        accessorKey: "lastOrder",
        header: "Last Order",
        cell: ({ row }) => {
            const lastOrder = row.original.lastOrder;
            return <span className="text-sm">{lastOrder ? format(new Date(lastOrder), "dd/MM/yyyy") : "-"}</span>;
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return <span className="badge badge-secondary">{row.original.status}</span>;
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: function CellComponent ({ row }) {
            const customer = row.original;
            const setIsOpen = useUIStore((state) => state.setIsCustomerDialogOpen);
            const setselectedCustomer = useUIStore((state) => state.setSelectedCustomer);
            const handleViewDetails = (customer: CustomerNew) => {
                setIsOpen(true);
                setselectedCustomer(customer);
            }
            return (
                <div className="flex gap-2">
                    <Button onClick={() => handleViewDetails(customer)} variant="ghost" size="icon">
                        <EyeIcon className="h-4 w-4" />
                    </Button>
                    {/* <Button variant="ghost" size="icon">
                        <MailIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <PhoneIcon className="h-4 w-4" />
                    </Button> */}
                </div>
            );
        }
    }
]