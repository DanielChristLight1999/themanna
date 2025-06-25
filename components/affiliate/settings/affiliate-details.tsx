"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, Copy } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const AffiliateDetails = ({ referralCode, totalEarnings }: { referralCode: string, totalEarnings: number }) => {
    const [copied, setCopied] = useState(false)

    const copyReferralCode = async () => {
        try {
            await navigator.clipboard.writeText(referralCode)
            setCopied(true)
            toast.success("Copied!", {
                description: "Referral code copied to clipboard",
            })
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Error", {
                description: "Failed to copy referral code",
            })
        }
    }
    return (
        <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Affiliate Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Your Referral Code</Label>
                        <div className="flex gap-3">
                            <Input value={referralCode} readOnly className="border-emerald-200 bg-emerald-50 font-mono text-lg" />
                            <Button
                                onClick={copyReferralCode}
                                variant="outline"
                                className="border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Total Earnings</Label>
                        <div className="text-3xl font-bold text-emerald-600">₦{totalEarnings.toLocaleString()}</div>
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Active Affiliate</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default AffiliateDetails