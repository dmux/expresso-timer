import { PomodoroApp } from "@/ui/pomodoro-app"
import { LanguageProvider } from "@/ui/i18n/LanguageContext"

/** Thin Server Component shell; everything interactive lives in the client boundary. */
export default function Home() {
  return (
    <LanguageProvider>
      <PomodoroApp />
    </LanguageProvider>
  )
}
