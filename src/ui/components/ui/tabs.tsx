"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "@/ui/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-[calc(var(--px)*3)] data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex w-full items-stretch gap-[calc(var(--px)*2)]",
        className
      )}
      {...props}
    />
  )
}

/** The active tab reads as a pressed console key: bevel inverted, no underline slide. */
function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex flex-1 items-center justify-center pixel-bevel transition-pixel",
        "px-[calc(var(--px)*3)] py-[calc(var(--px)*2)] text-[calc(var(--px)*2.5)] whitespace-nowrap uppercase outline-none",
        "bg-[var(--px-surface-alt)] text-[var(--px-text-muted)] hover:bg-[var(--px-surface)]",
        "data-active:bg-[var(--px-surface)] data-active:text-[var(--px-text)] data-active:pixel-bevel-inset",
        "disabled:pointer-events-none disabled:text-[var(--px-text-muted)]",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-[calc(var(--px)*2.5)] outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
