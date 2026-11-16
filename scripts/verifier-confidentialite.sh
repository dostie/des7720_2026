#!/bin/sh
# Vérifie qu'aucune information personnelle ou secrète ne part vers un repo public.
# Usage:
#   sh scripts/verifier-confidentialite.sh --staged        fichiers indexés (pre-commit)
#   sh scripts/verifier-confidentialite.sh --tout          tous les fichiers suivis
#   sh scripts/verifier-confidentialite.sh --message FICH  message de commit (commit-msg)
#   sh scripts/verifier-confidentialite.sh --auteur        adresse d'auteur Git
#   sh scripts/verifier-confidentialite.sh --non-pousses   messages et auteurs des commits pas encore poussés (pre-push)
# Code de sortie 1 si un problème est trouvé.

mode="${1:---tout}"
TEMOIN=$(mktemp)
trap 'rm -f "$TEMOIN"' EXIT
# Écrit dans un fichier témoin: fonctionne aussi depuis un pipe (sous-shell)
signaler() { printf '  \033[31m✗\033[0m %s\n' "$1"; echo x >> "$TEMOIN"; }

EMAIL='[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
EMAIL_OK='@users\.noreply\.github\.com|noreply@anthropic\.com|@example\.(com|org)'
SECRET='BEGIN [A-Z ]*PRIVATE KEY|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{10,}|(api[_-]?key|secret|token|passw(or)?d)[[:space:]]*[:=][[:space:]]*["'"'"'][^"'"'"']{8,}'
CHEMIN='/Users/[A-Za-z0-9._-]+|/home/[A-Za-z0-9._-]+|[A-Z]:\\Users\\'
SESSION='claude\.ai/(code|chat)/|session_[A-Za-z0-9]{12,}'
FICHIER_SENSIBLE='(^|/)\.env|\.pem$|\.key$|\.p12$|\.pfx$|id_rsa|id_ed25519|(^|/)\.npmrc$|(^|/)credentials|(^|/)secrets'

# Analyse un flux de texte (stdin) ; $1 = étiquette
analyser_texte() {
  contenu=$(cat)
  [ -z "$contenu" ] && return 0
  mails=$(printf '%s\n' "$contenu" | grep -oE "$EMAIL" | grep -vE "$EMAIL_OK" | sort -u)
  [ -n "$mails" ] && signaler "$1: adresse courriel ($(printf '%s' "$mails" | tr '\n' ' '))"
  printf '%s\n' "$contenu" | grep -qE "$SECRET"  && signaler "$1: clé, jeton ou mot de passe probable"
  printf '%s\n' "$contenu" | grep -qE "$CHEMIN"  && signaler "$1: chemin absolu de l'ordinateur"
  printf '%s\n' "$contenu" | grep -qE "$SESSION" && signaler "$1: lien ou identifiant de session d'agent"
  return 0
}

# GPS dans les images (si Pillow ou exiftool est disponible)
verifier_image() {
  f="$1"
  if command -v exiftool >/dev/null 2>&1; then
    exiftool -s3 -GPSLatitude "$f" 2>/dev/null | grep -q . && signaler "$f: position GPS dans les métadonnées"
  elif python3 -c 'import PIL' >/dev/null 2>&1; then
    python3 - "$f" <<'PY' || signaler "$f: position GPS dans les métadonnées"
import sys
from PIL import Image
try:
    gps = Image.open(sys.argv[1]).getexif().get_ifd(0x8825)
except Exception:
    gps = {}
sys.exit(1 if gps else 0)
PY
  fi
}

verifier_auteur() {
  ident=$(git var GIT_AUTHOR_IDENT 2>/dev/null)
  courriel=$(printf '%s' "$ident" | sed -n 's/.*<\(.*\)>.*/\1/p')
  case "$courriel" in
    *@users.noreply.github.com) ;;
    *) signaler "adresse d'auteur Git '$courriel' n'est pas une adresse noreply GitHub"
       printf '    Corriger: git config user.email "ID+nom@users.noreply.github.com"\n'
       printf '    Et sur GitHub: Settings > Emails > « Keep my email addresses private » + « Block command line pushes that expose my email ».\n' ;;
  esac
}

EXCLUS=':!libs :!scripts/verifier-confidentialite.sh'

case "$mode" in
  --staged)
    fichiers=$(git diff --cached --name-only --diff-filter=ACM)
    printf '%s\n' "$fichiers" | grep -E "$FICHIER_SENSIBLE" | while read -r f; do signaler "$f: nom de fichier sensible"; done
    git diff --cached -U0 -- . $EXCLUS | grep -E '^\+[^+]' | sed 's/^+//' | analyser_texte "contenu indexé"
    for f in $(printf '%s\n' "$fichiers" | grep -iE '\.(jpe?g|tiff?|png)$' | grep -v '^libs/'); do verifier_image "$f"; done
    verifier_auteur ;;
  --message)
    analyser_texte "message de commit" < "$2" ;;
  --auteur)
    verifier_auteur ;;
  --non-pousses)
    base=$(git rev-parse --abbrev-ref '@{u}' 2>/dev/null || echo origin/main)
    git log "$base..HEAD" --format='%ae%n%ce%n%B' | analyser_texte "commits non poussés"
    git diff "$base..HEAD" -U0 -- . $EXCLUS | grep -E '^\+[^+]' | sed 's/^+//' | analyser_texte "contenu des commits non poussés" ;;
  --tout|*)
    git ls-files | grep -E "$FICHIER_SENSIBLE" | while read -r f; do signaler "$f: nom de fichier sensible"; done
    git grep -hI -E '.' -- . $EXCLUS | analyser_texte "fichiers suivis"
    for f in $(git ls-files | grep -iE '\.(jpe?g|tiff?|png)$' | grep -v '^libs/'); do verifier_image "$f"; done
    verifier_auteur ;;
esac

if [ -s "$TEMOIN" ]; then
  printf '\nVérification de confidentialité: problème(s) trouvé(s). Corriger avant de publier.\n'
  exit 1
fi
[ "$mode" = "--tout" ] && echo "Vérification de confidentialité: rien à signaler."
exit 0
