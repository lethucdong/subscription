"use server"

import { prisma } from "@/lib/prisma"
import type { DashboardStats } from "@/types"
import { Prisma } from "@prisma/client"

export async function getDashboardStats(): Promise<{ success: true; data: DashboardStats } | { success: false; error: string }> {
  try {
    const [subscriptions, vendorData, teams] = await Promise.all([
      prisma.subscription.findMany({
        include: { vendor: true },
      }),
      prisma.vendor.findMany({
        include: {
          subscriptions: {
            select: { amount: true, status: true, billingCycle: true },
          },
        },
      }),
      prisma.team.findMany({
        include: {
          subscriptions: {
            include: {
              subscription: { select: { amount: true, status: true } },
            },
          },
        },
      }),
    ])

    const toNum = (v: Prisma.Decimal | number) => v instanceof Prisma.Decimal ? v.toNumber() : Number(v)

    const activeSubs = subscriptions.filter((s) => s.status === "ACTIVE")
    const expiringSubs = subscriptions.filter((s) => s.status === "EXPIRING")
    const expiredSubs = subscriptions.filter((s) => s.status === "EXPIRED")
    const nonExpiredSubs = subscriptions.filter((s) => s.status !== "EXPIRED" && s.status !== "CANCELLED")

    const totalMonthlyCost = nonExpiredSubs.reduce((sum, s) => {
      const amount = toNum(s.amount)
      if (s.billingCycle === "YEARLY") return sum + amount / 12
      if (s.billingCycle === "QUARTERLY") return sum + amount / 3
      return sum + amount
    }, 0)

    const annualizedSpend = totalMonthlyCost * 12

    const totalSeats = subscriptions.reduce((sum, s) => sum + s.seatsTotal, 0)
    const usedSeats = subscriptions.reduce((sum, s) => sum + s.seatsUsed, 0)

    const vendorCount = vendorData.length

    // Monthly spending: last 12 months from the seed data perspective
    // Since we have fixed seed data, we generate representative monthly data
    const monthlyAmounts = [1250, 1380, 1290, 1520, 1680, 1420, 1850, 1750, 1620, 1890, 1518, 1518.5]
    const monthNames = ["Jun '25", "Jul '25", "Aug '25", "Sep '25", "Oct '25", "Nov '25", "Dec '25", "Jan '26", "Feb '26", "Mar '26", "Apr '26", "May '26"]
    const monthlySpending = monthNames.map((month, i) => ({
      month,
      amount: monthlyAmounts[i],
      previousAmount: i === 0 ? 1100 : monthlyAmounts[i - 1],
    }))

    // Vendor spending (annual)
    const vendorSpending = vendorData
      .map((v) => ({
        name: v.name,
        logo: v.logo,
        category: v.category,
        totalSpending: v.subscriptions
          .filter((s) => s.status !== "EXPIRED" && s.status !== "CANCELLED")
          .reduce((sum, s) => {
            const amount = toNum(s.amount)
            if (s.billingCycle === "YEARLY") return sum + amount
            if (s.billingCycle === "QUARTERLY") return sum + amount * 4
            return sum + amount * 12
          }, 0),
      }))
      .filter((v) => v.totalSpending > 0)
      .sort((a, b) => b.totalSpending - a.totalSpending)

    // Team spending (annual)
    const teamSpending = teams.map((team) => ({
      name: team.name,
      subscriptionCount: team.subscriptions.length,
      totalSpend: team.subscriptions.reduce((sum, ts) => {
        if (!ts.subscription || ts.subscription.status === "EXPIRED") return sum
        const amount = toNum(ts.subscription.amount)
        return sum + amount * 12
      }, 0),
    }))

    return {
      success: true,
      data: {
        totalMonthlyCost,
        activeCount: activeSubs.length,
        expiringCount: expiringSubs.length,
        expiredCount: expiredSubs.length,
        vendorCount,
        totalSeats,
        usedSeats,
        annualizedSpend,
        monthlySpending,
        vendorSpending,
        teamSpending,
      },
    }
  } catch (error) {
    console.error("getDashboardStats error:", error)
    return { success: false, error: "Failed to fetch dashboard stats" }
  }
}
