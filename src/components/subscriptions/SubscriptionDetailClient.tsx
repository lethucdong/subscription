"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Users,
  Tag,
  UserPlus,
  RefreshCw,
  XCircle,
  CheckCircle,
  Package,
  Clock,
  DollarSign,
  X,
} from "lucide-react"
import { StatusBadge, Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { assignUserToSubscription, removeUserFromSubscription, deleteSubscription } from "@/app/actions/subscriptions"
import type { SerializedSubscription, SerializedActivity, SerializedUser } from "@/types"

function ActivityIcon({ type }: { type: string }) {
  const config: Record<string, { icon: typeof RefreshCw; bg: string; color: string }> = {
    renewal: { icon: RefreshCw, bg: "bg-emerald-500/10", color: "text-emerald-400" },
    payment: { icon: DollarSign, bg: "bg-blue-500/10", color: "text-blue-400" },
    seat_added: { icon: UserPlus, bg: "bg-violet-500/10", color: "text-violet-400" },
    seat_removed: { icon: Users, bg: "bg-gray-500/10", color: "text-gray-400" },
    plan_change: { icon: Package, bg: "bg-cyan-500/10", color: "text-cyan-400" },
    cancelled: { icon: XCircle, bg: "bg-red-500/10", color: "text-red-400" },
    created: { icon: CheckCircle, bg: "bg-emerald-500/10", color: "text-emerald-400" },
  }
  const c = config[type] || { icon: Clock, bg: "bg-gray-500/10", color: "text-gray-400" }
  const Icon = c.icon
  return (
    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", c.bg)}>
      <Icon className={cn("h-4 w-4", c.color)} />
    </div>
  )
}

interface AssignUserModalProps {
  subscriptionId: string
  assignedUserIds: string[]
  allUsers: SerializedUser[]
  onClose: () => void
}

function AssignUserModal({ subscriptionId, assignedUserIds, allUsers, onClose }: AssignUserModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const availableUsers = allUsers.filter(u => !assignedUserIds.includes(u.id))

  function handleAssign(userId: string) {
    setError(null)
    startTransition(async () => {
      const result = await assignUserToSubscription(subscriptionId, userId)
      if (result.success) {
        router.refresh()
        onClose()
      } else {
        setError(result.error ?? "Failed to assign user")
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-sm rounded-2xl border border-white/[0.12] bg-gray-900 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Assign User</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        {availableUsers.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">All users are already assigned</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleAssign(user.id)}
                disabled={isPending}
                className="w-full flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 hover:bg-white/[0.06] transition-colors text-left disabled:opacity-50"
              >
                <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-semibold text-white">
                  {user.avatar}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-200">{user.name}</p>
                  <p className="text-[10px] text-gray-600">{user.email}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

interface Props {
  subscription: SerializedSubscription
  activities: SerializedActivity[]
  allUsers: SerializedUser[]
}

export function SubscriptionDetailClient({ subscription: sub, activities, allUsers }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [assignModalOpen, setAssignModalOpen] = useState(false)

  const days = daysUntil(sub.nextRenewal)
  const pct = sub.seatsTotal > 0 ? Math.round((sub.seatsUsed / sub.seatsTotal) * 100) : 0
  const assignedUserIds = sub.assignedUsers.map(au => au.userId)

  function handleRemoveUser(userId: string) {
    startTransition(async () => {
      await removeUserFromSubscription(sub.id, userId)
      router.refresh()
    })
  }

  function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${sub.name}"? This cannot be undone.`)) return
    startTransition(async () => {
      const result = await deleteSubscription(sub.id)
      if (result.success) {
        router.push("/subscriptions")
      }
    })
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Assign modal */}
      <AnimatePresence>
        {assignModalOpen && (
          <AssignUserModal
            subscriptionId={sub.id}
            assignedUserIds={assignedUserIds}
            allUsers={allUsers}
            onClose={() => setAssignModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Back button */}
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
        <Link
          href="/subscriptions"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Subscriptions
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-white/[0.08] bg-gray-900/50 p-6 backdrop-blur-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl"
            style={{
              background: `${sub.color}15`,
              border: `1px solid ${sub.color}25`,
            }}
          >
            {sub.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white">{sub.name}</h1>
                <p className="text-gray-500 mt-0.5">{sub.vendor.name} · {sub.category}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={sub.status.toLowerCase() as any} />
                <Badge variant="outline">{sub.plan}</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-3 max-w-2xl">{sub.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {sub.tags.map((t) => (
                <Badge key={t.id} variant="outline" className="text-[10px]">
                  <Tag className="h-2.5 w-2.5 mr-0.5" />
                  {t.tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-gray-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              Delete
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2 text-sm font-medium text-white transition-colors">
              <RefreshCw className="h-4 w-4" />
              Renew Now
            </button>
          </div>
        </div>
      </motion.div>

      {/* Info cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: DollarSign,
            label: "Monthly Cost",
            value: formatCurrency(sub.billingCycle === "YEARLY" ? sub.amount / 12 : sub.amount),
            sub: `${formatCurrency(sub.billingCycle === "YEARLY" ? sub.amount : sub.amount * 12)}/year`,
            color: "text-violet-400",
            bg: "bg-violet-500/10",
            delay: 0.1,
          },
          {
            icon: Calendar,
            label: "Next Renewal",
            value: sub.status === "EXPIRED" ? "Expired" : formatDate(sub.nextRenewal),
            sub: sub.status === "EXPIRED" ? "Action required" : days <= 0 ? "Due today!" : `${days} days away`,
            color: sub.status === "EXPIRED" ? "text-red-400" : days <= 14 ? "text-amber-400" : "text-emerald-400",
            bg: sub.status === "EXPIRED" ? "bg-red-500/10" : days <= 14 ? "bg-amber-500/10" : "bg-emerald-500/10",
            delay: 0.15,
          },
          {
            icon: CreditCard,
            label: "Billing Cycle",
            value: sub.billingCycle === "MONTHLY" ? "Monthly" : sub.billingCycle === "YEARLY" ? "Yearly" : "Quarterly",
            sub: sub.autoRenew ? "Auto-renewing" : "Manual renewal",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            delay: 0.2,
          },
          {
            icon: Users,
            label: "Seat Utilization",
            value: `${sub.seatsUsed} / ${sub.seatsTotal}`,
            sub: `${pct}% utilized`,
            color: pct >= 90 ? "text-red-400" : pct >= 70 ? "text-amber-400" : "text-emerald-400",
            bg: pct >= 90 ? "bg-red-500/10" : pct >= 70 ? "bg-amber-500/10" : "bg-emerald-500/10",
            delay: 0.25,
          },
        ].map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item.delay }}
            className="rounded-2xl border border-white/[0.08] bg-gray-900/50 p-5 backdrop-blur-sm"
          >
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl mb-3", item.bg)}>
              <item.icon className={cn("h-4.5 w-4.5", item.color)} style={{ width: 18, height: 18 }} />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</p>
            <p className={cn("text-xl font-bold mt-1 tabular-nums", item.color)}>{item.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{item.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Seat Management + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Seat management */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 rounded-2xl border border-white/[0.08] bg-gray-900/50 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-white">Seat Management</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {sub.seatsUsed} of {sub.seatsTotal} seats assigned
              </p>
            </div>
            <button
              onClick={() => setAssignModalOpen(true)}
              disabled={isPending || sub.seatsUsed >= sub.seatsTotal}
              className="flex items-center gap-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 text-xs font-medium text-violet-400 hover:bg-violet-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Assign
            </button>
          </div>

          <Progress
            value={sub.seatsUsed}
            max={sub.seatsTotal}
            showLabel
            size="md"
            className="mb-6"
          />

          {/* User list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sub.assignedUsers.map((su, i) => (
              <motion.div
                key={su.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.03 * i + 0.3 }}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 hover:bg-white/[0.04] transition-colors group"
              >
                <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-semibold text-white">
                  {su.user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-200 truncate">{su.user.name}</p>
                  <p className="text-[10px] text-gray-600 truncate">{su.user.role}</p>
                </div>
                <button
                  onClick={() => handleRemoveUser(su.userId)}
                  disabled={isPending}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-red-400 disabled:opacity-30"
                >
                  <XCircle className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}

            {/* Empty seats */}
            {Array.from({ length: Math.max(0, sub.seatsTotal - sub.seatsUsed) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-3 rounded-xl border border-dashed border-white/[0.06] px-3 py-2.5"
              >
                <div className="h-8 w-8 shrink-0 rounded-full border border-dashed border-white/[0.1] flex items-center justify-center">
                  <UserPlus className="h-3.5 w-3.5 text-gray-700" />
                </div>
                <p className="text-xs text-gray-700">Available seat</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-gray-900/50 p-6 backdrop-blur-sm"
        >
          <h2 className="text-sm font-semibold text-white mb-5">Activity</h2>

          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-8 w-8 text-gray-700 mb-3" />
              <p className="text-sm text-gray-600">No recent activity</p>
              <p className="text-xs text-gray-700 mt-1">
                Activity will appear here as changes are made
              </p>
            </div>
          ) : (
            <div className="relative space-y-4">
              {/* Timeline line */}
              <div className="absolute left-4 top-4 bottom-4 w-px bg-white/[0.06]" />

              {activities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.35 }}
                  className="flex gap-3 relative"
                >
                  <ActivityIcon type={activity.type} />
                  <div className="flex-1 min-w-0 pb-1">
                    <p className="text-xs font-medium text-gray-200">{activity.description}</p>
                    {activity.amount != null && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatCurrency(activity.amount)}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-700 mt-1">
                      {new Date(activity.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activities.length > 0 && (
            <button className="mt-4 w-full rounded-xl border border-white/[0.06] py-2 text-xs text-gray-500 hover:text-gray-300 hover:border-white/[0.12] transition-colors">
              View all activity
            </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
