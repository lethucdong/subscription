"use client"

import { AlertTriangle, Clock, CheckCircle2, ExternalLink } from "lucide-react"
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { SerializedSubscription } from "@/types"

function getRenewalUrgency(days: number): "urgent" | "warning" | "healthy" {
  if (days <= 0) return "urgent"
  if (days <= 14) return "urgent"
  if (days <= 30) return "warning"
  return "healthy"
}

const urgencyConfig = {
  urgent: {
    icon: AlertTriangle,
    iconColor: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    badge: "bg-red-500/10 text-red-400",
    dot: "bg-red-400",
  },
  warning: {
    icon: Clock,
    iconColor: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    badge: "bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400",
  },
  healthy: {
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    badge: "bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-400",
  },
}

interface RenewalTimelineProps {
  subscriptions: SerializedSubscription[]
}

export function RenewalTimeline({ subscriptions }: RenewalTimelineProps) {
  const sorted = [...subscriptions]
    .filter(s => s.status !== "EXPIRED" && s.status !== "CANCELLED")
    .sort((a, b) => new Date(a.nextRenewal).getTime() - new Date(b.nextRenewal).getTime())

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gray-900/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Renewal Timeline
          </h3>
          <p className="mt-1 text-sm text-gray-300">
            {sorted.filter(s => daysUntil(s.nextRenewal) <= 30).length} renewals in 30 days
          </p>
        </div>
        <Link
          href="/subscriptions"
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
        >
          View all
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {sorted.map((sub) => {
          const days = daysUntil(sub.nextRenewal)
          const urgency = getRenewalUrgency(days)
          const config = urgencyConfig[urgency]
          const Icon = config.icon

          return (
            <Link key={sub.id} href={`/subscriptions/${sub.id}`}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 cursor-pointer",
                  "hover:bg-white/[0.03]",
                  urgency === "urgent"
                    ? "border-red-500/20 bg-red-500/5"
                    : urgency === "warning"
                    ? "border-amber-500/20 bg-amber-500/5"
                    : "border-white/[0.06] bg-transparent"
                )}
              >
                <span className="text-lg">{sub.logo}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {sub.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(sub.nextRenewal)}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-white tabular-nums">
                    {formatCurrency(sub.amount)}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1",
                      config.badge
                    )}
                  >
                    <Icon className={cn("h-3 w-3", config.iconColor)} />
                    {days <= 0
                      ? "Today"
                      : days === 1
                      ? "Tomorrow"
                      : `${days}d`}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
