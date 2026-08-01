"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { dictionaries, Locale, type TranslationKey } from "./dictionaries"

export type { TranslationKey }

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en-US")

  useEffect(() => {
    const saved = localStorage.getItem("expresso-locale")
    if (saved === "pt-BR" || saved === "en-US") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(saved)
    } else {
      // Check browser language
      const browserLang = navigator.language
      if (browserLang.startsWith("pt")) {
        setLocaleState("pt-BR")
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem("expresso-locale", newLocale)
    setLocaleState(newLocale)
  }

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let str: string = dictionaries[locale][key] || dictionaries["en-US"][key] || key

    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        str = str.replace(`{${param}}`, String(value))
      })
    }

    return str
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider")
  }
  return context
}
