import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCursor } from '../hooks/useCursor.js'
import { drawSkateGame } from '../utils/skateGame.js'

/**
 * Télé cathodique + console au sol. Toujours allumée : sa lueur bleue
 * qui scintille participe à l'éclairage. Un clic rapproche la caméra
 * (focus 'tv') — pas de on/off, pour que le premier clic change le plan
 * tout de suite. L'écran affiche un mini-jeu de skate rétro.
 */
const Television = ({ onFocus }) => {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const lightRef = useRef()
  const lastDraw = useRef(0)

  const { canvas, ctx, texture } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 160
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#060608'
    ctx.fillRect(0, 0, 256, 160)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return { canvas, ctx, texture }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (t - lastDraw.current > 1 / 12) {
      drawSkateGame(ctx, canvas.width, canvas.height, t)
      texture.needsUpdate = true
      lastDraw.current = t
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.68 + Math.sin(t * 11) * 0.14 + Math.random() * 0.07
    }
  })

  const focusTv = (e) => {
    e.stopPropagation()
    onFocus('tv')
  }

  return (
    <group position={[2.42, 0, 0.9]} rotation-y={-Math.PI / 2}>
      {/* meuble bas */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.4, 0.48]} />
        <meshStandardMaterial color="#33271c" roughness={0.85} />
      </mesh>

      {/* télé cathodique */}
      <group
        position={[0, 0.63, 0]}
        onClick={focusTv}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh castShadow>
          <boxGeometry args={[0.58, 0.46, 0.44]} />
          <meshStandardMaterial color="#2b2b32" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.01, 0.222]}>
          <planeGeometry args={[0.44, 0.34]} />
          <meshStandardMaterial
            map={texture}
            emissiveMap={texture}
            emissive="#ffffff"
            emissiveIntensity={0.9}
            color="#888888"
            roughness={0.35}
          />
        </mesh>
        {/* boutons */}
        <mesh position={[0.2, -0.17, 0.222]}>
          <planeGeometry args={[0.1, 0.05]} />
          <meshStandardMaterial color="#1c1c22" roughness={0.7} />
        </mesh>
      </group>

      {/* lueur de l'écran */}
      <pointLight ref={lightRef} position={[0, 0.7, 0.7]} color="#7fc4ff" intensity={0.7} distance={3.2} decay={2} />

      {/* console grise au sol + manette */}
      <group position={[0.18, 0, 0.5]}>
        <mesh position={[0, 0.045, 0]} castShadow>
          <boxGeometry args={[0.27, 0.08, 0.21]} />
          <meshStandardMaterial color="#9aa0a8" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.087, -0.01]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.07, 24]} />
          <meshStandardMaterial color="#6b7077" roughness={0.55} />
        </mesh>
        {/* manette */}
        <mesh position={[-0.28, 0.022, 0.18]} rotation-y={0.4} castShadow>
          <boxGeometry args={[0.15, 0.04, 0.1]} />
          <meshStandardMaterial color="#84888f" roughness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

export default Television
