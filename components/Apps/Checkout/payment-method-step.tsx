"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CreditCard, Landmark, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCheckoutStore } from "@/stores/checkoutstore"
import { initializePayment } from "@/actions/paymentactions"
import useCartStore from "@/stores/cartstore"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const paymentSchema = z.object({
  paymentMethod: z.enum(["paystack", "bank-transfer"], {
    required_error: "Please select a payment method",
  }),
})

export default function PaymentMethodStep() {
  const [isProcessing, setIsProcessing] = useState(false)
  const prevStep = useCheckoutStore((state) => state.prevStep)
  const setPaymentMethod = useCheckoutStore((state) => state.setPaymentMethod)
  const selectedAddressId = useCheckoutStore((state) => state.selectedAddressId)
  const subtotal = useCartStore((state) => state.getSubtotal())
  const total = useCheckoutStore((state) => state.getTotal(subtotal))
  const orderNote = useCheckoutStore((state) => state.orderNote)
  const deliveryFee = useCheckoutStore((state) => state.getDeliveryFee())
  const router = useRouter()


  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "paystack",
    },
  })

  const onSubmit = async (data: z.infer<typeof paymentSchema>) => {
    setIsProcessing(true)
    setPaymentMethod(data.paymentMethod)

    try {
      // For Paystack, we would normally initialize the payment here
      if (data.paymentMethod === "paystack") {
        const orderData = {
            amount: total,
            selectedAddressId: selectedAddressId,
            paymentMethod: data.paymentMethod,
            orderNote: orderNote,
            deliveryFee: deliveryFee,
        }
        const payment = await initializePayment(orderData);
        if (payment.error){
            toast.error(payment.message)
            return
        }
        toast.success(payment.message)
        router.replace(payment.url)

      }

    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Choose how you want to pay for your order</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                        <div className="flex items-center space-x-2 border rounded-md p-4">
                          <RadioGroupItem value="paystack" id="paystack" />
                          <div className="grid gap-1 flex-1">
                            <Label htmlFor="paystack" className="font-medium">
                              Pay with Paystack
                            </Label>
                            <p className="text-sm text-muted-foreground">Pay securely with your credit/debit card</p>
                          </div>
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="flex items-center space-x-2 border rounded-md p-4">
                          <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                          <div className="grid gap-1 flex-1">
                            <Label htmlFor="bank-transfer" className="font-medium">
                              Bank Transfer
                            </Label>
                            <p className="text-sm text-muted-foreground">Make a transfer to our bank account</p>
                          </div>
                          <Landmark className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("paymentMethod") === "bank-transfer" && (
                <Alert>
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Bank Transfer Details:</p>
                      <div className="text-sm space-y-1">
                        <p>Bank Name: First Bank of Nigeria</p>
                        <p>Account Name: Food Delivery Ltd</p>
                        <p>Account Number: 1234567890</p>
                        <p>Reference: Your phone number</p>
                      </div>
                      <Separator className="my-2" />
                      <p className="text-sm">
                        Please note that your order will be processed after we confirm your payment. This may take up to
                        30 minutes during business hours.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex lg:flex-row flex-col gap-4 mt-4 w-full  lg:justify-between">
              <Button className="w-full h-12" variant="outline" type="button" onClick={prevStep} disabled={isProcessing}>
                Back
              </Button>
              <Button className="w-full h-12" type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : form.watch("paymentMethod") === "paystack" ? (
                  "Pay Now"
                ) : (
                  "Complete Order"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
