"use server"

import { prisma } from "@/lib/prisma"
import { cacheTag, cacheLife, updateTag } from "next/cache"
import { SubscriptionStatus, BillingCycle, Prisma } from "@prisma/client"
import type { SerializedSubscription } from "@/types"

function serializeSubscription(sub: any): SerializedSubscription {
  return {
    id: sub.id,
    name: sub.name,
    vendorId: sub.vendorId,
    logo: sub.logo,
    color: sub.color,
    category: sub.category,
    status: sub.status as SerializedSubscription["status"],
    plan: sub.plan,
    billingCycle: sub.billingCycle as SerializedSubscription["billingCycle"],
    amount: sub.amount instanceof Prisma.Decimal ? sub.amount.toNumber() : Number(sub.amount),
    currency: sub.currency,
    nextRenewal: sub.nextRenewal instanceof Date ? sub.nextRenewal.toISOString() : sub.nextRenewal,
    seatsUsed: sub.seatsUsed,
    seatsTotal: sub.seatsTotal,
    description: sub.description,
    autoRenew: sub.autoRenew,
    createdAt: sub.createdAt instanceof Date ? sub.createdAt.toISOString() : sub.createdAt,
    updatedAt: sub.updatedAt instanceof Date ? sub.updatedAt.toISOString() : sub.updatedAt,
    vendor: sub.vendor
      ? {
          id: sub.vendor.id,
          name: sub.vendor.name,
          logo: sub.vendor.logo,
          website: sub.vendor.website,
          description: sub.vendor.description,
          category: sub.vendor.category,
          createdAt: sub.vendor.createdAt instanceof Date ? sub.vendor.createdAt.toISOString() : sub.vendor.createdAt,
          updatedAt: sub.vendor.updatedAt instanceof Date ? sub.vendor.updatedAt.toISOString() : sub.vendor.updatedAt,
        }
      : { id: "", name: "", logo: "", website: null, description: null, category: "", createdAt: "", updatedAt: "" },
    assignedUsers: (sub.assignedUsers ?? []).map((su: any) => ({
      id: su.id,
      subscriptionId: su.subscriptionId,
      userId: su.userId,
      assignedAt: su.assignedAt instanceof Date ? su.assignedAt.toISOString() : su.assignedAt,
      user: {
        id: su.user.id,
        name: su.user.name,
        email: su.user.email,
        avatar: su.user.avatar,
        role: su.user.role,
        createdAt: su.user.createdAt instanceof Date ? su.user.createdAt.toISOString() : su.user.createdAt,
        updatedAt: su.user.updatedAt instanceof Date ? su.user.updatedAt.toISOString() : su.user.updatedAt,
      },
    })),
    tags: (sub.tags ?? []).map((t: any) => ({
      id: t.id,
      subscriptionId: t.subscriptionId,
      tag: t.tag,
    })),
  }
}

const subscriptionInclude = {
  vendor: true,
  assignedUsers: { include: { user: true } },
  tags: true,
}

export async function getSubscriptions(filter?: {
  status?: SubscriptionStatus
  search?: string
}): Promise<{ success: true; data: SerializedSubscription[] } | { success: false; error: string }> {
  "use cache"
  cacheTag("subscriptions")
  cacheLife("minutes")

  try {
    const where: any = {}
    if (filter?.status) where.status = filter.status
    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { vendor: { name: { contains: filter.search, mode: "insensitive" } } },
      ]
    }

    const subs = await prisma.subscription.findMany({
      where,
      include: subscriptionInclude,
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: subs.map(serializeSubscription) }
  } catch (error) {
    console.error("getSubscriptions error:", error)
    return { success: false, error: "Failed to fetch subscriptions" }
  }
}

// Lean variant — only fields needed by dashboard widgets (RenewalTimeline, SeatUsageCard).
// Skips vendor/assignedUsers/tags includes to keep the cache payload small.
export async function getSubscriptionsForDashboard(): Promise<SerializedSubscription[]> {
  "use cache"
  cacheTag("subscriptions")
  cacheLife("minutes")

  try {
    const subs = await prisma.subscription.findMany({
      select: {
        id: true,
        name: true,
        logo: true,
        color: true,
        status: true,
        category: true,
        billingCycle: true,
        amount: true,
        currency: true,
        nextRenewal: true,
        seatsUsed: true,
        seatsTotal: true,
      },
      orderBy: { createdAt: "desc" },
    })

    const empty = { id: "", name: "", logo: "", website: null, description: null, category: "", createdAt: "", updatedAt: "" }
    return subs.map((sub) => ({
      id: sub.id,
      name: sub.name,
      vendorId: "",
      logo: sub.logo,
      color: sub.color,
      category: sub.category,
      status: sub.status as SerializedSubscription["status"],
      plan: "",
      billingCycle: sub.billingCycle as SerializedSubscription["billingCycle"],
      amount: sub.amount instanceof Prisma.Decimal ? sub.amount.toNumber() : Number(sub.amount),
      currency: sub.currency,
      nextRenewal: sub.nextRenewal instanceof Date ? sub.nextRenewal.toISOString() : sub.nextRenewal,
      seatsUsed: sub.seatsUsed,
      seatsTotal: sub.seatsTotal,
      description: null,
      autoRenew: false,
      createdAt: "",
      updatedAt: "",
      vendor: empty,
      assignedUsers: [],
      tags: [],
    }))
  } catch (error) {
    console.error("getSubscriptionsForDashboard error:", error)
    return []
  }
}

