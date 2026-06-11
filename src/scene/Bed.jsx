import Pillow from './Pillow.jsx'
import Shoebox from './Shoebox.jsx'
import Football from './Football.jsx'

/*
  Lit contre le mur gauche, tête au mur du fond.
  Centre du lit : x = -2.0, z = -1.55. Largeur 1.08 (x), longueur 2.1 (z).
*/

const BED_FEET = [[-0.5, -1.0], [0.5, -1.0], [-0.5, 1.0], [0.5, 1.0]]

const Bed = ({ focus, onFocus, markSecret, playExclusive, stopIf, onOverlay }) => {
  return (
    <group>
      {/* ── Structure du lit ── */}
      <group position={[-2.0, 0, -1.55]}>
        {/* tête de lit */}
        <mesh position={[0, 0.62, -1.06]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.7, 0.06]} />
          <meshStandardMaterial color="#3a2c20" roughness={0.8} />
        </mesh>
        {/* cadre */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.08, 0.16, 2.1]} />
          <meshStandardMaterial color="#34271c" roughness={0.85} />
        </mesh>
        {/* pieds */}
        {BED_FEET.map(([x, z], i) => (
          <mesh key={i} position={[x, 0.12, z]} castShadow>
            <cylinderGeometry args={[0.035, 0.04, 0.24, 10]} />
            <meshStandardMaterial color="#2a1f16" roughness={0.85} />
          </mesh>
        ))}
        {/* matelas */}
        <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.16, 2.02]} />
          <meshStandardMaterial color="#cfc6b2" roughness={0.95} />
        </mesh>
        {/* couette — rouge sombre, l'accent "yeux rouges" */}
        <mesh position={[0, 0.55, 0.42]} castShadow receiveShadow>
          <boxGeometry args={[1.06, 0.1, 1.25]} />
          <meshStandardMaterial color="#5b2330" roughness={0.95} />
        </mesh>

        {/* oreiller (relatif au lit) */}
        <Pillow
          focus={focus}
          onFocus={onFocus}
          markSecret={markSecret}
          playExclusive={playExclusive}
          stopIf={stopIf}
        />
      </group>

      {/* objets au sol, en coordonnées monde */}
      <Shoebox onFocus={onFocus} markSecret={markSecret} onOverlay={onOverlay} />
      <Football />
    </group>
  )
}

export default Bed
