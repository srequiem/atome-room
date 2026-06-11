import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { BASE_CAM, FOCUS } from '../config.js'

/**
 * Une seule source de vérité (`cur`) : GSAP anime `cur` vers la cible
 * (vue de base ou point de focus), et useFrame applique `cur` + le
 * parallax du pointeur à chaque frame.
 */
const CameraRig = ({ focus }) => {
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

export default CameraRig
