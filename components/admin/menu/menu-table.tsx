"use client"

import useUIStore from "@/stores/uistore"
import ConfirmDeleteDialog from "../common/confirm-delete-dialog"
import { DataTable } from "../common/data-table"
import { MenuItem, productsTableColumn } from "@/lib/columns/productsTableColumn"
import { deleteMenuItem } from "@/actions/admin/menu-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Mock data - would be replaced with actual data from API
// const products = [
//   {
//     id: "PRD-001",
//     name: "Jollof Rice Special",
//     category: "Main Dishes",
//     price: 1500,
//     cost: 800,
//     stock: 50,
//     sku: "JRS-001",
//     status: "IN_STOCK",
//     image: "/placeholder.svg?height=80&width=80",
//     description: "Flavorful jollof rice served with chicken, plantain, and coleslaw.",
//     tags: ["Popular", "Spicy"],
//   },
//   {
//     id: "PRD-002",
//     name: "Suya Platter",
//     category: "Appetizers",
//     price: 950,
//     cost: 500,
//     stock: 30,
//     sku: "SP-002",
//     status: "IN_STOCK",
//     image: "/placeholder.svg?height=80&width=80",
//     description: "Grilled spicy beef skewers served with onions and tomatoes.",
//     tags: ["Spicy", "Gluten-Free"],
//   },
//   {
//     id: "PRD-003",
//     name: "Egusi Soup & Pounded Yam",
//     category: "Main Dishes",
//     price: 1850,
//     cost: 950,
//     stock: 25,
//     sku: "ESP-003",
//     status: "IN_STOCK",
//     image: "/placeholder.svg?height=80&width=80",
//     description: "Rich egusi soup with assorted meat served with pounded yam.",
//     tags: ["Traditional"],
//   },
//   {
//     id: "PRD-004",
//     name: "Pepper Soup",
//     category: "Soups",
//     price: 750,
//     cost: 400,
//     stock: 40,
//     sku: "PS-004",
//     status: "IN_STOCK",
//     image: "/placeholder.svg?height=80&width=80",
//     description: "Spicy pepper soup with goat meat or fish.",
//     tags: ["Spicy", "Gluten-Free"],
//   },
//   {
//     id: "PRD-005",
//     name: "Moin Moin Deluxe",
//     category: "Sides",
//     price: 800,
//     cost: 350,
//     stock: 35,
//     sku: "MM-005",
//     status: "LOW_STOCK",
//     image: "/placeholder.svg?height=80&width=80",
//     description: "Steamed bean pudding with boiled eggs and fish.",
//     tags: ["Vegetarian"],
//   },
//   {
//     id: "PRD-006",
//     name: "Chapman",
//     category: "Beverages",
//     price: 750,
//     cost: 300,
//     stock: 60,
//     sku: "CHP-006",
//     status: "IN_STOCK",
//     image: "/placeholder.svg?height=80&width=80",
//     description: "Refreshing Nigerian cocktail made with Grenadine and Fanta.",
//     tags: ["Non-Alcoholic"],
//   },
//   {
//     id: "PRD-007",
//     name: "Puff Puff",
//     category: "Desserts",
//     price: 500,
//     cost: 200,
//     stock: 0,
//     sku: "PP-007",
//     status: "OUT_OF_STOCK",
//     image: "/placeholder.svg?height=80&width=80",
//     description: "Deep-fried sweet dough balls.",
//     tags: ["Sweet"],
//   },
// ]

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "IN_STOCK":
      return "default"
    case "LOW_STOCK":
      return "secondary"
    case "OUT_OF_STOCK":
      return "destructive"
    default:
      return "outline"
  }
}

export function MenuTable({products}: { products: MenuItem[] }) {
  const selectedProduct = useUIStore((state) => state.selectedMenuItem);
  const setSelectedProduct = useUIStore((state) => state.setSelectedMenuItem);
  const setIsConfirmDeleteDialogOpen = useUIStore((state) => state.setIsConfirmDeleteDialogOpen);
  const [loading, setLoading] = useState(false);
  const router =  useRouter()
  const onCancelDelete = () => {
    setSelectedProduct(null);
    setIsConfirmDeleteDialogOpen(false);
  }
  const onConfirmDelete = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    const response = await deleteMenuItem(selectedProduct.id)
    if (response.error) {
      toast.error(response.message);
      return;
    }
    toast.success("Product deleted successfully");
    setSelectedProduct(null);
    setIsConfirmDeleteDialogOpen(false);
    setLoading(false);
    router.refresh();
  }
  return (
    <div className="w-full">
      <DataTable data={products} columns={productsTableColumn} />
      <ConfirmDeleteDialog loading={loading} onCancel={onCancelDelete} onConfirm={onConfirmDelete} />
    </div>
  )
}
