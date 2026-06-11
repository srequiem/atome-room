import { PRESAVE_URL } from '../config.js'

/** Barre du haut : identité, raccourci pre-save (si débloqué + finale repliée), bouton son. */
const Hud = ({ muted, onToggleMute, showPresave }) => (
  <header className="hud-top">
    <div className="hud-id">
      <span className="hud-id__artist">Sacha Requiem</span>
      <span className="hud-id__title">ATOME</span>
    </div>
    <div className="hud-actions">
      {showPresave && (
        <a className="hud-btn hud-btn--red" href={PRESAVE_URL} target="_blank" rel="noreferrer">
          pre-save
        </a>
      )}
      <button
        className="hud-btn"
        onClick={onToggleMute}
        aria-label={muted ? 'Activer le son' : 'Couper le son'}
      >
        {muted ? 'son coupé' : 'son'}
      </button>
    </div>
  </header>
)

export default Hud
