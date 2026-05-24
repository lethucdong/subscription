"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Search, Sun, Moon, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const notifications = [
  {
    id: 1,
    title: "Figma Team expiring soon",
    description: "Renews in 6 days — action required",
    time: "2h ago",
    type: "warning",
    read: false,
  },
  {
    id: 2,
    title: "GitHub Enterprise expiring",
    description: "Renews in 8 days",
    time: "5h ago",
    type: "warning",
    read: false,
  },
  {
    id: 3,
    title: "Vercel Pro expired",
    description: "Subscription expired on May 10",
    time: "1d ago",
    type: "danger",
    read: false,
  },
  {
    id: 4,
    title: "Adobe CC payment processed",
    description: "$600 charged successfully",
    time: "2d ago",
    type: "success",
    read: true,
  },
]

export function Navbar() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const isDark = !mounted || resolvedTheme === "dark"

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-black/[0.06] dark:border-white/[0.06] bg-white/80 dark:bg-gray-950/60 backdrop-blur-xl transition-colors duration-200">
      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-gray-400 transition-colors" />
        <input
          type="text"
          placeholder="Search subscriptions..."
          className="w-72 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 pl-9 pr-4 text-sm text-gray-300 placeholder:text-gray-600 outline-none transition-all duration-200 focus:border-violet-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-violet-500/20"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] text-gray-600 bg-white/[0.04] rounded px-1.5 py-0.5 border border-white/[0.06]">
          <span>⌘</span>K
        </kbd>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-gray-400 hover:text-gray-200 hover:bg-white/[0.08] transition-colors"
        >
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowUserMenu(false)
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-gray-400 hover:text-gray-200 hover:bg-white/[0.08] transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-gray-950" />
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-white/[0.08] bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <span className="text-sm font-medium text-white">Notifications</span>
                  <button className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                    <Check className="h-3 w-3" />
                    Mark all read
                  </button>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer",
                        !notif.read && "bg-white/[0.02]"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                          notif.type === "warning" && "bg-amber-400",
                          notif.type === "danger" && "bg-red-400",
                          notif.type === "success" && "bg-emerald-400",
                          notif.read && "opacity-0"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-200">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notif.description}</p>
                        <p className="text-[10px] text-gray-600 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 hover:bg-white/[0.08] transition-colors"
          >
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[10px] font-semibold text-white">
              AC
            </div>
            <span className="text-xs font-medium text-gray-300 hidden sm:block">Alex Chen</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 z-50 w-52 rounded-2xl border border-white/[0.08] bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden py-1"
              >
                {["Profile", "Settings", "Billing", "Help"].map((item) => (
                  <button
                    key={item}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 transition-colors text-left"
                  >
                    {item}
                  </button>
                ))}
                <div className="border-t border-white/[0.06] mt-1 pt-1">
                  <button className="w-full flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left">
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside to close */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false)
            setShowUserMenu(false)
          }}
        />
      )}
    </header>
  )
}
