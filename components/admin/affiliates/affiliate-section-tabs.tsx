import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Overview from "./sections/overview"
import PendingPayouts from "./sections/pending-payouts"
import PayoutHistory from "./sections/payout-history"
import { getAdminPayoutHistory, getAdminPayoutsData } from "@/lib/admin-data/affiliates/get-admin-affiliate-data"

const AffiliateSectionTabs = async () => {
    const pendingPayouts = await getAdminPayoutsData()
    const payoutHistory = await getAdminPayoutHistory()
    return (
        <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="pending">Pending Payouts</TabsTrigger>
                <TabsTrigger value="history">Payout History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
                <Overview />
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
                <PendingPayouts pendingList={pendingPayouts} />
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
               <PayoutHistory historyList={payoutHistory} />
            </TabsContent>
        </Tabs>
    )
}

export default AffiliateSectionTabs