import { getSubscriptions } from "@/app/actions/subscriptions"
import { getVendorsLean } from "@/app/actions/vendors"
import { SubscriptionsClient } from "@/components/subscriptions/SubscriptionsClient"

export default async function SubscriptionsPage() {
  const [subsResult, vendors] = await Promise.all([
    getSubscriptions(),
    getVendorsLean(),
  ])

  const subscriptions = subsResult.success ? subsResult.data : []

  return <SubscriptionsClient initialSubscriptions={subscriptions} vendors={vendors} />
}
