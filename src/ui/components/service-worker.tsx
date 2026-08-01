"use client"

import { useEffect } from "react"

/**
 * Registers the offline shell. Renders nothing — it exists so the registration runs
 * once, after hydration, instead of blocking the first paint.
 *
 * Development is deliberately excluded: a service worker that caches build assets and
 * the dev server that rewrites them on every save fight each other, and the worker wins.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (!("serviceWorker" in navigator)) return

    // Failure here costs the offline shell and nothing else, so it stays silent.
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {})
  }, [])

  return null
}
