import { getDashboardStats } from "@/app/actions/dashboard"
import { getSubscriptions } from "@/app/actions/subscriptions"
import { DashboardClient } from "@/components/dashboard/DashboardClient"

export const revalidate = 60

export default async function DashboardPage() {
  const [statsResult, subsResult] = await Promise.all([
    getDashboardStats(),
    getSubscriptions(),
  ])

  const stats = statsResult.success ? statsResult.data : null
  const subscriptions = subsResult.success ? subsResult.data : []

  return <DashboardClient stats={stats} subscriptions={subscriptions} />
}
