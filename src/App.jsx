import { useState, useRef, useCallback, useEffect } from 'react'
import Experience from './Experience.jsx'
import { PRESAVE_URL, INSTAGRAM_URL, IMG, SECRET_IDS } from './config.js'

const SECRET_LABELS = {
  oreiller: 'sous l’oreiller',
  boite: 'la boîte à chaussures',
  radio: 'la radio',
  fenetre: 'par la fenêtre',
}

export default function App() {
  const [entered, setEntered] = useState(false)
  const [ready, setReady] = useState(false)
  const [focus, setFocus] = useState(null)
  const [secrets, setSecrets] = useState({})
  const [overlay, setOverlay] = useState(null) // 'photos' | null
  const [audioKey, setAudioKey] = useState(null)
  const [muted, setMuted] = useState(false)
  const [hintGone, setHintGone] = useState(false)
  const [finaleDismissed, setFinaleDismissed] = useState(false)
  const playerRef = useRef(null)

  // le hint s'efface tout seul au bout d'un moment
  useEffect(() => {
    if (!entered) return
    const t = setTimeout(() => setHintGone(true), 9000)
    return () => clearTimeout(t)
  }, [entered])

  const found = SECRET_IDS.filter((id) => secrets[id]).length
  const allFound = found >= SECRET_IDS.length

  // ── Audio : un seul son à la fois ──
  const stopAudio = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pause()
      playerRef.current = null
    }
    setAudioKey(null)
  }, [])

  const playExclusive = useCallback(
    (key, src) => {
      if (audioKey === key) {
        stopAudio()
        return
      }
      if (playerRef.current) playerRef.current.pause()
      const a = new Audio(src)
      a.muted = muted
      a.volume = 0.92
      a.onended = () => setAudioKey((k) => (k === key ? null : k))
      a.play().catch(() => {})
      playerRef.current = a
      setAudioKey(key)
    },
    [audioKey, muted, stopAudio]
  )

  const stopIf = useCallback(
    (key) => {
      if (audioKey === key) stopAudio()
    },
    [audioKey, stopAudio]
  )

  useEffect(() => {
    if (playerRef.current) playerRef.current.muted = muted
  }, [muted])

  const markSecret = useCallback((id) => {
    setSecrets((s) => (s[id] ? s : { ...s, [id]: true }))
    setHintGone(true)
  }, [])

  const onFocus = useCallback((id) => {
    setFocus(id)
    setHintGone(true)
  }, [])

  return (
    <div className="app">
      <Experience
        focus={focus}
        onFocus={onFocus}
        markSecret={markSecret}
        playExclusive={playExclusive}
        stopIf={stopIf}
        audioKey={audioKey}
        onOverlay={setOverlay}
        onReady={() => setReady(true)}
      />

      {/* ── Écran d'entrée ── */}
      <div className={`gate ${entered ? 'gate--hidden' : ''}`}>
        <p className="gate__artist">Sacha Requiem</p>
        <p className="gate__line">Il y a une chambre. Quelqu’un y a caché des choses.</p>
        <button
          className="gate__enter"
          disabled={!ready}
          onClick={() => setEntered(true)}
        >
          {ready ? 'Entrer dans la chambre' : 'La chambre se prépare…'}
        </button>
      </div>

      {/* ── HUD ── */}
      {entered && (
        <>
          <header className="hud-top">
            <div className="hud-id">
              <span className="hud-id__artist">Sacha Requiem</span>
              <span className="hud-id__title">ATOME</span>
            </div>
            <div className="hud-actions">
              {allFound && finaleDismissed && (
                <a className="hud-btn hud-btn--red" href={PRESAVE_URL} target="_blank" rel="noreferrer">
                  pre-save
                </a>
              )}
              <button
                className="hud-btn"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? 'Activer le son' : 'Couper le son'}
              >
                {muted ? 'son coupé' : 'son'}
              </button>
            </div>
          </header>

          {!hintGone && (
            <p className="hint">Fouille. Tout finit par se trouver.</p>
          )}

          <footer className="hud-bottom">
            {focus ? (
              <button className="hud-btn" onClick={() => setFocus(null)}>
                ← reculer
              </button>
            ) : (
              <span />
            )}
            <div className="counter">
              <span className="counter__dots">
                {SECRET_IDS.map((id) => (
                  <i key={id} title={SECRET_LABELS[id]} className={secrets[id] ? 'dot dot--on' : 'dot'} />
                ))}
              </span>
              <span className="counter__label">souvenirs · {found}/{SECRET_IDS.length}</span>
            </div>
          </footer>

          {/* ── Panneau final ── */}
          {allFound && !overlay && !finaleDismissed && (
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
              <button className="finale__dismiss" onClick={() => setFinaleDismissed(true)}>
                rester encore un peu dans la chambre
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Overlay : la boîte à chaussures ── */}
      {overlay === 'photos' && (
        <div className="overlay" onClick={() => setOverlay(null)}>
          <div className="overlay__inner" onClick={(e) => e.stopPropagation()}>
            <button className="overlay__close" onClick={() => setOverlay(null)} aria-label="Fermer">×</button>
            <p className="overlay__kicker">La boîte à chaussures</p>
            <div className="prints">
              <figure className="print">
                <img src={IMG.coverLarge} alt="ATOME — la pochette. Une photo d'enfance, les yeux rouges du flash." />
                <figcaption>ATOME — la pochette. C’est moi, vers quatre ans.</figcaption>
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
      )}

      <p className="credit">© Sacha Requiem — codé dans la chambre</p>
    </div>
  )
}
