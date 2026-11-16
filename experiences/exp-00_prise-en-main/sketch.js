// exp-00, prise en main
// But: vérifier que p5.js tourne et que je comprends le cycle setup / draw.
// Ce sketch est un test d'installation, pas une expérience de design.

let x = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Helvetica Neue');
}

function draw() {
  background(17);

  // 1. Un cercle suit la souris
  noStroke();
  fill(255);
  circle(mouseX, mouseY, 40);

  // 2. Un point avance seul: draw() tourne en boucle (~60 fois par seconde)
  x = (x + 2) % width;
  fill(255, 90, 60);
  circle(x, height / 2, 16);

  // 3. Du texte qui confirme que tout fonctionne
  fill(255);
  textSize(14);
  text('p5.js ' + p5.prototype.VERSION + '  |  ' + nf(frameRate(), 2, 0) + ' fps  |  ' + floor(millis() / 1000) + ' s', 20, 30);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
