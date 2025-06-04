

import { OrdersTable } from "../orders/orders-table"
import { Order } from "@/lib/columns/ordersTableColumn"
import { getAllOrders } from "@/actions/admin/order-actions"

interface RecentOrdersProps {
  filterType?: "online" | "pos" | "pickup"
}

const getRecentOrders = (allOrders: Order[], filterType?: string) => {

  if (!filterType || filterType === "all") {
    return allOrders
  }

  return allOrders.filter((order) => order.type === filterType)
}

export async function RecentOrders({ filterType }: RecentOrdersProps) {
  const ordersBaseData = await getAllOrders(7) // Fetch orders from the last 30 days
  const orders = getRecentOrders(ordersBaseData, filterType)

  return (
    // <Card className="max-w-92 md:w-full md:max-w-none">
    //   <CardHeader className="flex flex-row items-center justify-between">
    //     <div>
    //       <CardTitle>Recent Orders</CardTitle>
    //       <CardDescription>Latest orders across the platform</CardDescription>
    //     </div>
    //     <Button variant="outline" size="sm">
    //       View All
    //     </Button>
    //   </CardHeader>
    //   <CardContent className="w-full h-full">
    //     <Table>
    //       <TableHeader>
    //         <TableRow>
    //           <TableHead>Order</TableHead>
    //           <TableHead>Customer</TableHead>
    //           <TableHead>Status</TableHead>
    //           <TableHead className="text-right">Amount</TableHead>
    //           <TableHead></TableHead>
    //         </TableRow>
    //       </TableHeader>
    //       <TableBody>
    //         {orders.length > 0 ? (
    //           orders.map((order) => (
    //             <TableRow key={order.id}>
    //               <TableCell className="font-medium">{order.id}</TableCell>
    //               <TableCell>{order.customer}</TableCell>
    //               <TableCell>
    //                 <Badge variant={getStatusBadgeVariant(order.status)}>{order.status.replace("_", " ")}</Badge>
    //               </TableCell>
    //               <TableCell className="text-right">₦{order.total.toLocaleString()}</TableCell>
    //               <TableCell>
    //                 <Button variant="ghost" size="icon">
    //                   <EyeIcon className="h-4 w-4" />
    //                 </Button>
    //               </TableCell>
    //             </TableRow>
    //           ))
    //         ) : (
    //           <TableRow>
    //             <TableCell colSpan={5} className="text-center text-muted-foreground">
    //               No recent orders found
    //             </TableCell>
    //           </TableRow>
    //         )}
    //       </TableBody>
    //     </Table>
    //   </CardContent>
    // </Card>
    <OrdersTable orders={orders}/>
  )
}
