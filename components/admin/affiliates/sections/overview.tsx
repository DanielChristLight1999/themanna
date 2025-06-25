import React from 'react'
import { AffiliatesStats } from '../affiliates-stats'
import { AffiliateApplications } from '../affiliate-applications'
import { AffiliatesTable } from '../affiliates-table'
import { getActiveAffiliates, getAdminAffiliatesChartData, getAdminAffiliatesData, getPendingApplications } from '@/lib/admin-data/affiliates/get-admin-affiliate-data'

const Overview = async () => {
    const statsData = await getAdminAffiliatesData()
    const chartData = await getAdminAffiliatesChartData()
    const pendingApplications = await getPendingApplications()
    const activeAffiliates = await getActiveAffiliates()
    return (
        <div className="flex flex-col space-y-6">
            <AffiliatesStats chartData={chartData} stats={statsData} />
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                    <AffiliateApplications applications={pendingApplications} />
                </div>
                <div className="md:col-span-2">
                    <AffiliatesTable affiliates={activeAffiliates} />
                </div>
            </div>
        </div>
    )
}

export default Overview