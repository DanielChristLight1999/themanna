"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PlayIcon, PauseIcon, MonitorStopIcon as StopIcon, UserIcon, ClockIcon } from "lucide-react"
import { PosProductSearch } from "./pos-product-search"
import { PosCart } from "./pos-cart"
import { PosPayment } from "./pos-payment"
import { PosSessionDialog } from "./pos-session-dialog"
import { PosReceiptDialog } from "./pos-receipt-dialog"
import { toast } from "sonner"

interface PosSession {
  id: string
  cashier: string
  startTime: string
  status: "ACTIVE" | "PAUSED" | "CLOSED"
  totalSales: number
  totalOrders: number
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  image?: string
}

interface Transaction {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  timestamp: string
}

export function PosInterface() {
  const [currentSession, setCurrentSession] = useState<PosSession | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null)
  const [sessionTime, setSessionTime] = useState(0)

  // Timer for session duration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (currentSession?.status === "ACTIVE") {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [currentSession?.status])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startSession = (cashierName: string) => {
    const newSession: PosSession = {
      id: `POS-${Date.now()}`,
      cashier: cashierName,
      startTime: new Date().toISOString(),
      status: "ACTIVE",
      totalSales: 0,
      totalOrders: 0,
    }
    setCurrentSession(newSession)
    setSessionTime(0)
    toast.message("Session Started", {
      description: `POS session started for ${cashierName}`,
    })
  }

  const pauseSession = () => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, status: "PAUSED" })
      toast.message("Session Paused", {
        description: "POS session has been paused",
      })
    }
  }

  const resumeSession = () => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, status: "ACTIVE" })
      toast.message("Session Resumed", {
        description: "POS session has been resumed",
      })
    }
  }

  const endSession = () => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, status: "CLOSED" })
      toast.message("Session Ended", {
        description: `Session ended. Total sales: ₦${currentSession.totalSales.toLocaleString()}`,
      })
      // Reset everything
      setTimeout(() => {
        setCurrentSession(null)
        setCartItems([])
        setSessionTime(0)
      }, 2000)
    }
  }

  const addToCart = (product: any) => {
    const existingItem = cartItems.find((item) => item.id === product.id)
    if (existingItem) {
      setCartItems(cartItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          category: product.category,
          image: product.image,
        },
      ])
    }
  }

  const updateCartItem = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== id))
    } else {
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const processPayment = (paymentData: any) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.075 // 7.5% tax
    const discount = paymentData.discount || 0
    const total = subtotal + tax - discount

    const transaction: Transaction = {
      id: `TXN-${Date.now()}`,
      items: [...cartItems],
      subtotal,
      tax,
      discount,
      total,
      paymentMethod: paymentData.method,
      timestamp: new Date().toISOString(),
    }

    // Update session
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        totalSales: currentSession.totalSales + total,
        totalOrders: currentSession.totalOrders + 1,
      })
    }

    setLastTransaction(transaction)
    setCartItems([])
    setIsPaymentOpen(false)
    setIsReceiptOpen(true)

    toast.success(`Transaction completed successfully. Total: ₦${total.toLocaleString()}`)
  }

  if (!currentSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Start POS Session</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">Start a new POS session to begin processing transactions</p>
            <Button onClick={() => setIsSessionDialogOpen(true)} size="lg" className="w-full">
              <PlayIcon className="mr-2 h-5 w-5" />
              Start New Session
            </Button>
          </CardContent>
        </Card>

        <PosSessionDialog
          open={isSessionDialogOpen}
          onOpenChange={setIsSessionDialogOpen}
          onStartSession={startSession}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              <span className="font-medium">{currentSession.cashier}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              <span className="font-mono">{formatTime(sessionTime)}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Badge variant={currentSession.status === "ACTIVE" ? "default" : "secondary"}>
              {currentSession.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right mr-4">
              <div className="text-sm text-muted-foreground">Session Sales</div>
              <div className="font-bold">₦{currentSession.totalSales.toLocaleString()}</div>
            </div>
            {currentSession.status === "ACTIVE" ? (
              <Button variant="outline" onClick={pauseSession}>
                <PauseIcon className="mr-2 h-4 w-4" />
                Pause
              </Button>
            ) : (
              <Button variant="outline" onClick={resumeSession}>
                <PlayIcon className="mr-2 h-4 w-4" />
                Resume
              </Button>
            )}
            <Button variant="destructive" onClick={endSession}>
              <StopIcon className="mr-2 h-4 w-4" />
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Product Search */}
        <div className="flex-1 p-4 overflow-auto">
          <PosProductSearch onAddToCart={addToCart} disabled={currentSession.status !== "ACTIVE"} />
        </div>

        {/* Right Panel - Cart */}
        <div className="w-96 border-l bg-card">
          <PosCart
            items={cartItems}
            onUpdateItem={updateCartItem}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            onCheckout={() => setIsPaymentOpen(true)}
            disabled={currentSession.status !== "ACTIVE"}
          />
        </div>
      </div>

      {/* Payment Dialog */}
      <PosPayment
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        cartItems={cartItems}
        onProcessPayment={processPayment}
      />

      {/* Receipt Dialog */}
      <PosReceiptDialog
        open={isReceiptOpen}
        onOpenChange={setIsReceiptOpen}
        transaction={lastTransaction}
        session={currentSession}
      />
    </div>
  )
}
