"use client"

import { useCallback, useEffect, useSyncExternalStore } from "react"

import type { PomodoroService, PomodoroSnapshot } from "@/application/pomodoro-service"
import { createSession } from "@/domain/timer/session"
import { DEFAULT_SETTINGS, durationFor } from "@/domain/timer/settings"
import { createPomodoroService } from "@/ui/container"

/**
 * 200ms is far more often than the display changes, but the countdown is recomputed
 * from the clock every time, so the cost is a subtraction and the accuracy is exact.
 */
const TICK_MS = 200

/**
 * Stable reference on purpose: `getServerSnapshot` must return the same object every
 * call, and it is what the hydration pass renders — which is why reading localStorage
 * in the service constructor cannot cause a mismatch.
 */
const SERVER_SNAPSHOT: PomodoroSnapshot = {
  session: createSession(DEFAULT_SETTINGS),
  settings: DEFAULT_SETTINGS,
  remainingMs: durationFor("focus", DEFAULT_SETTINGS),
  progress: 0,
  history: [],
}

let instance: PomodoroService | null = null

function getService(): PomodoroService | null {
  if (typeof window === "undefined") return null
  instance ??= createPomodoroService()
  return instance
}

const noop = () => () => {}

export function usePomodoro() {
  const service = getService()

  const subscribe = useCallback(
    (listener: () => void) => service?.subscribe(listener) ?? noop(),
    [service]
  )

  const snapshot = useSyncExternalStore(
    subscribe,
    () => service?.getSnapshot() ?? SERVER_SNAPSHOT,
    () => SERVER_SNAPSHOT
  )

  useEffect(() => {
    if (!service) return
    const id = window.setInterval(service.tick, TICK_MS)
    return () => window.clearInterval(id)
  }, [service])

  // Coming back from a background tab should correct the display at once rather than
  // waiting out the interval.
  useEffect(() => {
    if (!service) return
    const onVisible = () => {
      if (document.visibilityState === "visible") service.tick()
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => document.removeEventListener("visibilitychange", onVisible)
  }, [service])

  return {
    ...snapshot,
    toggle: service?.toggle,
    reset: service?.reset,
    skip: service?.skip,
    updateSettings: service?.updateSettings,
  }
}
