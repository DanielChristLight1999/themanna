"use client"

import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardIcon, MapPinIcon, PhoneIcon, PrinterIcon, UserIcon } from "lucide-react"
import { Order } from "@/lib/columns/ordersTableColumn"
import { format } from "date-fns"
import { extractorderId, formatPrice } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { updateOrderStatus } from "@/actions/admin/order-actions"
import { OrderStatus } from "@/lib/generated/prisma"
import { usePrintContext } from "@/lib/usecontext.tsx/print-context"
import { useReactToPrint } from "react-to-print";
import { useCopyToClipboard } from "usehooks-ts"

interface OrderDetailsDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "PENDING":
      return "secondary"
    case "CONFIRMED":
      return "outline"
    case "IN_TRANSIT":
      return "default"
    case "DELIVERED":
      return "outline"
    case "CANCELLED":
      return "destructive"
    default:
      return "outline"
  }
}
const orderSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "IN_TRANSIT",
    "DELIVERED",
    "CANCELLED"
  ]),
})
export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {

  const { contentRef } = usePrintContext();
  const reactToPrintFn = useReactToPrint({ contentRef });
  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      status: order?.status,
    },
  })
  const [clipboardText, setClipboardText] = useCopyToClipboard()
  const handleCopyToClipboard = async (text: string) => {
   const success = await setClipboardText(text)
   if(success){
     toast.success("Copied to clipboard")
   } else {
     toast.error("Failed to copy to clipboard")
   }
  }
  const handleUpdateStatus = async (data: z.infer<typeof orderSchema>) => {
    // Handle status update logic here
    const response = await updateOrderStatus(order?.id as string, data.status as OrderStatus)
    if (response.error) {
      toast.error(response.message)
    } else {
      toast.success(`Order status updated to ${data.status}`)
    }
  }
  if (!order) return null


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order ORD-{extractorderId(order.id as string)}</span>
            <Badge variant={getStatusBadgeVariant(order.status)}>{order.status.replace("_", " ")}</Badge>
          </DialogTitle>
          <DialogDescription className="uppercase text-left">
            {format(order.date, "dd/MM/yyyy HH:mm")} · {order.type} Order
          </DialogDescription>
        </DialogHeader>

        <div ref={contentRef} className="grid gap-6">
          <div className="grid gap-3">
            <div className="text-sm font-medium">Customer Information</div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer}</span>
              </div>
              {order.phone ? (
                <div className="flex items-center gap-2 text-sm">
                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{order.phone}</span>
                </div>
              ) : ""}
              <div className="flex items-start gap-2 text-sm">
                <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{order.address}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <div className="text-sm font-medium">Order Items</div>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{item.quantity}x</span> {item.name}
                  </div>
                  <div>{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <div className="text-sm font-medium">Payment Details</div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(order.total - (order.deliveryFee || 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>{formatPrice(order.deliveryFee || 0)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Payment Method</span>
                <span>{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="print:hidden grid gap-3">
            <div className="text-sm font-medium">Update Order Status</div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateStatus)} className="flex w-full gap-2">
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={order.status}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                          <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                          <SelectItem value="DELIVERED">Delivered</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button>Update</Button>
              </form>
            </Form>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => reactToPrintFn()} variant="outline" className="flex-1 gap-2">
            <PrinterIcon className="h-4 w-4" />
            Print Receipt
          </Button>
          <Button onClick={async () => await handleCopyToClipboard(order?.id as string)} variant="outline" className="flex-1 gap-2">
            <ClipboardIcon className="h-4 w-4" />
            Copy Order ID
          </Button>
          <Button onClick={() => onOpenChange(false)} className="flex-1">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
