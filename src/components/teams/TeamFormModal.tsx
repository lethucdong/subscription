"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { createTeam, updateTeam } from "@/app/actions/teams"
import type { SerializedTeam } from "@/types"

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16"]

interface TeamFormModalProps {
  mode: "create" | "edit"
  team?: SerializedTeam
  onClose: () => void
}

function deriveAvatar(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return "TM"
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function TeamFormModal({ mode, team, onClose }: TeamFormModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({
    name: team?.name ?? "",
    description: team?.description ?? "",
    color: team?.color ?? "#8b5cf6",
    avatar: team?.avatar ?? "",
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (team) {
      setForm({
        name: team.name,
        description: team.description ?? "",
        color: team.color,
        avatar: team.avatar,
      })
    }
  }, [team])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setError(null)

    startTransition(async () => {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        color: form.color,
        avatar: form.avatar.trim() || deriveAvatar(form.name),
      }

      const result =
        mode === "create" ? await createTeam(payload) : await updateTeam(team!.id, payload)

      if (result.success) {
        router.refresh()
        onClose()
      } else {
        setError(result.error ?? "Failed to save team")
      }
    })
  }

  const inputCls =
    "w-full rounded-xl border border-white/[0.08] bg-gray-900/80 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"

  const title = mode === "create" ? "Create Team" : "Edit Team"
  const action = mode === "create" ? "Create Team" : "Save Changes"

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
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-gray-900/50 p-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ background: form.color }}
            >
              {form.avatar || deriveAvatar(form.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{form.name || "Team name"}</p>
              <p className="text-xs text-gray-500 truncate">
                {form.description || "Team description"}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Name <span className="text-violet-400">*</span>
            </label>
            <input
              className={inputCls}
              placeholder="Engineering, Design, etc."
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Avatar
              </label>
              <input
                className={inputCls}
                placeholder="auto"
                maxLength={3}
                value={form.avatar}
                onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value.toUpperCase() }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Color</label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: c }))}
                    className={cn(
                      "h-6 w-6 rounded-lg border-2 transition-transform",
                      form.color === c ? "border-white scale-110" : "border-transparent hover:scale-105"
                    )}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Description</label>
            <textarea
              className={inputCls + " resize-none"}
              placeholder="What does this team do?"
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
