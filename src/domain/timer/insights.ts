import type { SessionRecord } from "@/application/ports"

export type Insights = {
  readonly todayFocusMs: number
  readonly weekFocusMs: number
}

/**
 * Calculates daily and weekly focus time based on the session history.
 * @param history The session records.
 * @param now The current time (epoch ms).
 */
export function calculateInsights(
  history: readonly SessionRecord[],
  now: number
): Insights {
  const nowDate = new Date(now)
  const startOfToday = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate()
  ).getTime()
  const startOfWeek = startOfToday - nowDate.getDay() * 24 * 60 * 60 * 1000

  let todayFocusMs = 0
  let weekFocusMs = 0

  for (const record of history) {
    if (record.phase === "focus") {
      if (record.completedAt >= startOfToday) {
        todayFocusMs += record.elapsedMs
      }
      if (record.completedAt >= startOfWeek) {
        weekFocusMs += record.elapsedMs
      }
    }
  }

  return {
    todayFocusMs,
    weekFocusMs,
  }
}
