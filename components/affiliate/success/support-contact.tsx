"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MessageCircle, Copy, Check } from "lucide-react"
import { useState } from "react"

export function SupportContact() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const supportEmail = "affiliates@themanarestaurant.com"

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } catch (err) {
      console.error("Failed to copy email:", err)
    }
  }

  return (
    <Card className="mb-8 border-blue-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
          Need Help?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">
          If you have any questions about your application or the affiliate program, our support team is here to help.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Email Support</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">{supportEmail}</p>
                  <Button variant="ghost" size="sm" onClick={copyEmail} className="h-6 w-6 p-0">
                    {copiedEmail ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Phone Support</p>
                <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <h4 className="text-sm font-medium text-emerald-800 mb-2">Business Hours</h4>
              <div className="text-sm text-emerald-700 space-y-1">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Response Time</h4>
              <p className="text-sm text-blue-700">
                We typically respond to emails within 4-6 hours during business hours.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
