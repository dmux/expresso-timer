import { describe, expect, it } from "vitest"
import type { SessionRecord } from "@/application/ports"
import { calculateInsights } from "./insights"

describe("calculateInsights", () => {
  it("calculates today, week, and trends correctly", () => {
    const NOW = new Date("2026-08-01T15:00:00Z").getTime()
    // 2026-08-01 is a Saturday.
    // Start of today: 2026-08-01 00:00:00
    // Start of week (Sunday): 2026-07-26 00:00:00

    const history: SessionRecord[] = [
      {
        phase: "focus",
        elapsedMs: 10 * 60_000,
        completedAt: new Date("2026-08-01T10:00:00Z").getTime(),
        ranToCompletion: true,
      }, // Today (diffDays=0, diffWeeks=0, diffMonths=0)
      {
        phase: "focus",
        elapsedMs: 15 * 60_000,
        completedAt: new Date("2026-07-31T10:00:00Z").getTime(),
        ranToCompletion: true,
      }, // Yesterday (diffDays=1, diffWeeks=0, diffMonths=1)
      {
        phase: "shortBreak",
        elapsedMs: 5 * 60_000,
        completedAt: new Date("2026-08-01T10:05:00Z").getTime(),
        ranToCompletion: true,
      }, // Today, but break
      {
        phase: "focus",
        elapsedMs: 25 * 60_000,
        completedAt: new Date("2026-07-25T10:00:00Z").getTime(),
        ranToCompletion: true,
      }, // Last week Saturday (diffDays=7, diffWeeks=1, diffMonths=1)
    ]

    const insights = calculateInsights(history, NOW)

    expect(insights.todayFocusMs).toBe(10 * 60_000)
    expect(insights.weekFocusMs).toBe((10 + 15) * 60_000)

    // dailyTrendMs: [0, 0, 0, 0, 0, 15m, 10m]
    expect(insights.dailyTrendMs).toEqual([0, 0, 0, 0, 0, 15 * 60_000, 10 * 60_000])

    // weeklyTrendMs: [0, 0, 25m, 25m]
    expect(insights.weeklyTrendMs).toEqual([0, 0, 25 * 60_000, 25 * 60_000])

    // monthlyTrendMs: [0, 0, 0, 0, 40m, 10m] (July has 40m, August has 10m)
    expect(insights.monthlyTrendMs).toEqual([0, 0, 0, 0, 40 * 60_000, 10 * 60_000])
  })

  it("returns zero when history is empty", () => {
    const NOW = new Date("2026-08-01T15:00:00Z").getTime()
    const insights = calculateInsights([], NOW)

    expect(insights.todayFocusMs).toBe(0)
    expect(insights.weekFocusMs).toBe(0)
    expect(insights.dailyTrendMs).toEqual([0, 0, 0, 0, 0, 0, 0])
    expect(insights.weeklyTrendMs).toEqual([0, 0, 0, 0])
    expect(insights.monthlyTrendMs).toEqual([0, 0, 0, 0, 0, 0])
  })
})
