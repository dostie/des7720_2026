#!/bin/sh
# Installe les hooks Git locaux qui lancent la vérification de confidentialité.
# À refaire sur chaque ordinateur après avoir cloné le repo: npm run hooks
set -e
dir=$(git rev-parse --git-path hooks)
mkdir -p "$dir"
installer() {
  f="$dir/$1"
  if [ -e "$f" ] && ! grep -q verifier-confidentialite "$f"; then
    echo "Un hook $1 existe déjà et n'est pas le nôtre: $f (non modifié)"; return
  fi
  printf '#!/bin/sh\n%s\n' "$2" > "$f"
  chmod +x "$f"
  echo "Installé: $1"
}
installer pre-commit 'exec sh scripts/verifier-confidentialite.sh --staged'
installer commit-msg 'exec sh scripts/verifier-confidentialite.sh --message "$1"'
installer pre-push   'exec sh scripts/verifier-confidentialite.sh --non-pousses'
