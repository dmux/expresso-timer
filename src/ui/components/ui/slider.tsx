import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/ui/lib/utils"

/**
 * A chunky rail with a square thumb. Everything is sized in whole `--px` units, and the
 * track keeps hard ends rather than the default pill.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn("w-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative h-[calc(var(--px)*4)] w-full grow overflow-hidden bg-[var(--px-surface-alt)] pixel-bevel-inset select-none"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="h-full bg-[var(--px-accent)] select-none"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className={cn(
              "relative block size-[calc(var(--px)*6)] shrink-0 pixel-bevel pixel-shadow-sm transition-pixel",
              "bg-[var(--px-surface)] select-none after:absolute after:-inset-[calc(var(--px)*2)]",
              "hover:bg-[var(--px-accent)] active:shadow-none active:pixel-bevel-inset",
              "disabled:pointer-events-none"
            )}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
