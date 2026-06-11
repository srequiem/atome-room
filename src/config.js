// ─────────────────────────────────────────────────────────────
// CONFIG — tout ce que tu peux vouloir changer est ici, Sacha.
// ─────────────────────────────────────────────────────────────

// TODO : remplace par ton vrai lien pre-save (Feature.fm, DistroKid, ToneDen…)
export const PRESAVE_URL = 'https://example.com/presave-atome'

// TODO : tes liens
export const INSTAGRAM_URL = 'https://instagram.com/sacharequiem'

// Assets (dans /public)
export const AUDIO = {
  fragment: '/audio/secret-oreiller.mp3', // refrain final d'ATOME (2:00 → 2:30 du master)
  radio: '/audio/secret-radio.mp3',       // extrait outro
}
export const IMG = {
  coverLarge: '/img/cover-large.jpg',
  coverSmall: '/img/cover-small.jpg',
  teaserFallback: '/img/teaser-fallback.jpg',
}
// Dépose ton teaser Kling ici quand il est prêt : public/video/teaser.mp4
export const VIDEO_TEASER = '/video/teaser.mp4'

// ─────────────────────────────────────────────────────────────
// Caméra — vue de base + points de focus par objet
// ─────────────────────────────────────────────────────────────
export const BASE_CAM = {
  pos: [0.35, 1.72, 3.45],
  look: [0.1, 0.95, -1.3],
}

export const FOCUS = {
  oreiller: { pos: [-0.65, 1.2, -0.9], look: [-2.05, 0.55, -2.3] },
  boite:    { pos: [-0.25, 0.85, 0.7], look: [-0.85, 0.12, -0.95] },
  radio:    { pos: [1.05, 1.35, -0.3], look: [2.5, 1.05, -1.3] },
  fenetre:  { pos: [0.7, 1.5, -0.7],  look: [0.7, 1.65, -3.2] },
  tv:       { pos: [0.7, 0.95, 0.9],  look: [2.35, 0.62, 0.9] },
  skate:    { pos: [1.35, 1.05, -1.2], look: [2.3, 0.45, -2.9] },
}

// Les 4 secrets qui débloquent le pre-save
export const SECRET_IDS = ['oreiller', 'boite', 'radio', 'fenetre']
