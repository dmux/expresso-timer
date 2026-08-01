"use client"

import * as React from "react"

import { cn } from "@/ui/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-[calc(var(--px)*2)] text-[calc(var(--px)*2.5)] leading-[1.6] uppercase select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:text-[var(--px-text-muted)]",
        className
      )}
      {...props}
    />
  )
}

export { Label }
