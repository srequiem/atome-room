import { useLanguage } from '../i18n/LanguageContext.jsx'

/** Écran d'entrée. La phrase porte tout ; on entre par le bouton. */
const Gate = ({ ready, entered, onEnter }) => {
  const { t } = useLanguage()
  return (
    <div className={`gate ${entered ? 'gate--hidden' : ''}`}>
      <p className="gate__artist">Sacha Requiem</p>
      <p className="gate__line">{t.gate.line}</p>
      <button className="gate__enter" disabled={!ready} onClick={onEnter}>
        {ready ? t.gate.enter : t.gate.loading}
      </button>
    </div>
  )
}

export default Gate
