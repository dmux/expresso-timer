"use client"

import { useSyncExternalStore } from "react"

export type ThemePreference = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

export const THEME_STORAGE_KEY = "expresso-timer:theme:v1"

const DARK_QUERY = "(prefers-color-scheme: dark)"

/**
 * The theme deliberately does not go through the settings port like everything else.
 * It has to be applied before React exists — an inline script in the document head sets
 * `data-theme` on first paint, otherwise the page flashes the wrong colours during
 * hydration — so the storage key is read from two places and has to stay self-contained.
 *
 * The script resolves "system" down to a concrete light/dark value, which is why the
 * stylesheet only ever needs one dark block instead of duplicating it for the media
 * query and the explicit override.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});var p=s==="light"||s==="dark"?s:"system";var d=p==="dark"||(p==="system"&&matchMedia(${JSON.stringify(
  DARK_QUERY
)}).matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})()`

function readPreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    return raw === "light" || raw === "dark" ? raw : "system"
  } catch {
    return "system"
  }
}

function resolve(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") return preference
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light"
}

function apply(resolved: ResolvedTheme): void {
  // `color-scheme` follows this attribute from CSS, so it is not set here.
  document.documentElement.dataset.theme = resolved
}

const listeners = new Set<() => void>()

function notify(): void {
  for (const listener of listeners) listener()
}

/** Snapshots must be referentially stable or useSyncExternalStore loops forever. */
let snapshot: { preference: ThemePreference; resolved: ResolvedTheme } = {
  preference: "system",
  resolved: "light",
}

const SERVER_SNAPSHOT = snapshot

function refresh(): void {
  const preference = readPreference()
  const resolved = resolve(preference)
  if (snapshot.preference === preference && snapshot.resolved === resolved) return

  snapshot = { preference, resolved }
  apply(resolved)
  notify()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  // Only meaningful while the preference is "system", but keeping it always attached
  // means there is no listener to add and remove as the preference changes.
  const query = window.matchMedia(DARK_QUERY)
  query.addEventListener("change", refresh)

  if (listeners.size === 1) refresh()

  return () => {
    listeners.delete(listener)
    query.removeEventListener("change", refresh)
  }
}

export function setThemePreference(preference: ThemePreference): void {
  try {
    if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // A blocked store still leaves the theme working for this session.
  }
  refresh()
}

export function useTheme() {
  const { preference, resolved } = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => SERVER_SNAPSHOT
  )

  return { preference, resolved, setPreference: setThemePreference }
}
