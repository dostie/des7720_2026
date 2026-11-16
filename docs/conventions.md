# Conventions

## Commits
Un commit par variante ou changement de comportement. Message en deux parties:

```
exp-02: ajoute un délai de 800 ms avant la réponse

Intention: tester la lenteur comme résistance.
Effet: l'interaction semble hésiter, les gens cliquent deux fois.
```

## Tags
`video-v1`, `final-v1`, et `exp-XX-vN` au besoin.

## Expériences
Dossier `experiences/exp-XX_nom-court/` avec `index.html`, `sketch.js`, `README.md` (modèle dans `experiences/_modele/`).

## Journal
Un fichier par séance dans `journal/`, nommé `AAAA-MM-JJ_cours-N.md`, d'après `journal/_modele.md`.

## Exercices de Junior
- Dossier `exercices/cours_N/`, copié tel que fourni par Junior (ses `README.md`, `index.html`, `css/`, `js/`, `assets/`).
- On travaille directement dedans, avec un commit par étape (ex.: « Créer un canevas rouge »), comme dans la démo.
- Ces exercices utilisent p5.js par CDN (1.11.11). On ne les modifie pas pour utiliser `libs/`.
- Les explorations personnelles qui partent d'un exercice vont dans `experiences/exp-XX_nom/`, avec `libs/`.
- Aperçu local: http://localhost:5500/exercices/cours_1/ (`npm run dev`) ou Live Server.

## Fichiers lourds
Pas de vidéos brutes ni de PDF du cours dans le repo. Ils restent dans le dossier local du cours.
