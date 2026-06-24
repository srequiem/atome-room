import { useRef, useState } from 'react'

import { useFrame } from '@react-three/fiber'
import { AUDIO } from '../config.js'

import { useCursor } from '../hooks/useCursor.js'

/**
 * La commode et, posée dessus, la radio vintage. Au clic : l'extrait de
 * l'outro de l'EP, l'aiguille dérive, la LED et le cadran s'allument.
 */
const DRAWER_HEIGHTS = [0.62, 0.4, 0.18]

const Radio = ({ onFocus, markSecret, playing, playExclusive }) => {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  const needleRef = useRef()

  useFrame(({ clock }) => {
    if (needleRef.current && playing) {
      needleRef.current.position.x = -0.05 + Math.sin(clock.elapsedTime * 0.6) * 0.04
    }
  })

  const toggle = (e) => {
    e.stopPropagation()
    onFocus('radio')
    playExclusive('radio', AUDIO.radio)
    markSecret('radio')
  }

  return (
    <group position={[2.55, 0, -1.3]}>
      {/* commode */}
      <mesh position={[-0.2, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.84, 0.95]} />
        <meshStandardMaterial color="#3a2c20" roughness={0.85} />
      </mesh>
      {DRAWER_HEIGHTS.map((y, i) => (
        <group key={i}>
          <mesh position={[-0.412, y, 0]} rotation-y={-Math.PI / 2}>
            <planeGeometry args={[0.82, 0.16]} />
            <meshStandardMaterial color="#2c2117" roughness={0.9} />
          </mesh>
          <mesh position={[-0.42, y, 0]}>
            <sphereGeometry args={[0.016, 10, 10]} />
            <meshStandardMaterial color="#b8a06a" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* radio — clic pour écouter un extrait de l'EP */}
      <group
        position={[-0.2, 0.96, 0.08]}
        rotation-y={-Math.PI / 2}
        onClick={toggle}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh castShadow>
          <boxGeometry args={[0.44, 0.24, 0.16]} />
          <meshStandardMaterial color="#6e4226" roughness={0.6} />
        </mesh>
        {/* grille haut-parleur */}
        <mesh position={[-0.1, 0, 0.081]}>
          <planeGeometry args={[0.18, 0.18]} />
          <meshStandardMaterial color="#241a12" roughness={0.95} />
        </mesh>
        {/* cadran */}
        <mesh position={[0.11, 0.03, 0.081]}>
          <planeGeometry args={[0.16, 0.07]} />
          <meshStandardMaterial color="#e8d8a8" emissive="#c8a850" emissiveIntensity={playing ? 0.7 : 0.08} roughness={0.5} />
        </mesh>
        {/* aiguille */}
        <mesh ref={needleRef} position={[0.11, 0.03, 0.084]}>
          <planeGeometry args={[0.005, 0.06]} />
          <meshStandardMaterial color="#a8231d" />
        </mesh>
        {/* boutons */}
        {[-0.06, 0.06].map((x, i) => (
          <mesh key={i} position={[0.1 + x * 0.6, -0.07, 0.085]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.022, 0.022, 0.02, 14]} />
            <meshStandardMaterial color="#241a12" roughness={0.5} />
          </mesh>
        ))}
        {/* LED */}
        <mesh position={[0.2, 0.09, 0.081]}>
          <sphereGeometry args={[0.011, 8, 8]} />
          <meshStandardMaterial
            color={playing ? '#ff5040' : '#3a1410'}
            emissive={playing ? '#ff3522' : '#000000'}
            emissiveIntensity={playing ? 2.2 : 0}
          />
        </mesh>
        {/* antenne */}
        <mesh position={[-0.18, 0.24, 0]} rotation-z={0.5}>
          <cylinderGeometry args={[0.004, 0.004, 0.3, 6]} />
          <meshStandardMaterial color="#999" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  )
}

export default Radio
