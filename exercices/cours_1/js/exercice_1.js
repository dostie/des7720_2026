// DES7720 — EXERCICE 1 — Introduction à p5.js

// Charger les fichiers avant de commencer.
// Charger les images, sons, polices, etc. avant de commencer le sketch.
function preload() {
}

// Préparer le sketch une seule fois.
// Fonction setup() est exécutée une seule fois au début du sketch. C'est ici que l'on définit la taille de la fenêtre, les couleurs, etc.
function setup() {

createCanvas(640, 640); // Crée une fenêtre de 640 × 640 pixels. https://p5js.org/reference/p5/createCanvas/
//background (50, 30, 10); // Définit la couleur de fond de la fenêtre. https://p5js.org/reference/p5/background/

// Dessiner un rectangle.
rectMode(CENTER); // Définit le mode de dessin des rectangles. https://p5js.org/reference/p5/rectMode/
// Dessiner un rectangle à la position (300, 300) avec une largeur de 100 et une hauteur de 25.
//rect(300, 300, 100, 25); // Dessine un rectangle. Les 2 premieres positions sont le points de depart en x,y. Ensuite les deux autres positions sont la largeur (x) et la hauteur (y). https://p5js.org/reference/p5/rect/



}

// Dessiner en boucle.
// Fonction draw() est exécutée en boucle après la fonction setup(). C'est ici que l'on dessine les formes, les images, etc.
// Cela roule à une vitesse de 60 images par seconde par défaut, mais cela peut être modifié avec la fonction frameRate().
function draw() {
// Créer un fond de couleur pour effacer les dessins précédents.
background (50, mouseY, 10); // Définit la couleur de fond de la fenêtre. https://p5js.org/reference/p5/background/


// Dessiner un rectangle qui suit la souris.
rect(mouseX, mouseY, 100, 25); // Dessine un rectangle. Les 2 premieres positions sont le points de depart en x,y. Ensuite les deux autres positions sont la largeur (x) et la hauteur (y). https://p5js.org/reference/p5/rect/
rect(mouseX, mouseY, 25, 100); // Dessine un rectangle. Les 2 premieres positions sont le points de depart en x,y. Ensuite les deux autres positions sont la largeur (x) et la hauteur (y). https://p5js.org/reference/p5/rect/

}
