"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Receipt, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { OrderTimeline } from "./order-timeline"
import { OrderStatus } from "@/lib/generated/prisma"
import { format } from "date-fns"

interface TrackOrderModalProps {
    isOpen: boolean
    onClose: () => void
    orderNumber: string
    orderDate: string
    status: OrderStatus
    estimatedDelivery?: string
    deliveryEnd: Date
    deliveryAddress: string
    //   restaurantName: string
}

export function TrackOrderModal({
    isOpen,
    onClose,
    orderNumber,
    orderDate,
    status,
    estimatedDelivery,
    deliveryAddress,
    deliveryEnd,
    //   restaurantName,
}: TrackOrderModalProps) {
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(status)

    // Simulate real-time updates for demo purposes
    useEffect(() => {
        // Only simulate updates if the order is not delivered or cancelled
        if (status !== "DELIVERED" && status !== "CANCELLED") {
            const timer = setTimeout(() => {
                // Simulate status progression
                if (currentStatus === "CONFIRMED") {
                    setCurrentStatus("CONFIRMED")
                } else if (currentStatus === "IN_TRANSIT") {
                    setCurrentStatus("IN_TRANSIT")
                } else if (currentStatus === "DELIVERED") {
                    setCurrentStatus("DELIVERED")
                }
            }, 15000) // Update every 15 seconds for demo

            return () => clearTimeout(timer)
        }
    }, [currentStatus, status])

    // Format date for display
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Format time for display
    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    // Get status badge color
    //   const getStatusColor = (status: OrderStatus) => {
    //     switch (status) {
    //       case "preparing":
    //         return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    //       case "ready":
    //         return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    //       case "out-for-delivery":
    //         return "bg-purple-100 text-purple-800 hover:bg-purple-100"
    //       case "delivered":
    //         return "bg-green-100 text-green-800 hover:bg-green-100"
    //       case "cancelled":
    //         return "bg-red-100 text-red-800 hover:bg-red-100"
    //       default:
    //         return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    //     }
    //   }
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
    //   const getStatusText = (status: OrderStatus) => {
    //     switch (status) {
    //       case "preparing":
    //         return "Preparing"
    //       case "ready":
    //         return "Ready for Pickup"
    //       case "out-for-delivery":
    //         return "Out for Delivery"
    //       case "delivered":
    //         return "Delivered"
    //       case "cancelled":
    //         return "Cancelled"
    //       default:
    //         return status
    //     }
    //   }

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

    // Calculate estimated time remaining
    //   const getTimeRemaining = () => {
    //     if (!estimatedDelivery || currentStatus === "DELIVERED" || currentStatus === "CANCELLED") {
    //       return null
    //     }

    //     const now = new Date()
    //     const estimatedTime = new Date()
    //     const [hours, minutes] = estimatedDelivery.split(":").map(Number)

    //     estimatedTime.setHours(hours, minutes)

    //     // If estimated time is in the past, return 0
    //     if (estimatedTime < now) {
    //       return "Arriving soon"
    //     }

    //     const diffMs = estimatedTime.getTime() - now.getTime()
    //     const diffMins = Math.round(diffMs / 60000)

    //     if (diffMins < 1) {
    //       return "Arriving now"
    //     } else if (diffMins === 1) {
    //       return "1 minute"
    //     } else if (diffMins < 60) {
    //       return `${diffMins} minutes`
    //     } else {
    //       const hours = Math.floor(diffMins / 60)
    //       const mins = diffMins % 60
    //       return `${hours} hr${hours > 1 ? "s" : ""} ${mins > 0 ? `${mins} min${mins > 1 ? "s" : ""}` : ""}`
    //     }
    //   }

    // const getTimeRemaining = () => {
    //     if (!estimatedDelivery || currentStatus === "DELIVERED" || currentStatus === "CANCELLED") {
    //         return null;
    //     }

    //     const now = new Date();

    //     // Extract the second time from the range "9:15 AM - 9:30 AM"
    //     const endTimeStr = estimatedDelivery.split(" - ")[1];
    //     if (!endTimeStr) return null;

    //     const estimatedTime = new Date();
    //     const [time, modifier] = endTimeStr.split(" ");
    //     const [hoursStr, minutesStr] = time.split(":");

    //     let hours = parseInt(hoursStr, 10);
    //     const minutes = parseInt(minutesStr, 10);

    //     if (modifier === "PM" && hours < 12) hours += 12;
    //     if (modifier === "AM" && hours === 12) hours = 0;

    //     estimatedTime.setHours(hours, minutes, 0, 0);

    //     if (estimatedTime < now) {
    //         return "Arriving soon";
    //     }

    //     const diffMs = estimatedTime.getTime() - now.getTime();
    //     const diffMins = Math.round(diffMs / 60000);

    //     if (diffMins < 1) {
    //         return "Arriving now";
    //     } else if (diffMins === 1) {
    //         return "1 minute";
    //     } else if (diffMins < 60) {
    //         return `${diffMins} minutes`;
    //     } else {
    //         const hrs = Math.floor(diffMins / 60);
    //         const mins = diffMins % 60;
    //         return `${hrs} hr${hrs > 1 ? "s" : ""}${mins > 0 ? ` ${mins} min${mins > 1 ? "s" : ""}` : ""}`;
    //     }
    // };


    const getTimeRemaining = () => {
        if (!deliveryEnd || currentStatus === "DELIVERED" || currentStatus === "CANCELLED") {
            return null;
        }

        const now = new Date();

        if (deliveryEnd < now) {
            return "Arriving soon";
        }

        const diffMs = deliveryEnd.getTime() - now.getTime();
        const diffMins = Math.round(diffMs / 60000);

        if (diffMins < 1) {
            return "Arriving now";
        } else if (diffMins === 1) {
            return "1 minute";
        } else if (diffMins < 60) {
            return `${diffMins} minutes`;
        } else {
            const hrs = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            return `${hrs} hr${hrs > 1 ? "s" : ""}${mins > 0 ? ` ${mins} min${mins > 1 ? "s" : ""}` : ""}`;
        }
    };




    const timeRemaining = getTimeRemaining()

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md md:max-w-lg max-h-[90vh] overflow-auto">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <DialogTitle>Track Order #{orderNumber}</DialogTitle>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="text-sm text-muted-foreground">
                            {format(new Date(orderDate), "PPP")} at {format(new Date(orderDate), "p")}
                        </div>

                        <Badge variant="outline" className={cn("font-normal", getStatusColor(currentStatus))}>
                            {getStatusText(currentStatus)}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-2">
                    {/* Estimated delivery time */}
                    {currentStatus !== "DELIVERED" && currentStatus !== "CANCELLED" && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                            <h3 className="font-medium">Estimated Delivery</h3>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div className="text-sm">
                                    {estimatedDelivery && (
                                        <span>
                                            {estimatedDelivery} {`(${timeRemaining})`}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order timeline */}
                    <OrderTimeline currentStatus={currentStatus} orderDate={orderDate} />

                    <Separator />

                    {/* Order details */}
                    <div className="space-y-4">
                        {/* <div className="space-y-1">
              <h3 className="text-sm font-medium">Restaurant</h3>
              <p className="text-sm text-muted-foreground">{restaurantName}</p>
            </div> */}

                        <div className="space-y-1">
                            <h3 className="text-sm font-medium">Delivery Address</h3>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-muted-foreground">{deliveryAddress}</p>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Receipt className="h-4 w-4" />
                                View Order Details
                            </Button>


                            {currentStatus !== "DELIVERED" && currentStatus !== "CANCELLED" && (
                                <Button variant="outline" size="sm">
                                    Contact Support
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
