import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { AUDIO } from '../config.js'
import { makeWallpaper } from '../utils/textures.js'
import { makeCurtainGeometry } from '../utils/geometry.js'
import { useCursor } from '../hooks/useCursor.js'
import Graveyard from './Graveyard.jsx'

/*
  Mur du fond (z = -3) percé d'une fenêtre.
  Ouverture : 1.3 (l) × 1.5 (h), centrée en x = 0.7, y = 1.55.
*/

const T = 0.12 // épaisseur mur
const WIN = { cx: 0.7, cy: 1.55, w: 1.3, h: 1.5 }

const WindowWall = ({ onFocus, markSecret, playExclusive, stopIf }) => {
  const wallTex = useMemo(() => makeWallpaper(), [])
  const curtainGeo = useMemo(() => makeCurtainGeometry(), [])
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const curtainL = useRef()
  const curtainR = useRef()
  const opened = useRef(false)

  const openWindow = (e) => {
    e.stopPropagation()
    onFocus('fenetre')
    // l'extrait de « Comme il est loin » monte du cimetière
    playExclusive('fenetre', AUDIO.fenetre)
    if (!opened.current) {
      opened.current = true
      gsap.to(curtainL.current.position, { x: WIN.cx - WIN.w / 2 - 0.13, duration: 1.1, ease: 'power3.inOut' })
      gsap.to(curtainR.current.position, { x: WIN.cx + WIN.w / 2 + 0.13, duration: 1.1, ease: 'power3.inOut' })
      gsap.to([curtainL.current.scale, curtainR.current.scale], { x: 0.55, duration: 1.1, ease: 'power3.inOut' })
    }
    setTimeout(() => markSecret('fenetre'), 1200)
  }

  // les 4 pans de mur autour de l'ouverture
  const leftCenter = (WIN.cx - WIN.w / 2 + 3) / 2 - 3
  const leftW = WIN.cx - WIN.w / 2 + 3
  const rightCenter = (WIN.cx + WIN.w / 2 + 3) / 2
  const rightW = 3 - (WIN.cx + WIN.w / 2)
  const botH = WIN.cy - WIN.h / 2
  const topH = 3 - (WIN.cy + WIN.h / 2)

  return (
    <group>
      {/* ── Mur du fond, percé (4 pans) ── */}
      <mesh position={[leftCenter, 1.5, -3]} castShadow receiveShadow>
        <boxGeometry args={[leftW, 3, T]} />
        <meshStandardMaterial map={wallTex} roughness={0.95} />
      </mesh>
      <mesh position={[rightCenter, 1.5, -3]} castShadow receiveShadow>
        <boxGeometry args={[rightW, 3, T]} />
        <meshStandardMaterial map={wallTex} roughness={0.95} />
      </mesh>
      <mesh position={[WIN.cx, botH / 2, -3]} castShadow receiveShadow>
        <boxGeometry args={[WIN.w, botH, T]} />
        <meshStandardMaterial map={wallTex} roughness={0.95} />
      </mesh>
      <mesh position={[WIN.cx, WIN.cy + WIN.h / 2 + topH / 2, -3]} castShadow receiveShadow>
        <boxGeometry args={[WIN.w, topH, T]} />
        <meshStandardMaterial map={wallTex} roughness={0.95} />
      </mesh>

      {/* ── Cadre de fenêtre + croisillons ── */}
      <group position={[WIN.cx, WIN.cy, -3]}>
        {[
          [0, WIN.h / 2 + 0.03, WIN.w + 0.16, 0.07],
          [0, -WIN.h / 2 - 0.03, WIN.w + 0.16, 0.07],
        ].map(([x, y, w, h], i) => (
          <mesh key={'h' + i} position={[x, y, 0.02]}>
            <boxGeometry args={[w, h, 0.1]} />
            <meshStandardMaterial color="#454b5e" roughness={0.7} />
          </mesh>
        ))}
        {[
          [-WIN.w / 2 - 0.03, 0, 0.07, WIN.h + 0.16],
          [WIN.w / 2 + 0.03, 0, 0.07, WIN.h + 0.16],
        ].map(([x, y, w, h], i) => (
          <mesh key={'v' + i} position={[x, y, 0.02]}>
            <boxGeometry args={[w, h, 0.1]} />
            <meshStandardMaterial color="#454b5e" roughness={0.7} />
          </mesh>
        ))}
        {/* croisillon central */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.045, WIN.h, 0.06]} />
          <meshStandardMaterial color="#3c4254" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[WIN.w, 0.045, 0.06]} />
          <meshStandardMaterial color="#3c4254" roughness={0.7} />
        </mesh>

        {/* vitre cliquable */}
        <mesh
          position={[0, 0, -0.01]}
          onClick={openWindow}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[WIN.w, WIN.h]} />
          <meshStandardMaterial color="#9db4e8" transparent opacity={0.07} roughness={0.1} />
        </mesh>
      </group>

      {/* ── Rideaux ── */}
      <mesh ref={curtainL} geometry={curtainGeo} position={[WIN.cx - 0.36, WIN.cy + 0.04, -2.9]} castShadow>
        <meshStandardMaterial color="#243150" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={curtainR} geometry={curtainGeo} position={[WIN.cx + 0.36, WIN.cy + 0.04, -2.9]} castShadow>
        <meshStandardMaterial color="#243150" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* tringle */}
      <mesh position={[WIN.cx, WIN.cy + WIN.h / 2 + 0.16, -2.9]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.014, 0.014, WIN.w + 0.5, 10]} />
        <meshStandardMaterial color="#5c5346" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* ── Dehors : le cimetière, la lune ── */}
      <Graveyard />
    </group>
  )
}

export default WindowWall
