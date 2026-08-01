import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/ui/lib/utils"

/**
 * Restyled for pixel art: no radius, no blur, no easing. The pressed state inverts the
 * bevel and drops the button onto its own hard shadow — the classic chunky click.
 */
const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center gap-[calc(var(--px)*2)] select-none",
    "font-sans whitespace-nowrap uppercase transition-pixel outline-none",
    "pixel-bevel pixel-shadow",
    "active:translate-x-[calc(var(--px)*2)] active:translate-y-[calc(var(--px)*2)] active:shadow-none active:pixel-bevel-inset",
    "disabled:pointer-events-none disabled:text-[var(--px-text-muted)]",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-[var(--px-accent)] text-[var(--px-on-accent)] hover:bg-[var(--px-accent-hover)]",
        secondary:
          "bg-[var(--px-surface-alt)] text-[var(--px-text)] hover:bg-[var(--px-surface)]",
        outline:
          "bg-[var(--px-surface)] text-[var(--px-text)] hover:bg-[var(--px-surface-alt)]",
        ghost:
          "border-transparent bg-transparent text-[var(--px-text)] shadow-none hover:bg-[var(--px-surface-alt)] active:translate-x-0 active:translate-y-0",
        destructive:
          "bg-[var(--px-text)] text-[var(--px-surface)] hover:bg-[var(--px-text-muted)]",
      },
      size: {
        /* Every size is a whole multiple of --px so nothing lands off the grid. */
        default: "h-[calc(var(--px)*12)] px-[calc(var(--px)*4)] text-[calc(var(--px)*3)]",
        sm: "h-[calc(var(--px)*9)] px-[calc(var(--px)*3)] text-[calc(var(--px)*2)]",
        lg: "h-[calc(var(--px)*14)] px-[calc(var(--px)*6)] text-[calc(var(--px)*4)]",
        icon: "size-[calc(var(--px)*12)] p-[calc(var(--px)*2)]",
        "icon-lg": "size-[calc(var(--px)*14)] p-[calc(var(--px)*3)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
