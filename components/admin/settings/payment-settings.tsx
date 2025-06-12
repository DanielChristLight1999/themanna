"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PaymentSettingsType, updatePaymentSettings } from "@/actions/admin/settings-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import AuthButton from "@/components/Apps/common/AuthButton"

const schema = z.object({
  enableOnlinePayments: z.boolean(),
  enableCashPayments: z.boolean(),
  enableTransferPayments: z.boolean(),
  taxRate: z.coerce.number().min(0),
  serviceCharge: z.coerce.number().min(0),
})

type FormValues = z.infer<typeof schema>

export function PaymentSettings({ initialSettings }: { initialSettings?: PaymentSettingsType }) {
  // const [paymentSettings, setPaymentSettings] = useState({
  //   enableOnlinePayments: true,
  //   enableCashPayments: true,
  //   enableTransferPayments: true,
  //   taxRate: 7.5,
  //   serviceCharge: 5,
  // })
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialSettings || {
      enableOnlinePayments: true,
      enableCashPayments: true,
      enableTransferPayments: true,
      taxRate: 7.5,
      serviceCharge: 5,
    },
  })

  const onSubmit = async (values: FormValues) => {
    const response = await updatePaymentSettings(values)
    if (response.error) {
      toast.error(response.message)
      return
    }
    toast.success("Payment settings updated")
    router.refresh()
  }

  return (
    // <div className="space-y-6">
    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Payment Methods</CardTitle>
    //       <CardDescription>Configure which payment methods are available to customers</CardDescription>
    //     </CardHeader>
    //     <CardContent className="space-y-6">
    //       <div className="flex items-center justify-between">
    //         <div className="space-y-0.5">
    //           <Label htmlFor="enable-online">Online Payments</Label>
    //           <p className="text-sm text-muted-foreground">Allow customers to pay online via card or bank transfer</p>
    //         </div>
    //         <Switch
    //           id="enable-online"
    //           checked={paymentSettings.enableOnlinePayments}
    //           onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableOnlinePayments: checked })}
    //         />
    //       </div>

    //       <div className="flex items-center justify-between">
    //         <div className="space-y-0.5">
    //           <Label htmlFor="enable-cash">Cash on Delivery</Label>
    //           <p className="text-sm text-muted-foreground">Allow customers to pay with cash upon delivery</p>
    //         </div>
    //         <Switch
    //           id="enable-cash"
    //           checked={paymentSettings.enableCashPayments}
    //           onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableCashPayments: checked })}
    //         />
    //       </div>

    //       <div className="flex items-center justify-between">
    //         <div className="space-y-0.5">
    //           <Label htmlFor="enable-transfer">Bank Transfer</Label>
    //           <p className="text-sm text-muted-foreground">Allow customers to pay via bank transfer</p>
    //         </div>
    //         <Switch
    //           id="enable-transfer"
    //           checked={paymentSettings.enableTransferPayments}
    //           onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableTransferPayments: checked })}
    //         />
    //       </div>
    //     </CardContent>
    //     <CardFooter>
    //       <Button disabled={isSaving} onClick={handleSave}>
    //         {isSaving ? <Loader2 className="animate-spin mr-2" /> : "Save Changes"}
    //       </Button>
    //     </CardFooter>
    //   </Card>

    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Tax & Fees</CardTitle>
    //       <CardDescription>Configure tax rates and service charges</CardDescription>
    //     </CardHeader>
    //     <CardContent className="space-y-6">
    //       <div className="grid gap-4 sm:grid-cols-2">
    //         <div className="space-y-2">
    //           <Label htmlFor="tax-rate">Tax Rate (%)</Label>
    //           <Input
    //             id="tax-rate"
    //             type="number"
    //             value={paymentSettings.taxRate}
    //             onChange={(e) =>
    //               setPaymentSettings({
    //                 ...paymentSettings,
    //                 taxRate: Number.parseFloat(e.target.value),
    //               })
    //             }
    //           />
    //         </div>
    //         <div className="space-y-2">
    //           <Label htmlFor="service-charge">Service Charge (%)</Label>
    //           <Input
    //             id="service-charge"
    //             type="number"
    //             value={paymentSettings.serviceCharge}
    //             onChange={(e) =>
    //               setPaymentSettings({
    //                 ...paymentSettings,
    //                 serviceCharge: Number.parseFloat(e.target.value),
    //               })
    //             }
    //           />
    //         </div>
    //       </div>
    //     </CardContent>
    //     <CardFooter>
    //       <Button disabled={isSaving} onClick={handleSave}>
    //         {isSaving ? <Loader2 className="animate-spin mr-2" /> : "Save Changes"}
    //       </Button>
    //     </CardFooter>
    //   </Card>
    // </div>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Configure which payment methods are available to customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="enableOnlinePayments"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Online Payments</FormLabel>
                    <p className="text-sm text-muted-foreground">Allow customers to pay online via card or bank transfer</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enableCashPayments"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Cash on Delivery</FormLabel>
                    <p className="text-sm text-muted-foreground">Allow customers to pay with cash upon delivery</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enableTransferPayments"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Bank Transfer</FormLabel>
                    <p className="text-sm text-muted-foreground">Allow customers to pay via bank transfer</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <AuthButton buttonText="Save Changes" loading={form.formState.isSubmitting} />
          </CardFooter>
        </Card>

        {/* Tax & Fees */}
        <Card>
          <CardHeader>
            <CardTitle>Tax & Fees</CardTitle>
            <CardDescription>Configure tax rates and service charges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceCharge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Charge (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
                <AuthButton buttonText="Save Changes" loading={form.formState.isSubmitting} />
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
