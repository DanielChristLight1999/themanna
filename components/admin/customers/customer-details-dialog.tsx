"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Customer } from "@/lib/columns/customersTableColumn"
import { formatPrice } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, MailIcon, MapPinIcon, PhoneIcon, UserIcon } from "lucide-react"
import { OrdersTable } from "../orders/orders-table"
import useUIStore from "@/stores/uistore"

interface CustomerDetailsDialogProps {
  customer: Customer | null
}

export function CustomerDetailsDialog({ customer }: CustomerDetailsDialogProps) {
  const setOpen = useUIStore((state) => state.setIsCustomerDialogOpen)
  const open = useUIStore((state) => state.isCustomerDialogOpen)
  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl flex flex-col h-5/6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>View and manage customer information</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full h-full">
          <TabsList className="w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Personal Information</h3>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col gap-4">
                      {customer.addresses.length > 0 ? customer.addresses.map((address, index) => (
                        <div
                          key={address.id}
                          className="bg-muted p-3 rounded-md shadow-sm space-y-1"
                        >
                          <div className="text-sm font-medium">{address.label}</div>
                          <div className="text-sm text-muted-foreground">{address.street}</div>
                          <div className="text-sm text-muted-foreground">{address.city}, {address.state} {address.postalCode}</div>
                          {index !== customer.addresses.length - 1 && <Separator className="my-2" />}
                        </div>
                      )) : (
                        <span className="text-muted-foreground">No addresses available</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Joined on {format(new Date(customer.joinDate), "dd/MM/yyyy")}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Account Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-lg font-medium">{customer.totalOrders}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-lg font-medium">{formatPrice(customer.totalSpent)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Last Order</p>
                    <p className="text-lg font-medium">{customer.lastOrder ? format(new Date(customer.lastOrder), "dd/MM/yyyy") : "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-lg font-medium">{customer.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="pt-4">
            <OrdersTable forceMobile={true} orders={customer?.orders || []} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
