# ATOME — la chambre

Site teaser interactif de **Sacha Requiem**. Une chambre d'enfant la nuit, explorable
à la souris ou au doigt. Quatre souvenirs y sont cachés ; quand on les a tous trouvés,
le pre-save apparaît.

React 18 · @react-three/fiber · Three.js · GSAP · Vite.

## Lancer en local

```bash
npm install
npm run dev
```

## Déployer sur Vercel

```bash
git init && git add -A && git commit -m "ATOME — la chambre"
# pousse sur GitHub, puis importe le repo dans Vercel.
# Framework preset : Vite (détecté automatiquement). Rien d'autre à configurer.
```

## Les 4 secrets

Six secrets débloquent le pre-save :

| Où | Quoi | Fichier |
|---|---|---|
| Sous l'oreiller | dent + pièce → DAHLIA NOIR, 0:39→0:49 | `public/audio/secret-dahlia.mp3` |
| Boîte à chaussures sous le lit | tirages argentiques (la cover + 2 emplacements) | `public/img/cover-large.jpg` |
| La radio sur la commode | extrait de l'outro de l'EP | `public/audio/secret-radio.mp3` |
| La fenêtre (le cimetière, la lune) | « Comme il est loin », 0:09→0:39 | `public/audio/secret-fenetre.mp3` |
| Le skateboard | ambiance République (manif), 0:38→fin | `public/audio/secret-skate.mp3` |
| Le cube « ? » au sol | le single ATOME, 1:19→1:49 | `public/audio/secret-atome.mp3` |

Bonus non comptés (ne débloquent rien, juste pour l'âme de la chambre) :
- le **cadre photo** sur le chevet → agrandit la photo d'enfance ;
- la **veilleuse** (on/off, étoiles au plafond) ;
- la **télé + console** (mini-jeu de skate rétro, toujours allumée, clic = gros plan) ;
- le **ballon de foot** oublié près du lit, les **cubes alphabet** sur le tapis.

## Architecture

Un composant = un fichier. Les patterns partagés sont des hooks réutilisables.

```
src/
├── main.jsx                 point d'entrée React
├── App.jsx                  orchestrateur : état du jeu + composition UI
├── Experience.jsx           le Canvas R3F + composition de la scène 3D
├── config.js                liens, assets, points caméra, secrets + libellés
├── styles.css
├── hooks/
│   ├── useCursor.js         curseur "pointer" au survol (source unique)
│   └── useExclusiveAudio.js un seul son à la fois (play / stop / stopIf)
├── utils/
│   ├── textures.js          fabriques de textures procédurales (canvas)
│   ├── geometry.js          géométrie ondulée des rideaux
│   └── skateGame.js         rendu canvas du mini-jeu de la TV
├── scene/                   objets 3D, un par fichier
│   ├── CameraRig.jsx        caméra : focus GSAP + parallax pointeur
│   ├── Lights.jsx           ambiance, lune, veilleuse qui respire
│   ├── Room.jsx             coque (sol/plafond/murs/porte/tapis) + cubes
│   ├── LetterCube.jsx
│   ├── MysteryCube.jsx      bonus : le « ? » qui joue ATOME
│   ├── Bed.jsx              compose Pillow + Shoebox + FootballBoot
│   ├── Pillow.jsx           secret : dent + pièce + fragment ATOME
│   ├── Shoebox.jsx          secret : tirages argentiques
│   ├── Football.jsx         décor : le ballon de foot
│   ├── Nightstand.jsx       chevet + veilleuse + cadre photo
│   ├── CeilingStars.jsx     étoiles projetées au plafond
│   ├── Radio.jsx            secret : extrait outro
│   ├── Television.jsx       TV + console + mini-jeu de skate
│   ├── Skateboard.jsx
│   ├── WindowWall.jsx       secret : fenêtre → « Comme il est loin »
│   ├── Tombstone.jsx
│   └── Graveyard.jsx        le cimetière + la lune, dehors
└── ui/                      panneaux DOM, un par fichier
    ├── Gate.jsx             écran d'entrée
    ├── Hud.jsx              barre du haut
    ├── Hint.jsx             invitation à fouiller
    ├── MemoryCounter.jsx    les points "souvenirs n/4"
    ├── Finale.jsx           panneau de fin (pre-save)
    ├── PhotosOverlay.jsx    overlay des tirages (boîte)
    └── PortraitOverlay.jsx  overlay de la photo (cadre)

```

Pour ajouter un objet interactif : crée `src/scene/MonObjet.jsx` (arrow function,
`export default`), utilise `useCursor` depuis `hooks/`, et compose-le dans
`Experience.jsx`. Pour un nouveau secret : ajoute son id dans `SECRET_IDS` et son
libellé dans `SECRET_LABELS` (config.js), et appelle `markSecret('id')` au bon moment.

## À toi de compléter

1. **`src/config.js`** → `PRESAVE_URL` (ton vrai lien pre-save) et `INSTAGRAM_URL`.
2. **Photos argentiques** → ajoute 2 scans dans `public/img/` et remplace les deux
   blocs `print--empty` dans `src/App.jsx` par des `<img>` (même structure que la cover).
3. **Fragments audio** → pour re-découper un passage (ex. l'extrait DAHLIA de l'oreiller) :
   `ffmpeg -ss 39 -t 10 -i DAHLIA_NOIR.mp3 -af "afade=t=in:st=0:d=0.6,afade=t=out:st=8:d=2" -b:a 192k secret-dahlia.mp3`

## Notes importantes

- **Anti-leak** : le master complet n'est volontairement **jamais** embarqué dans le
  site — uniquement des fragments mp3 de ~30 s. Ne dépose pas le wav dans `public/`.
- **Jeu TV** : c'est un jeu de skate rétro *générique* (hommage à l'ère PS1), pas
  Tony Hawk's Pro Skater — l'IP appartient à Activision, on ne peut pas l'utiliser
  sur un site promo. Le clin d'œil reste lisible pour qui sait.
- **Caméra** : les points de vue par objet se règlent dans `src/config.js` → `FOCUS`.
- **Perf mobile** : DPR plafonné à 1.8, ombres légères, textures générées en canvas
  (aucun gros asset 3D à télécharger).
