"use client"

import { useEffect } from "react"

import { msToClock } from "@/domain/shared/duration"
import { CoffeeCupCanvas } from "@/ui/components/coffee-cup-canvas"
import { PhaseBar } from "@/ui/components/phase-bar"
import { PixelPanel } from "@/ui/components/pixel-panel"
import { SettingsDialog } from "@/ui/components/settings-dialog"
import { ThemeToggle } from "@/ui/components/theme-toggle"
import { TimerControls } from "@/ui/components/timer-controls"
import { TimerDisplay } from "@/ui/components/timer-display"
import { usePomodoro } from "@/ui/hooks/use-pomodoro"
import { useTranslation, type TranslationKey } from "@/ui/i18n/LanguageContext"

export function PomodoroApp() {
  const {
    session,
    settings,
    remainingMs,
    progress,
    history,
    toggle,
    reset,
    skip,
    updateSettings,
  } = usePomodoro()

  const { t } = useTranslation()

  useEffect(() => {
    document.title =
      session.status === "running"
        ? `${msToClock(remainingMs)} · ${t(`phase.${session.phase}` as TranslationKey)}`
        : t("app.title")
  }, [remainingMs, session.status, session.phase, t])

  return (
    <main className="flex flex-1 items-center justify-center pixel-dither-soft p-[calc(var(--px)*4)]">
      {/* w-full up to the cap, so the panel tracks the device instead of sitting at a
          fixed width with the screen empty around it. */}
      <PixelPanel className="flex w-full max-w-[calc(var(--px)*150)] flex-col">
        <header className="flex items-center justify-between gap-[calc(var(--px)*2)] border-b-[length:var(--px)] border-[var(--px-line)] bg-[var(--px-surface-alt)] px-[calc(var(--px)*3)] py-[calc(var(--px)*2)]">
          {/* The balancing spacer only exists where there is room for it; below that
              the title sits left and the toggle right, which always fits. */}
          <div className="hidden w-[calc(var(--px)*38)] sm:block" aria-hidden="true" />
          <h1 className="text-[calc(var(--px)*3)] tracking-[var(--px)] uppercase sm:text-[calc(var(--px)*4)] sm:tracking-[calc(var(--px)*1.5)]">
            {t("app.title")}
          </h1>
          <div className="flex justify-end sm:w-[calc(var(--px)*38)]">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-col items-center gap-[calc(var(--px)*5)] p-[calc(var(--px)*5)]">
          <CoffeeCupCanvas
            session={session}
            design={settings.cupDesign}
            milkAmount={settings.milkAmount}
            cappuccinoFoam={settings.cappuccinoFoam}
          />

          <TimerDisplay
            phase={session.phase}
            remainingMs={remainingMs}
            completedFocusCount={session.completedFocusCount}
            cyclesUntilLongBreak={settings.cyclesUntilLongBreak}
          />

          <PhaseBar phase={session.phase} progress={progress} />

          {/* Wraps rather than overflowing once the buttons outgrow a narrow screen. */}
          <div className="flex flex-wrap items-center justify-center gap-[calc(var(--px)*3)]">
            <TimerControls
              status={session.status}
              onToggle={() => toggle?.()}
              onReset={() => reset?.()}
              onSkip={() => skip?.()}
            />
            <SettingsDialog
              settings={settings}
              history={history}
              onChange={(patch) => updateSettings?.(patch)}
            />
          </div>
        </div>
      </PixelPanel>
    </main>
  )
}
