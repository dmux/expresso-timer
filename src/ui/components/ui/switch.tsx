"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/ui/lib/utils"

/**
 * A square toggle that snaps between two positions. `steps(1)` on the thumb makes the
 * travel a single jump rather than a slide — a smooth glide would read as the wrong era.
 */
function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center pixel-bevel-inset transition-pixel",
        "h-[calc(var(--px)*7)] w-[calc(var(--px)*13)] p-0 outline-none",
        "data-checked:bg-[var(--px-accent)] data-unchecked:bg-[var(--px-surface-alt)]",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-[calc(var(--px)*5)] bg-[var(--px-surface)]",
          "border-[length:var(--px)] border-[var(--px-line)]",
          // transition-pixel already covers transform on discrete steps, so the thumb
          // jumps rather than glides without defining its own timing.
          "transition-pixel",
          "data-checked:translate-x-[calc(var(--px)*6)] data-unchecked:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
