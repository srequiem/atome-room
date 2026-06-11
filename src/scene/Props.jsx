import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { AUDIO, IMG } from '../config.js'
import { makeDeckArt } from '../utils/textures.js'

function useCursor(hovered) {
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])
}

/* ────────────────────────────────────────────────────────────
   CHEVET + VEILLEUSE + ÉTOILES AU PLAFOND + CADRE PHOTO
   ──────────────────────────────────────────────────────────── */
export function Nightstand({ lampOn, onToggleLamp }) {
  const [hov, setHov] = useState(false)
  useCursor(hov)
  const coverTex = useLoader(THREE.TextureLoader, IMG.coverSmall)
  coverTex.colorSpace = THREE.SRGBColorSpace
  const glowRef = useRef()

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const base = lampOn ? 1.7 : 0
      glowRef.current.material.emissiveIntensity = base + (lampOn ? Math.sin(clock.elapsedTime * 1.6) * 0.25 : 0)
    }
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
        onPointerOver={() => setHov(true)}
        onPointerOut={() => setHov(false)}
      >
        <mesh position={[0, 0.022, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.062, 0.045, 16]} />
          <meshStandardMaterial color="#4a3a2c" roughness={0.7} />
        </mesh>
        <mesh ref={glowRef} position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.055, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#ffb47a"
            emissive="#ff9a4a"
            emissiveIntensity={1.7}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* cadre photo : la cover, déjà dans la chambre */}
      <group position={[0.14, 0.6, 0]} rotation={[-0.1, -0.25, 0]}>
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

