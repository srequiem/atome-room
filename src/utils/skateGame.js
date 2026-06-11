/**
 * Dessine une frame du mini-jeu de skate rétro sur un contexte 2D.
 * Hommage générique aux jeux de skate de l'ère PS1 — aucune marque.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} W largeur du canvas
 * @param {number} H hauteur du canvas
 * @param {number} t temps écoulé en secondes
 */
export const drawSkateGame = (ctx, W, H, t) => {
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
