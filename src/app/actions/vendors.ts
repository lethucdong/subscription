"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { SerializedVendor } from "@/types"
import { Prisma } from "@prisma/client"

function serializeVendor(vendor: any, computed?: {
  subscriptionCount?: number
  totalAnnualSpend?: number
  activeProductCount?: number
  teamNames?: string[]
}): SerializedVendor {
  return {
    id: vendor.id,
    name: vendor.name,
    logo: vendor.logo,
    website: vendor.website,
    description: vendor.description,
    category: vendor.category,
    createdAt: vendor.createdAt instanceof Date ? vendor.createdAt.toISOString() : vendor.createdAt,
    updatedAt: vendor.updatedAt instanceof Date ? vendor.updatedAt.toISOString() : vendor.updatedAt,
    subscriptionCount: computed?.subscriptionCount ?? vendor._count?.subscriptions ?? 0,
    totalAnnualSpend: computed?.totalAnnualSpend ?? 0,
    activeProductCount: computed?.activeProductCount ?? 0,
    teamNames: computed?.teamNames ?? [],
  }
}

export async function getVendors(): Promise<{ success: true; data: SerializedVendor[] } | { success: false; error: string }> {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        subscriptions: {
          include: {
            teamSubscriptions: { include: { team: { select: { name: true } } } },
          },
        },
        _count: { select: { subscriptions: true } },
      },
      orderBy: { name: "asc" },
    })

    const serialized = vendors.map((vendor) => {
      const totalAnnualSpend = vendor.subscriptions.reduce((sum, sub) => {
        const amount = sub.amount instanceof Prisma.Decimal ? sub.amount.toNumber() : Number(sub.amount)
        return sum + amount * 12
      }, 0)
      const activeProductCount = vendor.subscriptions.filter((s) => s.status === "ACTIVE").length
      const teamNamesSet = new Set<string>()
      vendor.subscriptions.forEach((sub) =>
        sub.teamSubscriptions.forEach((ts) => teamNamesSet.add(ts.team.name))
      )

      return serializeVendor(vendor, {
        subscriptionCount: vendor._count.subscriptions,
        totalAnnualSpend,
        activeProductCount,
        teamNames: Array.from(teamNamesSet),
      })
    })

    return { success: true, data: serialized }
  } catch (error) {
    console.error("getVendors error:", error)
    return { success: false, error: "Failed to fetch vendors" }
  }
}

export async function getVendorById(
  id: string
): Promise<{ success: true; data: SerializedVendor } | { success: false; error: string }> {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        subscriptions: { include: { teamSubscriptions: { include: { team: { select: { name: true } } } } } },
        _count: { select: { subscriptions: true } },
      },
    })
    if (!vendor) return { success: false, error: "Vendor not found" }

    const totalAnnualSpend = vendor.subscriptions.reduce((sum, sub) => {
      const amount = sub.amount instanceof Prisma.Decimal ? sub.amount.toNumber() : Number(sub.amount)
      return sum + amount * 12
    }, 0)

    return {
      success: true,
      data: serializeVendor(vendor, {
        subscriptionCount: vendor._count.subscriptions,
        totalAnnualSpend,
        activeProductCount: vendor.subscriptions.filter((s) => s.status === "ACTIVE").length,
      }),
    }
  } catch (error) {
    console.error("getVendorById error:", error)
    return { success: false, error: "Failed to fetch vendor" }
  }
}

export async function createVendor(data: {
  name: string
  logo: string
  category: string
  website?: string
  description?: string
}): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const vendor = await prisma.vendor.create({ data })
    revalidatePath("/vendors")
    revalidatePath("/subscriptions")
    return { success: true, id: vendor.id }
  } catch (error) {
    console.error("createVendor error:", error)
    return { success: false, error: "Failed to create vendor" }
  }
}

export async function updateVendor(
  id: string,
  data: { name?: string; logo?: string; category?: string; website?: string; description?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.vendor.update({ where: { id }, data })
    revalidatePath("/vendors")
    return { success: true }
  } catch (error) {
    console.error("updateVendor error:", error)
    return { success: false, error: "Failed to update vendor" }
  }
}

export async function deleteVendor(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.$transaction(async (tx) => {
      const subs = await tx.subscription.findMany({ where: { vendorId: id }, select: { id: true } })
      const subIds = subs.map(s => s.id)
      if (subIds.length > 0) {
        await tx.activity.deleteMany({ where: { subscriptionId: { in: subIds } } })
        await tx.subscription.deleteMany({ where: { vendorId: id } })
      }
      await tx.vendor.delete({ where: { id } })
    })
    revalidatePath("/vendors")
    revalidatePath("/subscriptions")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("deleteVendor error:", error)
    return { success: false, error: "Failed to delete vendor" }
  }
}
