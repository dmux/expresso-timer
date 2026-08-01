export type Locale = "en-US" | "pt-BR"

export const dictionaries = {
  "en-US": {
    "app.title": "Expresso Timer",
    "phase.focus": "FOCUS",
    "phase.shortBreak": "BREAK",
    "phase.longBreak": "LONG BREAK",
    "cup.mug": "Mug",
    "cup.glass": "Glass",

    // Timer Display & Controls
    "timer.play": "Start",
    "timer.pause": "Pause",
    "timer.resume": "Resume",
    "timer.reset": "Reset",
    "timer.skip": "Skip",
    "timer.cycles": "{cycles} focus sessions in this cycle",

    // Theme Toggle
    "theme.dark": "Switch to dark theme",
    "theme.light": "Switch to light theme",
    "theme.system": "System theme",

    // Settings Dialog
    "settings.button": "Settings and history",
    "settings.tooltip": "Settings",
    "settings.title": "Settings",
    "settings.description":
      "Durations in minutes.\nChanges apply immediately to the current phase.",
    "settings.tabs.timer": "Timer",
    "settings.tabs.history": "History",
    "settings.tabs.about": "About",
    "settings.focus": "Focus",
    "settings.shortBreak": "Short break",
    "settings.longBreak": "Long break",
    "settings.cycles": "Focus sessions per cycle",
    "settings.cupModel": "Cup model",
    "settings.foam": "Cappuccino foam",
    "settings.milk": "Milk amount",
    "settings.autoStart": "Auto-start next phase",
    "settings.sound": "Sound effects",
    "settings.notifications": "Browser notifications",
    "settings.language": "Language",
    "language.en-US": "English",
    "language.pt-BR": "Português (BR)",

    // History
    "history.today": "Focus Today",
    "history.week": "This Week",
    "history.month": "This Month",
    "history.empty": "No sessions yet.",
    "history.col.phase": "Phase",
    "history.col.duration": "Duration",
    "history.col.when": "When",
    "history.skipped": " (skipped)",

    // Notifications
    "notification.completed": "{phase} completed",
    "notification.next": "Next: {phase}.",

    // About
    "about.description":
      "A pomodoro timer with pixel-art style focused on your productivity (and your coffee).",
    "about.developedBy": "Developed by",
  },
  "pt-BR": {
    "app.title": "Expresso Timer",
    "phase.focus": "FOCO",
    "phase.shortBreak": "PAUSA",
    "phase.longBreak": "PAUSA LONGA",
    "cup.mug": "Xícara",
    "cup.glass": "Copo",

    // Timer Display & Controls
    "timer.play": "Iniciar",
    "timer.pause": "Pausar",
    "timer.resume": "Retomar",
    "timer.reset": "Reiniciar",
    "timer.skip": "Pular",
    "timer.cycles": "de {cycles} focos no ciclo",

    // Theme Toggle
    "theme.dark": "Mudar para tema escuro",
    "theme.light": "Mudar para tema claro",
    "theme.system": "Tema do sistema",

    // Settings Dialog
    "settings.button": "Configurações e histórico",
    "settings.tooltip": "Configurações",
    "settings.title": "Configurações",
    "settings.description":
      "Durações em minutos.\nAlterações se aplicam imediatamente à fase atual.",
    "settings.tabs.timer": "Timer",
    "settings.tabs.history": "Histórico",
    "settings.tabs.about": "Sobre",

    // Settings - Timer
    "settings.focus": "Foco",
    "settings.shortBreak": "Pausa curta",
    "settings.longBreak": "Pausa longa",
    "settings.cycles": "Focos por ciclo",

    // Settings - Design
    "settings.cupModel": "Modelo da xícara",
    "settings.foam": "Espuma no cappuccino",
    "settings.milk": "Quantidade de leite",

    // Settings - Behavior
    "settings.autoStart": "Iniciar próxima fase automaticamente",
    "settings.sound": "Som ao finalizar",
    "settings.notifications": "Notificações do sistema",
    "settings.language": "Idioma",
    "language.en-US": "English",
    "language.pt-BR": "Português (BR)",

    // History
    "history.today": "Foco Hoje",
    "history.week": "Na Semana",
    "history.month": "No Mês",
    "history.empty": "Nenhuma sessão ainda.",
    "history.col.phase": "Fase",
    "history.col.duration": "Duração",
    "history.col.when": "Quando",
    "history.skipped": " (pulado)",

    // Notifications
    "notification.completed": "{phase} concluído",
    "notification.next": "Agora: {phase}.",

    // About
    "about.description":
      "Um timer pomodoro com estilo pixel-art focado na sua produtividade (e no seu café).",
    "about.developedBy": "Desenvolvido por",
  },
} as const

export type TranslationKey = keyof (typeof dictionaries)["en-US"]
