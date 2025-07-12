"use client"

import { OrderDetailsDialog } from "./order-details-dialog"
import { DataTable } from "../common/data-table"
import { Order, ordersTableColumn } from "@/lib/columns/ordersTableColumn"
import useUIStore from "@/stores/uistore"
import { CustomerOrder } from "@/lib/getData"


export function OrdersTable({orders, forceMobile}: {orders: CustomerOrder[], forceMobile?: boolean}) {

  const selectedOrder = useUIStore((state) => state.selectedOrder)
  const isDetailsOpen = useUIStore((state) => state.isOrderDetailsDialogOpen)
  const setIsDetailsOpen = useUIStore((state) => state.setIsOrderDetailsDialogOpen)

  return (
    <div className=" h-full">
      <DataTable forceMobile={forceMobile} columns={ordersTableColumn} data={orders} />
      {/* <Card>
        <CardContent className="p-0">
          <DataTable data={orders} columns={ordersTableColumn} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-xs text-muted-foreground">{order.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>{order.status.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell className="text-right">₦{order.total.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(order)}>
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                          <DropdownMenuItem>Contact Customer</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}

      <OrderDetailsDialog order={selectedOrder} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
    </div>
  )
}
