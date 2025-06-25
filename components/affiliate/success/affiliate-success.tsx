"use client"

import { CheckCircle, Mail, Clock, Home, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { NextSteps } from "./next-steps"
import { SupportContact } from "./support-contact"

export function AffiliateSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              M
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">The Mana Restaurant</h1>
          <p className="text-gray-600">Affiliate Program</p>
        </div>

        {/* Success Message */}
        <Card className="mb-8 border-emerald-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <CheckCircle className="w-20 h-20 text-emerald-600 animate-pulse" />
                <div className="absolute inset-0 w-20 h-20 rounded-full bg-emerald-100 animate-ping opacity-20"></div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted Successfully! 🎉</h2>

            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Thank you for your interest in joining The Mana Restaurant affiliate program. Your application has been
              received and is now under review.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 px-4 py-2">
                <Mail className="w-4 h-4 mr-2" />
                Email Confirmation Sent
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Review in Progress
              </Badge>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
              <div className="flex items-center justify-center mb-3">
                <Mail className="w-6 h-6 text-emerald-600 mr-2" />
                <h3 className="text-lg font-semibold text-emerald-800">Check Your Email</h3>
              </div>
              <p className="text-emerald-700 text-sm">
                We&#39;ve sent a confirmation email with important details about your application. Please check your inbox
                (and spam folder) for further instructions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <NextSteps />

        {/* Support Contact */}
        <SupportContact />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Homepage
            </Link>
          </Button>

          <Button variant="outline" asChild className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <Link href="/contact">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">© 2025 The Mana Restaurant. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
