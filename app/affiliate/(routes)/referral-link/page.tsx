
import ReferralLink from '@/components/affiliate/referral-link-content'
import { getReferralLink } from '@/lib/affiliate-data/get-referrals-data'
import React from 'react'

export default async function page() {
  const {referralLink, qrImage} = await getReferralLink()
  return (
    <div>
      <ReferralLink qrImage={qrImage} referralLink={referralLink} />
    </div>
  )
}
