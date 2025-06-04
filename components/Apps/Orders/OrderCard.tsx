"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { OrderStatus, PaymentMethod } from '@/lib/generated/prisma'
import { cn, estimatedDeliveryTime, extractorderId, formatPrice } from '@/lib/utils'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react'
import { useState } from 'react'
import { TrackOrderModal } from './TrackOrderModal'

export interface OrderCardProps {
    id: string
    status: OrderStatus
    placedAt: Date
    totalAmount: number
    address: {
        label: string
        street: string
        city: string
        state: string
        postalCode: string | null
    } | null
    deliveryFee: number | null
    payment: {
        method: PaymentMethod
    } | null
    items: {
        product: {
            name: string
        }
        quantity: number,
        unitPrice: number
    }[]
}
const OrderCard = ({ order }: { order: OrderCardProps }) => {
    const [expanded, setExpanded] = useState(false)
    const [isTrackingOpen, setIsTrackingOpen] = useState(false)



    // Get status badge color
    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            case "CONFIRMED":
                return "bg-blue-100 text-blue-800 hover:bg-blue-100"
            case "IN_TRANSIT":
                return "bg-purple-100 text-purple-800 hover:bg-purple-100"
            case "DELIVERED":
                return "bg-green-100 text-green-800 hover:bg-green-100"
            case "CANCELLED":
                return "bg-red-100 text-red-800 hover:bg-red-100"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
    }

    // Get status text
    const getStatusText = (status: OrderStatus) => {
        switch (status) {
            case "PENDING":
                return "Confirming"
            case "CONFIRMED":
                return "Preparing Order"
            case "IN_TRANSIT":
                return "Out for Delivery"
            case "DELIVERED":
                return "Delivered"
            case "CANCELLED":
                return "Cancelled"
            default:
                return status
        }
    }
    const deliveryEnd = new Date(order.placedAt.getTime() + 45 * 60000)
    const estimatedDelivery = `${format(deliveryEnd, "p")} - ${format(new Date(deliveryEnd.getTime() + 15 * 60000), "p")}`
    return (
        <div>
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    {/* Order header */}
                    <div className="bg-muted/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium">Order #{extractorderId(order.id as string)}</h3>
                                <Badge variant="outline" className={cn("text-xs", getStatusColor(OrderStatus.CONFIRMED))}>
                                    {getStatusText(OrderStatus.CONFIRMED)}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {format(order.placedAt, "PPP")} at {format(order.placedAt, "p")}
                            </p>
                        </div>

                        <div className="flex flex-col-reverse md:flex-row md:items-center gap-3">

                            <div className="flex items-center gap-1 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Est. delivery: {estimatedDelivery}</span>
                            </div>

                            <div className="font-medium">{formatPrice(order.totalAmount)}</div>
                        </div>
                    </div>

                    {/* Order items (collapsed) */}

                    {!expanded ? <div className="px-4 pb-2">
                        <p className="text-sm text-muted-foreground truncate">
                            {order.items
                                .slice(0, 2)
                                .map((item) => `${item.quantity}× ${item.product.name}`)
                                .join(", ")}
                            {order.items.length > 2 && `, +${order.items.length - 2} more`}
                        </p>
                    </div> : ""}


                    {/* Expanded content */}
                    {expanded ?
                        <div className="px-4 py-2 space-y-4">
                            {/* Order items (expanded) */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Order Items</h4>
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <div>
                                            <span className="font-medium">
                                                {item.quantity}× {item.product.name}
                                            </span>
                                            {/* {item.options && item.options.length > 0 && (
                                                <p className="text-xs text-muted-foreground">{item.options.join(", ")}</p>
                                            )} */}
                                        </div>
                                        <div>{formatPrice(item.unitPrice * item.quantity)}</div>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            {/* Delivery address */}
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium">Delivery Address</h4>
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-muted-foreground">{order.address?.label}</p>
                                        <p className="text-muted-foreground">{order.address?.street}</p>
                                        <p className="text-muted-foreground">
                                            {order.address?.city}, {order.address?.state} {order.address?.postalCode || ""}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order summary */}
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium">Order Summary</h4>
                                <div className="space-y-1 text-sm">
                                    {/* <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>₦{order.subtotal.toLocaleString()}</span>
                                    </div> */}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery Fee</span>
                                        <span>{formatPrice(order?.deliveryFee || 0)}</span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                        <span>Total</span>
                                        <span>{formatPrice(order.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment method */}
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium">Payment Method</h4>
                                <p className="text-sm text-muted-foreground">{order.payment?.method}</p>
                            </div>
                        </div>
                        : ""}
                </CardContent>

                <CardFooter className="flex justify-between p-4 pt-2 border-t">
                    {order.status === "PENDING" || order.status === "IN_TRANSIT" || order.status === "CONFIRMED" ? (
                        <Button onClick={() => setIsTrackingOpen(true)} variant="outline" size="sm">
                            Track Order
                        </Button>
                    ) : ""}

                    {order.status === "DELIVERED" ? (
                        <Button variant="outline" size="sm">
                            Reorder
                        </Button>
                    ) : ""}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => setExpanded(!expanded)}
                        aria-expanded={expanded}
                        aria-label={expanded ? "Show less" : "Show more"}
                    >
                        {expanded ? (
                            <>
                                <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4 mr-1" /> Show More
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
            {/* Track Order Modal */}
            <TrackOrderModal
                isOpen={isTrackingOpen}
                onClose={() => setIsTrackingOpen(false)}
                orderNumber={extractorderId(order.id as string) as string}
                orderDate={order.placedAt.toString()}
                status={order.status}
                estimatedDelivery={estimatedDelivery}
                deliveryEnd={deliveryEnd}
                deliveryAddress={order.address?.street as string}
            />
        </div >
    )
}

export default OrderCard