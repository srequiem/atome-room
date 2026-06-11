/** Une pierre tombale, ou une croix si `cross` est vrai. */
const Tombstone = ({ position, rotation = 0, cross = false }) => (
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

export default Tombstone
