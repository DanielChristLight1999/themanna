

import ReferralsTable from '@/components/affiliate/referrals-table'
import { getReferralsData } from '@/lib/affiliate-data/get-referrals-data'
import React from 'react'

export default async function page() {
  const referralsData = await getReferralsData()
  return (
    <div>
      <ReferralsTable referrals={referralsData} />
    </div>
  )
}
