import { getDashboardStats } from "@/app/actions/dashboard"
import { getSubscriptions } from "@/app/actions/subscriptions"
import { AnalyticsClient } from "@/components/analytics/AnalyticsClient"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const [statsResult, subsResult] = await Promise.all([
    getDashboardStats(),
    getSubscriptions(),
  ])

  const stats = statsResult.success ? statsResult.data : null
  const subscriptions = subsResult.success ? subsResult.data : []

  return <AnalyticsClient stats={stats} subscriptions={subscriptions} />
}
