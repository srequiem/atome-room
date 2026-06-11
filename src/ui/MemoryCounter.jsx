import { SECRET_IDS, SECRET_LABELS } from '../config.js'

/** Le compteur de souvenirs : un point par secret, allumé quand trouvé. */
const MemoryCounter = ({ secrets, found }) => (
  <div className="counter">
    <span className="counter__dots">
      {SECRET_IDS.map((id) => (
        <i key={id} title={SECRET_LABELS[id]} className={secrets[id] ? 'dot dot--on' : 'dot'} />
      ))}
    </span>
    <span className="counter__label">TROUVÉS · {found}/{SECRET_IDS.length}</span>
  </div>
)

export default MemoryCounter
