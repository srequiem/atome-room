import { IMG } from '../config.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

/** Overlay plein écran : la photo d'enfance, en grand. */
const PortraitOverlay = ({ onClose }) => {
  const { t } = useLanguage()
  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay__inner" onClick={(e) => e.stopPropagation()}>
        <button className="overlay__close" onClick={onClose} aria-label={t.overlay.close}>×</button>
        <figure className="print print--solo">
          <img src={IMG.coverLarge} alt={t.portrait.alt} />
          <figcaption>{t.portrait.caption}</figcaption>
        </figure>
      </div>
    </div>
  )
}

export default PortraitOverlay
