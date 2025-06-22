"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Bell, Gift, ShoppingBag, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

const notificationsFormSchema = z.object({
  orderUpdates: z.boolean(),
  orderDelivery: z.boolean(),
  promotions: z.boolean(),
  newItems: z.boolean(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

export default function NotificationSettings() {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      orderUpdates: true,
      orderDelivery: true,
      promotions: false,
      newItems: true,
    },
  })

  function onSubmit(data: NotificationsFormValues) {
    toast.success("Notification preferences updated")
  }

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-emerald-600" />
          Notification Settings
        </CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="orderUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-emerald-600" />
                        <FormLabel className="text-base">Order Updates</FormLabel>
                      </div>
                      <FormDescription>Receive notifications about your order status</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orderDelivery"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-emerald-600" />
                        <FormLabel className="text-base">Delivery Updates</FormLabel>
                      </div>
                      <FormDescription>Get notified when your order is out for delivery</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="promotions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-orange-500" />
                        <FormLabel className="text-base">Promotions & Offers</FormLabel>
                      </div>
                      <FormDescription>Receive notifications about special deals and discounts</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newItems"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">New Menu Items</FormLabel>
                      <FormDescription>Get notified when new items are added to the menu</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <CardFooter className="px-0 pt-6">
              <Button type="submit" className="ml-auto bg-emerald-600 hover:bg-emerald-700">
                Save Preferences
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
