import { useLanguage } from '../i18n/LanguageContext.jsx'

/** L'invitation discrète à fouiller, en bas de l'écran. */
const Hint = () => {
  const { t } = useLanguage()
  return <p className="hint">{t.hint}</p>
}

export default Hint
