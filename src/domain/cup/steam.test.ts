import { describe, expect, it } from "vitest"

import {
  advanceSteam,
  particleOpacity,
  particleX,
  STEAM_OPACITY_STEPS,
  STEAM_SPAWN_SPREAD,
  type SteamParticle,
} from "./steam"

const ORIGIN = { x: 11, y: 1 }

/** A seeded generator makes the whole simulation reproducible. */
function seededRng(seed: number) {
  let state = seed
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296
    return state / 4_294_967_296
  }
}

/** Always draws 0, so every fractional emission chance resolves as "yes". */
const alwaysEmit = () => 0

describe("advanceSteam", () => {
  it("emits nothing at zero intensity", () => {
    const result = advanceSteam([], 1_000, 0, ORIGIN, alwaysEmit)
    expect(result).toHaveLength(0)
  })

  it("emits at a rate proportional to intensity", () => {
    const full = advanceSteam([], 1_000, 1, ORIGIN, seededRng(1))
    const half = advanceSteam([], 1_000, 0.5, ORIGIN, seededRng(1))

    expect(full.length).toBeGreaterThan(half.length)
    expect(half.length).toBeGreaterThan(0)
  })

  it("is deterministic for a given seed", () => {
    const a = advanceSteam([], 500, 1, ORIGIN, seededRng(42))
    const b = advanceSteam([], 500, 1, ORIGIN, seededRng(42))

    expect(a).toEqual(b)
  })

  it("lifts particles and retires them once they outlive their lifespan", () => {
    const particle: SteamParticle = {
      originX: 11,
      y: 1,
      ageMs: 0,
      lifeMs: 1_000,
      drift: 0,
      wobblePhase: 0,
      speed: 0.01,
    }

    const [moved] = advanceSteam([particle], 100, 0, ORIGIN, alwaysEmit)
    expect(moved.y).toBeLessThan(particle.y)
    expect(moved.ageMs).toBe(100)

    expect(advanceSteam([particle], 1_000, 0, ORIGIN, alwaysEmit)).toHaveLength(0)
  })

  it("spawns new particles at the emitter", () => {
    const [spawned] = advanceSteam([], 1_000, 1, ORIGIN, alwaysEmit)

    expect(spawned.y).toBe(ORIGIN.y)
    expect(spawned.ageMs).toBe(0)
    expect(Math.abs(spawned.originX - ORIGIN.x)).toBeLessThanOrEqual(
      STEAM_SPAWN_SPREAD / 2
    )
  })
})

describe("particleOpacity", () => {
  it("only ever returns one of the quantised steps", () => {
    const particle: SteamParticle = {
      originX: 0,
      y: 0,
      ageMs: 0,
      lifeMs: 1_000,
      drift: 0,
      wobblePhase: 0,
      speed: 0,
    }

    for (let ageMs = 0; ageMs <= 1_000; ageMs += 50) {
      const opacity = particleOpacity({ ...particle, ageMs })
      expect(opacity * STEAM_OPACITY_STEPS).toBe(
        Math.round(opacity * STEAM_OPACITY_STEPS)
      )
    }
  })

  it("fades as the particle ages", () => {
    const base: SteamParticle = {
      originX: 0,
      y: 0,
      ageMs: 0,
      lifeMs: 1_000,
      drift: 0,
      wobblePhase: 0,
      speed: 0,
    }

    expect(particleOpacity({ ...base, ageMs: 900 })).toBeLessThan(
      particleOpacity({ ...base, ageMs: 100 })
    )
  })
})

describe("particleX", () => {
  it("stays within the drift amplitude of its spawn column", () => {
    const particle: SteamParticle = {
      originX: 10,
      y: 0,
      ageMs: 0,
      lifeMs: 1_000,
      drift: 2,
      wobblePhase: 0.5,
      speed: 0,
    }

    for (let ageMs = 0; ageMs <= 1_000; ageMs += 25) {
      const x = particleX({ ...particle, ageMs })
      expect(Math.abs(x - 10)).toBeLessThanOrEqual(2)
    }
  })
})
