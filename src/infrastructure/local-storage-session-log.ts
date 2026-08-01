import { z } from "zod"

import type { SessionLog, SessionRecord } from "@/application/ports"

const STORAGE_KEY = "expresso-timer:log:v1"
const MAX_RECORDS = 50

const schema = z.array(
  z.object({
    phase: z.enum(["focus", "shortBreak", "longBreak"]),
    elapsedMs: z.number().nonnegative(),
    completedAt: z.number().nonnegative(),
    ranToCompletion: z.boolean(),
  })
)

export function createLocalStorageSessionLog(storage: Storage): SessionLog {
  const readAll = (): SessionRecord[] => {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return []
    try {
      const parsed = schema.safeParse(JSON.parse(raw))
      return parsed.success ? parsed.data : []
    } catch {
      return []
    }
  }

  return {
    append(record) {
      // Newest first, capped — the log is a rolling window, not an archive.
      const next = [record, ...readAll()].slice(0, MAX_RECORDS)
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Ignore quota failures; losing history is better than losing the timer.
      }
    },

    recent(limit) {
      return readAll().slice(0, limit)
    },
  }
}
