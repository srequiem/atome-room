import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { AUDIO } from '../config.js'
import { useCursor } from '../hooks/useCursor.js'

/**
 * Une planche posée contre le mur du fond, à côté de la fenêtre.
 * Rien de fancy : un deck, des trucks, 4 roues blanches face à la pièce.
 * Secret : au clic, il vacille et l'ambiance de la République (un soir
 * de manif) monte — le territoire de Sacha.
 */
const Skateboard = ({ onFocus, markSecret, playExclusive }) => {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const ref = useRef()

  const materials = useMemo(() => {
    const wood = new THREE.MeshStandardMaterial({ color: '#8a5a36', roughness: 0.65 })
    const grip = new THREE.MeshStandardMaterial({ color: '#16161a', roughness: 1 })
    // faces d'une box : +x, -x, +y, -y, +z (vers la pièce), -z (grip, contre le mur)
    return [wood, wood, wood, wood, wood, grip]
  }, [])

  const activate = (e) => {
    e.stopPropagation()
    onFocus('skate')
    playExclusive('skate', AUDIO.skate)
    markSecret('skate')
    if (ref.current) {
      gsap.fromTo(
        ref.current.rotation,
        { z: 0 },
        { z: 0.08, duration: 0.12, yoyo: true, repeat: 5, ease: 'sine.inOut' }
      )
    }
  }

  return (
    <group
      ref={ref}
      position={[1.72, 0.395, -2.86]}
      rotation-x={-0.18}
      onClick={activate}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* le deck, quasi vertical, appuyé contre le mur */}
      <mesh material={materials} castShadow>
        <boxGeometry args={[0.21, 0.78, 0.05]} />
      </mesh>
      {/* trucks + 4 roues blanches, face à la pièce */}
      {[-0.24, 0.24].map((y, i) => (
        <group key={i} position={[0, y, 0.055]}>
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.06, 0.06]} />
            <meshStandardMaterial color="#8c8f96" metalness={0.7} roughness={0.4} />
          </mesh>
          {[-0.075, 0.075].map((x, j) => (
            <mesh key={j} position={[x, 0, 0.03]} rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.036, 0.036, 0.03, 16]} />
              <meshStandardMaterial color="#efe9da" roughness={0.45} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export default Skateboard
