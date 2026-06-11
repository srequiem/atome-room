import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { BASE_CAM, FOCUS } from './config.js'
import Room from './scene/Room.jsx'
import Bed from './scene/Bed.jsx'
import WindowWall from './scene/WindowWall.jsx'
import { Nightstand, CeilingStars, Radio, TVSetup, Skateboard } from './scene/Props.jsx'

/* ── Caméra : une seule source de vérité (cur), GSAP anime cur,
     useFrame applique cur + parallax souris ── */
function CameraRig({ focus }) {
  const { camera } = useThree()
  const cur = useRef({
    px: BASE_CAM.pos[0], py: BASE_CAM.pos[1], pz: BASE_CAM.pos[2],
    lx: BASE_CAM.look[0], ly: BASE_CAM.look[1], lz: BASE_CAM.look[2],
  })
  const lookVec = useRef(new THREE.Vector3())

  useEffect(() => {
    const target = focus && FOCUS[focus] ? FOCUS[focus] : BASE_CAM
    gsap.to(cur.current, {
      px: target.pos[0], py: target.pos[1], pz: target.pos[2],
      lx: target.look[0], ly: target.look[1], lz: target.look[2],
      duration: 1.7,
      ease: 'power3.inOut',
      overwrite: true,
    })
  }, [focus])

  useFrame((state) => {
    const m = state.pointer // [-1, 1]
    const k = focus ? 0.06 : 0.22
    const c = cur.current
    camera.position.set(c.px + m.x * k, c.py + m.y * k * 0.5, c.pz)
    lookVec.current.set(c.lx + m.x * k * 1.6, c.ly + m.y * k * 0.8, c.lz)
    camera.lookAt(lookVec.current)
  })

  return null
}

/* ── Lumières d'une chambre la nuit ── */
function Lights({ lampOn }) {
  const lampRef = useRef()

  useFrame(({ clock }) => {
    if (!lampRef.current) return
    // respiration de la veilleuse + extinction douce, une seule source de vérité
    const target = lampOn ? 2.3 + Math.sin(clock.elapsedTime * 1.6) * 0.15 : 0
    lampRef.current.intensity += (target - lampRef.current.intensity) * 0.09
  })

  return (
    <>
      <ambientLight intensity={0.6} color="#44558c" />
      {/* la lune, par la fenêtre */}
      <directionalLight
        position={[3.2, 4.6, -7]}
        intensity={0.85}
        color="#8da3d8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0015}
      />
      {/* la veilleuse */}
      <pointLight
        ref={lampRef}
        position={[-1.05, 1.05, -2.55]}
        intensity={2.3}
        distance={10}
        decay={1.7}
        color="#ffb072"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.002}
      />
    </>
  )
}

export default function Experience({ focus, onFocus, markSecret, playExclusive, stopIf, audioKey, onOverlay, onReady }) {
  const [lampOn, setLampOn] = useState(true)

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ fov: 55, position: BASE_CAM.pos, near: 0.1, far: 40 }}
      gl={{ antialias: true, toneMappingExposure: 1.45 }}
      onCreated={() => onReady && onReady()}
    >
      <color attach="background" args={['#070b16']} />
      <fog attach="fog" args={['#0a1020', 8.5, 21]} />

      <CameraRig focus={focus} />
      <Lights lampOn={lampOn} />

      <Suspense fallback={null}>
        <Room />
        <WindowWall onFocus={onFocus} markSecret={markSecret} playExclusive={playExclusive} />
        <Bed
          onFocus={onFocus}
          markSecret={markSecret}
          playExclusive={playExclusive}
          stopIf={stopIf}
          onOverlay={onOverlay}
        />
        <Nightstand lampOn={lampOn} onToggleLamp={() => setLampOn((v) => !v)} />
        <CeilingStars lampOn={lampOn} />
        <Radio onFocus={onFocus} playing={audioKey === 'radio'} playExclusive={playExclusive} />
        <TVSetup onFocus={onFocus} />
        <Skateboard />
      </Suspense>
    </Canvas>
  )
}
