"use client"

import type React from "react"

import { CheckCircle2, Circle, Clock, MapPin, Receipt, Utensils, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { OrderStatus } from "@/lib/generated/prisma"

interface OrderTimelineProps {
  currentStatus: OrderStatus
  orderDate: string
}

interface TimelineStage {
  id: OrderStatus | "placed"
  label: string
  icon: React.ReactNode
  description: string
  time?: string
}

export function OrderTimeline({ currentStatus, orderDate }: OrderTimelineProps) {
  // Helper to get random minutes between min and max
  const getRandomMinutes = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  // Create timestamps for each stage based on the order date
  const orderDateTime = new Date(orderDate)

  // Order placed time is the order date
  const placedTime = orderDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Add random minutes for each subsequent stage
  const preparingTime = new Date(orderDateTime.getTime() + getRandomMinutes(5, 10) * 60000)
  const readyTime = new Date(preparingTime.getTime() + getRandomMinutes(10, 20) * 60000)
  const outForDeliveryTime = new Date(readyTime.getTime() + getRandomMinutes(5, 10) * 60000)
  const deliveredTime = new Date(outForDeliveryTime.getTime() + getRandomMinutes(15, 30) * 60000)

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Define the timeline stages
  const stages: TimelineStage[] = [
    {
      id: "PENDING",
      label: "Order Placed",
      icon: <Receipt className="h-5 w-5" />,
      description: "Your order has been received by the restaurant.",
      time: placedTime,
    },
    {
      id: "CONFIRMED",
      label: "Preparing",
      icon: <Utensils className="h-5 w-5" />,
      description: "The restaurant is preparing your food.",
      time: formatTime(preparingTime),
    },
    {
      id: "IN_TRANSIT",
      label: "Out for Delivery",
      icon: <MapPin className="h-5 w-5" />,
      description: "Your order is on its way to you.",
      time: formatTime(outForDeliveryTime),
    },
    {
      id: "DELIVERED",
      label: "Delivered",
      icon: <CheckCircle2 className="h-5 w-5" />,
      description: "Your order has been delivered. Enjoy!",
      time: formatTime(deliveredTime),
    },
  ]

  // Determine the status of each stage
  const getStageStatus = (stageId: string) => {
    // Order of stages for comparison
    const stageOrder = ["PENDING", "CONFIRMED", "IN_TRANSIT", "DELIVERED"]
    const currentStageIndex = stageOrder.indexOf(currentStatus === "CANCELLED" ? "PENDING" : currentStatus)
    const stageIndex = stageOrder.indexOf(stageId)

    if (currentStatus === "CANCELLED" && stageId !== "PENDING") {
      return "cancelled"
    } else if (stageIndex < currentStageIndex || (stageIndex === currentStageIndex && currentStatus !== "CANCELLED")) {
      return "completed"
    } else if (stageIndex === currentStageIndex) {
      return "current"
    } else {
      return "upcoming"
    }
  }

  // Only show times for completed or current stages
  const shouldShowTime = (stageId: string) => {
    const status = getStageStatus(stageId)
    return status === "completed" || status === "current"
  }

  return (
    <div className="space-y-1">
      <h3 className="font-medium">Order Timeline</h3>
      <div className="relative mt-3 ml-2">
        {stages.map((stage, index) => {
          const stageStatus = getStageStatus(stage.id)
          const isLast = index === stages.length - 1

          return (
            <div key={stage.id} className="relative pb-8">
              {/* Vertical line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-2.5 top-5 h-full w-0.5 -ml-px",
                    stageStatus === "completed" || stageStatus === "current"
                      ? "bg-primary"
                      : stageStatus === "cancelled"
                        ? "bg-red-300"
                        : "bg-muted",
                  )}
                />
              )}

              <div className="relative flex items-start space-x-3">
                {/* Status icon */}
                <div>
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white",
                      stageStatus === "completed"
                        ? "bg-primary text-primary-foreground"
                        : stageStatus === "current"
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : stageStatus === "cancelled"
                            ? "bg-red-500 text-white"
                            : "bg-muted text-muted-foreground",
                    )}
                  >
                    {stageStatus === "completed" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : stageStatus === "current" ? (
                      <Clock className="h-3 w-3" />
                    ) : stageStatus === "cancelled" ? (
                      <X className="h-3 w-3" />
                    ) : (
                      <Circle className="h-3 w-3" />
                    )}
                  </div>
                </div>

                {/* Stage content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">
                    {stage.label}
                    {shouldShowTime(stage.id) && stage.time && (
                      <span className="ml-2 text-muted-foreground font-normal">{stage.time}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{stage.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
