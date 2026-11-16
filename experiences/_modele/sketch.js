// exp-XX, nom court
// Intention: ...
// Mécanisme (délai, condition, seuil, réaction): ...

let etat = { dernierClic: 0 };

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(17);
  noStroke();
  fill(255);
  circle(mouseX, mouseY, 40);
}

function mousePressed() {
  etat.dernierClic = millis();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
