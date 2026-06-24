import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

const STAR_COUNT = 80
const LAMP_CENTER = { x: -0.95, z: -2.62 }

const CeilingStars = ({ lampOn }) => {
  const groupRef = useRef()
  const matRef = useRef()

  const positions = useMemo(() => {
    const pts = []
    let seed = 12
    const rnd = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    for (let i = 0; i < STAR_COUNT; i++) {
      const a = rnd() * Math.PI * 2
      const r = 0.4 + rnd() * 2.4
      const x = Math.min(2.75, Math.max(-2.75, LAMP_CENTER.x + Math.cos(a) * r))
      const z = Math.min(2.75, Math.max(-2.75, LAMP_CENTER.z + Math.sin(a) * r * 0.9))
      pts.push(x - LAMP_CENTER.x, 2.965, z - LAMP_CENTER.z)
    }
    return new Float32Array(pts)
  }, [])

  useFrame(({ clock }, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.05
    if (matRef.current) {
      const target = lampOn ? 0.55 + Math.sin(clock.elapsedTime * 0.9) * 0.28 : 0
      matRef.current.opacity += (target - matRef.current.opacity) * 0.08
    }
  })

  return (
    <group ref={groupRef} position={[LAMP_CENTER.x, 0, LAMP_CENTER.z]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          ref={matRef}
          size={0.06}
          color="#ffe6ad"
          transparent
          opacity={0}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default CeilingStars
