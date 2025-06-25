import Commissions from '@/components/affiliate/commisions-content'
import { getCommissionsData } from '@/lib/affiliate-data/get-commisions-data'
import { getSummaryData } from '@/lib/affiliate-data/get-dashboard-data'
import React from 'react'

export default async function page() {
  const {paidCommissions, unpaidCommissions} = await getSummaryData()
  const commisionsData = await getCommissionsData()
  return (
    <div>
      <Commissions totalPaid={paidCommissions} totalUnpaid={unpaidCommissions} commissions={commisionsData} />
    </div>
  )
}
