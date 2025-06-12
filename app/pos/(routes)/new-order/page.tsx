import { getCategories, getProducts, getSavedOrder } from "@/lib/getData"
import { NewOrderContent } from "./new-order-content"
import { redirect } from "next/navigation"
import { POSHydrator } from "./pos-hydrator"
import { CartItem } from "@/stores/usePOSStore"
import { PosSession } from "@/lib/generated/prisma"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resumeId = (await searchParams).resume as string
  let cartItems: CartItem[] = []
  let sessiondata = {
    id: "",
    staffId: "",
    openedAt: new Date(),
    cashierName: "",
  }

  if (resumeId) {
    const savedOrder = await getSavedOrder(resumeId)
    if (!savedOrder) {
      redirect("/pos/active-orders")
    }

    cartItems = savedOrder.items.map((i) => ({
      id: i.product.id.toString(),
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      image: i.product.images?.[0]?.url || "/placeholder.svg",
    }))
    sessiondata = {
      id: savedOrder.session?.id as string,
      staffId: savedOrder.session?.staffId as string,
      openedAt: savedOrder.session?.openedAt as Date,
      cashierName: savedOrder.session?.staff?.name as string,
    }
  }
  const products = await getProducts()
  const categories = await getCategories()
  return (
    <>
      <POSHydrator sessiondata={sessiondata} cart={cartItems} />
      <NewOrderContent resumeId={resumeId} products={products} availableCategories={categories} />
    </>
  )
}
