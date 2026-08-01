import { useState } from "react"
import type { SessionRecord } from "@/application/ports"
import { calculateInsights } from "@/domain/timer/insights"
import { useTranslation, type TranslationKey } from "@/ui/i18n/LanguageContext"
import { ScrollArea } from "@/ui/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table"

type SessionHistoryProps = {
  history: readonly SessionRecord[]
}

export function SessionHistory({ history }: SessionHistoryProps) {
  const { t, locale } = useTranslation()
  const [now] = useState(() => Date.now())
  const { todayFocusMs, weekFocusMs, dailyTrendMs, weeklyTrendMs, monthlyTrendMs } =
    calculateInsights(history, now)

  const todayFocusMin = Math.round(todayFocusMs / 60_000)
  const weekFocusMin = Math.round(weekFocusMs / 60_000)
  const monthFocusMin = Math.round(monthlyTrendMs[5] / 60_000)

  return (
    <div className="flex flex-col gap-[calc(var(--px)*4)] pt-[calc(var(--px)*3)]">
      <div className="flex gap-[calc(var(--px)*2)] border-b-[length:var(--px)] border-[var(--px-line)] pb-[calc(var(--px)*4)]">
        <div className="flex flex-1 flex-col items-center justify-start">
          <span className="text-center text-[calc(var(--px)*2.5)] text-[var(--px-text-muted)]">
            {t("history.today")}
          </span>
          <span className="mt-[calc(var(--px)*1)] text-[calc(var(--px)*3.5)] tabular-nums">
            {todayFocusMin} min
          </span>
          <PixelSparkline data={dailyTrendMs} />
        </div>
        <div className="flex flex-1 flex-col items-center justify-start border-l-[length:var(--px)] border-[var(--px-line)]">
          <span className="text-center text-[calc(var(--px)*2.5)] text-[var(--px-text-muted)]">
            {t("history.week")}
          </span>
          <span className="mt-[calc(var(--px)*1)] text-[calc(var(--px)*3.5)] tabular-nums">
            {weekFocusMin} min
          </span>
          <PixelSparkline data={weeklyTrendMs} />
        </div>
        <div className="flex flex-1 flex-col items-center justify-start border-l-[length:var(--px)] border-[var(--px-line)]">
          <span className="text-center text-[calc(var(--px)*2.5)] text-[var(--px-text-muted)]">
            {t("history.month")}
          </span>
          <span className="mt-[calc(var(--px)*1)] text-[calc(var(--px)*3.5)] tabular-nums">
            {monthFocusMin} min
          </span>
          <PixelSparkline data={monthlyTrendMs} />
        </div>
      </div>

      {history.length === 0 ? (
        <p className="py-[calc(var(--px)*6)] text-center text-[calc(var(--px)*2.5)] text-[var(--px-text-muted)]">
          {t("history.empty")}
        </p>
      ) : (
        <ScrollArea className="h-[calc(var(--px)*45)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("history.col.phase")}</TableHead>
                <TableHead>{t("history.col.duration")}</TableHead>
                <TableHead>{t("history.col.when")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record, idx) => (
                <TableRow key={`${record.completedAt}-${idx}`}>
                  <TableCell>{t(`phase.${record.phase}` as TranslationKey)}</TableCell>
                  <TableCell>
                    {Math.round(record.elapsedMs / 60_000)} min
                    {!record.ranToCompletion && (
                      <span className="text-[var(--px-text-muted)]">
                        {t("history.skipped")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-[var(--px-text-muted)]">
                    {formatTime(record.completedAt, locale)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  )
}

function formatTime(epochMs: number, locale: string): string {
  return new Date(epochMs).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function PixelSparkline({ data }: { data: number[] }) {
  const max = Math.max(1, ...data)

  return (
    <div className="mt-[calc(var(--px)*3)] flex h-[calc(var(--px)*8)] w-full items-end justify-center gap-[calc(var(--px)*1.5)]">
      {data.map((value, i) => {
        const percentage = Math.max(2, (value / max) * 100)
        return (
          <div
            key={i}
            className="w-[calc(var(--px)*3)] bg-[var(--px-surface-inverted)] opacity-80"
            style={{ height: `${percentage}%` }}
            title={`${Math.round(value / 60_000)} min`}
          />
        )
      })}
    </div>
  )
}
