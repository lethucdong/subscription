"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { createVendor, updateVendor } from "@/app/actions/vendors"
import type { SerializedVendor } from "@/types"

const LOGOS = ["🤖", "🎨", "🅰️", "📝", "💬", "🐙", "📐", "▲", "💻", "📊", "🔒", "☁️"]
const CATEGORIES = [
  "AI & ML",
  "Design",
  "Development",
  "Communication",
  "Productivity",
  "Analytics",
  "Security",
  "Marketing",
  "Infrastructure",
  "Project Management",
  "Other",
]

interface VendorFormModalProps {
  mode: "create" | "edit"
  vendor?: SerializedVendor
  onClose: () => void
}

export function VendorFormModal({ mode, vendor, onClose }: VendorFormModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({
    name: vendor?.name ?? "",
    logo: vendor?.logo ?? "🤖",
    category: vendor?.category ?? "Other",
    website: vendor?.website ?? "",
    description: vendor?.description ?? "",
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (vendor) {
      setForm({
        name: vendor.name,
        logo: vendor.logo,
        category: vendor.category,
        website: vendor.website ?? "",
        description: vendor.description ?? "",
      })
    }
  }, [vendor])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setError(null)

    startTransition(async () => {
      const payload = {
        name: form.name.trim(),
        logo: form.logo,
        category: form.category,
        website: form.website.trim() || undefined,
        description: form.description.trim() || undefined,
      }

      const result =
        mode === "create"
          ? await createVendor(payload)
          : await updateVendor(vendor!.id, payload)

      if (result.success) {
        router.refresh()
        onClose()
      } else {
        setError(result.error ?? "Failed to save vendor")
      }
    })
  }

  const inputCls =
    "w-full rounded-xl border border-white/[0.08] bg-gray-900/80 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"

  const title = mode === "create" ? "Add Vendor" : "Edit Vendor"
  const action = mode === "create" ? "Add Vendor" : "Save Changes"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md rounded-2xl border border-white/[0.12] bg-gray-900 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Logo Emoji
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LOGOS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, logo: emoji }))}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl text-lg border transition-all",
                    form.logo === emoji
                      ? "border-violet-500/60 bg-violet-500/15 scale-110"
                      : "border-white/[0.06] bg-gray-900/50 hover:border-white/[0.14]"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Name <span className="text-violet-400">*</span>
            </label>
            <input
              className={inputCls}
              placeholder="e.g. Stripe"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Category</label>
            <select
              className={inputCls + " cursor-pointer"}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-gray-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Website</label>
            <input
              className={inputCls}
              placeholder="https://example.com"
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Description</label>
            <textarea
              className={inputCls + " resize-none"}
              placeholder="What does this vendor provide?"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !form.name.trim()}
              className="rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                action
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
