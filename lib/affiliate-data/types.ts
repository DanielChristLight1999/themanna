export type EarningsChartData = {
  month: string
  earnings: number
}[]

export type RecentCommisionData = {
  id: string
  orderId: string
  amount: number
  status: string
  date: Date
}

export type ReferralsData = {
  id: string
  name: string
  email: string
  dateReferred: Date
  status: string
}