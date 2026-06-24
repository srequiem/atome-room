import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { BASE_CAM, FOCUS } from '../config.js'

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

// sensibilité du glissement tactile : ~un demi-écran pour aller d'un bord à l'autre
const DRAG_GAIN = 1.8

// amplitude du regard en tactile (mobile) — assez ample pour balayer toute la
// pièce : viser la télé/radio à droite, le lit à gauche, le sol et le plafond.
// (le desktop garde son parallax discret, inchangé)
const TOUCH = {
  posX: 0.5,   // translation latérale de la caméra
  posY: 0.3,   // translation verticale
  lookX: 2.3,  // rotation horizontale du regard (gauche ↔ droite)
  lookY: 1.0,  // rotation verticale du regard (sol ↔ plafond)
  focusScale: 0.35, // on calme l'amplitude quand un objet est en gros plan
}

// FOV : plus large en portrait (mobile) pour élargir le champ horizontal
const FOV_PORTRAIT = 66
const FOV_LANDSCAPE = 55

/**
 * Une seule source de vérité (`cur`) : GSAP anime `cur` vers la cible
 * (vue de base ou point de focus), et useFrame applique `cur` + le regard.
 *
 * Desktop : parallax à la souris (position absolue du pointeur), inchangé.
 * Mobile  : glisser-pour-regarder, ample, qui reste où on l'a laissé.
 */
const CameraRig = ({ focus }) => {
  const { camera, gl } = useThree()
  const cur = useRef({
    px: BASE_CAM.pos[0], py: BASE_CAM.pos[1], pz: BASE_CAM.pos[2],
    lx: BASE_CAM.look[0], ly: BASE_CAM.look[1], lz: BASE_CAM.look[2],
  })
  const lookVec = useRef(new THREE.Vector3())

  // regard tactile : décalage cumulé par le glissement, borné à [-1, 1]
  const touchLook = useRef({ x: 0, y: 0 })
  const touchMode = useRef(false)
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

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

  // ── FOV adapté à l'orientation (portrait = champ plus large) ──
  useEffect(() => {
    const applyFov = () => {
      const portrait = window.innerHeight >= window.innerWidth
      camera.fov = portrait ? FOV_PORTRAIT : FOV_LANDSCAPE
      camera.updateProjectionMatrix()
    }
    applyFov()
    window.addEventListener('resize', applyFov)
    return () => window.removeEventListener('resize', applyFov)
  }, [camera])

  // ── glisser-pour-regarder (mobile) ──
  useEffect(() => {
    const el = gl.domElement

    const onDown = (e) => {
      if (e.pointerType !== 'touch') {
        touchMode.current = false
        return
      }
      touchMode.current = true
      dragging.current = true
      last.current = { x: e.clientX, y: e.clientY }
    }

    const onMove = (e) => {
      // la souris reprend toujours la main sur un appareil hybride
      if (e.pointerType === 'mouse') {
        touchMode.current = false
        return
      }
      if (e.pointerType !== 'touch' || !dragging.current) return
      const rect = el.getBoundingClientRect()
      const dx = (e.clientX - last.current.x) / rect.width
      const dy = (e.clientY - last.current.y) / rect.height
      last.current = { x: e.clientX, y: e.clientY }
      touchLook.current.x = clamp(touchLook.current.x + dx * DRAG_GAIN, -1, 1)
      touchLook.current.y = clamp(touchLook.current.y - dy * DRAG_GAIN, -1, 1)
    }

    const onUp = (e) => {
      if (e.pointerType === 'touch') dragging.current = false
    }

    el.addEventListener('pointerdown', onDown, { passive: true })
    el.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('pointercancel', onUp, { passive: true })
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [gl])

  useFrame((state) => {
    const c = cur.current

    if (touchMode.current) {
      // mobile : regard ample, translation douce, calmé en gros plan
      const m = touchLook.current
      const w = focus ? TOUCH.focusScale : 1
      camera.position.set(c.px + m.x * TOUCH.posX * w, c.py + m.y * TOUCH.posY * w, c.pz)
      lookVec.current.set(c.lx + m.x * TOUCH.lookX * w, c.ly + m.y * TOUCH.lookY * w, c.lz)
    } else {
      // desktop : parallax souris, strictement inchangé
      const m = state.pointer
      const k = focus ? 0.06 : 0.22
      camera.position.set(c.px + m.x * k, c.py + m.y * k * 0.5, c.pz)
      lookVec.current.set(c.lx + m.x * k * 1.6, c.ly + m.y * k * 0.8, c.lz)
    }

    camera.lookAt(lookVec.current)
  })

  return null
}

export default CameraRig
