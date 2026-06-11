import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { makeWallpaper, makeNightSky } from '../utils/textures.js'

function useCursor(hovered) {
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])
}

/*
  Mur du fond (z = -3) percé d'une fenêtre.
  Ouverture : 1.3 (l) × 1.5 (h), centrée en x = 0.7, y = 1.55.
  Dehors : la nuit, la lune, un cimetière dans la brume.
*/

const T = 0.12 // épaisseur mur
const WIN = { cx: 0.7, cy: 1.55, w: 1.3, h: 1.5 }

function curvedCurtainGeometry() {
  const g = new THREE.PlaneGeometry(0.42, 1.72, 12, 1)
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, Math.sin(pos.getX(i) * 22) * 0.028)
  }
  g.computeVertexNormals()
  return g
}

function Tombstone({ position, rotation = 0, cross = false }) {
  return (
    <group position={position} rotation-y={rotation}>
      {cross ? (
        <>
          <mesh castShadow>
            <boxGeometry args={[0.07, 0.62, 0.07]} />
            <meshStandardMaterial color="#1a1f2c" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.14, 0]} castShadow>
            <boxGeometry args={[0.34, 0.07, 0.07]} />
            <meshStandardMaterial color="#1a1f2c" roughness={0.95} />
          </mesh>
        </>
      ) : (
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.5, 0.09]} />
          <meshStandardMaterial color="#20242e" roughness={0.95} />
        </mesh>
      )}
    </group>
  )
}

export default function WindowWall({ onFocus, markSecret, onOverlay }) {
  const wallTex = useMemo(() => makeWallpaper(), [])
  const skyTex = useMemo(() => makeNightSky(), [])
  const curtainGeo = useMemo(() => curvedCurtainGeometry(), [])
  const [hov, setHov] = useState(false)
  useCursor(hov)
  const curtainL = useRef()
  const curtainR = useRef()
  const opened = useRef(false)

  function openWindow(e) {
    e.stopPropagation()
    onFocus('fenetre')
    if (!opened.current) {
      opened.current = true
      gsap.to(curtainL.current.position, { x: WIN.cx - WIN.w / 2 - 0.13, duration: 1.1, ease: 'power3.inOut' })
      gsap.to(curtainR.current.position, { x: WIN.cx + WIN.w / 2 + 0.13, duration: 1.1, ease: 'power3.inOut' })
      gsap.to([curtainL.current.scale, curtainR.current.scale], { x: 0.55, duration: 1.1, ease: 'power3.inOut' })
    }
    setTimeout(() => {
      markSecret('fenetre')
      onOverlay('teaser')
    }, 1300)
  }

  // les 4 pans de mur autour de l'ouverture
  const left = (WIN.cx - WIN.w / 2 + 3) / 2 - 3 // centre du pan gauche
  const leftW = WIN.cx - WIN.w / 2 + 3
  const rightW = 3 - (WIN.cx + WIN.w / 2)
  const botH = WIN.cy - WIN.h / 2
  const topH = 3 - (WIN.cy + WIN.h / 2)

  return (
    <group>
      {/* ── Mur du fond, percé ── */}
      <mesh position={[left, 1.5, -3]} castShadow receiveShadow>
        <boxGeometry args={[leftW, 3, T]} />
        <meshStandardMaterial map={wallTex} roughness={0.95} />
      </mesh>
      <mesh position={[(WIN.cx + WIN.w / 2 + 3) / 2, 1.5, -3]} castShadow receiveShadow>
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
          onPointerOver={() => setHov(true)}
          onPointerOut={() => setHov(false)}
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

      {/* ── Dehors : la nuit ── */}
      {/* ciel */}
      <mesh position={[0.7, 2.2, -8.5]}>
        <planeGeometry args={[14, 7]} />
        <meshBasicMaterial map={skyTex} fog={false} />
      </mesh>
      {/* sol extérieur */}
      <mesh rotation-x={-Math.PI / 2} position={[0.7, -0.05, -5.8]} receiveShadow>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#0a0e18" roughness={1} />
      </mesh>
      {/* le cimetière, dans la brume */}
      <Tombstone position={[-0.4, 0.22, -4.2]} rotation={0.15} cross />
      <Tombstone position={[0.6, 0.2, -4.8]} rotation={-0.1} />
      <Tombstone position={[1.7, 0.24, -4.4]} rotation={0.25} cross />
      <Tombstone position={[2.6, 0.18, -5.4]} rotation={-0.2} />
      <Tombstone position={[0.1, 0.2, -5.8]} rotation={0.1} cross />
      <Tombstone position={[1.2, 0.16, -6.3]} rotation={-0.3} />
      <Tombstone position={[-1.1, 0.18, -5.2]} rotation={0.3} />
      {/* un arbre nu, silhouette */}
      <group position={[3.4, 0, -5.0]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.09, 1.6, 8]} />
          <meshStandardMaterial color="#0e1119" roughness={1} />
        </mesh>
        <mesh position={[0.25, 1.5, 0]} rotation-z={-0.7}>
          <cylinderGeometry args={[0.02, 0.04, 0.8, 6]} />
          <meshStandardMaterial color="#0e1119" roughness={1} />
        </mesh>
        <mesh position={[-0.2, 1.7, 0]} rotation-z={0.6}>
          <cylinderGeometry args={[0.018, 0.035, 0.7, 6]} />
          <meshStandardMaterial color="#0e1119" roughness={1} />
        </mesh>
      </group>
    </group>
  )
}
