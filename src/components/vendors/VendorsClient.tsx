"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Building2, TrendingUp, Package, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { deleteVendor } from "@/app/actions/vendors"
import { VendorFormModal } from "@/components/vendors/VendorFormModal"
import type { SerializedVendor } from "@/types"

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "AI & ML": { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
  Design: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  Productivity: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  Communication: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  Development: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  "Project Management": { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  Infrastructure: { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20" },
  Other: { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20" },
}

const getCategoryGradient = (category: string) => {
  const gradients: Record<string, string> = {
    "AI & ML": "#7c3aed",
    Design: "#ec4899",
    Communication: "#10b981",
    Development: "#f97316",
    Productivity: "#3b82f6",
    "Project Management": "#06b6d4",
    Infrastructure: "#6b7280",
    Other: "#6b7280",
  }
  return gradients[category] || "#6b7280"
}

interface VendorCardMenuProps {
  vendor: SerializedVendor
  onEdit: () => void
  onDelete: () => void
}

function VendorCardMenu({ vendor, onEdit, onDelete }: VendorCardMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg p-1.5 text-gray-500 hover:text-gray-200 hover:bg-white/[0.06] transition-colors"
        aria-label={`Open menu for ${vendor.name}`}
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-36 rounded-xl border border-white/[0.1] bg-gray-900 shadow-xl overflow-hidden">
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

interface VendorsClientProps {
  vendors: SerializedVendor[]
}

export function VendorsClient({ vendors }: VendorsClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<SerializedVendor | null>(null)
  const totalAnnualSpend = vendors.reduce((sum, v) => sum + (v.totalAnnualSpend ?? 0), 0)

  function handleDelete(vendor: SerializedVendor) {
    const productCount = vendor.subscriptionCount ?? 0
    const message =
      productCount > 0
        ? `Delete "${vendor.name}"? This will also delete ${productCount} subscription${productCount > 1 ? "s" : ""}. This cannot be undone.`
        : `Delete "${vendor.name}"? This cannot be undone.`
    if (!confirm(message)) return

    startTransition(async () => {
      const result = await deleteVendor(vendor.id)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error ?? "Failed to delete vendor")
      }
    })
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {addOpen && <VendorFormModal mode="create" onClose={() => setAddOpen(false)} />}
      {editing && (
        <VendorFormModal mode="edit" vendor={editing} onClose={() => setEditing(null)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Vendors</h1>
          <p className="text-sm text-gray-500 mt-1">
            {vendors.length} software vendors · {formatCurrency(totalAnnualSpend)} annual spend
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.97] px-4 py-2.5 text-sm font-medium text-white transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Building2,
            label: "Total Vendors",
            value: vendors.length,
            sub: "Unique providers",
            color: "text-violet-400",
            bg: "bg-violet-500/10",
          },
          {
            icon: TrendingUp,
            label: "Annual Spend",
            value: formatCurrency(totalAnnualSpend),
            sub: "Across all vendors",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            icon: Package,
            label: "Active Products",
            value: vendors.reduce((sum, v) => sum + (v.activeProductCount ?? 0), 0),
            sub: "Subscriptions active",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-gray-900/50 p-5"
          >
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", stat.bg)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-0.5 tabular-nums">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {vendors
          .sort((a, b) => (b.totalAnnualSpend ?? 0) - (a.totalAnnualSpend ?? 0))
          .map((vendor, i) => {
            const colors = categoryColors[vendor.category] || categoryColors["Other"]
            const pct =
              totalAnnualSpend > 0
                ? Math.round(((vendor.totalAnnualSpend ?? 0) / totalAnnualSpend) * 100)
                : 0

            return (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.15 }}
                whileHover={{ y: -2 }}
                className={cn(
                  "group relative rounded-2xl border border-white/[0.08] bg-gray-900/50 p-5 backdrop-blur-sm hover:border-white/[0.14] hover:bg-gray-900/70 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-200",
                  isPending && "opacity-60"
                )}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl text-2xl border",
                        colors.bg,
                        colors.border
                      )}
                    >
                      {vendor.logo}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{vendor.name}</h3>
                      <span
                        className={cn(
                          "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                          colors.bg,
                          colors.text,
                          colors.border
                        )}
                      >
                        {vendor.category}
                      </span>
                    </div>
                  </div>
                  <VendorCardMenu
                    vendor={vendor}
                    onEdit={() => setEditing(vendor)}
                    onDelete={() => handleDelete(vendor)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Annual Spend</span>
                    <span className="text-sm font-bold text-white tabular-nums">
                      {formatCurrency(vendor.totalAnnualSpend ?? 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Share of Budget</span>
                    <span className="text-xs font-medium text-gray-300 tabular-nums">{pct}%</span>
                  </div>

                  <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.05 + 0.3, duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${getCategoryGradient(vendor.category)}, transparent)`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5">
                      <p className="text-[10px] text-gray-600">Products</p>
                      <p className="text-sm font-semibold text-white">{vendor.subscriptionCount ?? 0}</p>
                    </div>
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5">
                      <p className="text-[10px] text-gray-600">Teams</p>
                      <p className="text-sm font-semibold text-white">{vendor.teamNames?.length ?? 0}</p>
                    </div>
                  </div>

                  {vendor.teamNames && vendor.teamNames.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {vendor.teamNames.slice(0, 3).map((team) => (
                        <span
                          key={team}
                          className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-gray-500"
                        >
                          {team}
                        </span>
                      ))}
                      {vendor.teamNames.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-gray-600">
                          +{vendor.teamNames.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-white/[0.08] bg-gray-900/50 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white">Spend Breakdown</h2>
          <p className="text-xs text-gray-500 mt-0.5">All vendors ranked by annual spend</p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {vendors
            .sort((a, b) => (b.totalAnnualSpend ?? 0) - (a.totalAnnualSpend ?? 0))
            .map((vendor, i) => {
              const pct =
                totalAnnualSpend > 0
                  ? Math.round(((vendor.totalAnnualSpend ?? 0) / totalAnnualSpend) * 100)
                  : 0
              return (
                <div
                  key={vendor.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-xs text-gray-700 w-5 tabular-nums">{i + 1}</span>
                  <span className="text-xl w-8">{vendor.logo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200">{vendor.name}</p>
                    <p className="text-xs text-gray-600">{vendor.category}</p>
                  </div>
                  <div className="w-32 hidden sm:block">
                    <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full opacity-70"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${getCategoryGradient(vendor.category)}, transparent)`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 w-10 tabular-nums text-right hidden sm:block">{pct}%</span>
                  <span className="text-sm font-semibold text-white tabular-nums text-right w-24">
                    {formatCurrency(vendor.totalAnnualSpend ?? 0)}
                    <span className="text-xs font-normal text-gray-600">/yr</span>
                  </span>
                </div>
              )
            })}
        </div>
      </motion.div>
    </div>
  )
}
