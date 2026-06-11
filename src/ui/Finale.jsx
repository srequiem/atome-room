import { PRESAVE_URL, INSTAGRAM_URL } from '../config.js'

/** Panneau de fin : apparaît quand les 4 souvenirs sont trouvés. */
const Finale = ({ onDismiss }) => (
  <div className="finale">
    <p className="finale__kicker">Tu as tout trouvé.</p>
    <p className="finale__text">
      <em>ATOME</em> — premier extrait de l’EP. Le reste arrive.
    </p>
    <div className="finale__actions">
      <a className="btn btn--primary" href={PRESAVE_URL} target="_blank" rel="noreferrer">
        Pre-save ATOME
      </a>
      <a className="btn" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
        Instagram
      </a>
    </div>
    <button className="finale__dismiss" onClick={onDismiss}>
      rester encore un peu dans la chambre
    </button>
  </div>
)

export default Finale
