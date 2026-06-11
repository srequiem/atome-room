import { useMemo } from 'react'
import { makeLetterCube } from '../utils/textures.js'

/** Un petit cube d'enfant en bois, gravé d'une lettre. */
const LetterCube = ({ letter, position, rotation }) => {
  const tex = useMemo(() => makeLetterCube(letter), [letter])
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[0.13, 0.13, 0.13]} />
      <meshStandardMaterial map={tex} roughness={0.8} />
    </mesh>
  )
}

export default LetterCube
