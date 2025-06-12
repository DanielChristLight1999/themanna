import { getCompletedPOSOrders } from "@/lib/pos-data/getposdata"
import { PastOrdersContent } from "./past-orders-content"

export default async function PastOrders() {
  const orders = await getCompletedPOSOrders()
  return (
      <PastOrdersContent orders={orders} />
  )
}
