"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DeliverySettings() {
  const [deliverySettings, setDeliverySettings] = useState({
    enableDelivery: true,
    enablePickup: true,
    defaultDeliveryFee: 350,
    minimumOrderAmount: 1000,
    estimatedDeliveryTime: 45,
    deliveryRadius: 10,
    zones: [
      { name: "Ikeja", fee: 350 },
      { name: "Lekki", fee: 500 },
      { name: "Victoria Island", fee: 500 },
      { name: "Yaba", fee: 400 },
    ],
  })

  const handleSave = () => {
    // In a real app, this would call an API to save the settings
    console.log("Saving delivery settings:", deliverySettings)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Options</CardTitle>
          <CardDescription>Configure your restaurant's delivery settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-delivery">Enable Delivery</Label>
              <p className="text-sm text-muted-foreground">Allow customers to order food for delivery</p>
            </div>
            <Switch
              id="enable-delivery"
              checked={deliverySettings.enableDelivery}
              onCheckedChange={(checked) => setDeliverySettings({ ...deliverySettings, enableDelivery: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-pickup">Enable Pickup</Label>
              <p className="text-sm text-muted-foreground">Allow customers to order food for pickup</p>
            </div>
            <Switch
              id="enable-pickup"
              checked={deliverySettings.enablePickup}
              onCheckedChange={(checked) => setDeliverySettings({ ...deliverySettings, enablePickup: checked })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="default-delivery-fee">Default Delivery Fee (₦)</Label>
              <Input
                id="default-delivery-fee"
                type="number"
                value={deliverySettings.defaultDeliveryFee}
                onChange={(e) =>
                  setDeliverySettings({
                    ...deliverySettings,
                    defaultDeliveryFee: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimum-order">Minimum Order Amount (₦)</Label>
              <Input
                id="minimum-order"
                type="number"
                value={deliverySettings.minimumOrderAmount}
                onChange={(e) =>
                  setDeliverySettings({
                    ...deliverySettings,
                    minimumOrderAmount: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="delivery-time">Estimated Delivery Time (minutes)</Label>
              <Input
                id="delivery-time"
                type="number"
                value={deliverySettings.estimatedDeliveryTime}
                onChange={(e) =>
                  setDeliverySettings({
                    ...deliverySettings,
                    estimatedDeliveryTime: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
              <Input
                id="delivery-radius"
                type="number"
                value={deliverySettings.deliveryRadius}
                onChange={(e) =>
                  setDeliverySettings({
                    ...deliverySettings,
                    deliveryRadius: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Zones</CardTitle>
          <CardDescription>Configure delivery fees for different areas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="zones" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="zones">Zones</TabsTrigger>
              <TabsTrigger value="add">Add New Zone</TabsTrigger>
            </TabsList>
            <TabsContent value="zones" className="pt-4">
              <div className="space-y-4">
                {deliverySettings.zones.map((zone, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center">
                    <div className="col-span-2">
                      <Label className="mb-1 block">{zone.name}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={zone.fee}
                        onChange={(e) => {
                          const updatedZones = [...deliverySettings.zones]
                          updatedZones[index].fee = Number.parseInt(e.target.value)
                          setDeliverySettings({
                            ...deliverySettings,
                            zones: updatedZones,
                          })
                        }}
                      />
                      <span className="text-sm">₦</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="add" className="pt-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zone-name">Zone Name</Label>
                  <Input id="zone-name" placeholder="e.g., Surulere" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone-fee">Delivery Fee (₦)</Label>
                  <Input id="zone-fee" type="number" placeholder="e.g., 400" />
                </div>
                <Button className="w-full">Add Zone</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
