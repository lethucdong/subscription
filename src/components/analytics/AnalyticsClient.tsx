"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { SpendingChart } from "@/components/dashboard/SpendingChart"
import { VendorSpendChart } from "@/components/dashboard/VendorSpendChart"
import { formatCurrency } from "@/lib/utils"
import type { DashboardStats } from "@/types"

interface AnalyticsClientProps {
  stats: DashboardStats | null
}

export function AnalyticsClient({ stats }: AnalyticsClientProps) {
  const monthlySpending = stats?.monthlySpending ?? []

  const avgMonthly = monthlySpending.length > 0
    ? Math.round(monthlySpending.reduce((s, m) => s + m.amount, 0) / monthlySpending.length)
    : 0

  const maxMonth = monthlySpending.length > 0
    ? monthlySpending.reduce((a, b) => (a.amount > b.amount ? a : b))
    : null

  const minMonth = monthlySpending.length > 0
    ? monthlySpending.reduce((a, b) => (a.amount < b.amount ? a : b))
    : null

  const totalYearly = monthlySpending.reduce((s, m) => s + m.amount, 0)

  const categorySpend = stats?.categorySpend ?? {}
  const totalCategorySpend = Object.values(categorySpend).reduce((a, b) => a + b, 0)
  const sortedCategories = Object.entries(categorySpend).sort(([, a], [, b]) => b - a)

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Spending trends and insights across your subscriptions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: DollarSign,
            label: "Avg Monthly Spend",
            value: formatCurrency(avgMonthly),
            sub: null,
            color: "text-violet-400",
            bg: "bg-violet-500/10",
          },
          {
            icon: TrendingUp,
            label: "Peak Month",
            value: maxMonth?.month ?? "—",
            sub: maxMonth ? formatCurrency(maxMonth.amount) : null,
            color: "text-red-400",
            bg: "bg-red-500/10",
          },
          {
            icon: TrendingDown,
            label: "Lowest Month",
            value: minMonth?.month ?? "—",
            sub: minMonth ? formatCurrency(minMonth.amount) : null,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            icon: BarChart3,
            label: "12-Month Total",
            value: formatCurrency(totalYearly),
            sub: null,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/[0.08] bg-gray-900/50 p-5"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
            <p className="text-xl font-bold text-white mt-1 tabular-nums">{stat.value}</p>
            {stat.sub && <p className="text-xs text-gray-500 mt-0.5">{stat.sub}</p>}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SpendingChart data={monthlySpending} />
        </div>
        <div>
          <VendorSpendChart vendors={stats?.vendorSpending ?? []} />
        </div>
      </div>

      {/* Category breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-white/[0.08] bg-gray-900/50 p-6"
      >
        <h2 className="text-sm font-semibold text-white mb-4">Spend by Category</h2>
        <div className="space-y-3">
          {sortedCategories.map(([cat, spend]) => {
            const pct = totalCategorySpend > 0 ? Math.round((spend / totalCategorySpend) * 100) : 0
            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{cat}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 tabular-nums">{pct}%</span>
                    <span className="text-white font-medium tabular-nums w-20 text-right">
                      {formatCurrency(spend)}/yr
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400"
                  />
                </div>
              </div>
            )
          })}
          {sortedCategories.length === 0 && (
            <p className="text-sm text-gray-600 text-center py-4">No subscription data available</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
