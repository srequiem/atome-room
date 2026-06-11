import { IMG } from '../config.js'

/** Overlay plein écran : la photo d'enfance, en grand. */
const PortraitOverlay = ({ onClose }) => (
  <div className="overlay" onClick={onClose}>
    <div className="overlay__inner" onClick={(e) => e.stopPropagation()}>
      <button className="overlay__close" onClick={onClose} aria-label="Fermer">×</button>
      <figure className="print print--solo">
        <img src={IMG.coverLarge} alt="Sacha enfant, les yeux rouges du flash, devant le sapin." />
        <figcaption>C’est moi, vers 5 ans.</figcaption>
      </figure>
    </div>
  </div>
)

export default PortraitOverlay
