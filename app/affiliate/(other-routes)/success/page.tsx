import { AffiliateSuccess } from "@/components/affiliate/success/affiliate-success"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Application Submitted - The Mana Restaurant Affiliate Program",
  description: "Your affiliate application has been successfully submitted. Check your email for next steps.",
}

export default function AffiliateSuccessPage() {
  return <AffiliateSuccess />
}
