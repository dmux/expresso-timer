"use client"

import type { SessionRecord } from "@/application/ports"
import { CUP_DESIGN_LABELS, CUP_DESIGNS, type CupDesign } from "@/domain/cup/cup-design"
import { CUP_ART } from "@/domain/pixelart/sprites/cups"
import { ICON_GEAR } from "@/domain/pixelart/sprites/icons"
import { SETTINGS_LIMITS, type PomodoroSettings } from "@/domain/timer/settings"
import { PixelSprite } from "@/ui/components/pixel-sprite"
import { SessionHistory } from "@/ui/components/session-history"
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
                  aria-label="Configurações e histórico"
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
        <TooltipContent>Configurações</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajustes</DialogTitle>
          {/* Broken by hand rather than left to wrap: the close button sits over the
              right end of the first line, and one sentence per line clears it. */}
          <DialogDescription>
            Durações em minutos.
            <br />
            Mudanças valem já na fase atual.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="timer">
          <TabsList>
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="about">Sobre</TabsTrigger>
          </TabsList>

          <TabsContent value="timer">
            <div className="flex flex-col gap-[calc(var(--px)*5)] pt-[calc(var(--px)*3)]">
              <MinuteSlider
                id="focus"
                label="Foco"
                value={settings.focusMinutes}
                limits={SETTINGS_LIMITS.focusMinutes}
                onChange={(focusMinutes) => onChange({ focusMinutes })}
              />
              <MinuteSlider
                id="short-break"
                label="Pausa curta"
                value={settings.shortBreakMinutes}
                limits={SETTINGS_LIMITS.shortBreakMinutes}
                onChange={(shortBreakMinutes) => onChange({ shortBreakMinutes })}
              />
              <MinuteSlider
                id="long-break"
                label="Pausa longa"
                value={settings.longBreakMinutes}
                limits={SETTINGS_LIMITS.longBreakMinutes}
                onChange={(longBreakMinutes) => onChange({ longBreakMinutes })}
              />
              <MinuteSlider
                id="cycles"
                label="Focos por ciclo"
                unit=""
                value={settings.cyclesUntilLongBreak}
                limits={SETTINGS_LIMITS.cyclesUntilLongBreak}
                onChange={(cyclesUntilLongBreak) => onChange({ cyclesUntilLongBreak })}
              />

              <div className="flex flex-col gap-[calc(var(--px)*3)] border-t-[length:var(--px)] border-[var(--px-line)] pt-[calc(var(--px)*4)]">
                <DesignPicker
                  value={settings.cupDesign}
                  onChange={(cupDesign) => onChange({ cupDesign })}
                />
                {settings.cupDesign === "mug" && (
                  <Toggle
                    id="cappuccino-foam"
                    label="Espuma de cappuccino"
                    checked={settings.cappuccinoFoam}
                    onChange={(cappuccinoFoam) => onChange({ cappuccinoFoam })}
                  />
                )}
                <MinuteSlider
                  id="milk-amount"
                  label="Quantidade de leite"
                  unit="%"
                  value={settings.milkAmount}
                  limits={SETTINGS_LIMITS.milkAmount}
                  onChange={(milkAmount) => onChange({ milkAmount })}
                />
              </div>

              <div className="flex flex-col gap-[calc(var(--px)*3)] border-t-[length:var(--px)] border-[var(--px-line)] pt-[calc(var(--px)*4)]">
                <Toggle
                  id="auto-start"
                  label="Iniciar próxima fase sozinho"
                  checked={settings.autoStartNext}
                  onChange={(autoStartNext) => onChange({ autoStartNext })}
                />
                <Toggle
                  id="sound"
                  label="Som ao terminar"
                  checked={settings.soundEnabled}
                  onChange={(soundEnabled) => onChange({ soundEnabled })}
                />
                <Toggle
                  id="notifications"
                  label="Notificação do sistema"
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
                <span className="text-[calc(var(--px)*3)]">Expresso Timer</span>
                <span className="text-[var(--px-text-muted)]">
                  Um timer pomodoro com estilo pixel-art focado na sua produtividade (e no
                  seu café).
                </span>
              </div>

              <div className="flex flex-col gap-[calc(var(--px)*3)] border-t-[length:var(--px)] border-[var(--px-line)] pt-[calc(var(--px)*4)]">
                <span className="text-[var(--px-text-muted)]">Desenvolvido por</span>
                <span className="text-[calc(var(--px)*3)]">Rafael Sales</span>

                <div className="flex flex-col gap-[calc(var(--px)*2)] pl-[calc(var(--px)*2)]">
                  <a
                    href="https://rafaelsales.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--px-accent)] underline decoration-[length:var(--px)] underline-offset-4"
                  >
                    rafaelsales.dev
                  </a>
                  <a
                    href="https://github.com/rafaelsales"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--px-accent)] underline decoration-[length:var(--px)] underline-offset-4"
                  >
                    github.com/rafaelsales
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
  return (
    <div className="flex flex-col gap-[calc(var(--px)*2)]">
      <span className="text-[calc(var(--px)*3)]">Modelo do copo</span>
      <div
        role="radiogroup"
        aria-label="Modelo do copo"
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
            {CUP_DESIGN_LABELS[design]}
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
