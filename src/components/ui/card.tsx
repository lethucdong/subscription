"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glow?: boolean
  gradient?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, glow, gradient, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl border border-white/[0.08] bg-gray-900/50 backdrop-blur-sm",
          hover &&
            "cursor-pointer transition-all duration-200 hover:border-white/[0.14] hover:bg-gray-900/70 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(124,58,237,0.08)]",
          glow && "shadow-[0_0_30px_rgba(124,58,237,0.1)]",
          gradient &&
            "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/[0.04] before:to-transparent before:pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1 p-6 pb-4", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-sm font-medium text-gray-400 tracking-wide uppercase", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center border-t border-white/[0.06] p-6 pt-4",
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

// Animated card for entrance animations
export function AnimatedCard({
  children,
  className,
  delay = 0,
  hover = false,
}: CardProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover ? { scale: 1.01 } : undefined}
      className={cn(
        "relative rounded-2xl border border-white/[0.08] bg-gray-900/50 backdrop-blur-sm",
        hover &&
          "cursor-pointer transition-colors duration-200 hover:border-white/[0.14] hover:bg-gray-900/70 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      {children}
    </motion.div>
  )
}
