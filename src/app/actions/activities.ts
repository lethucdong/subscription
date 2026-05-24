"use server"

import { prisma } from "@/lib/prisma"
import type { SerializedActivity } from "@/types"
import { Prisma } from "@prisma/client"

function serializeActivity(a: any): SerializedActivity {
  return {
    id: a.id,
    type: a.type,
    description: a.description,
    subscriptionId: a.subscriptionId,
    userId: a.userId,
    amount: a.amount != null ? (a.amount instanceof Prisma.Decimal ? a.amount.toNumber() : Number(a.amount)) : null,
    createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
    subscription: a.subscription
      ? { id: a.subscription.id, name: a.subscription.name, logo: a.subscription.logo }
      : null,
    user: a.user ? { id: a.user.id, name: a.user.name, avatar: a.user.avatar } : null,
  }
}

export async function getActivities(
  subscriptionId?: string,
  limit = 50
): Promise<{ success: true; data: SerializedActivity[] } | { success: false; error: string }> {
  try {
    const activities = await prisma.activity.findMany({
      where: subscriptionId ? { subscriptionId } : undefined,
      include: {
        subscription: { select: { id: true, name: true, logo: true } },
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return { success: true, data: activities.map(serializeActivity) }
  } catch (error) {
    console.error("getActivities error:", error)
    return { success: false, error: "Failed to fetch activities" }
  }
}

export async function createActivity(data: {
  type: string
  description: string
  subscriptionId?: string
  userId?: string
  amount?: number
}): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.activity.create({ data })
    return { success: true }
  } catch (error) {
    console.error("createActivity error:", error)
    return { success: false, error: "Failed to create activity" }
  }
}
