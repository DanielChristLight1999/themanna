"use client"

import AuthButton from "@/components/Apps/common/AuthButton"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DeliverySettingsType } from "@/lib/getsettingsData"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { PlusCircleIcon, Trash2 } from "lucide-react"
import { updateDeliverySettings } from "@/actions/admin/settings-actions"
import { RolePermissionSettings } from "@/lib/permissions/types"

const formSchema = z.object({
  defaultDeliveryFee: z.coerce.number().min(1),
  minimumOrderAmount: z.coerce.number().min(1),
  estimatedDeliveryTime: z.coerce.number().min(1),
  deliveryRadius: z.coerce.number().min(1),
})

const deliveryZonesSchema = z.object({
  zones: z.array(z.object({
    name: z.string().min(1),
    fee: z.coerce.number().min(1),
  }))
})

export function DeliverySettings({ deliverySettings, permissions }: { deliverySettings: DeliverySettingsType, permissions: RolePermissionSettings }) {
  const canUpdateSettings = permissions?.settings?.update ?? false
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultDeliveryFee: deliverySettings.defaultDeliveryFee,
      minimumOrderAmount: deliverySettings.minimumOrderAmount,
      estimatedDeliveryTime: deliverySettings.estimatedDeliveryTime,
      deliveryRadius: deliverySettings.deliveryRadius,
    },
  })

  const deliveryZonesForm = useForm<z.infer<typeof deliveryZonesSchema>>({
    resolver: zodResolver(deliveryZonesSchema),
    defaultValues: {
      zones: deliverySettings.zones,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: deliveryZonesForm.control,
    name: "zones",
  })

  const onSubmitDelivery = async (data: z.infer<typeof formSchema>) => {
    const result = await updateDeliverySettings({
      enableDelivery: deliverySettings.enableDelivery,
      enablePickup: deliverySettings.enablePickup,
      ...data,
      zones: deliverySettings.zones,
    })

    if (result.error) {
      toast.error(result.message)
    } else {
      toast.success(result.message)
    }
  }

  const onSubmitZones = async (data: z.infer<typeof deliveryZonesSchema>) => {
    const result = await updateDeliverySettings({
      enableDelivery: deliverySettings.enableDelivery,
      enablePickup: deliverySettings.enablePickup,
      defaultDeliveryFee: deliverySettings.defaultDeliveryFee,
      minimumOrderAmount: deliverySettings.minimumOrderAmount,
      estimatedDeliveryTime: deliverySettings.estimatedDeliveryTime,
      deliveryRadius: deliverySettings.deliveryRadius,
      zones: data.zones,
    })

    if (result.error) {
      toast.error(result.message)
    } else {
      toast.success(result.message)
    }
  }


  return (
    <div className="space-y-6">
      {/* Delivery Options */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Options</CardTitle>
          <CardDescription>Configure your restaurant's delivery settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitDelivery)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField name="defaultDeliveryFee" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Delivery Fee (₦)</FormLabel>
                    <FormControl><Input disabled={!canUpdateSettings} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="minimumOrderAmount" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Order Amount (₦)</FormLabel>
                    <FormControl><Input disabled={!canUpdateSettings} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField name="estimatedDeliveryTime" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Delivery Time (min)</FormLabel>
                    <FormControl><Input disabled={!canUpdateSettings} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="deliveryRadius" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Radius (km)</FormLabel>
                    <FormControl><Input disabled={!canUpdateSettings} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <AuthButton disabled={!canUpdateSettings} loading={form.formState.isSubmitting} buttonText="Save Settings" />
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Delivery Zones */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Zones</CardTitle>
          <CardDescription>Configure delivery fees for specific locations</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...deliveryZonesForm}>
            <form onSubmit={deliveryZonesForm.handleSubmit(onSubmitZones)} className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-3 gap-4 items-end">
                  <FormField name={`zones.${index}.name`} control={deliveryZonesForm.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zone Name</FormLabel>
                      <FormControl><Input disabled={!canUpdateSettings} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name={`zones.${index}.fee`} control={deliveryZonesForm.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee (₦)</FormLabel>
                      <FormControl><Input disabled={!canUpdateSettings} type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button
                    disabled={!canUpdateSettings}
                    variant="destructive"
                    type="button"
                    size={"icon"}
                    className="mt-1"
                    onClick={() => remove(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <div className="flex flex-col gap-2 items-start">
                <Button disabled={!canUpdateSettings} type="button" onClick={() => append({ name: "", fee: 0 })}>
                  <PlusCircleIcon />
                </Button>
                <AuthButton
                  disabled={!canUpdateSettings}
                  loading={deliveryZonesForm.formState.isSubmitting}
                  buttonText="Save Zones"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
