"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/ui/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        // A hairline would land on a sub-pixel; the rule is a whole logical pixel thick.
        "shrink-0 bg-[var(--px-line)]",
        "data-horizontal:h-[var(--px)] data-horizontal:w-full",
        "data-vertical:w-[var(--px)] data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
