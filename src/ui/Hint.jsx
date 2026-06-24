import { useLanguage } from '../i18n/LanguageContext.jsx'

const Hint = () => {
  const { t } = useLanguage()
  return <p className="hint">{t.hint}</p>
}

export default Hint
