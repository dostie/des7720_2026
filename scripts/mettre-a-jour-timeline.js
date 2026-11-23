#!/usr/bin/env node
// Usage: npm run timeline            (met à jour)
//        npm run timeline -- --simuler (montre ce qui changerait, sans rien écrire)
//
// Lit les dossiers du repo et met à jour:
//   - timeline.json (la page d'accueil)
//   - le tableau d'index du README (entre INDEX:DEBUT et INDEX:FIN)
// Ne supprime rien et ne touche pas à ce que tu as écrit à la main dans timeline.json.
// Crée seulement les pages exercices/cours_N/exercice_K.html qui manquent.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const racine = path.resolve(__dirname, '..');
const simuler = process.argv.includes('--simuler');
const P = (...a) => path.join(racine, ...a);
const lire = f => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '');
const info = [];
const avert = [];

// pas de tirets cadratins dans les textes
const propre = s => s.replace(/\s*[\u2014\u2013]\s*/g, ', ').replace(/\s+/g, ' ').trim();
const minuscule = s => s.charAt(0).toLowerCase() + s.slice(1);
const cellule = s => s.replace(/\|/g, '/').replace(/\s+/g, ' ').trim();

function aujourdhui() {
  const d = new Date();
  const z = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
}
function dateGit(rel) {
  try {
    const o = execFileSync('git', ['log', '--reverse', '--format=%ad', '--date=short', '--', rel],
      { cwd: racine, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim().split('\n')[0];
    return o || null;
  } catch (e) { return null; }
}
const lister = d => (fs.existsSync(d) ? fs.readdirSync(d) : []);
const rang = lien => (lien.startsWith('exercices/') ? 0 : lien.startsWith('experiences/') ? 1 : 2);

// ---------- état actuel ----------
let ancien = [];
try { ancien = JSON.parse(lire(P('timeline.json')) || '{"entrees":[]}').entrees || []; }
catch (e) { console.error('timeline.json illisible: ' + e.message); process.exit(1); }
const groupes = new Map(ancien.map(e => [e.groupe, e]));

// ---------- cours connus: journaux + dossiers d'exercices ----------
const cours = new Map(); // n -> { date, journal }
for (const f of lister(P('journal'))) {
  const m = f.match(/^(\d{4}-\d{2}-\d{2})_cours-(\d+)\.md$/);
  if (m) cours.set(Number(m[2]), { date: m[1], journal: 'journal/' + f });
}
for (const d of lister(P('exercices'))) {
  const m = d.match(/^cours_(\d+)$/);
  if (m && !cours.has(Number(m[1]))) cours.set(Number(m[1]), {});
}

// ---------- pages d'exercices manquantes ----------
function creerPage(n, k) {
  const dir = P('exercices', 'cours_' + n);
  const page = path.join(dir, 'exercice_' + k + '.html');
  if (fs.existsSync(page)) return;
  const modele = lire(path.join(dir, 'index.html'));
  if (!/<script src="js\/exercice_\d+\.js"><\/script>/.test(modele)) {
    avert.push('pas de page pour cours_' + n + '/exercice_' + k + ' (index.html sans script exercice_N.js)');
    return;
  }
  const html = modele
    .replace(/^[ \t]*<!-- <script[^\n]*-->[ \t]*\r?\n/gm, '')
    .replace(/<script src="js\/exercice_\d+\.js"><\/script>/, '<script src="js/exercice_' + k + '.js"></script>')
    .replace(/<title>[^<]*<\/title>/, '<title>Cours ' + n + ', exercice ' + k + '</title>');
  info.push('+ page créée: exercices/cours_' + n + '/exercice_' + k + '.html');
  if (!simuler) fs.writeFileSync(page, html);
}

function nomExercice(n, k) {
  const l1 = lire(P('exercices', 'cours_' + n, 'js', 'exercice_' + k + '.js')).split('\n')[0] || '';
  const m = l1.match(/EXERCICE\s+\d+\s*[\u2014\u2013-]+\s*(.+)$/i);
  return m ? 'exercice ' + k + ', ' + minuscule(propre(m[1])) : 'exercice ' + k;
}

// ---------- entrées ----------
const entrees = [];
for (const [n, c] of [...cours.entries()].sort((a, b) => a[0] - b[0])) {
  const groupe = 'cours ' + n;
  const e = Object.assign({}, groupes.get(groupe) || { groupe });
  e.groupe = groupe;
  e.date = c.date || e.date || dateGit('exercices/cours_' + n) || aujourdhui();
  if (c.journal) e.journal = c.journal;
  e.items = (e.items || []).slice();
  if (!groupes.has(groupe)) info.push('+ entrée: ' + groupe + ' (' + e.date + ')');

  for (const f of lister(P('exercices', 'cours_' + n, 'js'))) {
    const m = f.match(/^exercice_(\d+)\.js$/);
    if (!m) continue;
    creerPage(n, m[1]);
    const lien = 'exercices/cours_' + n + '/exercice_' + m[1] + '.html';
    const existe = fs.existsSync(P(lien)) || simuler;
    if (existe && !ancien.some(x => (x.items || []).some(i => i.lien === lien))) {
      e.items.push({ nom: nomExercice(n, m[1]), lien });
      info.push('+ ' + groupe + ': ' + lien);
    }
  }
  entrees.push(e);
}

// ---------- expériences ----------
for (const d of lister(P('experiences')).sort()) {
  if (d.startsWith('_') || !fs.existsSync(P('experiences', d, 'index.html'))) continue;
  const lien = 'experiences/' + d + '/';
  if (entrees.some(x => x.items.some(i => i.lien === lien))) continue;
  const date = dateGit('experiences/' + d) || aujourdhui();
  const cible = entrees.filter(x => x.date <= date).pop() || entrees[0];
  if (!cible) { avert.push('aucune entrée de cours pour placer ' + lien); continue; }
  const [id, ...reste] = d.split('_');
  cible.items.push({ nom: id + ' ' + reste.join('_').replace(/-/g, ' ').trim(), lien });
  info.push('+ ' + cible.groupe + ': ' + lien);
}

// ---------- tri et vérifications ----------
entrees.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
for (const e of entrees) {
  e.items = e.items
    .map((i, k) => ({ i, k }))
    .sort((a, b) => rang(a.i.lien || '') - rang(b.i.lien || '')
      || (a.i.lien || '').localeCompare(b.i.lien || '', 'fr', { numeric: true }) || a.k - b.k)
    .map(x => x.i);
  for (const i of e.items) {
    if (i.lien && !/^https?:/.test(i.lien) && !fs.existsSync(P(i.lien)) && !simuler)
      avert.push(e.groupe + ': le lien n\'existe pas (gardé tel quel): ' + i.lien);
  }
}

// ---------- timeline.json ----------
function serialiser(es) {
  const cles = ['date', 'groupe', 'journal', 'tutoriel'];
  const blocs = es.map(e => {
    const l = [];
    for (const k of cles) if (e[k] !== undefined) l.push('      ' + JSON.stringify(k) + ': ' + JSON.stringify(e[k]));
    for (const k of Object.keys(e)) if (!cles.includes(k) && k !== 'items') l.push('      ' + JSON.stringify(k) + ': ' + JSON.stringify(e[k]));
    const items = e.items.map(i => '        ' + JSON.stringify(i).replace(/^\{/, '{ ').replace(/\}$/, ' }').replace(/":"/g, '": "').replace(/","/g, '", "'));
    l.push('      "items": [\n' + items.join(',\n') + '\n      ]');
    return '    {\n' + l.join(',\n') + '\n    }';
  });
  return '{\n  "entrees": [\n' + blocs.join(',\n') + '\n  ]\n}\n';
}
const sortie = serialiser(entrees);
if (sortie !== lire(P('timeline.json'))) {
  info.push('~ timeline.json mis à jour');
  if (!simuler) fs.writeFileSync(P('timeline.json'), sortie);
}

// ---------- index du README ----------
function intention(lien) {
  const m = lien.match(/^experiences\/([^/]+)\//);
  if (!m) return '';
  const txt = lire(P('experiences', m[1], 'README.md')).replace(/\r/g, '');
  const sec = txt.match(/^##\s+Intention[^\n]*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/m);
  let bloc = sec ? sec[1] : txt.split('\n').slice(1).join('\n');
  const l = bloc.split('\n').map(s => s.trim()).find(s => s && !s.startsWith('#') && !s.startsWith('|') && !s.startsWith('-'));
  if (!l) return '';
  const p = propre(l);
  return p.length > 140 ? p.slice(0, 137) + '...' : p;
}
const lignes = [];
for (const e of entrees) {
  for (const i of e.items) {
    const type = i.lien && i.lien.startsWith('exercices/') ? 'exercice' : i.lien && i.lien.startsWith('experiences/') ? 'expérience' : 'autre';
    const nom = i.lien ? '[' + cellule(i.nom) + '](' + i.lien + ')' : cellule(i.nom);
    lignes.push('| ' + e.date + ' | ' + e.groupe + ' | ' + type + ' | ' + nom + ' | ' + cellule(intention(i.lien || '')) + ' |');
  }
}
const tableau = '<!-- INDEX:DEBUT (généré par `npm run timeline`, ne pas modifier à la main) -->\n'
  + '| Date | Cours | Type | Nom | Intention |\n|---|---|---|---|---|\n' + lignes.join('\n') + '\n<!-- INDEX:FIN -->';
let readme = lire(P('README.md'));
let neuf;
if (/<!-- INDEX:DEBUT[\s\S]*?<!-- INDEX:FIN -->/.test(readme)) {
  neuf = readme.replace(/<!-- INDEX:DEBUT[\s\S]*?<!-- INDEX:FIN -->/, () => tableau);
} else if (/^## Index des expériences[\s\S]*?(?=^## |(?![\s\S]))/m.test(readme)) {
  neuf = readme.replace(/^## Index des expériences[\s\S]*?(?=^## |(?![\s\S]))/m, () => '## Index des expérimentations\n\n' + tableau + '\n\n');
} else {
  neuf = readme.replace(/\s*$/, '\n\n## Index des expérimentations\n\n' + tableau + '\n');
}
if (neuf !== readme) {
  info.push('~ README.md: index mis à jour');
  if (!simuler) fs.writeFileSync(P('README.md'), neuf);
}

console.log((simuler ? '[simulation] ' : '') + (info.length ? '\n' + info.join('\n') : 'Rien à mettre à jour.'));
if (avert.length) console.log('\nAttention:\n- ' + avert.join('\n- '));
