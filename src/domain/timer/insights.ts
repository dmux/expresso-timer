import type { SessionRecord } from "@/application/ports"

export type Insights = {
  readonly todayFocusMs: number
  readonly weekFocusMs: number
  readonly dailyTrendMs: number[]
  readonly weeklyTrendMs: number[]
  readonly monthlyTrendMs: number[]
}

/**
 * Calculates daily, weekly, and monthly focus time trends based on the session history.
 * @param history The session records.
 * @param now The current time (epoch ms).
 */
export function calculateInsights(
  history: readonly SessionRecord[],
  now: number
): Insights {
  const nowDate = new Date(now)
  const MS_PER_DAY = 24 * 60 * 60 * 1000

  const startOfToday = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate()
  ).getTime()

  const startOfWeek = startOfToday - nowDate.getDay() * MS_PER_DAY

  let todayFocusMs = 0
  let weekFocusMs = 0

  const dailyTrendMs = [0, 0, 0, 0, 0, 0, 0]
  const weeklyTrendMs = [0, 0, 0, 0]
  const monthlyTrendMs = [0, 0, 0, 0, 0, 0]

  for (const record of history) {
    if (record.phase !== "focus") continue

    const recDate = new Date(record.completedAt)
    const startOfRecDay = new Date(
      recDate.getFullYear(),
      recDate.getMonth(),
      recDate.getDate()
    ).getTime()

    const diffDays = Math.round((startOfToday - startOfRecDay) / MS_PER_DAY)
    if (diffDays === 0) todayFocusMs += record.elapsedMs
    if (diffDays >= 0 && diffDays < 7) {
      dailyTrendMs[6 - diffDays] += record.elapsedMs
    }

    const startOfRecWeek = startOfRecDay - recDate.getDay() * MS_PER_DAY
    const diffWeeks = Math.round((startOfWeek - startOfRecWeek) / (7 * MS_PER_DAY))
    if (diffWeeks === 0) weekFocusMs += record.elapsedMs
    if (diffWeeks >= 0 && diffWeeks < 4) {
      weeklyTrendMs[3 - diffWeeks] += record.elapsedMs
    }

    const diffMonths =
      (nowDate.getFullYear() - recDate.getFullYear()) * 12 +
      (nowDate.getMonth() - recDate.getMonth())
    if (diffMonths >= 0 && diffMonths < 6) {
      monthlyTrendMs[5 - diffMonths] += record.elapsedMs
    }
  }

  return {
    todayFocusMs,
    weekFocusMs,
    dailyTrendMs,
    weeklyTrendMs,
    monthlyTrendMs,
  }
}
