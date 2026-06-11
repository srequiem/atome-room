import { IMG } from '../config.js'

/** Overlay plein écran : les tirages sortis de la boîte à chaussures. */
const PhotosOverlay = ({ onClose }) => (
  <div className="overlay" onClick={onClose}>
    <div className="overlay__inner" onClick={(e) => e.stopPropagation()}>
      <button className="overlay__close" onClick={onClose} aria-label="Fermer">×</button>
      <p className="overlay__kicker">La boîte à chaussures</p>
      <div className="prints">
        <figure className="print">
          <img src={IMG.coverLarge} alt="ATOME — la pochette. Une photo d'enfance, les yeux rouges du flash." />
          <figcaption>ATOME — C’est moi, vers 5 ans.</figcaption>
        </figure>
        <figure className="print print--empty">
          <div className="print__blank" />
          <figcaption>tirage à venir</figcaption>
        </figure>
        <figure className="print print--empty">
          <div className="print__blank" />
          <figcaption>tirage à venir</figcaption>
        </figure>
      </div>
    </div>
  </div>
)

export default PhotosOverlay
