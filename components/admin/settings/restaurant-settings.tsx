"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TimeInput } from "./time-input"
import { ImageIcon, UploadIcon } from "lucide-react"

export function RestaurantSettings() {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "The Mana Restaurant",
    description: "Authentic Nigerian cuisine with a modern twist.",
    address: "123 Lagos Street, Ikeja, Lagos",
    phone: "+234 812 345 6789",
    email: "info@themanarestaurant.com",
    website: "https://themanarestaurant.com",
    logo: "/placeholder.svg?height=100&width=100",
    openingHours: {
      monday: { open: "08:00", close: "22:00" },
      tuesday: { open: "08:00", close: "22:00" },
      wednesday: { open: "08:00", close: "22:00" },
      thursday: { open: "08:00", close: "22:00" },
      friday: { open: "08:00", close: "23:00" },
      saturday: { open: "10:00", close: "23:00" },
      sunday: { open: "10:00", close: "22:00" },
    },
  })

  const handleSave = () => {
    // In a real app, this would call an API to save the settings
    console.log("Saving restaurant settings:", restaurantInfo)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Information</CardTitle>
          <CardDescription>Update your restaurant's basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="restaurant-name">Restaurant Name</Label>
              <Input
                id="restaurant-name"
                value={restaurantInfo.name}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurant-phone">Phone Number</Label>
              <Input
                id="restaurant-phone"
                value={restaurantInfo.phone}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="restaurant-email">Email Address</Label>
              <Input
                id="restaurant-email"
                type="email"
                value={restaurantInfo.email}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurant-website">Website</Label>
              <Input
                id="restaurant-website"
                value={restaurantInfo.website}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, website: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant-address">Address</Label>
            <Input
              id="restaurant-address"
              value={restaurantInfo.address}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant-description">Description</Label>
            <Textarea
              id="restaurant-description"
              rows={3}
              value={restaurantInfo.description}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Restaurant Logo</Label>
            <div className="flex items-center gap-4">
              <Card className="w-[100px] h-[100px] flex items-center justify-center relative overflow-hidden">
                {restaurantInfo.logo ? (
                  <Image
                    src={restaurantInfo.logo || "/placeholder.svg"}
                    alt="Restaurant logo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8 mb-1" />
                    <span className="text-xs">No logo</span>
                  </div>
                )}
              </Card>
              <Button variant="outline" className="gap-2">
                <UploadIcon className="h-4 w-4" />
                Upload Logo
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <CardDescription>Set your restaurant's opening and closing times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(restaurantInfo.openingHours).map(([day, hours]) => (
              <div key={day} className="grid grid-cols-3 gap-4 items-center">
                <Label className="capitalize">{day}</Label>
                <TimeInput
                  value={hours.open}
                  onChange={(value) =>
                    setRestaurantInfo({
                      ...restaurantInfo,
                      openingHours: {
                        ...restaurantInfo.openingHours,
                        [day]: { ...hours, open: value },
                      },
                    })
                  }
                />
                <TimeInput
                  value={hours.close}
                  onChange={(value) =>
                    setRestaurantInfo({
                      ...restaurantInfo,
                      openingHours: {
                        ...restaurantInfo.openingHours,
                        [day]: { ...hours, close: value },
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
