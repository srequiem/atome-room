import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { AUDIO } from '../config.js'

function useCursor(hovered) {
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])
}

/*
  Lit contre le mur gauche, tête au mur du fond.
  Centre du lit : x = -2.0, z = -1.55. Largeur 1.08 (x), longueur 2.1 (z).
  → bord droit du cadre à x ≈ -1.46 : la boîte à chaussures dépasse dessous.
*/

export default function Bed({ onFocus, markSecret, playExclusive, stopIf, onOverlay }) {
  // ── Oreiller ──
  const pillowPivot = useRef()
  const toothRef = useRef()
  const coinRef = useRef()
  const [lifted, setLifted] = useState(false)
  const [hovP, setHovP] = useState(false)

  // ── Boîte à chaussures ──
  const boxRef = useRef()
  const lidRef = useRef()
  const [boxOpen, setBoxOpen] = useState(false)
  const [hovB, setHovB] = useState(false)

  useCursor(hovP || hovB)

  function togglePillow(e) {
    e.stopPropagation()
    const next = !lifted
    setLifted(next)
    if (next) {
      onFocus('oreiller')
      gsap.to(pillowPivot.current.rotation, { x: -1.05, duration: 0.9, ease: 'power3.out' })
      gsap.to(toothRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.5, delay: 0.35, ease: 'back.out(2)' })
      gsap.to(coinRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.5, delay: 0.5, ease: 'back.out(2)' })
      playExclusive('oreiller', AUDIO.fragment)
      markSecret('oreiller')
    } else {
      gsap.to(pillowPivot.current.rotation, { x: 0, duration: 0.7, ease: 'power3.inOut' })
      gsap.to([toothRef.current.scale, coinRef.current.scale], { x: 0.001, y: 0.001, z: 0.001, duration: 0.3 })
      stopIf('oreiller')
    }
  }

  function openBox(e) {
    e.stopPropagation()
    if (boxOpen) {
      onFocus('boite')
      onOverlay('photos')
      return
    }
    setBoxOpen(true)
    onFocus('boite')
    gsap.to(boxRef.current.position, { x: -0.78, duration: 1.0, ease: 'power3.inOut' })
    gsap.to(lidRef.current.rotation, { x: -1.9, duration: 0.8, delay: 0.85, ease: 'power3.out' })
    setTimeout(() => {
      markSecret('boite')
      onOverlay('photos')
    }, 1900)
  }

  return (
    <group>
      {/* ── Structure du lit ── */}
      <group position={[-2.0, 0, -1.55]}>
        {/* tête de lit */}
        <mesh position={[0, 0.62, -1.06]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.7, 0.06]} />
          <meshStandardMaterial color="#3a2c20" roughness={0.8} />
        </mesh>
        {/* cadre */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.08, 0.16, 2.1]} />
          <meshStandardMaterial color="#34271c" roughness={0.85} />
        </mesh>
        {/* pieds */}
        {[[-0.5, -1.0], [0.5, -1.0], [-0.5, 1.0], [0.5, 1.0]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.12, z]} castShadow>
            <cylinderGeometry args={[0.035, 0.04, 0.24, 10]} />
            <meshStandardMaterial color="#2a1f16" roughness={0.85} />
          </mesh>
        ))}
        {/* matelas */}
        <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.16, 2.02]} />
          <meshStandardMaterial color="#cfc6b2" roughness={0.95} />
        </mesh>
        {/* couette — rouge sombre, l'accent "yeux rouges" */}
        <mesh position={[0, 0.55, 0.42]} castShadow receiveShadow>
          <boxGeometry args={[1.06, 0.1, 1.25]} />
          <meshStandardMaterial color="#5b2330" roughness={0.95} />
        </mesh>

        {/* ── Oreiller (pivot au bord côté tête de lit) ── */}
        <group position={[0, 0.56, -0.98]}>
          <group ref={pillowPivot}>
            <mesh
              position={[0, 0.045, 0.2]}
              castShadow
              onClick={togglePillow}
              onPointerOver={() => setHovP(true)}
              onPointerOut={() => setHovP(false)}
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
      </group>

      {/* ── Boîte à chaussures, sous le lit, elle dépasse un peu ── */}
      <group
        ref={boxRef}
        position={[-1.5, 0.075, -0.95]}
        onClick={openBox}
        onPointerOver={() => setHovB(true)}
        onPointerOut={() => setHovB(false)}
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

      {/* ── Une chaussure de foot à crampons, oubliée là, couchée sur le flanc ── */}
      <group position={[-1.0, 0.052, -0.42]} rotation={[-1.5, 0.45, 0.15]}>
        {/* semelle */}
        <mesh castShadow>
          <boxGeometry args={[0.24, 0.022, 0.09]} />
          <meshStandardMaterial color="#ded8c8" roughness={0.6} />
        </mesh>
        {/* avant-pied */}
        <mesh position={[0.03, 0.045, 0]} castShadow>
          <boxGeometry args={[0.16, 0.06, 0.084]} />
          <meshStandardMaterial color="#17171c" roughness={0.55} />
        </mesh>
        {/* talon + cheville */}
        <mesh position={[-0.075, 0.058, 0]} castShadow>
          <boxGeometry args={[0.09, 0.09, 0.084]} />
          <meshStandardMaterial color="#17171c" roughness={0.55} />
        </mesh>
        {/* lacets */}
        {[0, 0.025, 0.05].map((dx, i) => (
          <mesh key={i} position={[0.04 + dx, 0.078, 0]}>
            <boxGeometry args={[0.008, 0.006, 0.05]} />
            <meshStandardMaterial color="#ded8c8" roughness={0.8} />
          </mesh>
        ))}
        {/* crampons, visibles puisque la chaussure est renversée */}
        {[
          [0.095, 0.028], [0.095, -0.028],
          [0.05, 0.03], [0.05, -0.03],
          [0, 0.03], [0, -0.03],
          [-0.085, 0.024], [-0.085, -0.024],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.018, z]}>
            <cylinderGeometry args={[0.0085, 0.005, 0.018, 8]} />
            <meshStandardMaterial color="#cfc9b8" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
