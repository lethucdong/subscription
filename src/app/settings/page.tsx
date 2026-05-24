"use client"

import { motion } from "framer-motion"
import {
  Bell, Shield, CreditCard, Users, Palette, Globe, Key, ChevronRight,
} from "lucide-react"

const sections = [
  {
    title: "Account",
    items: [
      { icon: Users, label: "Profile", description: "Manage your account details and preferences" },
      { icon: Shield, label: "Security", description: "Password, 2FA, and login sessions" },
      { icon: Key, label: "API Keys", description: "Generate and manage API access tokens" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { icon: CreditCard, label: "Billing", description: "Subscription plan and payment methods" },
      { icon: Users, label: "Team Members", description: "Invite and manage team access" },
      { icon: Globe, label: "Integrations", description: "Connect with Slack, Jira, and more" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", description: "Renewal alerts, payment reminders" },
      { icon: Palette, label: "Appearance", description: "Theme, language, and display settings" },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[800px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your workspace preferences</p>
      </div>

      <div className="space-y-6">
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.08 }}
          >
            <h2 className="text-xs font-medium uppercase tracking-wider text-gray-600 mb-2 px-1">
              {section.title}
            </h2>
            <div className="rounded-2xl border border-white/[0.08] bg-gray-900/50 overflow-hidden divide-y divide-white/[0.06]">
              {section.items.map((item, ii) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors group text-left"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] group-hover:border-violet-500/20 group-hover:bg-violet-500/10 transition-colors">
                    <item.icon className="h-4 w-4 text-gray-400 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200">{item.label}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-700 group-hover:text-gray-500 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5"
      >
        <h2 className="text-sm font-semibold text-red-400 mb-1">Danger Zone</h2>
        <p className="text-xs text-gray-500 mb-4">
          Irreversible actions. Please proceed with caution.
        </p>
        <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors">
          Delete Workspace
        </button>
      </motion.div>
    </div>
  )
}
