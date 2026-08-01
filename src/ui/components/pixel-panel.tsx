import { cn } from "@/ui/lib/utils"

type PixelPanelProps = React.ComponentProps<"div"> & {
  /** Drops the hard shadow, for panels that sit inside another one. */
  flat?: boolean
}

/** The retro console frame every surface in the app is built from. */
export function PixelPanel({ className, flat, ...props }: PixelPanelProps) {
  return (
    <div
      className={cn(
        "bg-[var(--px-surface)] pixel-bevel",
        !flat && "pixel-shadow",
        className
      )}
      {...props}
    />
  )
}
