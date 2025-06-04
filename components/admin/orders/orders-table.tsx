"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { OrderDetailsDialog } from "./order-details-dialog"
import { DataTable } from "../common/data-table"
import { Order, ordersTableColumn } from "@/lib/columns/ordersTableColumn"
import useUIStore from "@/stores/uistore"

// Mock data - would be replaced with actual data from API
// const orders = [
//   {
//     id: "ORD-001",
//     customer: "John Doe",
//     phone: "+234 812 345 6789",
//     date: "2023-05-22 14:30",
//     total: 2450,
//     status: "DELIVERED",
//     paymentMethod: "CARD",
//     type: "ONLINE",
//     items: [
//       { name: "Jollof Rice Special", quantity: 1, price: 1500 },
//       { name: "Suya Platter", quantity: 1, price: 950 },
//     ],
//     address: "123 Lagos Street, Ikeja, Lagos",
//   },
//   {
//     id: "ORD-002",
//     customer: "Jane Smith",
//     phone: "+234 803 456 7890",
//     date: "2023-05-22 13:45",
//     total: 1850,
//     status: "IN_TRANSIT",
//     paymentMethod: "CARD",
//     type: "ONLINE",
//     items: [{ name: "Egusi Soup & Pounded Yam", quantity: 1, price: 1850 }],
//     address: "45 Abuja Road, Wuse, Abuja",
//   },
//   {
//     id: "ORD-003",
//     customer: "POS Sale",
//     phone: "N/A",
//     date: "2023-05-22 13:15",
//     total: 750,
//     status: "COMPLETED",
//     paymentMethod: "CASH",
//     type: "POS",
//     items: [{ name: "Pepper Soup", quantity: 1, price: 750 }],
//     address: "In-store",
//   },
//   {
//     id: "ORD-004",
//     customer: "Mike Johnson",
//     phone: "+234 705 678 9012",
//     date: "2023-05-22 12:30",
//     total: 1200,
//     status: "CONFIRMED",
//     paymentMethod: "TRANSFER",
//     type: "PICKUP",
//     items: [
//       { name: "Moin Moin Deluxe", quantity: 1, price: 800 },
//       { name: "Chapman", quantity: 1, price: 400 },
//     ],
//     address: "Pickup in-store",
//   },
//   {
//     id: "ORD-005",
//     customer: "Sarah Williams",
//     phone: "+234 908 765 4321",
//     date: "2023-05-22 11:45",
//     total: 3200,
//     status: "PENDING",
//     paymentMethod: "CARD",
//     type: "ONLINE",
//     items: [
//       { name: "Jollof Rice Special", quantity: 1, price: 1500 },
//       { name: "Suya Platter", quantity: 1, price: 950 },
//       { name: "Chapman", quantity: 2, price: 750 },
//     ],
//     address: "78 Port Harcourt Road, GRA, Port Harcourt",
//   },
//   {
//     id: "ORD-006",
//     customer: "David Okafor",
//     phone: "+234 812 345 6789",
//     date: "2023-05-22 10:30",
//     total: 2100,
//     status: "DELIVERED",
//     paymentMethod: "CARD",
//     type: "ONLINE",
//     items: [
//       { name: "Egusi Soup & Pounded Yam", quantity: 1, price: 1850 },
//       { name: "Water", quantity: 1, price: 250 },
//     ],
//     address: "15 Enugu Street, Independence Layout, Enugu",
//   },
//   {
//     id: "ORD-007",
//     customer: "POS Sale",
//     phone: "N/A",
//     date: "2023-05-22 10:15",
//     total: 2250,
//     status: "COMPLETED",
//     paymentMethod: "POS",
//     type: "POS",
//     items: [
//       { name: "Jollof Rice Special", quantity: 1, price: 1500 },
//       { name: "Chapman", quantity: 1, price: 750 },
//     ],
//     address: "In-store",
//   },
// ]

// const getStatusBadgeVariant = (status: string) => {
//   switch (status) {
//     case "PENDING":
//       return "secondary"
//     case "CONFIRMED":
//       return "outline"
//     case "IN_TRANSIT":
//       return "default"
//     case "DELIVERED":
//     case "COMPLETED":
//       return "success"
//     case "CANCELLED":
//       return "destructive"
//     default:
//       return "outline"
//   }
// }

export function OrdersTable({orders, forceMobile}: {orders: Order[], forceMobile?: boolean}) {

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
