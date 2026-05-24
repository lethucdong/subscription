"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Grid3x3, List, Plus, ArrowUpDown } from "lucide-react"
import { Badge, StatusBadge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { AddSubscriptionModal } from "@/components/subscriptions/AddSubscriptionModal"
import type { SerializedSubscription, SerializedVendor, SubscriptionStatus } from "@/types"

type FilterTab = "all" | SubscriptionStatus

const tabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ACTIVE", label: "Active" },
  { key: "EXPIRING", label: "Expiring" },
  { key: "EXPIRED", label: "Expired" },
]

function SubscriptionCard({ sub }: { sub: SerializedSubscription }) {
  const pct = sub.seatsTotal > 0 ? Math.round((sub.seatsUsed / sub.seatsTotal) * 100) : 0
  const days = daysUntil(sub.nextRenewal)

  return (
    <Link href={`/subscriptions/${sub.id}`}>
      <div className="group relative rounded-2xl border border-white/[0.08] bg-gray-900/50 p-5 hover:border-white/[0.14] hover:bg-gray-900/70 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-pointer">
        {/* Gradient accent based on status */}
        <div
          className="absolute top-0 left-0 right-0 h-px rounded-t-2xl opacity-60"
          style={{
            background: sub.status === "ACTIVE"
              ? "linear-gradient(90deg, transparent, #10b981, transparent)"
              : sub.status === "EXPIRING"
              ? "linear-gradient(90deg, transparent, #f59e0b, transparent)"
              : "linear-gradient(90deg, transparent, #ef4444, transparent)"
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
              style={{ background: `${sub.color}15`, border: `1px solid ${sub.color}25` }}
            >
              {sub.logo}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white group-hover:text-violet-200 transition-colors">
                {sub.name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{sub.vendor.name}</p>
            </div>
          </div>
          <StatusBadge status={sub.status.toLowerCase() as any} />
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Amount</span>
            <span className="text-sm font-semibold text-white tabular-nums">
              {formatCurrency(sub.amount)}
              <span className="text-xs font-normal text-gray-600">/{sub.billingCycle === "MONTHLY" ? "mo" : sub.billingCycle === "YEARLY" ? "yr" : "qtr"}</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Next Renewal</span>
            <span className={cn(
              "text-xs font-medium",
              sub.status === "EXPIRED" ? "text-red-400" :
              days <= 14 ? "text-amber-400" : "text-gray-300"
            )}>
              {sub.status === "EXPIRED" ? "Expired" : `${formatDate(sub.nextRenewal)} (${days}d)`}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Seats</span>
              <span className={cn(
                "font-medium",
                pct >= 90 ? "text-red-400" : pct >= 70 ? "text-amber-400" : "text-gray-400"
              )}>
                {sub.seatsUsed}/{sub.seatsTotal} ({pct}%)
              </span>
            </div>
            <Progress value={sub.seatsUsed} max={sub.seatsTotal} size="sm" />
          </div>
        </div>

        {/* Footer tags */}
        <div className="mt-4 flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className="text-[10px] py-0">{sub.category}</Badge>
          <Badge variant="outline" className="text-[10px] py-0">{sub.plan}</Badge>
        </div>
      </div>
    </Link>
  )
}

function SubscriptionRow({ sub }: { sub: SerializedSubscription }) {
  const pct = sub.seatsTotal > 0 ? Math.round((sub.seatsUsed / sub.seatsTotal) * 100) : 0
  const days = daysUntil(sub.nextRenewal)

  return (
    <Link href={`/subscriptions/${sub.id}`}>
      <div className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-gray-900/30 px-4 py-3.5 hover:border-white/[0.12] hover:bg-gray-900/60 transition-all duration-150 cursor-pointer">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xl shrink-0">{sub.logo}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">
              {sub.name}
            </p>
            <p className="text-xs text-gray-600">{sub.vendor.name}</p>
          </div>
        </div>

        <StatusBadge status={sub.status.toLowerCase() as any} />

        <div className="w-28 text-right shrink-0">
          <p className="text-sm font-semibold text-white tabular-nums">
            {formatCurrency(sub.amount)}
          </p>
          <p className="text-xs text-gray-600">/{sub.billingCycle === "MONTHLY" ? "mo" : sub.billingCycle === "YEARLY" ? "yr" : "qtr"}</p>
        </div>

        <div className="w-32 shrink-0">
          <p className={cn(
            "text-xs font-medium",
            sub.status === "EXPIRED" ? "text-red-400" :
            days <= 14 ? "text-amber-400" : "text-gray-400"
          )}>
            {sub.status === "EXPIRED" ? "Expired" : formatDate(sub.nextRenewal)}
          </p>
          {sub.status !== "EXPIRED" && (
            <p className="text-[10px] text-gray-600">{days} days</p>
          )}
        </div>

        <div className="w-36 shrink-0">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className={cn(
              pct >= 90 ? "text-red-400" : pct >= 70 ? "text-amber-400" : "text-gray-500"
            )}>
              {sub.seatsUsed}/{sub.seatsTotal}
            </span>
            <span className="text-gray-700">{pct}%</span>
          </div>
          <Progress value={sub.seatsUsed} max={sub.seatsTotal} size="sm" />
        </div>
      </div>
    </Link>
  )
}

interface SubscriptionsClientProps {
  initialSubscriptions: SerializedSubscription[]
  vendors: SerializedVendor[]
}

export function SubscriptionsClient({ initialSubscriptions, vendors }: SubscriptionsClientProps) {
  const router = useRouter()
  const [isRefreshing, startRefresh] = useTransition()
  const [filter, setFilter] = useState<FilterTab>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  function handleAdded() {
    setModalOpen(false)
    startRefresh(() => { router.refresh() })
  }

  const filtered = initialSubscriptions.filter(sub => {
    const matchesFilter = filter === "all" || sub.status === filter
    const matchesSearch =
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.vendor.name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const counts = {
    all: initialSubscriptions.length,
    ACTIVE: initialSubscriptions.filter(s => s.status === "ACTIVE").length,
    EXPIRING: initialSubscriptions.filter(s => s.status === "EXPIRING").length,
    EXPIRED: initialSubscriptions.filter(s => s.status === "EXPIRED").length,
    CANCELLED: initialSubscriptions.filter(s => s.status === "CANCELLED").length,
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-1">
            {initialSubscriptions.length} subscriptions tracked
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.97] px-4 py-2.5 text-sm font-medium text-white transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Subscription
        </button>
      </div>

      <AddSubscriptionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleAdded}
        vendors={vendors}
      />

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Tab filters */}
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-gray-900/50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
                filter === tab.key
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center tabular-nums",
                  filter === tab.key
                    ? "bg-violet-500/20 text-violet-300"
                    : "bg-white/[0.06] text-gray-600"
                )}
              >
                {counts[tab.key] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-gray-900/50 py-2 pl-9 pr-4 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
          />
        </div>

        {/* View & Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-gray-900/50 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors">
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort
          </button>
          <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-gray-900/50 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-lg p-1.5 transition-colors",
                viewMode === "grid" ? "bg-violet-500/15 text-violet-300" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded-lg p-1.5 transition-colors",
                viewMode === "list" ? "bg-violet-500/15 text-violet-300" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Refresh loading bar */}
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-violet-500/20">
          <div className="h-full bg-violet-500 w-[90%] transition-all duration-[6000ms] ease-out" />
        </div>
      )}

      {/* Subscriptions grid/list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gray-900 border border-white/[0.08] flex items-center justify-center text-3xl mb-4">
            🔍
          </div>
          <p className="text-gray-400 font-medium">No subscriptions found</p>
          <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((sub) => (
            <SubscriptionCard key={sub.id} sub={sub} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* List header */}
          <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-600">
            <span className="flex-1">Subscription</span>
            <span className="w-24">Status</span>
            <span className="w-28 text-right">Amount</span>
            <span className="w-32">Renewal</span>
            <span className="w-36">Seats</span>
          </div>
          {filtered.map((sub) => (
            <SubscriptionRow key={sub.id} sub={sub} />
          ))}
        </div>
      )}
    </div>
  )
}
