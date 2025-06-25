"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, QrCode } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function ReferralLink({referralLink, qrImage} : {referralLink: string, qrImage: string}) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast.success("Copied!", {
        description: "Referral link copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.success("Error",{
        description: "Failed to copy link",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Referral Link</h1>
        <p className="text-gray-600 mt-2">Share your unique link to earn commissions</p>
      </div>

      {/* Referral Link Card */}
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Your Unique Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={referralLink}
              readOnly
              className="flex-1 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 bg-emerald-50"
            />
            <Button onClick={copyToClipboard} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Card */}
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <QrCode className="w-5 h-5 mr-2 text-emerald-600" />
            QR Code for Mobile Sharing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-62 h-62 bg-emerald-50 border-2 border-emerald-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-emerald-600">
                <Image src={qrImage} alt="QR Code" width={160} height={160} />
                <p className="text-sm">QR Code</p>
                <p className="text-xs">Scan to visit link</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center max-w-md">
              Share this QR code for easy mobile access to your referral link
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">How to Use Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Share Your Link</h3>
                <p className="text-sm">
                  Copy and share your unique referral link with friends, family, or on social media.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Customer Makes Purchase</h3>
                <p className="text-sm">When someone clicks your link and makes a purchase, you earn a commission.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Earn Commission</h3>
                <p className="text-sm">
                  Track your earnings in the dashboard and get paid monthly for successful referrals.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <h4 className="font-semibold text-emerald-800 mb-2">💡 Pro Tips:</h4>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• Share on social media platforms for wider reach</li>
              <li>• Include personal recommendations with your link</li>
              <li>• Use the QR code for offline sharing</li>
              <li>• Track your performance in the Dashboard section</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
