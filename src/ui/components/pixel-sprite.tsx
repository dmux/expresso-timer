import { PALETTE } from "@/domain/pixelart/palette"
import { resolveCells, type Sprite } from "@/domain/pixelart/sprite"
import { cn } from "@/ui/lib/utils"

type PixelSpriteProps = {
  sprite: Sprite
  /** CSS colour for every non-transparent cell; defaults to the sprite's own palette. */
  color?: string
  /** Fill level for sprites that declare a liquid region. */
  level?: number
  className?: string
} & Omit<React.ComponentProps<"svg">, "color">

/**
 * Renders any domain sprite as crisp rectangles. Icons, the cycle beans and the cup
 * all go through this one path, which is what keeps UI pixel art and content pixel
 * art from drifting into two different systems.
 */
export function PixelSprite({
  sprite,
  color,
  level,
  className,
  ...props
}: PixelSpriteProps) {
  const cells = level === undefined ? sprite.cells : resolveCells(sprite, level)

  return (
    <svg
      viewBox={`0 0 ${sprite.width} ${sprite.height}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className={cn("block h-auto w-full", className)}
      {...props}
    >
      {cells.map((cell, index) =>
        cell === null ? null : (
          <rect
            key={index}
            x={index % sprite.width}
            y={Math.floor(index / sprite.width)}
            width={1}
            height={1}
            fill={color ?? PALETTE[cell]}
          />
        )
      )}
    </svg>
  )
}
