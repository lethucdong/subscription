export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { getSubscriptionById } from "@/app/actions/subscriptions"
import { getActivities } from "@/app/actions/activities"
import { getUsers } from "@/app/actions/users"
import { SubscriptionDetailClient } from "@/components/subscriptions/SubscriptionDetailClient"

export default async function SubscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [subResult, activitiesResult, usersResult] = await Promise.all([
    getSubscriptionById(id),
    getActivities(id),
    getUsers(),
  ])

  if (!subResult.success) notFound()

  const sub = subResult.data
  const activities = activitiesResult.success ? activitiesResult.data : []
  const allUsers = usersResult.success ? usersResult.data : []

  return (
    <SubscriptionDetailClient
      subscription={sub}
      activities={activities}
      allUsers={allUsers}
    />
  )
}
