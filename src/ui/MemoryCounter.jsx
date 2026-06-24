import { SECRET_IDS } from '../config.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

/** Le compteur de souvenirs : un point par secret, allumé quand trouvé. */
const MemoryCounter = ({ secrets, found }) => {
  const { t } = useLanguage()
  return (
    <div className="counter">
      <span className="counter__dots">
        {SECRET_IDS.map((id) => (
          <i key={id} title={t.secrets[id]} className={secrets[id] ? 'dot dot--on' : 'dot'} />
        ))}
      </span>
      <span className="counter__label">{t.counter.found} · {found}/{SECRET_IDS.length}</span>
    </div>
  )
}

export default MemoryCounter
