"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MapPin, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCheckoutStore } from "@/stores/checkoutstore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import useUIStore from "@/stores/uistore"
import { toast } from "sonner"

const deliverySchema = z.object({
  addressId: z.string({
    required_error: "Please select a delivery address",
  }),
  orderNote: z.string().optional(),
})

export default function DeliveryAddressStep() {
    const nextStep = useCheckoutStore((state) => state.nextStep)
    const selectedAddressId = useCheckoutStore((state) => state.selectedAddressId)
    const setSelectedAddressId = useCheckoutStore((state) => state.setSelectedAddressId)
    const userAddresses = useCheckoutStore((state) => state.userAddresses)
    const setOrderNote = useCheckoutStore((state) => state.setOrderNote)
    const orderNote = useCheckoutStore((state) => state.orderNote)
    const getselectedAddresses = useCheckoutStore((state) => state.getuserAddresses)
    const setIsNewAddressDialogOpen = useUIStore((state) => state.setIsNewAddressDialogOpen)
    const router = useRouter()

  useEffect(() => { getselectedAddresses() }, [getselectedAddresses])

  const form = useForm<z.infer<typeof deliverySchema>>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      addressId: selectedAddressId || "",
      orderNote: orderNote || "",
    },
  })

  const handleBacktoCart = () => {
    router.back()
  }

  const onSubmit = (data: z.infer<typeof deliverySchema>) => {
    if(!data.addressId){
      toast.error("Please select a delivery address")
      return
    }
    setSelectedAddressId(data.addressId)
    setOrderNote(data.orderNote || "")
    nextStep()
  }

  // Find the selected address details
  const selectedAddress = userAddresses.find((addr) => addr.id === form.watch("addressId"))

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Address</CardTitle>
          <CardDescription>Select where you want your food delivered</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="addressId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Address</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a delivery address" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userAddresses.map((address) => (
                          <SelectItem key={address.id} value={address.id}>
                            {address.label} {address.isDefault && "(Default)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedAddress && (
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{selectedAddress.label}</p>
                      <p className="text-sm text-muted-foreground">{selectedAddress.street}</p>
                      {/* {selectedAddress.apartment && (
                        <p className="text-sm text-muted-foreground">{selectedAddress.apartment}</p>
                      )} */}
                      <p className="text-sm text-muted-foreground">
                        {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setIsNewAddressDialogOpen(true)} variant="outline" size="sm" type="button" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add New Address
                </Button>
              </div>

              <FormField
                control={form.control}
                name="orderNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Instructions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., Ring the doorbell, call when nearby, etc."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex mt-4 w-full gap-2 lg:flex-row flex-col lg:justify-between">
              <Button className="w-full h-12 lg:w-auto" type="button" variant="outline"  onClick={handleBacktoCart}>
                Back to Cart
              </Button>
              <Button className="w-full h-12 lg:w-auto" type="submit">Continue to Payment</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
