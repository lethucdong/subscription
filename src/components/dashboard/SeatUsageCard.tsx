"use client"

import Link from "next/link"
import { Users, ExternalLink, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { SerializedSubscription } from "@/types"

interface SeatUsageCardProps {
  subscriptions: SerializedSubscription[]
}

export function SeatUsageCard({ subscriptions }: SeatUsageCardProps) {
  const nonExpired = subscriptions.filter(s => s.status !== "EXPIRED" && s.status !== "CANCELLED")
  const sorted = [...nonExpired].sort((a, b) => {
    const pctA = a.seatsUsed / a.seatsTotal
    const pctB = b.seatsUsed / b.seatsTotal
    return pctB - pctA
  })

  const totalUsed = subscriptions.reduce((sum, s) => sum + s.seatsUsed, 0)
  const totalAvailable = subscriptions.reduce((sum, s) => sum + s.seatsTotal, 0)
  const overallPct = totalAvailable > 0 ? Math.round((totalUsed / totalAvailable) * 100) : 0

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gray-900/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Seat Usage
          </h3>
          <p className="mt-1 text-sm text-gray-300">
            <span className="text-white font-semibold">{totalUsed}</span>
            <span className="text-gray-500"> / {totalAvailable} seats used ({overallPct}%)</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
            <Users className="h-4 w-4 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map((sub) => {
          const pct = sub.seatsTotal > 0 ? Math.round((sub.seatsUsed / sub.seatsTotal) * 100) : 0
          const isAtCapacity = pct >= 100
          const isNearCapacity = pct >= 70

          return (
            <Link key={sub.id} href={`/subscriptions/${sub.id}`}>
              <div className="group space-y-2 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{sub.logo}</span>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {sub.name}
                    </span>
                    {isAtCapacity && (
                      <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-medium tabular-nums",
                        isAtCapacity
                          ? "text-red-400"
                          : isNearCapacity
                          ? "text-amber-400"
                          : "text-gray-500"
                      )}
                    >
                      {sub.seatsUsed}/{sub.seatsTotal}
                    </span>
                    <span className="text-xs text-gray-700 tabular-nums">
                      {pct}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={sub.seatsUsed}
                  max={sub.seatsTotal}
                  size="sm"
                  animated={true}
                />
              </div>
            </Link>
          )
        })}
      </div>

      <Link
        href="/subscriptions"
        className="mt-5 flex items-center justify-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors pt-4 border-t border-white/[0.06]"
      >
        Manage seats
        <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  )
}
