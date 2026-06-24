import { IMG } from '../config.js'


const PhotosOverlay = ({ onClose }) => (
  <div className="overlay" onClick={onClose}>
    <div className="overlay__inner" onClick={(e) => e.stopPropagation()}>
      <button className="overlay__close" onClick={onClose} aria-label="Fermer">×</button>
      <p className="overlay__kicker">La boîte à chaussures</p>
      <div className="prints">
        <figure className="print">
          <img src={IMG.coverBrotherLarge} alt="ATOME — la pochette. Une photo d'enfance, les yeux rouges du flash." />
          <figcaption>Brotherhood - Ma première sortie</figcaption>
        </figure>
        <figure className="print print--empty">
          <img src={IMG.coverCeSoirLarge} alt="ATOME — la pochette. Une photo d'enfance, les yeux rouges du flash." />
          <figcaption>Ce soir - Ma première sortie FR</figcaption>
        </figure>
        <figure className="print print--empty">
         <img src={IMG.coverMauvaisGarconLarge} alt="ATOME — la pochette. Une photo d'enfance, les yeux rouges du flash." />
          <figcaption>Mauvais Garçon</figcaption>
        </figure>
      </div>
    </div>
  </div>
)

export default PhotosOverlay
