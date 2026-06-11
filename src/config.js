// ─────────────────────────────────────────────────────────────
// CONFIG — tout ce que tu peux vouloir changer est ici, Sacha.
// ─────────────────────────────────────────────────────────────

// TODO : remplace par ton vrai lien pre-save (Feature.fm, DistroKid, ToneDen…)
export const PRESAVE_URL = 'https://example.com/presave-atome'

// TODO : tes liens
export const INSTAGRAM_URL = 'https://instagram.com/sacharequiem'

// Assets (dans /public)
export const AUDIO = {
  fragment: '/audio/secret-oreiller.mp3', // ATOME, 1:19 → 1:49 — « perdre une dent ramenait des pièces »
  radio: '/audio/secret-radio.mp3',       // extrait outro
  fenetre: '/audio/secret-fenetre.mp3',   // « Comme il est loin », 0:09 → 0:39
}
export const IMG = {
  coverLarge: '/img/cover-large.jpg',
  coverSmall: '/img/cover-small.jpg',
}

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
  skate:    { pos: [1.0, 1.1, -0.9], look: [1.72, 0.45, -2.85] },
}

// Les 4 secrets qui débloquent le pre-save
export const SECRET_IDS = ['oreiller', 'boite', 'radio', 'fenetre']
