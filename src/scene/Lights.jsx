import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Les lumières d'une chambre la nuit : une ambiance bleutée,
 * la lune par la fenêtre (directionnelle), et la veilleuse (ponctuelle)
 * dont l'intensité « respire » quand elle est allumée.
 */
const Lights = ({ lampOn }) => {
  const lampRef = useRef()

  useFrame(({ clock }) => {
    if (!lampRef.current) return
    const target = lampOn ? 2.53 + Math.sin(clock.elapsedTime * 1.6) * 0.15 : 0
    lampRef.current.intensity += (target - lampRef.current.intensity) * 0.09
  })

  return (
    <>
      <ambientLight intensity={1.9} color="#44558c" />

      {/* la lune, par la fenêtre */}
      <directionalLight
        position={[3.2, 4.6, -7]}
        intensity={2}
        color="#8da3d8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0015}
      />

      {/* la veilleuse */}
      <pointLight
        ref={lampRef}
        position={[-1.05, 1.05, -2.55]}
        intensity={2.53}
        distance={10}
        decay={1.7}
        color="#ffb072"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.002}
      />
    </>
  )
}

export default Lights
