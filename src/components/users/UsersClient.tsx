"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Users, Plus, Search, MoreVertical, Pencil, Trash2, X, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { createUser, updateUser, deleteUser } from "@/app/actions/users"
import type { SerializedUser } from "@/types"

const ROLES = ["admin", "manager", "member", "viewer"]

interface UserFormModalProps {
  mode: "create" | "edit"
  user?: SerializedUser
  onClose: () => void
}

function UserFormModal({ mode, user, onClose }: UserFormModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    avatar: user?.avatar ?? "",
    role: user?.role ?? "member",
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, avatar: user.avatar, role: user.role })
    }
  }, [user])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    setError(null)

    startTransition(async () => {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        avatar: form.avatar.trim() || undefined,
        role: form.role,
      }

      const result =
        mode === "create" ? await createUser(payload) : await updateUser(user!.id, payload)

      if (result.success) {
        router.refresh()
        onClose()
      } else {
        setError(result.error ?? "Failed to save user")
      }
    })
  }

  const inputCls =
    "w-full rounded-xl border border-white/[0.08] bg-gray-900/80 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"

  const title = mode === "create" ? "Add User" : "Edit User"
  const action = mode === "create" ? "Add User" : "Save Changes"

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
              Name <span className="text-violet-400">*</span>
            </label>
            <input
              className={inputCls}
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Email <span className="text-violet-400">*</span>
            </label>
            <input
              type="email"
              className={inputCls}
              placeholder="jane@company.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Avatar initials
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
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Role</label>
              <select
                className={inputCls + " cursor-pointer"}
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-gray-900">
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>
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
              disabled={isPending || !form.name.trim() || !form.email.trim()}
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

interface UserRowMenuProps {
  user: SerializedUser
  onEdit: () => void
  onDelete: () => void
}

function UserRowMenu({ user, onEdit, onDelete }: UserRowMenuProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg p-1.5 text-gray-500 hover:text-gray-200 hover:bg-white/[0.06] transition-colors"
        aria-label={`Open menu for ${user.name}`}
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

interface UsersClientProps {
  users: SerializedUser[]
}

const roleColors: Record<string, string> = {
  admin: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  manager: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  member: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  viewer: "bg-gray-500/10 text-gray-400 border-gray-500/20",
}

export function UsersClient({ users }: UsersClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<SerializedUser | null>(null)

  function handleDelete(user: SerializedUser) {
    if (!confirm(`Delete user "${user.name}"? Their seats and team memberships will be released.`)) return
    startTransition(async () => {
      const result = await deleteUser(user.id)
      if (result.success) router.refresh()
      else alert(result.error ?? "Failed to delete user")
    })
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
      {addOpen && <UserFormModal mode="create" onClose={() => setAddOpen(false)} />}
      {editing && <UserFormModal mode="edit" user={editing} onClose={() => setEditing(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            {users.length} people in your workspace
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.97] px-4 py-2.5 text-sm font-medium text-white transition-all"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-gray-900/50 py-2 pl-9 pr-4 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-gray-900/50 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-8 w-8 text-gray-700 mb-3" />
            <p className="text-sm text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={cn(
                  "flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors",
                  isPending && "opacity-60"
                )}
              >
                <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-semibold text-white">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{user.name}</p>
                  <p className="text-xs text-gray-600 truncate flex items-center gap-1.5 mt-0.5">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize",
                    roleColors[user.role] ?? roleColors.viewer
                  )}
                >
                  {user.role}
                </span>
                <UserRowMenu
                  user={user}
                  onEdit={() => setEditing(user)}
                  onDelete={() => handleDelete(user)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
