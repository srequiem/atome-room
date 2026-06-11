import * as THREE from 'three'

// ─── Helpers ────────────────────────────────────────────────
function makeCanvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')]
}

function toTexture(canvas, { repeat = null } = {}) {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(repeat[0], repeat[1])
  }
  return tex
}

// Petit PRNG déterministe (les étoiles ne bougent pas entre les renders)
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Papier peint : étoiles discrètes ton sur ton ───────────
export function makeWallpaper() {
  const [c, ctx] = makeCanvas(256, 256)
  ctx.fillStyle = '#18213a'
  ctx.fillRect(0, 0, 256, 256)
  const rnd = mulberry32(42)
  ctx.fillStyle = '#1f2a4a'
  for (let i = 0; i < 22; i++) {
    const x = rnd() * 256
    const y = rnd() * 256
    const s = 2.5 + rnd() * 3.5
    // étoile à 4 branches
    ctx.beginPath()
    ctx.moveTo(x, y - s)
    ctx.quadraticCurveTo(x, y, x + s, y)
    ctx.quadraticCurveTo(x, y, x, y + s)
    ctx.quadraticCurveTo(x, y, x - s, y)
    ctx.quadraticCurveTo(x, y, x, y - s)
    ctx.fill()
  }
  return toTexture(c, { repeat: [3, 1.6] })
}

// ─── Parquet sombre ─────────────────────────────────────────
export function makeFloor() {
  const [c, ctx] = makeCanvas(256, 256)
  const rnd = mulberry32(7)
  const lath = 256 / 6
  for (let i = 0; i < 6; i++) {
    const shade = 0.85 + rnd() * 0.3
    ctx.fillStyle = `rgb(${Math.round(43 * shade)}, ${Math.round(33 * shade)}, ${Math.round(24 * shade)})`
    ctx.fillRect(i * lath, 0, lath, 256)
    ctx.fillStyle = 'rgba(10,7,4,0.7)'
    ctx.fillRect(i * lath, 0, 1.5, 256)
    // joints horizontaux décalés
    const y = rnd() * 256
    ctx.fillRect(i * lath, y, lath, 1.5)
  }
  return toTexture(c, { repeat: [2.5, 2.5] })
}

// ─── Ciel nocturne (vu par la fenêtre) ──────────────────────
export function makeNightSky() {
  const [c, ctx] = makeCanvas(1024, 512)
  const grad = ctx.createLinearGradient(0, 0, 0, 512)
  grad.addColorStop(0, '#03050c')
  grad.addColorStop(0.6, '#0a1126')
  grad.addColorStop(1, '#101a33')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1024, 512)
  // étoiles
  const rnd = mulberry32(2026)
  for (let i = 0; i < 140; i++) {
    const x = rnd() * 1024
    const y = rnd() * 380
    const a = 0.25 + rnd() * 0.65
    ctx.fillStyle = `rgba(225,232,255,${a})`
    ctx.fillRect(x, y, rnd() > 0.85 ? 2 : 1, rnd() > 0.85 ? 2 : 1)
  }
  // lune + halo
  const mx = 700
  const my = 110
  const halo = ctx.createRadialGradient(mx, my, 10, mx, my, 120)
  halo.addColorStop(0, 'rgba(220,228,255,0.5)')
  halo.addColorStop(1, 'rgba(220,228,255,0)')
  ctx.fillStyle = halo
  ctx.fillRect(mx - 130, my - 130, 260, 260)
  ctx.fillStyle = '#e8edfa'
  ctx.beginPath()
  ctx.arc(mx, my, 26, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(180,190,215,0.5)'
  ctx.beginPath()
  ctx.arc(mx - 8, my - 5, 5, 0, Math.PI * 2)
  ctx.arc(mx + 9, my + 8, 4, 0, Math.PI * 2)
  ctx.fill()
  return toTexture(c)
}

// ─── Cube en bois avec une lettre ───────────────────────────
export function makeLetterCube(letter) {
  const [c, ctx] = makeCanvas(128, 128)
  ctx.fillStyle = '#c9a36b'
  ctx.fillRect(0, 0, 128, 128)
  ctx.strokeStyle = '#9c7846'
  ctx.lineWidth = 8
  ctx.strokeRect(8, 8, 112, 112)
  ctx.fillStyle = '#33231a'
  ctx.font = 'bold 70px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(letter, 64, 70)
  return toTexture(c)
}

// ─── Artwork sous le skate ──────────────────────────────────
export function makeDeckArt() {
  const [c, ctx] = makeCanvas(256, 96)
  ctx.fillStyle = '#a8231d'
  ctx.fillRect(0, 0, 256, 96)
  const rnd = mulberry32(99)
  ctx.fillStyle = 'rgba(240,230,210,0.5)'
  for (let i = 0; i < 12; i++) {
    ctx.fillRect(rnd() * 256, rnd() * 96, 2, 2)
  }
  ctx.fillStyle = '#f2ead8'
  ctx.font = 'italic 44px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('ATOME', 128, 50)
  return toTexture(c)
}

// ─── Tapis rond, anneaux concentriques ──────────────────────
export function makeRug() {
  const [c, ctx] = makeCanvas(512, 512)
  const rings = ['#202c4e', '#1b2542', '#243358', '#1b2542', '#16203a']
  rings.forEach((col, i) => {
    ctx.fillStyle = col
    ctx.beginPath()
    ctx.arc(256, 256, 250 - i * 48, 0, Math.PI * 2)
    ctx.fill()
  })
  return toTexture(c)
}
