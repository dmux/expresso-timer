import { describe, expect, it } from "vitest"
import type { SessionRecord } from "@/application/ports"
import { calculateInsights } from "./insights"

describe("calculateInsights", () => {
  it("calculates today and week focus time correctly", () => {
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
      }, // Today
      {
        phase: "focus",
        elapsedMs: 15 * 60_000,
        completedAt: new Date("2026-07-31T10:00:00Z").getTime(),
        ranToCompletion: true,
      }, // Yesterday (this week)
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
      }, // Last week (Saturday)
    ]

    const insights = calculateInsights(history, NOW)

    expect(insights.todayFocusMs).toBe(10 * 60_000)
    expect(insights.weekFocusMs).toBe((10 + 15) * 60_000)
  })

  it("returns zero when history is empty", () => {
    const NOW = new Date("2026-08-01T15:00:00Z").getTime()
    const insights = calculateInsights([], NOW)

    expect(insights.todayFocusMs).toBe(0)
    expect(insights.weekFocusMs).toBe(0)
  })
})
