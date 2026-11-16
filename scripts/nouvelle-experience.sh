#!/bin/sh
# Usage: npm run nouvelle -- 02 delai-reponse
# Crée experiences/exp-02_delai-reponse à partir du modèle.
set -e
[ $# -eq 2 ] || { echo "Usage: npm run nouvelle -- <numero> <nom-court>"; exit 1; }
dest="experiences/exp-$1_$2"
[ -e "$dest" ] && { echo "Existe déjà: $dest"; exit 1; }
mkdir -p "$dest"
for f in index.html sketch.js README.md; do
  sed "s/exp-XX, nom court/exp-$1, $2/" "experiences/_modele/$f" > "$dest/$f"
done
echo "Créé: $dest"
echo "Ouvrir: http://localhost:5500/$dest/"
