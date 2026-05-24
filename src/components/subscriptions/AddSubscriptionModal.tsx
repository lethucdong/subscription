"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { createSubscription } from "@/app/actions/subscriptions"
import type { SerializedVendor } from "@/types"

const CATEGORIES = ["AI & ML", "Design", "Development", "Communication", "Productivity", "Analytics", "Security", "Marketing", "Infrastructure", "Project Management"]
const LOGOS: { emoji: string; label: string }[] = [
  { emoji: "🤖", label: "AI" },
  { emoji: "🎨", label: "Design" },
  { emoji: "💻", label: "Dev" },
  { emoji: "📊", label: "Analytics" },
  { emoji: "📧", label: "Email" },
  { emoji: "🔒", label: "Security" },
  { emoji: "📁", label: "Files" },
  { emoji: "☁️", label: "Cloud" },
  { emoji: "🚀", label: "Deploy" },
  { emoji: "📝", label: "Notes" },
  { emoji: "💬", label: "Chat" },
  { emoji: "🔧", label: "Tools" },
]
const COLORS = [
  "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b",
  "#ef4444", "#06b6d4", "#ec4899", "#84cc16",
]

interface FormState {
  name: string
  vendorId: string
  logo: string
  color: string
  category: string
  plan: string
  billingCycle: "MONTHLY" | "YEARLY" | "QUARTERLY"
  amount: string
  nextRenewal: string
  seatsUsed: string
  seatsTotal: string
  description: string
}

