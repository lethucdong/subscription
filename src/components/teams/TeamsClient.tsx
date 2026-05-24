"use client"

import { motion } from "framer-motion"
import { Users, DollarSign, Package } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { SerializedTeam } from "@/types"

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-600",
]

function computeTeamAnnualSpend(team: SerializedTeam): number {
  return team.subscriptions.reduce((sum, ts) => {
    if (!ts.subscription) return sum
    const sub = ts.subscription
    if (sub.status === "EXPIRED" || sub.status === "CANCELLED") return sum
    const amount = typeof sub.amount === "number" ? sub.amount : Number(sub.amount)
    return sum + amount * 12
  }, 0)
}

interface TeamsClientProps {
  teams: SerializedTeam[]
}

export function TeamsClient({ teams }: TeamsClientProps) {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Teams</h1>
        <p className="text-sm text-gray-500 mt-1">
          {teams.length} teams · manage subscription access by team
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team, i) => {
          const annualSpend = computeTeamAnnualSpend(team)
          const spendDisplay = annualSpend >= 1000
            ? `$${Math.round(annualSpend / 1000 * 10) / 10}k`
            : formatCurrency(annualSpend)

          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="rounded-2xl border border-white/[0.08] bg-gray-900/50 p-5 backdrop-blur-sm hover:border-white/[0.14] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white bg-gradient-to-br",
                  avatarColors[i % avatarColors.length]
                )}>
                  {team.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{team.name}</h3>
                  <p className="text-xs text-gray-500">{team.members.length} members</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 text-center">
                  <Users className="h-3.5 w-3.5 text-gray-500 mx-auto mb-1" />
                  <p className="text-sm font-semibold text-white">{team.members.length}</p>
                  <p className="text-[10px] text-gray-600">Members</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 text-center">
                  <Package className="h-3.5 w-3.5 text-gray-500 mx-auto mb-1" />
                  <p className="text-sm font-semibold text-white">{team.subscriptions.length}</p>
                  <p className="text-[10px] text-gray-600">Products</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 text-center">
                  <DollarSign className="h-3.5 w-3.5 text-gray-500 mx-auto mb-1" />
                  <p className="text-sm font-semibold text-white tabular-nums">
                    {spendDisplay}
                  </p>
                  <p className="text-[10px] text-gray-600">Spend/yr</p>
                </div>
              </div>

              {/* Subscriptions */}
              {team.subscriptions.length > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mb-2">Subscriptions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {team.subscriptions.map(ts => ts.subscription && (
                      <span
                        key={ts.id}
                        className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-400"
                      >
                        {ts.subscription.logo} {ts.subscription.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Members avatars */}
              {team.members.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-2">Members</p>
                  <div className="flex -space-x-1.5">
                    {team.members.slice(0, 6).map((member) => (
                      <div
                        key={member.id}
                        className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 border border-gray-900 flex items-center justify-center text-[8px] font-semibold text-white"
                        title={member.user.name}
                      >
                        {member.user.avatar}
                      </div>
                    ))}
                    {team.members.length > 6 && (
                      <div className="h-6 w-6 rounded-full bg-gray-800 border border-gray-900 flex items-center justify-center text-[8px] text-gray-400">
                        +{team.members.length - 6}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
