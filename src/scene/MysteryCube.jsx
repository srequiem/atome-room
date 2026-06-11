import { useRef, useState, useMemo } from 'react'
import gsap from 'gsap'
import { AUDIO } from '../config.js'
import { makeLetterCube } from '../utils/textures.js'
import { useCursor } from '../hooks/useCursor.js'

/**
 * Le dé « ? » parmi les cubes A·T·O·M·E. Cliquable : il tourne sur
 * lui-même et lance l'extrait du single ATOME. C'est le 6ᵉ secret.
 */
const MysteryCube = ({ position, rotation, playExclusive, markSecret }) => {
  const tex = useMemo(() => makeLetterCube('?'), [])
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const ref = useRef()

  const activate = (e) => {
    e.stopPropagation()
    playExclusive('atome', AUDIO.atome)
    markSecret('atome')
    if (ref.current) {
      gsap.to(ref.current.rotation, { y: ref.current.rotation.y + Math.PI * 2, duration: 1.1, ease: 'power2.out' })
    }
  }

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      onClick={activate}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.13, 0.13, 0.13]} />
      <meshStandardMaterial map={tex} roughness={0.8} />
    </mesh>
  )
}

export default MysteryCube
