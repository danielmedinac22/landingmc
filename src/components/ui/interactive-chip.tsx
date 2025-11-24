"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface InteractiveChipProps {
  label: string
  isSelected: boolean
  onClick: () => void
  index?: number
  className?: string
}

export function InteractiveChip({
  label,
  isSelected,
  onClick,
  index = 0,
  className,
}: InteractiveChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{
        opacity: 1,
        scale: isSelected ? 1.05 : 1,
        y: 0,
      }}
      whileHover={{
        scale: 1.05,
        y: -2,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        opacity: { delay: index * 0.05, duration: 0.3 },
        scale: { delay: index * 0.05, duration: 0.3 },
        y: { delay: index * 0.05, duration: 0.3 },
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className={cn(
        "relative px-4 sm:px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300",
        "border-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isSelected
          ? "bg-foreground text-background border-foreground shadow-medium"
          : "bg-background text-foreground border-border hover:border-foreground/30",
        className
      )}
      aria-pressed={isSelected}
      role="button"
      tabIndex={0}
    >
      {isSelected && (
        <motion.div
          layoutId="chip-background"
          className="absolute inset-0 rounded-2xl bg-foreground"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {label}
        {isSelected && (
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            <Check className="size-5" />
          </motion.span>
        )}
      </span>

      {isSelected && (
        <motion.div
          animate={{ y: [0, -1, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
        />
      )}
    </motion.button>
  )
}

