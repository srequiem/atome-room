import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useCursor } from '../hooks/useCursor.js'

/**
 * La boîte à chaussures, glissée sous le lit. Au clic elle sort,
 * son couvercle s'ouvre, puis l'overlay des tirages argentiques apparaît.
 * Positionnée en coordonnées monde (sœur du groupe du lit).
 */
const Shoebox = ({ onFocus, markSecret, onOverlay }) => {
  const boxRef = useRef()
  const lidRef = useRef()
  const [opened, setOpened] = useState(false)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  const open = (e) => {
    e.stopPropagation()
    if (opened) {
      onFocus('boite')
      onOverlay('photos')
      return
    }
    setOpened(true)
    onFocus('boite')
    gsap.to(boxRef.current.position, { x: -0.78, duration: 1.0, ease: 'power3.inOut' })
    gsap.to(lidRef.current.rotation, { x: -1.9, duration: 0.8, delay: 0.85, ease: 'power3.out' })
    setTimeout(() => {
      markSecret('boite')
      onOverlay('photos')
    }, 1900)
  }

  return (
    <group
      ref={boxRef}
      position={[-1.5, 0.075, -0.95]}
      onClick={open}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.12, 0.26]} />
        <meshStandardMaterial color="#8a7c66" roughness={0.95} />
      </mesh>
      {/* couvercle (pivot au bord arrière) */}
      <group position={[0, 0.06, -0.13]}>
        <group ref={lidRef}>
          <mesh position={[0, 0.012, 0.13]} castShadow>
            <boxGeometry args={[0.48, 0.025, 0.28]} />
            <meshStandardMaterial color="#7a6d58" roughness={0.95} />
          </mesh>
        </group>
      </group>
      {/* étiquette manuscrite */}
      <mesh position={[0, 0.0, 0.131]}>
        <planeGeometry args={[0.16, 0.06]} />
        <meshStandardMaterial color="#e6dcc4" roughness={0.9} />
      </mesh>
    </group>
  )
}

export default Shoebox
