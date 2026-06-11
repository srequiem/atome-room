/** Écran d'entrée. La phrase porte tout ; on entre par le bouton. */
const Gate = ({ ready, entered, onEnter }) => (
  <div className={`gate ${entered ? 'gate--hidden' : ''}`}>
    <p className="gate__artist">Sacha Requiem</p>
    <p className="gate__line">Il y a une chambre. Quelqu’un y a caché des choses.</p>
    <button className="gate__enter" disabled={!ready} onClick={onEnter}>
      {ready ? 'Entrer dans la chambre' : 'La chambre se prépare…'}
    </button>
  </div>
)

export default Gate
