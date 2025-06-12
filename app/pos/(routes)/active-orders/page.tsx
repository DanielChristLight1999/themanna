import { getActivePOSOrders } from "@/lib/pos-data/getposdata"
import { ActiveOrdersContent } from "./active-orders-content"

export default async function ActiveOrders() {
  const orders = await getActivePOSOrders()
  return (
      <ActiveOrdersContent initialOrders={orders} />
  )
}
