"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

function getProgressColor(percent: number): string {
  if (percent >= 90) return "from-red-500 to-red-400"
  if (percent >= 70) return "from-amber-500 to-amber-400"
  return "from-emerald-600 to-emerald-400"
}

function getProgressGlow(percent: number): string {
  if (percent >= 90) return "shadow-[0_0_8px_rgba(239,68,68,0.4)]"
  if (percent >= 70) return "shadow-[0_0_8px_rgba(245,158,11,0.4)]"
  return "shadow-[0_0_8px_rgba(16,185,129,0.4)]"
}

const sizeMap = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
}

export function Progress({
  value,
  max = 100,
  className,
  showLabel = false,
  size = "md",
  animated = true,
}: ProgressProps) {
  const percent = Math.min(100, Math.round((value / max) * 100))
  const color = getProgressColor(percent)
  const glow = getProgressGlow(percent)

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">
            {value} / {max} seats
          </span>
          <span
            className={cn(
              "font-medium",
              percent >= 90 ? "text-red-400" : percent >= 70 ? "text-amber-400" : "text-emerald-400"
            )}
          >
            {percent}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-white/[0.06]",
          sizeMap[size]
        )}
      >
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percent}%` }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            "h-full rounded-full bg-gradient-to-r",
            color,
            glow
          )}
        />
      </div>
    </div>
  )
}
