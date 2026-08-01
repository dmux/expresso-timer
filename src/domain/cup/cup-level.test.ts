import { describe, expect, it } from "vitest"

import { levelFor, steamIntensity } from "./cup-level"

describe("levelFor", () => {
  it("drains the cup over a focus phase", () => {
    expect(levelFor("focus", 0)).toBe(1)
    expect(levelFor("focus", 0.5)).toBe(0.5)
    expect(levelFor("focus", 1)).toBe(0)
  })

  it("refills it over a break, in either flavour", () => {
    expect(levelFor("shortBreak", 0)).toBe(0)
    expect(levelFor("shortBreak", 1)).toBe(1)
    expect(levelFor("longBreak", 0.25)).toBe(0.25)
  })

  it("clamps progress that arrives out of range", () => {
    expect(levelFor("focus", -0.5)).toBe(1)
    expect(levelFor("focus", 2)).toBe(0)
  })
})

describe("steamIntensity", () => {
  it("holds the extremes", () => {
    expect(steamIntensity(1)).toBe(1)
    expect(steamIntensity(0)).toBe(0)
  })

  it("fades faster than the coffee drains, so the cup cools before it empties", () => {
    for (const level of [0.2, 0.5, 0.8]) {
      expect(steamIntensity(level)).toBeLessThan(level)
    }
  })

  it("stays monotonic", () => {
    expect(steamIntensity(0.3)).toBeLessThan(steamIntensity(0.6))
  })
})
