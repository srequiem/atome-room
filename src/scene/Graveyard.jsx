import { useMemo } from 'react'

import { makeNightSky } from '../utils/textures.js'

import Tombstone from './Tombstone.jsx'

/**
 * Ce qu'on voit dehors par la fenêtre : le ciel nocturne et sa lune,
 * un petit cimetière dans la brume, un arbre nu en silhouette.
 */
const GRAVES = [
  { position: [-0.4, 0.22, -4.2], rotation: 0.15, cross: true },
  { position: [0.6, 0.2, -4.8], rotation: -0.1 },
  { position: [1.7, 0.24, -4.4], rotation: 0.25, cross: true },
  { position: [2.6, 0.18, -5.4], rotation: -0.2 },
  { position: [0.1, 0.2, -5.8], rotation: 0.1, cross: true },
  { position: [1.2, 0.16, -6.3], rotation: -0.3 },
  { position: [-1.1, 0.18, -5.2], rotation: 0.3 },
]

const Graveyard = () => {
  const skyTex = useMemo(() => makeNightSky(), [])

  return (
    <group>
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

      {/* les tombes, dans la brume */}
      {GRAVES.map((g, i) => (
        <Tombstone key={i} position={g.position} rotation={g.rotation} cross={g.cross} />
      ))}

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

export default Graveyard
