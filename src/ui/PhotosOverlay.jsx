import { IMG } from '../config.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const PhotosOverlay = ({ onClose }) => {
  const { t } = useLanguage()
  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay__inner" onClick={(e) => e.stopPropagation()}>
        <button className="overlay__close" onClick={onClose} aria-label={t.overlay.close}>×</button>
        <p className="overlay__kicker">{t.photos.kicker}</p>
        <div className="prints">
          <figure className="print">
            <img src={IMG.coverBrotherLarge} alt={t.photos.alt} />
            <figcaption>{t.photos.cap1}</figcaption>
          </figure>
          <figure className="print print--empty">
            <img src={IMG.coverCeSoirLarge} alt={t.photos.alt} />
            <figcaption>{t.photos.cap2}</figcaption>
          </figure>
          <figure className="print print--empty">
            <img src={IMG.coverMauvaisGarconLarge} alt={t.photos.alt} />
            <figcaption>{t.photos.cap3}</figcaption>
          </figure>
        </div>
      </div>
    </div>
  )
}

export default PhotosOverlay
