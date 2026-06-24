import { useMemo } from 'react'
import * as THREE from 'three'

const makeBallTexture = () => {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 128
  const ctx = c.getContext('2d')
  // fond blanc cassé
  ctx.fillStyle = '#eceae4'
  ctx.fillRect(0, 0, 256, 128)
  // taches sombres facon pentagones, réparties
  ctx.fillStyle = '#1b1b1f'
  const spots = [
    [40, 32], [110, 22], [186, 36], [232, 70],
    [70, 80], [150, 92], [20, 96], [200, 104], [128, 54],
  ]
  spots.forEach(([x, y]) => {
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2
      const r = 15
      const px = x + Math.cos(a) * r
      const py = y + Math.sin(a) * r
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  })
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const Football = () => {
  const tex = useMemo(() => makeBallTexture(), [])
  return (
    <mesh position={[-0.95, 0.11, -0.38]} castShadow receiveShadow>
      <sphereGeometry args={[0.11, 24, 24]} />
      <meshStandardMaterial map={tex} roughness={0.6} />
    </mesh>
  )
}

export default Football
