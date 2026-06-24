import { useRef, useState } from 'react'

import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

import { IMG } from '../config.js'

import { useCursor } from '../hooks/useCursor.js'

/**
 * Table de chevet avec la veilleuse (clic = on/off, pilotée par le parent)
 * et un cadre photo posé dessus : la cover, déjà là dans la chambre.
 */
const Nightstand = ({ lampOn, onToggleLamp, onOverlay }) => {
  const [lampHover, setLampHover] = useState(false)
  const [frameHover, setFrameHover] = useState(false)

  useCursor(lampHover || frameHover)

  const coverTex = useLoader(THREE.TextureLoader, IMG.coverSmall)
  coverTex.colorSpace = THREE.SRGBColorSpace
  
  const glowRef = useRef()

  useFrame(({ clock }) => {
    if (!glowRef.current) return
    const base = lampOn ? 1.7 : 0
    glowRef.current.material.emissiveIntensity =
      base + (lampOn ? Math.sin(clock.elapsedTime * 1.6) * 0.25 : 0)
  })

  return (
    <group position={[-0.95, 0, -2.62]}>
      {/* table de chevet */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.6, 0.38]} />
        <meshStandardMaterial color="#3a2c20" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.42, 0.192]}>
        <planeGeometry args={[0.42, 0.16]} />
        <meshStandardMaterial color="#2c2117" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.42, 0.2]}>
        <sphereGeometry args={[0.014, 10, 10]} />
        <meshStandardMaterial color="#b8a06a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* veilleuse — clic pour éteindre / rallumer */}
      <group
        position={[-0.1, 0.6, 0.02]}
        onClick={(e) => { e.stopPropagation(); onToggleLamp() }}
        onPointerOver={() => setLampHover(true)}
        onPointerOut={() => setLampHover(false)}
      >
        <mesh position={[0, 0.022, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.062, 0.045, 16]} />
          <meshStandardMaterial color="#4a3a2c" roughness={0.7} />
        </mesh>
        <mesh ref={glowRef} position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.055, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffb47a" emissive="#ff9a4a" emissiveIntensity={1.7} roughness={0.4} />
        </mesh>
      </group>

      {/* cadre photo : la cover — clic pour l'agrandir */}
      <group
        position={[0.14, 0.6, 0]}
        rotation={[-0.1, -0.25, 0]}
        onClick={(e) => { e.stopPropagation(); onOverlay('portrait') }}
        onPointerOver={() => setFrameHover(true)}
        onPointerOut={() => setFrameHover(false)}
      >
        <mesh position={[0, 0.13, -0.012]} castShadow>
          <boxGeometry args={[0.24, 0.26, 0.018]} />
          <meshStandardMaterial color="#2c2118" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshStandardMaterial map={coverTex} roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

export default Nightstand
