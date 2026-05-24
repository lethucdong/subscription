import { getSubscriptions } from "@/app/actions/subscriptions"
import { getVendors } from "@/app/actions/vendors"
import { SubscriptionsClient } from "@/components/subscriptions/SubscriptionsClient"

export const dynamic = "force-dynamic"

export default async function SubscriptionsPage() {
  const [subsResult, vendorsResult] = await Promise.all([
    getSubscriptions(),
    getVendors(),
  ])

  const subscriptions = subsResult.success ? subsResult.data : []
  const vendors = vendorsResult.success ? vendorsResult.data : []

  return <SubscriptionsClient initialSubscriptions={subscriptions} vendors={vendors} />
}
