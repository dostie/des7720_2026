# DES7720 partie 2, instructions pour les agents IA

Ce fichier s'adresse à tout agent de code (Claude Code, Codex, Cursor, Zed, Gemini CLI, Copilot, etc.).

## Contexte
Repo d'expérimentations p5.js pour le cours DES7720 (UQAM, DESS design d'expériences interactives, prof. Junior Vigneault, automne 2026). Le code est une matière: friction intentionnelle, délais, erreurs productives, règles, ambiguïté. L'étudiant est l'auteur du repo.

## Structure
- `experiences/cours_N/`: exercices fournis par Junior (p5.js par CDN 1.11.11, README de démo). Ne pas les réécrire ni les uniformiser: l'étudiant les travaille avec des commits par étape.
- `experiences/exp-XX_nom/`: expériences de l'étudiant, créées avec `npm run nouvelle -- XX nom`. Modèle dans `experiences/_modele/`.
- `libs/`: p5.js 1.11.13 et p5.sound en local. Pas de CDN, pas de build, HTML + `sketch.js` simples.
- `journal/`: un fichier par séance, modèle dans `journal/_modele.md`.
- `projet/`: prototype vidéo, prototype interactif final, tests.
- `processus/`: matériau du bilan réflexif.
- `docs/`: plan de cours, calendrier, évaluation, conventions.

## Commandes
- Serveur local: `npm run dev`, puis http://localhost:5500/
- Nouvelle expérience: `npm run nouvelle -- XX nom-court`

## Confidentialité (repo public)
- Ce repo est public. Ne jamais y mettre de clé, jeton, mot de passe, courriel, numéro de téléphone, adresse, chemin absolu de l'ordinateur, nom de compte ou information personnelle (la sienne, celle du professeur ou de camarades).
- Les journaux et le bilan sont publics: pas de confidences, pas de captures d'écran avec des données personnelles.
- Les courriels et documents du cours (dossier local) ne sont jamais copiés dans le repo.
- Avant tout commit: `npm run verifier`. Les hooks Git (`npm run hooks`) bloquent aussi les fuites courantes.
- Pas de lien vers des sessions ou conversations d'agents dans les messages de commit.
- Les commits utilisent l'adresse noreply de GitHub, jamais une vraie adresse courriel.

## Règles de travail
- Le travail est évalué sur le processus: ne pas écrire à la place de l'étudiant. Proposer, expliquer, laisser les décisions de design à l'étudiant et les consigner dans le journal.
- Commits: un par variante, message en deux parties (Intention, Effet). Voir `docs/conventions.md`.
- Ne pas commiter ni pousser sans demande explicite.
- Pas de tirets cadratins (em-dashes) dans les textes. Français par défaut.
- Ne pas ajouter de dépendances ni d'outils de build sans en discuter.
