import { getDashboardStats } from "@/app/actions/dashboard"
import { getSubscriptionsForDashboard } from "@/app/actions/subscriptions"
import { DashboardClient } from "@/components/dashboard/DashboardClient"

export default async function DashboardPage() {
  const [statsResult, subscriptions] = await Promise.all([
    getDashboardStats(),
    getSubscriptionsForDashboard(),
  ])

  const stats = statsResult.success ? statsResult.data : null

  return <DashboardClient stats={stats} subscriptions={subscriptions} />
}
