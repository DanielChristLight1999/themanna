"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export function PaymentSettings() {
  const [paymentSettings, setPaymentSettings] = useState({
    enableOnlinePayments: true,
    enableCashPayments: true,
    enableTransferPayments: true,
    paymentMethods: {
      paystack: {
        enabled: true,
        secretKey: "sk_test_***********************",
        publicKey: "pk_test_***********************",
      },
      flutterwave: {
        enabled: false,
        secretKey: "",
        publicKey: "",
      },
    },
    taxRate: 7.5,
    serviceCharge: 5,
  })

  const handleSave = () => {
    // In a real app, this would call an API to save the settings
    console.log("Saving payment settings:", paymentSettings)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Configure which payment methods are available to customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-online">Online Payments</Label>
              <p className="text-sm text-muted-foreground">Allow customers to pay online via card or bank transfer</p>
            </div>
            <Switch
              id="enable-online"
              checked={paymentSettings.enableOnlinePayments}
              onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableOnlinePayments: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-cash">Cash on Delivery</Label>
              <p className="text-sm text-muted-foreground">Allow customers to pay with cash upon delivery</p>
            </div>
            <Switch
              id="enable-cash"
              checked={paymentSettings.enableCashPayments}
              onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableCashPayments: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-transfer">Bank Transfer</Label>
              <p className="text-sm text-muted-foreground">Allow customers to pay via bank transfer</p>
            </div>
            <Switch
              id="enable-transfer"
              checked={paymentSettings.enableTransferPayments}
              onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableTransferPayments: checked })}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Gateways</CardTitle>
          <CardDescription>Configure your payment gateway credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-paystack">Paystack</Label>
                <p className="text-sm text-muted-foreground">Accept payments via Paystack</p>
              </div>
              <Switch
                id="enable-paystack"
                checked={paymentSettings.paymentMethods.paystack.enabled}
                onCheckedChange={(checked) =>
                  setPaymentSettings({
                    ...paymentSettings,
                    paymentMethods: {
                      ...paymentSettings.paymentMethods,
                      paystack: {
                        ...paymentSettings.paymentMethods.paystack,
                        enabled: checked,
                      },
                    },
                  })
                }
              />
            </div>

            {paymentSettings.paymentMethods.paystack.enabled && (
              <div className="grid gap-4 sm:grid-cols-2 pl-6 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label htmlFor="paystack-public-key">Public Key</Label>
                  <Input
                    id="paystack-public-key"
                    value={paymentSettings.paymentMethods.paystack.publicKey}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        paymentMethods: {
                          ...paymentSettings.paymentMethods,
                          paystack: {
                            ...paymentSettings.paymentMethods.paystack,
                            publicKey: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paystack-secret-key">Secret Key</Label>
                  <Input
                    id="paystack-secret-key"
                    type="password"
                    value={paymentSettings.paymentMethods.paystack.secretKey}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        paymentMethods: {
                          ...paymentSettings.paymentMethods,
                          paystack: {
                            ...paymentSettings.paymentMethods.paystack,
                            secretKey: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-flutterwave">Flutterwave</Label>
                <p className="text-sm text-muted-foreground">Accept payments via Flutterwave</p>
              </div>
              <Switch
                id="enable-flutterwave"
                checked={paymentSettings.paymentMethods.flutterwave.enabled}
                onCheckedChange={(checked) =>
                  setPaymentSettings({
                    ...paymentSettings,
                    paymentMethods: {
                      ...paymentSettings.paymentMethods,
                      flutterwave: {
                        ...paymentSettings.paymentMethods.flutterwave,
                        enabled: checked,
                      },
                    },
                  })
                }
              />
            </div>

            {paymentSettings.paymentMethods.flutterwave.enabled && (
              <div className="grid gap-4 sm:grid-cols-2 pl-6 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label htmlFor="flutterwave-public-key">Public Key</Label>
                  <Input
                    id="flutterwave-public-key"
                    value={paymentSettings.paymentMethods.flutterwave.publicKey}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        paymentMethods: {
                          ...paymentSettings.paymentMethods,
                          flutterwave: {
                            ...paymentSettings.paymentMethods.flutterwave,
                            publicKey: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flutterwave-secret-key">Secret Key</Label>
                  <Input
                    id="flutterwave-secret-key"
                    type="password"
                    value={paymentSettings.paymentMethods.flutterwave.secretKey}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        paymentMethods: {
                          ...paymentSettings.paymentMethods,
                          flutterwave: {
                            ...paymentSettings.paymentMethods.flutterwave,
                            secretKey: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax & Fees</CardTitle>
          <CardDescription>Configure tax rates and service charges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                value={paymentSettings.taxRate}
                onChange={(e) =>
                  setPaymentSettings({
                    ...paymentSettings,
                    taxRate: Number.parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-charge">Service Charge (%)</Label>
              <Input
                id="service-charge"
                type="number"
                value={paymentSettings.serviceCharge}
                onChange={(e) =>
                  setPaymentSettings({
                    ...paymentSettings,
                    serviceCharge: Number.parseFloat(e.target.value),
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
    </div>
  )
}
