import { SECRET_IDS } from '../config.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const MemoryCounter = ({ secrets, found, onFinalize }) => {
  const { t } = useLanguage()

  return (
    <div className="counter">
      <span className="counter__dots">
        {SECRET_IDS.map((id) => (
          <i key={id} title={t.secrets[id]} className={secrets[id] ? 'dot dot--on' : 'dot'} />
        ))}
      </span>
      <span className="counter__label">{t.counter.found} · {found}/{SECRET_IDS.length}</span>
      {/* {found >= SECRET_IDS.length && (
        <button className="counter__finalize" onClick={onFinalize}>
          TODO
        </button>
      )} */}
    </div>
  )
}

export default MemoryCounter
