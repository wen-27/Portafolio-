"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { translations, Language, TranslationKey } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKey
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get saved language preference
    const saved = localStorage.getItem("portfolio-language") as Language
    if (saved && (saved === "es" || saved === "en")) {
      setLanguage(saved)
    }
    setMounted(true)
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("portfolio-language", lang)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: "es", setLanguage: handleSetLanguage, t: translations.es }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
