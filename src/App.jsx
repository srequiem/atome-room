import { useState, useCallback, useEffect } from 'react'
import { SECRET_IDS } from './config.js'

import { useExclusiveAudio } from './hooks/useExclusiveAudio.js'

import Gate from './ui/Gate.jsx'
import Hud from './ui/Hud.jsx'
import Hint from './ui/Hint.jsx'
import MemoryCounter from './ui/MemoryCounter.jsx'
import Finale from './ui/Finale.jsx'
import PhotosOverlay from './ui/PhotosOverlay.jsx'
import PortraitOverlay from './ui/PortraitOverlay.jsx'

import Experience from './Experience.jsx'

const HINT_TIMEOUT = 9000

const App = () => {
  const [entered, setEntered] = useState(false)
  const [ready, setReady] = useState(false)
  const [focus, setFocus] = useState(null)
  const [secrets, setSecrets] = useState({})
  const [overlay, setOverlay] = useState(null) // 'photos' | 'portrait' | null
  const [muted, setMuted] = useState(false)
  const [hintGone, setHintGone] = useState(false)
  const [finaleDismissed, setFinaleDismissed] = useState(false)

  const { audioKey, play: playExclusive, stopIf } = useExclusiveAudio(muted)

  const found = SECRET_IDS.filter((id) => secrets[id]).length
  const allFound = found >= SECRET_IDS.length

  // le hint s'efface tout seul au bout d'un moment
  useEffect(() => {
    if (!entered) return
    const t = setTimeout(() => setHintGone(true), HINT_TIMEOUT)
    return () => clearTimeout(t)
  }, [entered])

  const markSecret = useCallback((id) => {
    setSecrets((s) => (s[id] ? s : { ...s, [id]: true }))
    setHintGone(true)
  }, [])

  const onFocus = useCallback((id) => {
    setFocus(id)
    setHintGone(true)
  }, [])

  const handleGoBack = () => {
    stopIf(focus)
    setFocus(null)
  }

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

      <Gate ready={ready} entered={entered} onEnter={() => setEntered(true)} />

      {entered && (
        <>
          <Hud
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
            showPresave={allFound && finaleDismissed}
          />

          {!hintGone && <Hint />}

          <footer className="hud-bottom">
            <button
              className="hud-btn"
              onClick={handleGoBack}
              style={{ visibility: focus ? 'visible' : 'hidden', pointerEvents: focus ? 'auto' : 'none' }}
            >
              ← reculer
            </button>
            <MemoryCounter secrets={secrets} found={found} />
          </footer>

          {allFound && !overlay && !finaleDismissed && (
            <Finale onDismiss={() => setFinaleDismissed(true)} />
          )}
        </>
      )}

      {overlay === 'photos' && <PhotosOverlay onClose={() => setOverlay(null)} />}
      {overlay === 'portrait' && <PortraitOverlay onClose={() => setOverlay(null)} />}

      <p className="credit">© atome's room 2026</p>
    </div>
  )
}

export default App
