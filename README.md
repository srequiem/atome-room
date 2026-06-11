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

| Où | Quoi | Fichier |
|---|---|---|
| Sous l'oreiller | dent de lait + pièce → fragment d'ATOME (refrain final, 2:00→2:30 du master) | `public/audio/secret-oreiller.mp3` |
| Boîte à chaussures sous le lit | tirages argentiques (la cover + 2 emplacements) | `public/img/cover-large.jpg` |
| La radio sur la commode | extrait de l'outro de l'EP | `public/audio/secret-radio.mp3` |
| La fenêtre (le cimetière) | le teaser vidéo | `public/video/teaser.mp4` *(à déposer)* |

Bonus non comptés : la veilleuse (on/off, étoiles au plafond), la télé + console
(mini jeu de skate rétro), le skate dressé contre le mur (clic → il vacille),
les cubes alphabet sur le tapis.

## À toi de compléter

1. **`src/config.js`** → `PRESAVE_URL` (ton vrai lien pre-save) et `INSTAGRAM_URL`.
2. **`public/video/teaser.mp4`** → ton teaser Kling (format vertical conseillé, le
   site retombe sur une image de la forêt tant qu'il n'y est pas).
3. **Photos argentiques** → ajoute 2 scans dans `public/img/` et remplace les deux
   blocs `print--empty` dans `src/App.jsx` par des `<img>` (même structure que la cover).
4. **Fragment audio** → si tu préfères un autre passage que 2:00→2:30, dis-le-moi ou
   re-découpe : `ffmpeg -ss 118 -t 30 -i master.wav -af "afade=t=in:st=0:d=1.2,afade=t=out:st=27.5:d=2.5" -b:a 192k secret-oreiller.mp3`

## Notes importantes

- **Anti-leak** : le master complet n'est volontairement **jamais** embarqué dans le
  site — uniquement des fragments mp3 de ~30 s. Ne dépose pas le wav dans `public/`.
- **Jeu TV** : c'est un jeu de skate rétro *générique* (hommage à l'ère PS1), pas
  Tony Hawk's Pro Skater — l'IP appartient à Activision, on ne peut pas l'utiliser
  sur un site promo. Le clin d'œil reste lisible pour qui sait.
- **Caméra** : les points de vue par objet se règlent dans `src/config.js` → `FOCUS`.
- **Perf mobile** : DPR plafonné à 1.8, ombres légères, textures générées en canvas
  (aucun gros asset 3D à télécharger).
