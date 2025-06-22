"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
// import { Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"

// const deliveryOptions = ["pickup", "delivery", "both"] as const;

const generalFormSchema = z.object({
  // deliveryMethod: z.enum(deliveryOptions, {
  //   required_error: "You need to select a delivery preference.",
  // }),
  newsletter: z.boolean(),
})

type GeneralFormValues = z.infer<typeof generalFormSchema>

export default function GeneralSettings() {
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      newsletter: true,
    },
  })

  function onSubmit(data: GeneralFormValues) {
    toast.success("Your settings have been updated successfully.")
  }

  return (
    <Card className="h-full">
      <CardHeader className=" border-b">
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage your general account preferences</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 h-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* <FormField
              control={form.control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Preferred Delivery Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pickup" />
                        </FormControl>
                        <FormLabel className="font-normal">Pickup only</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="delivery" />
                        </FormControl>
                        <FormLabel className="font-normal">Delivery only</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="both" />
                        </FormControl>
                        <FormLabel className="font-normal">Show both options</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription className="flex items-center gap-1 text-xs">
                    <Truck className="h-3 w-3" />
                    This affects how orders are presented to you
                  </FormDescription>
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="newsletter"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Newsletter Subscription</FormLabel>
                    <FormDescription>Receive updates about new menu items and special offers</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
