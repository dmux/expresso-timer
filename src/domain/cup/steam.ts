import { clamp } from "../shared/duration"

/** Positions are in sprite pixel units, so the renderer only has to scale them. */
export type SteamParticle = {
  readonly originX: number
  readonly y: number
  readonly ageMs: number
  readonly lifeMs: number
  /** Horizontal wobble amplitude, in sprite pixels. */
  readonly drift: number
  readonly wobblePhase: number
  /** Sprite pixels per millisecond. */
  readonly speed: number
}

/** Injected so a seeded generator makes the whole simulation reproducible in tests. */
export type Rng = () => number

/* Tuned for the 48-wide cup: a wider, slower, denser plume than a 24-wide mug needs. */
const MAX_EMISSIONS_PER_SECOND = 26
const MIN_LIFE_MS = 1_400
const LIFE_SPREAD_MS = 1_000
const MIN_SPEED = 0.008
const SPEED_SPREAD = 0.006
const MAX_DRIFT = 5
const WOBBLE_RATE = 0.004

/** Width of the band particles spawn across, centred on the emitter. */
export const STEAM_SPAWN_SPREAD = 7

/** Opacity is quantised — a continuously fading particle betrays the pixel grid. */
export const STEAM_OPACITY_STEPS = 4

export type SteamOrigin = {
  readonly x: number
  readonly y: number
}

/**
 * Pure step: ages and lifts the existing particles, drops the expired ones, and emits
 * new ones at a rate proportional to `intensity`. Same inputs, same output.
 */
export function advanceSteam(
  particles: readonly SteamParticle[],
  dtMs: number,
  intensity: number,
  origin: SteamOrigin,
  rng: Rng
): SteamParticle[] {
  const alive: SteamParticle[] = []

  for (const particle of particles) {
    const ageMs = particle.ageMs + dtMs
    if (ageMs >= particle.lifeMs) continue
    alive.push({ ...particle, ageMs, y: particle.y - particle.speed * dtMs })
  }

  const toEmit = emissionCount(dtMs, intensity, rng)
  for (let i = 0; i < toEmit; i += 1) {
    alive.push(spawn(origin, rng))
  }

  return alive
}

/**
 * Fractional expectation resolved by a single random draw, so the average rate is exact
 * without carrying an accumulator across frames.
 */
function emissionCount(dtMs: number, intensity: number, rng: Rng): number {
  const expected =
    MAX_EMISSIONS_PER_SECOND * clamp(intensity, 0, 1) * (Math.max(0, dtMs) / 1000)
  const whole = Math.floor(expected)
  return whole + (rng() < expected - whole ? 1 : 0)
}

function spawn(origin: SteamOrigin, rng: Rng): SteamParticle {
  return {
    originX: origin.x + (rng() - 0.5) * STEAM_SPAWN_SPREAD,
    y: origin.y,
    ageMs: 0,
    lifeMs: MIN_LIFE_MS + rng() * LIFE_SPREAD_MS,
    drift: rng() * MAX_DRIFT,
    wobblePhase: rng() * Math.PI * 2,
    speed: MIN_SPEED + rng() * SPEED_SPREAD,
  }
}

/** Wobble is derived from age rather than stored, keeping the particle immutable. */
export function particleX(particle: SteamParticle): number {
  return (
    particle.originX +
    Math.sin(particle.wobblePhase + particle.ageMs * WOBBLE_RATE) * particle.drift
  )
}

export function particleOpacity(particle: SteamParticle): number {
  const remaining = 1 - clamp(particle.ageMs / particle.lifeMs, 0, 1)
  return Math.ceil(remaining * STEAM_OPACITY_STEPS) / STEAM_OPACITY_STEPS
}

export type PuffSize = 1 | 2 | 3

/**
 * Puff shapes as pixel offsets from the particle's own cell. Real steam leaves the cup
 * tight and blooms as it cools, so size grows with age while opacity falls — the two
 * curves crossing is what makes the plume look like vapour rather than confetti.
 */
const PUFF_SHAPES: Record<PuffSize, readonly (readonly [number, number])[]> = {
  1: [[0, 0]],
  2: [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
  3: [
    [0, -1],
    [-1, 0],
    [0, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [0, 2],
  ],
}

export function particleSize(particle: SteamParticle): PuffSize {
  const life = clamp(particle.ageMs / particle.lifeMs, 0, 1)
  if (life < 0.25) return 1
  if (life < 0.6) return 2
  return 3
}

export function puffOffsets(size: PuffSize) {
  return PUFF_SHAPES[size]
}
