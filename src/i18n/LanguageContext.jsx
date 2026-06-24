import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { STRINGS } from './strings.js'

const STORAGE_KEY = 'atome-lang'
const SUPPORTED = ['fr', 'en']

const detectLang = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (SUPPORTED.includes(saved)) return saved
  } catch {
    /* localStorage indisponible : on ignore */
  }
  const nav = (navigator.language || 'fr').toLowerCase()
  return nav.startsWith('en') ? 'en' : 'fr'
}

const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(detectLang)

  const setLang = (next) => {
    if (!SUPPORTED.includes(next)) return
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
    }
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t: STRINGS[lang] }), [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage doit être utilisé dans <LanguageProvider>')
  return ctx
}
