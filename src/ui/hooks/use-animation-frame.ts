"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"

/**
 * Drives a callback on every frame with the elapsed delta, without ever touching React
 * state — the canvas is written to directly, so nothing here re-renders the tree.
 */
export function useAnimationFrame(callback: (dtMs: number) => void, enabled = true) {
  const callbackRef = useRef(callback)

  // Kept in a ref so a new closure each render does not restart the loop.
  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    if (!enabled) return

    let frame = 0
    let previous = performance.now()

    const loop = (now: number) => {
      // A tab restored after minutes away would otherwise deliver one enormous delta.
      const dtMs = Math.min(now - previous, 100)
      previous = now
      callbackRef.current(dtMs)
      frame = requestAnimationFrame(loop)
    }

    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [enabled])
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/** The media query is an external store, so React can read it without an effect. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  )
}
