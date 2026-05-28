"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Users, DollarSign, Package, Plus, MoreVertical, Pencil, Trash2, Settings } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { deleteTeam } from "@/app/actions/teams"
import { TeamFormModal } from "@/components/teams/TeamFormModal"
import { TeamManageModal } from "@/components/teams/TeamManageModal"
import type { SerializedTeam, SerializedUser, SerializedSubscription } from "@/types"

function computeTeamAnnualSpend(team: SerializedTeam): number {
  return team.subscriptions.reduce((sum, ts) => {
    if (!ts.subscription) return sum
    const sub = ts.subscription
    if (sub.status === "EXPIRED" || sub.status === "CANCELLED") return sum
    const amount = typeof sub.amount === "number" ? sub.amount : Number(sub.amount)
    return sum + amount * 12
  }, 0)
}

interface TeamCardMenuProps {
  team: SerializedTeam
  onManage: () => void
  onEdit: () => void
  onDelete: () => void
}

function TeamCardMenu({ team, onManage, onEdit, onDelete }: TeamCardMenuProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg p-1.5 text-gray-500 hover:text-gray-200 hover:bg-white/[0.06] transition-colors"
        aria-label={`Open menu for ${team.name}`}
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-white/[0.1] bg-gray-900 shadow-xl overflow-hidden">
            <button
              onClick={() => {
                setOpen(false)
                onManage()
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/[0.06] transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              Manage
            </button>
            <button
              onClick={() => {
                setOpen(false)
                onEdit()
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/[0.06] transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={() => {
                setOpen(false)
                onDelete()
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-600",
]

interface TeamsClientProps {
  teams: SerializedTeam[]
  allUsers: SerializedUser[]
  allSubscriptions: SerializedSubscription[]
}

export function TeamsClient({ teams, allUsers, allSubscriptions }: TeamsClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<SerializedTeam | null>(null)
  const [managing, setManaging] = useState<SerializedTeam | null>(null)

  function handleDelete(team: SerializedTeam) {
    if (
      !confirm(
        `Delete team "${team.name}"? Members and subscription links will be removed; users/subscriptions themselves are kept.`
      )
    )
      return
    startTransition(async () => {
      const result = await deleteTeam(team.id)
      if (result.success) router.refresh()
      else alert(result.error ?? "Failed to delete team")
    })
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
      {addOpen && <TeamFormModal mode="create" onClose={() => setAddOpen(false)} />}
      {editing && (
        <TeamFormModal mode="edit" team={editing} onClose={() => setEditing(null)} />
      )}
      {managing && (
        <TeamManageModal
          team={managing}
          allUsers={allUsers}
          allSubscriptions={allSubscriptions}
          onClose={() => setManaging(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Teams</h1>
          <p className="text-sm text-gray-500 mt-1">
            {teams.length} teams · manage subscription access by team
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.97] px-4 py-2.5 text-sm font-medium text-white transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-gray-900/50 py-16 text-center">
          <Users className="h-8 w-8 text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No teams yet</p>
          <p className="text-xs text-gray-700 mt-1">Create your first team to start grouping subscriptions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team, i) => {
            const annualSpend = computeTeamAnnualSpend(team)
            const spendDisplay =
              annualSpend >= 1000
                ? `$${Math.round((annualSpend / 1000) * 10) / 10}k`
                : formatCurrency(annualSpend)

            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -2 }}
                className={cn(
                  "rounded-2xl border border-white/[0.08] bg-gray-900/50 p-5 backdrop-blur-sm hover:border-white/[0.14] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-200",
                  isPending && "opacity-60"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => setManaging(team)}
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white bg-gradient-to-br",
                        avatarColors[i % avatarColors.length]
                      )}
                      style={team.color ? { background: team.color } : undefined}
                    >
                      {team.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{team.name}</h3>
                      <p className="text-xs text-gray-500">{team.members.length} members</p>
                    </div>
                  </div>
                  <TeamCardMenu
                    team={team}
                    onManage={() => setManaging(team)}
                    onEdit={() => setEditing(team)}
                    onDelete={() => handleDelete(team)}
                  />
                </div>

                {team.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{team.description}</p>
                )}

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
                    <p className="text-sm font-semibold text-white tabular-nums">{spendDisplay}</p>
                    <p className="text-[10px] text-gray-600">Spend/yr</p>
                  </div>
                </div>

                {team.subscriptions.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Subscriptions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {team.subscriptions.map(
                        (ts) =>
                          ts.subscription && (
                            <span
                              key={ts.id}
                              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-400"
                            >
                              {ts.subscription.logo} {ts.subscription.name}
                            </span>
                          )
                      )}
                    </div>
                  </div>
                )}

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
      )}
    </div>
  )
}
