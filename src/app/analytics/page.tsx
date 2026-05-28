import { getDashboardStats } from "@/app/actions/dashboard"
import { AnalyticsClient } from "@/components/analytics/AnalyticsClient"

export default async function AnalyticsPage() {
  const statsResult = await getDashboardStats()
  const stats = statsResult.success ? statsResult.data : null

  return <AnalyticsClient stats={stats} />
}
