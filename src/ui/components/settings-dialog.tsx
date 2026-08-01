"use client"

import type { SessionRecord } from "@/application/ports"
import { CUP_DESIGNS, type CupDesign } from "@/domain/cup/cup-design"
import { CUP_ART } from "@/domain/pixelart/sprites/cups"
import { ICON_GEAR } from "@/domain/pixelart/sprites/icons"
import { SETTINGS_LIMITS, type PomodoroSettings } from "@/domain/timer/settings"
import { PixelSprite } from "@/ui/components/pixel-sprite"
import { SessionHistory } from "@/ui/components/session-history"
import { useTranslation, type TranslationKey } from "@/ui/i18n/LanguageContext"
import { Button } from "@/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/ui/dialog"
import { Label } from "@/ui/components/ui/label"
import { Slider } from "@/ui/components/ui/slider"
import { Switch } from "@/ui/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/components/ui/tooltip"

type SettingsDialogProps = {
  settings: PomodoroSettings
  history: readonly SessionRecord[]
  onChange: (patch: Partial<PomodoroSettings>) => void
}

export function SettingsDialog({ settings, history, onChange }: SettingsDialogProps) {
  const { t, locale, setLocale } = useTranslation()
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <Button
                  variant="secondary"
                  size="icon-lg"
                  aria-label={t("settings.button")}
                />
              }
            />
          }
        >
          <PixelSprite
            sprite={ICON_GEAR}
            color="currentColor"
            className="w-[calc(var(--px)*6)]"
          />
        </TooltipTrigger>
        <TooltipContent>{t("settings.tooltip")}</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("settings.title")}</DialogTitle>
          <DialogDescription className="whitespace-pre-line">
            {t("settings.description")}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="timer">
          <TabsList>
            <TabsTrigger value="timer">{t("settings.tabs.timer")}</TabsTrigger>
            <TabsTrigger value="history">{t("settings.tabs.history")}</TabsTrigger>
            <TabsTrigger value="about">{t("settings.tabs.about")}</TabsTrigger>
          </TabsList>

          <TabsContent value="timer">
            <div className="flex flex-col gap-[calc(var(--px)*5)] pt-[calc(var(--px)*3)]">
              <MinuteSlider
                id="focus"
                label={t("settings.focus")}
                value={settings.focusMinutes}
                limits={SETTINGS_LIMITS.focusMinutes}
                onChange={(focusMinutes) => onChange({ focusMinutes })}
              />
              <MinuteSlider
                id="short-break"
                label={t("settings.shortBreak")}
                value={settings.shortBreakMinutes}
                limits={SETTINGS_LIMITS.shortBreakMinutes}
                onChange={(shortBreakMinutes) => onChange({ shortBreakMinutes })}
              />
              <MinuteSlider
                id="long-break"
                label={t("settings.longBreak")}
                value={settings.longBreakMinutes}
                limits={SETTINGS_LIMITS.longBreakMinutes}
                onChange={(longBreakMinutes) => onChange({ longBreakMinutes })}
              />
              <MinuteSlider
                id="cycles"
                label={t("settings.cycles")}
                unit=""
                value={settings.cyclesUntilLongBreak}
                limits={SETTINGS_LIMITS.cyclesUntilLongBreak}
                onChange={(cyclesUntilLongBreak) => onChange({ cyclesUntilLongBreak })}
              />

              <div className="flex flex-col gap-[calc(var(--px)*3)] border-t-[length:var(--px)] border-[var(--px-line)] pt-[calc(var(--px)*4)]">
                <LanguagePicker value={locale} onChange={setLocale} />
                <DesignPicker
                  value={settings.cupDesign}
                  onChange={(cupDesign) => onChange({ cupDesign })}
                />
                {settings.cupDesign === "mug" && (
                  <Toggle
                    id="cappuccino-foam"
                    label={t("settings.foam")}
                    checked={settings.cappuccinoFoam}
                    onChange={(cappuccinoFoam) => onChange({ cappuccinoFoam })}
                  />
                )}
                <MinuteSlider
                  id="milk-amount"
                  label={t("settings.milk")}
                  unit="%"
                  value={settings.milkAmount}
                  limits={SETTINGS_LIMITS.milkAmount}
                  onChange={(milkAmount) => onChange({ milkAmount })}
                />
              </div>

              <div className="flex flex-col gap-[calc(var(--px)*3)] border-t-[length:var(--px)] border-[var(--px-line)] pt-[calc(var(--px)*4)]">
                <Toggle
                  id="auto-start"
                  label={t("settings.autoStart")}
                  checked={settings.autoStartNext}
                  onChange={(autoStartNext) => onChange({ autoStartNext })}
                />
                <Toggle
                  id="sound"
                  label={t("settings.sound")}
                  checked={settings.soundEnabled}
                  onChange={(soundEnabled) => onChange({ soundEnabled })}
                />
                <Toggle
                  id="notifications"
                  label={t("settings.notifications")}
                  checked={settings.notificationsEnabled}
                  onChange={(notificationsEnabled) => onChange({ notificationsEnabled })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <SessionHistory history={history} />
          </TabsContent>

          <TabsContent value="about">
            <div className="flex flex-col gap-[calc(var(--px)*4)] pt-[calc(var(--px)*3)] text-[calc(var(--px)*2.5)]">
              <div className="flex flex-col items-center gap-[calc(var(--px)*2)] pb-[calc(var(--px)*2)] text-center">
                <span className="text-[calc(var(--px)*4)]">☕</span>
                <span className="text-[calc(var(--px)*3)]">{t("app.title")}</span>
                <span className="text-[var(--px-text-muted)]">
                  {t("about.description")}
                </span>
              </div>

              <div className="flex flex-col gap-[calc(var(--px)*3)] border-t-[length:var(--px)] border-[var(--px-line)] pt-[calc(var(--px)*4)]">
                <span className="text-[var(--px-text-muted)]">
                  {t("about.developedBy")}
                </span>
                <span className="text-[calc(var(--px)*3)]">Rafael Sales</span>

                <div className="flex flex-col gap-[calc(var(--px)*2)] pl-[calc(var(--px)*2)]">
                  <a
                    href="https://rfsales.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--px-accent)] underline decoration-[length:var(--px)] underline-offset-4"
                  >
                    rfsales.dev
                  </a>
                  <a
                    href="https://github.com/dmux/expresso-timer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--px-accent)] underline decoration-[length:var(--px)] underline-offset-4"
                  >
                    github.com/dmux/expresso-timer
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function MinuteSlider({
  id,
  label,
  value,
  limits,
  unit = "min",
  onChange,
}: {
  id: string
  label: string
  value: number
  limits: { min: number; max: number }
  unit?: string
  onChange: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-[calc(var(--px)*2)]">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-[calc(var(--px)*2.5)] tabular-nums">
          {value}
          {unit && ` ${unit}`}
        </span>
      </div>
      <Slider
        id={id}
        min={limits.min}
        max={limits.max}
        step={1}
        value={value}
        onValueChange={(next) => onChange(Array.isArray(next) ? next[0] : next)}
      />
    </div>
  )
}

/**
 * Two radios drawn as their own sprite: at this size a label alone ("Xícara" / "Copo")
 * says far less than the silhouette does, and the preview is the same art the canvas
 * renders, so what is picked is exactly what appears.
 */
function DesignPicker({
  value,
  onChange,
}: {
  value: CupDesign
  onChange: (design: CupDesign) => void
}) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-[calc(var(--px)*2)]">
      <span className="text-[calc(var(--px)*3)]">{t("settings.cupModel")}</span>
      <div
        role="radiogroup"
        aria-label={t("settings.cupModel")}
        className="flex gap-[calc(var(--px)*3)]"
      >
        {CUP_DESIGNS.map((design) => (
          <Button
            key={design}
            role="radio"
            aria-checked={value === design}
            variant={value === design ? "default" : "outline"}
            onClick={() => onChange(design)}
            className="h-auto flex-1 flex-col gap-[calc(var(--px)*2)] py-[calc(var(--px)*3)] text-[calc(var(--px)*2.5)]"
          >
            <PixelSprite
              sprite={CUP_ART[design].sprite}
              level={1}
              className="w-[calc(var(--px)*14)]"
            />
            {t(`cup.${design}` as TranslationKey)}
          </Button>
        ))}
      </div>
    </div>
  )
}

function LanguagePicker({
  value,
  onChange,
}: {
  value: "en-US" | "pt-BR"
  onChange: (locale: "en-US" | "pt-BR") => void
}) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-[calc(var(--px)*2)] pb-[calc(var(--px)*2)]">
      <span className="text-[calc(var(--px)*3)]">{t("settings.language")}</span>
      <div
        role="radiogroup"
        aria-label={t("settings.language")}
        className="flex gap-[calc(var(--px)*3)]"
      >
        {(["en-US", "pt-BR"] as const).map((lang) => (
          <Button
            key={lang}
            role="radio"
            aria-checked={value === lang}
            variant={value === lang ? "default" : "outline"}
            onClick={() => onChange(lang)}
            className="flex-1 text-[calc(var(--px)*2.5)]"
          >
            {t(`language.${lang}` as TranslationKey)}
          </Button>
        ))}
      </div>
    </div>
  )
}

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-[calc(var(--px)*4)]">
      <Label htmlFor={id}>{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
