import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Gère la lecture d'extraits audio avec une règle simple :
 * un seul son à la fois. Re-cliquer sur la source en cours l'arrête.
 *
 * @param {boolean} muted — coupe le son sans interrompre la lecture
 * @returns {{ audioKey: string|null, play: Function, stop: Function, stopIf: Function }}
 */
export const useExclusiveAudio = (muted) => {
  const [audioKey, setAudioKey] = useState(null)
  const playerRef = useRef(null)

  const stop = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pause()
      playerRef.current = null
    }
    setAudioKey(null)
  }, [])

  const play = useCallback(
    (key, src) => {
      // re-clic sur la même source → on coupe
      if (audioKey === key) {
        stop()
        return
      }
      if (playerRef.current) playerRef.current.pause()

      const audio = new Audio(src)
      audio.muted = muted
      audio.volume = 0.92
      audio.onended = () => setAudioKey((current) => (current === key ? null : current))
      audio.play().catch(() => {})

      playerRef.current = audio
      setAudioKey(key)
    },
    [audioKey, muted, stop]
  )

  const stopIf = useCallback(
    (key) => {
      if (audioKey === key) stop()
    },
    [audioKey, stop]
  )

  // refléter le mute sur la lecture en cours
  useEffect(() => {
    if (playerRef.current) playerRef.current.muted = muted
  }, [muted])

  return { audioKey, play, stop, stopIf }
}
