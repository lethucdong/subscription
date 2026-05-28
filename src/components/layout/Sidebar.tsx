"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CreditCard,
  Building2,
  Users,
  UserCircle,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/subscriptions", icon: CreditCard, label: "Subscriptions" },
  { href: "/vendors", icon: Building2, label: "Vendors" },
  { href: "/teams", icon: Users, label: "Teams" },
  { href: "/users", icon: UserCircle, label: "Users" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      style={{ width: collapsed ? 72 : 240 }}
      className="relative flex flex-col h-full shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
    >
      {/* Inner content wrapper */}
      <div className="flex flex-col h-full overflow-hidden border-r border-white/[0.08] dark:bg-gray-950/80 bg-white/95">

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] dark:border-white/[0.06] border-gray-100">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
            <Zap className="h-5 w-5 text-white" fill="currentColor" />
          </div>
          <div
            className={cn(
              "overflow-hidden whitespace-nowrap transition-all duration-200",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            <span className="text-sm font-semibold text-white">SubTrack</span>
            <span className="block text-[10px] text-gray-500 font-medium tracking-wide">
              WORKSPACE
            </span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-violet-500/10 text-violet-600 dark:text-violet-300 shadow-sm border border-violet-500/20"
                      : "text-gray-500 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                >
                  <item.icon
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-violet-400" : "text-gray-500",
                      collapsed && "mx-auto"
                    )}
                    style={{ width: 18, height: 18 }}
                  />
                  <span
                    className={cn(
                      "truncate transition-all duration-150",
                      collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User profile */}
        <div className="border-t border-white/[0.06] px-2 py-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-white/[0.04] transition-colors",
              collapsed && "justify-center"
            )}
          >
            <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white">
              AC
            </div>
            <div
              className={cn(
                "flex-1 min-w-0 transition-all duration-150",
                collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
              )}
            >
              <p className="text-xs font-medium text-gray-200 truncate">Alex Chen</p>
              <p className="text-[10px] text-gray-500 truncate">alex@acme.com</p>
            </div>
            <button
              className={cn(
                "shrink-0 text-gray-600 hover:text-gray-400 transition-all duration-150",
                collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
              )}
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] z-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.12] dark:bg-gray-900 bg-white dark:text-gray-400 text-gray-500 hover:text-violet-400 shadow-md transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </aside>
  )
}
