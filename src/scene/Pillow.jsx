import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { AUDIO } from '../config.js'
import { useCursor } from '../hooks/useCursor.js'

/**
 * L'oreiller pivote pour révéler une dent de lait et une pièce,
 * et lance l'extrait de DAHLIA NOIR.
 * Se referme tout seul quand la caméra quitte ce focus.
 *
 * Placé à l'intérieur du groupe du lit : sa position est relative au lit.
 */
const Pillow = ({ focus, onFocus, markSecret, playExclusive, stopIf }) => {
  const pivotRef = useRef()
  const toothRef = useRef()
  const coinRef = useRef()
  const [lifted, setLifted] = useState(false)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  const reveal = () => {
    gsap.to(pivotRef.current.rotation, { x: -1.05, duration: 0.9, ease: 'power3.out' })
    gsap.to(toothRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.5, delay: 0.35, ease: 'back.out(2)' })
    gsap.to(coinRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.5, delay: 0.5, ease: 'back.out(2)' })
  }

  const conceal = () => {
    gsap.to(pivotRef.current.rotation, { x: 0, duration: 0.7, ease: 'power3.inOut' })
    gsap.to([toothRef.current.scale, coinRef.current.scale], { x: 0.001, y: 0.001, z: 0.001, duration: 0.3 })
  }

  const toggle = (e) => {
    e.stopPropagation()
    const next = !lifted
    setLifted(next)
    if (next) {
      onFocus('oreiller')
      reveal()
      playExclusive('oreiller', AUDIO.dahlia)
      markSecret('oreiller')
    } else {
      conceal()
      stopIf('oreiller')
    }
  }

  // si la caméra recule (focus perdu), on referme l'oreiller
  useEffect(() => {
    if (!focus && lifted) {
      setLifted(false)
      conceal()
    }
  }, [focus]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <group position={[0, 0.56, -0.98]}>
      <group ref={pivotRef}>
        <mesh
          position={[0, 0.045, 0.2]}
          castShadow
          onClick={toggle}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[0.58, 0.13, 0.36]} />
          <meshStandardMaterial color="#e9e2d0" roughness={0.95} />
        </mesh>
      </group>

      {/* Dent de lait + pièce, cachées dessous */}
      <group position={[0, 0.02, 0.18]}>
        <mesh ref={toothRef} scale={[0.001, 0.001, 0.001]} position={[-0.07, 0.02, 0]}>
          <coneGeometry args={[0.018, 0.034, 6]} />
          <meshStandardMaterial color="#f6f1e4" roughness={0.4} />
        </mesh>
        <mesh ref={coinRef} scale={[0.001, 0.001, 0.001]} position={[0.06, 0.006, 0.03]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.026, 0.026, 0.005, 24]} />
          <meshStandardMaterial color="#d9a83c" metalness={0.85} roughness={0.3} emissive="#3a2806" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  )
}

export default Pillow
