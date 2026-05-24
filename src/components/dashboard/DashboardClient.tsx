"use client"

import { DollarSign, Package, AlertTriangle, Users, TrendingUp, Building2 } from "lucide-react"
import { StatCard } from "@/components/dashboard/StatCard"
import { SpendingChart } from "@/components/dashboard/SpendingChart"
import { VendorSpendChart } from "@/components/dashboard/VendorSpendChart"
import { RenewalTimeline } from "@/components/dashboard/RenewalTimeline"
import { SeatUsageCard } from "@/components/dashboard/SeatUsageCard"
import { formatCurrency } from "@/lib/utils"
import type { DashboardStats, SerializedSubscription } from "@/types"

interface DashboardClientProps {
  stats: DashboardStats | null
  subscriptions: SerializedSubscription[]
}

export function DashboardClient({ stats, subscriptions }: DashboardClientProps) {
  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your SaaS subscriptions and spending
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        <StatCard
          title="Monthly Spend"
          value={formatCurrency(stats?.totalMonthlyCost ?? 0)}
          subtitle="Across all subscriptions"
          trend={{ value: "2.4%", positive: false }}
          icon={DollarSign}
          iconColor="text-violet-400"
          iconBg="bg-violet-500/10"
          delay={0}
        />
        <StatCard
          title="Active Subscriptions"
          value={String(stats?.activeCount ?? 0)}
          subtitle={`${stats?.expiringCount ?? 0} expiring soon`}
          icon={Package}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          delay={0.05}
        />
        <StatCard
          title="Expiring Soon"
          value={String(stats?.expiringCount ?? 0)}
          subtitle="In the next 30 days"
          icon={AlertTriangle}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
          delay={0.1}
        />
        <StatCard
          title="Total Seats"
          value={String(stats?.usedSeats ?? 0)}
          subtitle={`of ${stats?.totalSeats ?? 0} available`}
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          delay={0.15}
        />
        <StatCard
          title="Annual Run Rate"
          value={formatCurrency(stats?.annualizedSpend ?? 0)}
          subtitle="Projected yearly cost"
          icon={TrendingUp}
          iconColor="text-pink-400"
          iconBg="bg-pink-500/10"
          delay={0.2}
        />
        <StatCard
          title="Vendors"
          value={String(stats?.vendorCount ?? 0)}
          subtitle="Unique software vendors"
          icon={Building2}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10"
          delay={0.25}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SpendingChart data={stats?.monthlySpending ?? []} />
        </div>
        <div>
          <VendorSpendChart vendors={stats?.vendorSpending ?? []} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RenewalTimeline subscriptions={subscriptions} />
        <SeatUsageCard subscriptions={subscriptions} />
      </div>
    </div>
  )
}
