import type { Metadata } from "next"
import { getCategories, getMenuItems } from "@/actions/admin/menu-actions"
import MenuHeader from "./MenuHeader"
import { MenuCategories } from "@/components/admin/menu/menu-categories"
import { MenuTable } from "@/components/admin/menu/menu-table"
import { ProductDialog } from "@/components/admin/menu/product-dialog"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserPermissions } from "@/lib/permissions/check-permissions"

export const metadata: Metadata = {
  title: "Menu & Inventory | The Mana Restaurant Admin",
  description: "Manage menu and inventory for The Mana Restaurant",
}

export default async function MenuPage() {
  const session = await auth()

  if (!session?.user?.id) return redirect("/auth/login")
  const access = await getUserPermissions()
  const canViewMenu = access?.permissions?.products?.view ?? false
  const canCreateProduct = access?.permissions?.products?.create ?? false
  const canEditProduct = access?.permissions?.products?.update ?? false
  if (!canViewMenu) return redirect("/unauthorized")
  
  const products = await getMenuItems()
  const categories = await getCategories()
  return (
    <div className="flex flex-col p-6 space-y-6">
      <MenuHeader canCreateProduct={canCreateProduct} />
      <div className="flex flex-col md:flex-row gap-6">
          <MenuCategories categories={categories } />
          <MenuTable products={products} />
      </div>
      <ProductDialog categories={categories} canEditProduct={canEditProduct} canCreateProduct={canCreateProduct} />
    </div>
  )
}
