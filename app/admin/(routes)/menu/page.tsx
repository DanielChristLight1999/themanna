import type { Metadata } from "next"
import { getCategories, getMenuItems } from "@/actions/admin/menu-actions"
import MenuHeader from "./MenuHeader"
import { MenuCategories } from "@/components/admin/menu/menu-categories"
import { MenuTable } from "@/components/admin/menu/menu-table"
import { ProductDialog } from "@/components/admin/menu/product-dialog"

export const metadata: Metadata = {
  title: "Menu & Inventory | The Mana Restaurant Admin",
  description: "Manage menu and inventory for The Mana Restaurant",
}

export default async function MenuPage() {
  const products = await getMenuItems()
  const categories = await getCategories()
  return (
    <div className="flex flex-col p-6 space-y-6">
      <MenuHeader />
      <div className="flex flex-col md:flex-row gap-6">
          <MenuCategories categories={categories } />
          <MenuTable products={products} />
      </div>
      <ProductDialog categories={categories}  />
    </div>
  )
}
