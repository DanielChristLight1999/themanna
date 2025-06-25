"use client"


import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { EditIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import useUIStore from "@/stores/uistore";
import { useCanAccess } from "../permissions/use-can-access";

export interface MenuItem {
    id: number;
    name: string;
    category: {
        name: string;
        id: number
    };
    price: number;
    costPrice: number | null;
    sku: string | null;
    images: { url: string }[];
    description: string | null;
    inventory: {
        lowStockAlert: number;
        quantity: number;
    } | null;
}
export const productsTableColumn: ColumnDef<MenuItem>[] = [
    {
        accessorKey: "id",
        header: "Product",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col items-end md:flex-row md:items-center gap-2">
                    <Image height={50} width={50} src={row.original.images[0]?.url} alt={row.original.name} className="w-10 h-10 object-cover rounded" />
                    <div className="flex flex-col gap-1 ">
                        <span className="font-medium">{row.original.name}</span>
                        <span className="text-xs text-muted-foreground">SKU: {row.original.sku}</span>
                    </div>
                </div>
            )
        }

    },
    {
        accessorKey: "category.name",
        header: "Category",
        cell: ({ row }) => {
            return <span className="text-sm">{row.original.category.name}</span>
        }
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            return <span className="text-sm">₦{row.original.price.toLocaleString()}</span>
        }
    },
    {
        accessorKey: "inventory.quantity",
        header: "Stock",
        cell: ({ row }) => {
            return <span className="text-sm">{row.original.inventory?.quantity}</span>
        }
    },
    {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
            const inventory = row.original.inventory;
            if (!inventory) return <span className="text-sm">N/A</span>
            const status = inventory.quantity < inventory.lowStockAlert ? "LOW STOCK" : inventory.quantity <= 0 ? "OUT OF STOCK" : "IN STOCK";
            const variant = inventory.quantity <= 0 ? "destructive" : inventory.quantity < inventory.lowStockAlert ? "secondary" : "default";
            return (
                <span className={`badge badge-${variant}`}>
                    {status}
                </span>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: function CellComponent ({ row })  {
            const product = row.original;
            const canEditProduct = useCanAccess("products", "update")
            const canDeleteProduct = useCanAccess("products", "delete")
            const setselectedMenuItem = useUIStore((state) => state.setSelectedMenuItem)
            const setIsMenuItemDialogOpen = useUIStore((state) => state.setIsMenuItemDialogOpen)
            const setSelectedMenuItem = useUIStore((state) => state.setSelectedMenuItem)
            const setisConfirmDeleteDialogOpen = useUIStore((state) => state.setIsConfirmDeleteDialogOpen)

            const handleEditProduct = (product: MenuItem) => {
                setselectedMenuItem(product);
                setIsMenuItemDialogOpen(true);
            }

            const handleDeleteProduct = (product: MenuItem) => {
                setSelectedMenuItem(product);
                setisConfirmDeleteDialogOpen(true);
            }
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled={!canEditProduct} onClick={() => handleEditProduct(product)} className="text-primary">
                            <EditIcon className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={!canDeleteProduct} onClick={() => handleDeleteProduct(product)} className="text-destructive">
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]