export async function getSubscriptionById(
  id: string
): Promise<{ success: true; data: SerializedSubscription } | { success: false; error: string }> {
  "use cache"
  cacheTag("subscriptions", `subscription:${id}`)
  cacheLife("minutes")

  try {
    const sub = await prisma.subscription.findUnique({
      where: { id },
      include: subscriptionInclude,
    })

    if (!sub) return { success: false, error: "Subscription not found" }

    return { success: true, data: serializeSubscription(sub) }
  } catch (error) {
    console.error("getSubscriptionById error:", error)
    return { success: false, error: "Failed to fetch subscription" }
  }
}

export async function createSubscription(data: {
  name: string
  vendorId: string
  logo: string
  color: string
  category: string
  plan: string
  billingCycle: BillingCycle
  amount: number
  nextRenewal: string
  seatsUsed?: number
  seatsTotal: number
  description?: string
  tags?: string[]
}): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const sub = await prisma.subscription.create({
      data: {
        name: data.name,
        vendorId: data.vendorId,
        logo: data.logo,
        color: data.color,
        category: data.category,
        plan: data.plan,
        billingCycle: data.billingCycle,
        amount: data.amount,
        nextRenewal: new Date(data.nextRenewal),
        seatsUsed: data.seatsUsed ?? 0,
        seatsTotal: data.seatsTotal,
        description: data.description,
        tags: data.tags?.length
          ? { create: data.tags.map((tag) => ({ tag })) }
          : undefined,
      },
    })

    await prisma.activity.create({
      data: {
        type: "created",
        description: `Subscription "${data.name}" was created`,
        subscriptionId: sub.id,
        amount: data.amount,
      },
    })

    updateTag("subscriptions")
    return { success: true, id: sub.id }
  } catch (error) {
    console.error("createSubscription error:", error)
    return { success: false, error: "Failed to create subscription" }
  }
}

export async function updateSubscription(
  id: string,
  data: {
    name?: string
    logo?: string
    color?: string
    category?: string
    plan?: string
    billingCycle?: BillingCycle
    amount?: number
    nextRenewal?: string
    seatsUsed?: number
    seatsTotal?: number
    description?: string
    status?: SubscriptionStatus
    autoRenew?: boolean
    tags?: string[]
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = { ...data }
    if (data.nextRenewal) updateData.nextRenewal = new Date(data.nextRenewal)
    if (data.tags !== undefined) {
      delete updateData.tags
    }

    await prisma.$transaction(async (tx) => {
      await tx.subscription.update({ where: { id }, data: updateData })

      if (data.tags !== undefined) {
        await tx.subscriptionTag.deleteMany({ where: { subscriptionId: id } })
        if (data.tags.length > 0) {
          await tx.subscriptionTag.createMany({
            data: data.tags.map((tag) => ({ subscriptionId: id, tag })),
          })
        }
      }

      await tx.activity.create({
        data: {
          type: "plan_change",
          description: `Subscription "${data.name ?? id}" was updated`,
          subscriptionId: id,
          amount: data.amount,
        },
      })
    })

    updateTag("subscriptions")
    updateTag("activities")
    return { success: true }
  } catch (error) {
    console.error("updateSubscription error:", error)
    return { success: false, error: "Failed to update subscription" }
  }
}

export async function deleteSubscription(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.activity.deleteMany({ where: { subscriptionId: id } })
      await tx.subscription.delete({ where: { id } })
    })
    updateTag("subscriptions")
    updateTag("activities")
    return { success: true }
  } catch (error) {
    console.error("deleteSubscription error:", error)
    return { success: false, error: "Failed to delete subscription" }
  }
}

export async function assignUserToSubscription(
  subscriptionId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.subscriptionUser.create({ data: { subscriptionId, userId } })
      await tx.subscription.update({
        where: { id: subscriptionId },
        data: { seatsUsed: { increment: 1 } },
      })

      const [sub, user] = await Promise.all([
        tx.subscription.findUnique({ where: { id: subscriptionId }, select: { name: true } }),
        tx.user.findUnique({ where: { id: userId }, select: { name: true } }),
      ])

      await tx.activity.create({
        data: {
          type: "seat_added",
          description: `${user?.name ?? "User"} was assigned to ${sub?.name ?? subscriptionId}`,
          subscriptionId,
          userId,
        },
      })
    })

    updateTag("subscriptions")
    updateTag("activities")
    return { success: true }
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "User is already assigned to this subscription" }
    }
    console.error("assignUserToSubscription error:", error)
    return { success: false, error: "Failed to assign user" }
  }
}

export async function removeUserFromSubscription(
  subscriptionId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.subscriptionUser.delete({
        where: { subscriptionId_userId: { subscriptionId, userId } },
      })
      await tx.subscription.update({
        where: { id: subscriptionId },
        data: { seatsUsed: { decrement: 1 } },
      })

      const [sub, user] = await Promise.all([
        tx.subscription.findUnique({ where: { id: subscriptionId }, select: { name: true } }),
        tx.user.findUnique({ where: { id: userId }, select: { name: true } }),
      ])

      await tx.activity.create({
        data: {
          type: "seat_removed",
          description: `${user?.name ?? "User"} was removed from ${sub?.name ?? subscriptionId}`,
          subscriptionId,
          userId,
        },
      })
    })

    updateTag("subscriptions")
    updateTag("activities")
    return { success: true }
  } catch (error) {
    console.error("removeUserFromSubscription error:", error)
    return { success: false, error: "Failed to remove user" }
  }
}