/* Les étoiles que la veilleuse projette au plafond */
export function CeilingStars({ lampOn }) {
  const groupRef = useRef()
  const matRef = useRef()

  const positions = useMemo(() => {
    const center = { x: -0.95, z: -2.62 }
    const pts = []
    let seed = 12
    const rnd = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    for (let i = 0; i < 80; i++) {
      const a = rnd() * Math.PI * 2
      const r = 0.4 + rnd() * 2.4
      const x = Math.min(2.75, Math.max(-2.75, center.x + Math.cos(a) * r))
      const z = Math.min(2.75, Math.max(-2.75, center.z + Math.sin(a) * r * 0.9))
      pts.push(x - center.x, 2.965, z - center.z)
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
    <group ref={groupRef} position={[-0.95, 0, -2.62]}>
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

/* ────────────────────────────────────────────────────────────
   COMMODE + RADIO VINTAGE
   ──────────────────────────────────────────────────────────── */
export function Radio({ onFocus, playing, playExclusive }) {
  const [hov, setHov] = useState(false)
  useCursor(hov)
  const needleRef = useRef()

  useFrame(({ clock }) => {
    if (needleRef.current && playing) {
      needleRef.current.position.x = -0.05 + Math.sin(clock.elapsedTime * 0.6) * 0.04
    }
  })

  function toggle(e) {
    e.stopPropagation()
    onFocus('radio')
    playExclusive('radio', AUDIO.radio)
  }

  return (
    <group position={[2.55, 0, -1.3]}>
      {/* commode */}
      <mesh position={[-0.2, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.84, 0.95]} />
        <meshStandardMaterial color="#3a2c20" roughness={0.85} />
      </mesh>
      {[0.62, 0.4, 0.18].map((y, i) => (
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
        onPointerOver={() => setHov(true)}
        onPointerOut={() => setHov(false)}
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
          <meshStandardMaterial
            color="#e8d8a8"
            emissive="#c8a850"
            emissiveIntensity={playing ? 0.7 : 0.08}
            roughness={0.5}
          />
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

/* ────────────────────────────────────────────────────────────
   TV + CONSOLE — mini jeu de skate rétro (hommage générique
   aux jeux de skate PS1, sans aucune marque)
   ──────────────────────────────────────────────────────────── */
function drawSkateGame(ctx, W, H, t) {
  // ciel
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#221244')
  grad.addColorStop(1, '#0a0820')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
  // étoiles fixes
  ctx.fillStyle = 'rgba(220,225,255,0.7)'
  const stars = [[20, 18], [60, 30], [120, 12], [180, 26], [220, 16], [90, 40], [150, 36], [240, 38]]
  stars.forEach(([x, y]) => ctx.fillRect(x, y, 2, 2))
  // sol
  ctx.fillStyle = '#13301f'
  ctx.fillRect(0, H - 38, W, 38)
  ctx.fillStyle = '#0c2417'
  ctx.fillRect(0, H - 38, W, 3)
  // rampe
  ctx.fillStyle = '#3d4457'
  ctx.beginPath()
  ctx.moveTo(W - 92, H - 38)
  ctx.quadraticCurveTo(W - 50, H - 40, W - 46, H - 86)
  ctx.lineTo(W - 38, H - 86)
  ctx.lineTo(W - 38, H - 38)
  ctx.closePath()
  ctx.fill()
  // skateur
  const loop = W + 60
  const x = ((t * 55) % loop) - 30
  let y = H - 44
  if (x > W - 92 && x < W - 38) {
    const p = (x - (W - 92)) / 54
    y = H - 44 - Math.sin(p * Math.PI) * 34
  }
  const spin = x > W - 80 && x < W - 50 ? (t * 14) % (Math.PI * 2) : 0
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(spin)
  ctx.fillStyle = '#e8e8e8'
  ctx.fillRect(-9, 2, 18, 3) // board
  ctx.fillStyle = '#f5c89a'
  ctx.beginPath()
  ctx.arc(0, -14, 3.4, 0, Math.PI * 2) // tête
  ctx.fill()
  ctx.strokeStyle = '#f5c89a'
  ctx.lineWidth = 2.4
  ctx.beginPath()
  ctx.moveTo(0, -11)
  ctx.lineTo(0, -3)
  ctx.moveTo(0, -3)
  ctx.lineTo(-4, 2)
  ctx.moveTo(0, -3)
  ctx.lineTo(4, 2)
  ctx.moveTo(0, -9)
  ctx.lineTo(-5, -5)
  ctx.moveTo(0, -9)
  ctx.lineTo(5, -6)
  ctx.stroke()
  ctx.restore()
  // HUD
  ctx.fillStyle = '#aef2c0'
  ctx.font = 'bold 11px monospace'
  ctx.fillText('SCORE ' + String(Math.floor(t * 137) % 100000).padStart(5, '0'), 8, 16)
  if (Math.floor(t * 2) % 2 === 0) {
    ctx.fillStyle = '#ffd66e'
    ctx.fillText('SK8', W - 36, 16)
  }
  // scanlines CRT
  ctx.fillStyle = 'rgba(0,0,0,0.16)'
  for (let yy = 0; yy < H; yy += 3) ctx.fillRect(0, yy, W, 1)
}

export function TVSetup({ onFocus }) {
  const [on, setOn] = useState(false)
  const [hov, setHov] = useState(false)
  useCursor(hov)
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
    if (on && t - lastDraw.current > 1 / 12) {
      drawSkateGame(ctx, canvas.width, canvas.height, t)
      texture.needsUpdate = true
      lastDraw.current = t
    }
    if (lightRef.current) {
      lightRef.current.intensity = on ? 0.5 + Math.sin(t * 11) * 0.15 + Math.random() * 0.08 : 0
    }
  })

  function toggle(e) {
    e.stopPropagation()
    const next = !on
    setOn(next)
    if (next) onFocus('tv')
    if (!next) {
      ctx.fillStyle = '#060608'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      texture.needsUpdate = true
    }
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
        onClick={toggle}
        onPointerOver={() => setHov(true)}
        onPointerOut={() => setHov(false)}
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
            emissive={on ? '#ffffff' : '#000000'}
            emissiveIntensity={on ? 0.9 : 0}
            color={on ? '#888888' : '#0a0a0c'}
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
      <pointLight ref={lightRef} position={[0, 0.7, 0.7]} color="#7fc4ff" intensity={0} distance={3.2} decay={2} />

      {/* console grise au sol + câble + manette */}
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

/* ────────────────────────────────────────────────────────────
   SKATEBOARD — dressé contre le mur du fond, artwork ATOME
   visible. Clic : il vacille.
   ──────────────────────────────────────────────────────────── */
export function Skateboard() {
  const [hov, setHov] = useState(false)
  useCursor(hov)
  const innerRef = useRef()
  const deckArt = useMemo(() => makeDeckArt(), [])

  const materials = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({ color: '#7a4a2e', roughness: 0.7 })
    const grip = new THREE.MeshStandardMaterial({ color: '#16161a', roughness: 1 })
    const art = new THREE.MeshStandardMaterial({ map: deckArt, roughness: 0.55 })
    // ordre des faces d'une box : +x, -x, +y, -y, +z, -z
    return [side, side, art, grip, side, side]
  }, [deckArt])

  function wobble(e) {
    e.stopPropagation()
    if (!innerRef.current) return
    gsap.fromTo(
      innerRef.current.rotation,
      { x: 0 },
      { x: 0.09, duration: 0.12, yoyo: true, repeat: 5, ease: 'sine.inOut' }
    )
  }

  /*
    Dressé contre le mur du fond : tail au sol, nose appuyé au mur,
    l'artwork ATOME (face +y du deck) tourné vers la pièce.
    rotation-y du parent oriente la face, rotation-z de l'enfant le redresse.
  */
  return (
    <group position={[2.25, 0, -2.8]} rotation-y={Math.PI / 2}>
      <group
        ref={innerRef}
        position={[0, 0.38, 0]}
        rotation-z={1.32}
        onClick={wobble}
        onPointerOver={() => setHov(true)}
        onPointerOut={() => setHov(false)}
      >
        <mesh material={materials} castShadow>
          <boxGeometry args={[0.78, 0.05, 0.21]} />
        </mesh>
        {/* trucks + roues (côté grip → vers le mur) */}
        {[-0.24, 0.24].map((x, i) => (
          <group key={i} position={[x, -0.05, 0]}>
            <mesh>
              <boxGeometry args={[0.05, 0.05, 0.1]} />
              <meshStandardMaterial color="#8c8f96" metalness={0.7} roughness={0.4} />
            </mesh>
            {[-0.075, 0.075].map((z, j) => (
              <mesh key={j} position={[0, -0.015, z]} rotation-x={Math.PI / 2}>
                <cylinderGeometry args={[0.034, 0.034, 0.028, 14]} />
                <meshStandardMaterial color="#e8e2d4" roughness={0.5} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  )
}
