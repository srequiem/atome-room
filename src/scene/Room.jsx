import { useMemo } from 'react'
import { makeWallpaper, makeFloor, makeRug, makeLetterCube } from '../utils/textures.js'

/*
  La chambre : 6 × 3 × 6 m, origine au centre du sol.
  Diorama : pas de mur côté caméra (front, z = +3).
  Murs : back (z=-3, géré dans WindowWall), left (x=-3), right (x=+3).
*/

const WALL_THICKNESS = 0.12

function LetterCube({ letter, position, rotation }) {
  const tex = useMemo(() => makeLetterCube(letter), [letter])
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[0.13, 0.13, 0.13]} />
      <meshStandardMaterial map={tex} roughness={0.8} />
    </mesh>
  )
}

export default function Room() {
  const wallTex = useMemo(() => makeWallpaper(), [])
  const floorTex = useMemo(() => makeFloor(), [])
  const rugTex = useMemo(() => makeRug(), [])

  return (
    <group>
      {/* Sol */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial map={floorTex} roughness={0.85} />
      </mesh>

      {/* Plafond */}
      <mesh rotation-x={Math.PI / 2} position={[0, 3, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#10172b" roughness={0.95} />
      </mesh>

      {/* Mur gauche */}
      <mesh position={[-3 - WALL_THICKNESS / 2 + WALL_THICKNESS / 2, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[WALL_THICKNESS, 3, 6]} />
        <meshStandardMaterial map={wallTex} roughness={0.95} />
      </mesh>

      {/* Mur droit */}
      <mesh position={[3, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[WALL_THICKNESS, 3, 6]} />
        <meshStandardMaterial map={wallTex} roughness={0.95} />
      </mesh>

      {/* Porte (mur gauche, vers l'avant) */}
      <group position={[-2.92, 0, 1.6]}>
        <mesh position={[0, 1.04, 0]} rotation-y={Math.PI / 2} receiveShadow>
          <planeGeometry args={[0.92, 2.08]} />
          <meshStandardMaterial color="#131a2e" roughness={0.8} />
        </mesh>
        {/* cadre */}
        <mesh position={[0.005, 2.12, 0]} rotation-y={Math.PI / 2}>
          <planeGeometry args={[1.04, 0.08]} />
          <meshStandardMaterial color="#0d1322" roughness={0.9} />
        </mesh>
        {/* poignée */}
        <mesh position={[0.04, 1.02, 0.36]}>
          <sphereGeometry args={[0.026, 12, 12]} />
          <meshStandardMaterial color="#b8a06a" metalness={0.7} roughness={0.35} />
        </mesh>
      </group>

      {/* Tapis */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, 0.45]} receiveShadow>
        <circleGeometry args={[1.15, 48]} />
        <meshStandardMaterial map={rugTex} roughness={1} />
      </mesh>

      {/* Cubes alphabet — ils épellent A·T·O·M·E pour qui regarde bien */}
      <LetterCube letter="A" position={[-0.35, 0.078, 0.32]} rotation={[0, 0.5, 0]} />
      <LetterCube letter="T" position={[0.1, 0.078, 0.78]} rotation={[0, -0.3, 0]} />
      <LetterCube letter="O" position={[0.38, 0.078, 0.42]} rotation={[0, 0.9, 0]} />
      <LetterCube letter="M" position={[-0.08, 0.078, 0.12]} rotation={[0, -0.7, 0]} />
      <LetterCube letter="E" position={[0.62, 0.078, 0.95]} rotation={[0, 0.2, 0]} />
      {/* un cube tombé sur la tranche */}
      <LetterCube letter="?" position={[-0.62, 0.078, 0.85]} rotation={[0, 1.2, Math.PI / 2]} />
    </group>
  )
}
