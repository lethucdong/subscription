"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { X, UserPlus, UserMinus, Package, PackagePlus, PackageMinus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  addTeamMember,
  removeTeamMember,
  assignSubscriptionToTeam,
  removeSubscriptionFromTeam,
} from "@/app/actions/teams"
import type { SerializedTeam, SerializedUser, SerializedSubscription } from "@/types"

type Tab = "members" | "subscriptions"

interface Props {
  team: SerializedTeam
  allUsers: SerializedUser[]
  allSubscriptions: SerializedSubscription[]
  onClose: () => void
}

export function TeamManageModal({ team, allUsers, allSubscriptions, onClose }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState<Tab>("members")
  const [error, setError] = useState<string | null>(null)

  const memberIds = new Set(team.members.map((m) => m.userId))
  const subIds = new Set(team.subscriptions.map((s) => s.subscriptionId))
  const availableUsers = allUsers.filter((u) => !memberIds.has(u.id))
  const availableSubs = allSubscriptions.filter((s) => !subIds.has(s.id))

  function withRefresh(action: () => Promise<{ success: boolean; error?: string }>) {
    setError(null)
    startTransition(async () => {
      const result = await action()
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error ?? "Operation failed")
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-gray-900 shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white"
              style={{ background: team.color }}
            >
              {team.avatar}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{team.name}</h3>
              <p className="text-xs text-gray-500">Manage members and subscriptions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 px-6 py-3 border-b border-white/[0.06]">
          {(
            [
              { key: "members" as Tab, label: "Members", count: team.members.length },
              { key: "subscriptions" as Tab, label: "Subscriptions", count: team.subscriptions.length },
            ]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                tab === t.key
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              {t.label}
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/[0.06] text-gray-400 min-w-[20px] text-center">
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {tab === "members" ? (
            <>
              <section>
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Current members
                </h4>
                {team.members.length === 0 ? (
                  <p className="text-xs text-gray-600 py-4 text-center">No members yet</p>
                ) : (
                  <div className="space-y-1.5">
                    {team.members.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                      >
                        <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-semibold text-white">
                          {m.user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-200 truncate">{m.user.name}</p>
                          <p className="text-[10px] text-gray-600 truncate">{m.user.email}</p>
                        </div>
                        <button
                          onClick={() =>
                            withRefresh(() => removeTeamMember(team.id, m.userId))
                          }
                          disabled={isPending}
                          className="text-gray-600 hover:text-red-400 transition-colors disabled:opacity-40"
                          aria-label="Remove member"
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Add member
                </h4>
                {availableUsers.length === 0 ? (
                  <p className="text-xs text-gray-600 py-4 text-center">
                    All users are already on this team
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {availableUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => withRefresh(() => addTeamMember(team.id, u.id))}
                        disabled={isPending}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-left hover:bg-violet-500/10 hover:border-violet-500/20 transition-colors disabled:opacity-40 group"
                      >
                        <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-[10px] font-semibold text-white group-hover:from-violet-500 group-hover:to-purple-700 transition-colors">
                          {u.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-200 truncate">{u.name}</p>
                          <p className="text-[10px] text-gray-600 truncate">{u.email}</p>
                        </div>
                        <UserPlus className="h-3.5 w-3.5 text-gray-600 group-hover:text-violet-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <>
              <section>
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Assigned subscriptions
                </h4>
                {team.subscriptions.length === 0 ? (
                  <p className="text-xs text-gray-600 py-4 text-center">No subscriptions yet</p>
                ) : (
                  <div className="space-y-1.5">
                    {team.subscriptions.map((ts) => (
                      <div
                        key={ts.id}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                      >
                        <span className="text-lg w-7 text-center">{ts.subscription.logo}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-200 truncate">
                            {ts.subscription.name}
                          </p>
                          <p className="text-[10px] text-gray-600 truncate">
                            {ts.subscription.vendor.name} · {ts.subscription.plan}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            withRefresh(() => removeSubscriptionFromTeam(team.id, ts.subscriptionId))
                          }
                          disabled={isPending}
                          className="text-gray-600 hover:text-red-400 transition-colors disabled:opacity-40"
                          aria-label="Remove subscription"
                        >
                          <PackageMinus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Add subscription
                </h4>
                {availableSubs.length === 0 ? (
                  <p className="text-xs text-gray-600 py-4 text-center">
                    All subscriptions are already on this team
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {availableSubs.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => withRefresh(() => assignSubscriptionToTeam(team.id, sub.id))}
                        disabled={isPending}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-left hover:bg-violet-500/10 hover:border-violet-500/20 transition-colors disabled:opacity-40 group"
                      >
                        <span className="text-lg w-7 text-center">{sub.logo}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-200 truncate">{sub.name}</p>
                          <p className="text-[10px] text-gray-600 truncate">{sub.vendor.name}</p>
                        </div>
                        <PackagePlus className="h-3.5 w-3.5 text-gray-600 group-hover:text-violet-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
