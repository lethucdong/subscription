"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-800 text-gray-300 border border-gray-700",
        success:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        warning:
          "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        danger:
          "bg-red-500/10 text-red-400 border border-red-500/20",
        info:
          "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        purple:
          "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        outline:
          "bg-transparent border border-gray-700 text-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-emerald-400",
            variant === "warning" && "bg-amber-400",
            variant === "danger" && "bg-red-400",
            variant === "info" && "bg-blue-400",
            variant === "purple" && "bg-purple-400",
            variant === "default" && "bg-gray-400",
            variant === "outline" && "bg-gray-400",
          )}
        />
      )}
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: "active" | "expiring" | "expired" }) {
  const config = {
    active: { variant: "success" as const, label: "Active", dot: true },
    expiring: { variant: "warning" as const, label: "Expiring Soon", dot: true },
    expired: { variant: "danger" as const, label: "Expired", dot: true },
  }
  const { variant, label, dot } = config[status]
  return (
    <Badge variant={variant} dot={dot}>
      {label}
    </Badge>
  )
}