const INITIAL: FormState = {
  name: "",
  vendorId: "",
  logo: "🤖",
  color: "#8b5cf6",
  category: "Productivity",
  plan: "Team",
  billingCycle: "MONTHLY",
  amount: "",
  nextRenewal: "",
  seatsUsed: "1",
  seatsTotal: "10",
  description: "",
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  vendors: SerializedVendor[]
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}{required && <span className="text-violet-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full rounded-xl border border-white/[0.08] bg-gray-900/80 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
const selectCls = inputCls + " cursor-pointer"

export function AddSubscriptionModal({ open, onOpenChange, onSuccess, vendors }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
    setServerError(null)
  }

  function validate(): boolean {
    const errs: typeof errors = {}
    if (!form.name.trim()) errs.name = "Required"
    if (!form.vendorId) errs.vendorId = "Select a vendor"
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) errs.amount = "Enter a valid amount"
    if (!form.nextRenewal) errs.nextRenewal = "Required"
    if (!form.seatsTotal || Number(form.seatsTotal) < 1) errs.seatsTotal = "Min 1"
    if (Number(form.seatsUsed) > Number(form.seatsTotal)) errs.seatsUsed = "Cannot exceed total"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const selectedVendor = vendors.find(v => v.id === form.vendorId)

    startTransition(async () => {
      const result = await createSubscription({
        name: form.name.trim(),
        vendorId: form.vendorId,
        logo: form.logo,
        color: form.color,
        category: form.category,
        plan: form.plan || "Team",
        billingCycle: form.billingCycle as "MONTHLY" | "YEARLY" | "QUARTERLY",
        amount: Number(form.amount),
        nextRenewal: form.nextRenewal,
        seatsUsed: Number(form.seatsUsed) || 0,
        seatsTotal: Number(form.seatsTotal) || 10,
        description: form.description.trim() || undefined,
        tags: [form.category],
      })

      if (result.success) {
        setForm(INITIAL)
        setErrors({})
        onOpenChange(false)
        if (onSuccess) onSuccess()
        else router.refresh()
      } else {
        setServerError(result.error ?? "Something went wrong")
      }
    })
  }

  function handleClose() {
    if (isPending) return
    setForm(INITIAL)
    setErrors({})
    setServerError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
          <DialogDescription>Track a new SaaS subscription for your team.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pt-4 pb-2 space-y-4">
          {serverError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {serverError}
            </div>
          )}

          {/* Logo & Color row */}
          <div className="flex gap-4">
            <Field label="Logo">
              <div className="flex flex-wrap gap-1.5">
                {LOGOS.map(({ emoji }) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => set("logo", emoji)}
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
            </Field>
            <Field label="Color">
              <div className="flex flex-wrap gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("color", c)}
                    className={cn(
                      "h-7 w-7 rounded-lg border-2 transition-transform",
                      form.color === c ? "border-white scale-110" : "border-transparent hover:scale-105"
                    )}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </Field>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-gray-900/50 p-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-2xl"
              style={{ background: `${form.color}20`, border: `1px solid ${form.color}30` }}
            >
              {form.logo}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{form.name || "Subscription name"}</p>
              <p className="text-xs text-gray-500">
                {form.vendorId ? vendors.find(v => v.id === form.vendorId)?.name : "Select vendor"}
              </p>
            </div>
          </div>

          {/* Name */}
          <Field label="Name" required>
            <input
              className={cn(inputCls, errors.name && "border-red-500/50")}
              placeholder="e.g. Figma Team"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
          </Field>

          {/* Vendor */}
          <Field label="Vendor" required>
            <select
              className={cn(selectCls, errors.vendorId && "border-red-500/50")}
              value={form.vendorId}
              onChange={(e) => set("vendorId", e.target.value)}
            >
              <option value="" className="bg-gray-900">Select a vendor...</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id} className="bg-gray-900">
                  {v.logo} {v.name}
                </option>
              ))}
            </select>
            {errors.vendorId && <p className="text-xs text-red-400">{errors.vendorId}</p>}
          </Field>

          {/* Category & Plan */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                className={selectCls}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-gray-900">
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Plan name">
              <input
                className={inputCls}
                placeholder="e.g. Team, Pro, Enterprise"
                value={form.plan}
                onChange={(e) => set("plan", e.target.value)}
              />
            </Field>
          </div>

          {/* Amount & Billing */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (USD)" required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  className={cn(inputCls, "pl-7", errors.amount && "border-red-500/50")}
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => set("amount", e.target.value)}
                />
              </div>
              {errors.amount && <p className="text-xs text-red-400">{errors.amount}</p>}
            </Field>
            <Field label="Billing cycle">
              <div className="flex gap-2">
                {(["MONTHLY", "YEARLY"] as const).map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => set("billingCycle", cycle)}
                    className={cn(
                      "flex-1 rounded-xl border py-2 text-xs font-medium capitalize transition-all",
                      form.billingCycle === cycle
                        ? "border-violet-500/50 bg-violet-500/15 text-violet-300"
                        : "border-white/[0.08] bg-gray-900/50 text-gray-500 hover:text-gray-300"
                    )}
                  >
                    {cycle === "MONTHLY" ? "Monthly" : "Yearly"}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* Next Renewal */}
          <Field label="Next renewal date" required>
            <input
              className={cn(inputCls, errors.nextRenewal && "border-red-500/50")}
              type="date"
              value={form.nextRenewal}
              onChange={(e) => set("nextRenewal", e.target.value)}
              style={{ colorScheme: "dark" }}
            />
            {errors.nextRenewal && <p className="text-xs text-red-400">{errors.nextRenewal}</p>}
          </Field>

          {/* Seats */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Seats used">
              <input
                className={cn(inputCls, errors.seatsUsed && "border-red-500/50")}
                type="number"
                min="0"
                value={form.seatsUsed}
                onChange={(e) => set("seatsUsed", e.target.value)}
              />
              {errors.seatsUsed && <p className="text-xs text-red-400">{errors.seatsUsed}</p>}
            </Field>
            <Field label="Total seats" required>
              <input
                className={cn(inputCls, errors.seatsTotal && "border-red-500/50")}
                type="number"
                min="1"
                value={form.seatsTotal}
                onChange={(e) => set("seatsTotal", e.target.value)}
              />
              {errors.seatsTotal && <p className="text-xs text-red-400">{errors.seatsTotal}</p>}
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea
              className={cn(inputCls, "resize-none")}
              placeholder="What does this subscription do?"
              rows={2}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <button
              type="button"
              disabled={isPending}
              className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-gray-400 hover:text-gray-200 hover:border-white/[0.14] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Adding...
              </>
            ) : (
              "Add Subscription"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
