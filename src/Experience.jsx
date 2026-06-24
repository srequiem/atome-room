import { Suspense, useState } from 'react'

import { Canvas } from '@react-three/fiber'
import { BASE_CAM } from './config.js'

import CameraRig from './scene/CameraRig.jsx'
import Lights from './scene/Lights.jsx'
import Room from './scene/Room.jsx'
import WindowWall from './scene/WindowWall.jsx'
import Bed from './scene/Bed.jsx'
import Nightstand from './scene/Nightstand.jsx'
import CeilingStars from './scene/CeilingStars.jsx'
import Radio from './scene/Radio.jsx'
import Television from './scene/Television.jsx'
import Skateboard from './scene/Skateboard.jsx'



const Experience = ({ focus, onFocus, markSecret, playExclusive, stopIf, audioKey, onOverlay, onReady }) => {
  const [lampOn, setLampOn] = useState(true)

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ fov: 55, position: BASE_CAM.pos, near: 0.1, far: 40 }}
      gl={{ antialias: true, toneMappingExposure: 2.5 }}
      onCreated={() => onReady && onReady()}
    >
      <color attach="background" args={['#070b16']} />
      <fog attach="fog" args={['#0a1020', 8.5, 21]} />

      <CameraRig focus={focus} />
      <Lights lampOn={lampOn} />

      <Suspense fallback={null}>
        <Room playExclusive={playExclusive} markSecret={markSecret} />
        <WindowWall
          onFocus={onFocus}
          markSecret={markSecret}
          playExclusive={playExclusive}
          stopIf={stopIf}
        />
        <Bed
          focus={focus}
          onFocus={onFocus}
          markSecret={markSecret}
          playExclusive={playExclusive}
          stopIf={stopIf}
          onOverlay={onOverlay}
        />
        <Nightstand lampOn={lampOn} onToggleLamp={() => setLampOn((v) => !v)} onOverlay={onOverlay} />
        <CeilingStars lampOn={lampOn} />
        <Radio onFocus={onFocus} markSecret={markSecret} playing={audioKey === 'radio'} playExclusive={playExclusive} />
        <Television onFocus={onFocus} />
        <Skateboard onFocus={onFocus} markSecret={markSecret} playExclusive={playExclusive} />
      </Suspense>
    </Canvas>
  )
}

export default Experience
