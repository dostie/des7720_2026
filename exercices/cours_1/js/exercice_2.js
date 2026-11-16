
// Variables globales.
let refletImage; // Variable pour stocker l'image du reflet.

// preload() est une fonction spéciale de p5.js qui est exécutée avant setup(). C'est ici que l'on charge les fichiers (images, sons, polices, etc.) avant de commencer le sketch.
// Cela permet de s'assurer que tous les fichiers sont chargés avant de commencer le sketch.

function preload() {
    // Charger les fichiers avant de commencer.
    // Charger les images, sons, polices, etc. avant de commencer le sketch.
    refletImage = loadImage('./assets/images/reflet.jpg'); // Charger une image. https://p5js.org/reference/p5/loadImage/




}


// Préparer le sketch une seule fois.
// Fonction setup() est exécutée une seule fois au début du sketch. C'est ici que l'on définit la taille de la fenêtre, les couleurs, etc.
function setup() {

    // Crée une fenêtre de la taille de l'image du reflet. https://p5js.org/reference/p5/createCanvas/
    createCanvas(refletImage.width * 2, refletImage.height); // Crée une fenêtre de 640 × 640 pixels. https://p5js.org/reference/p5/createCanvas/
    background (0); // Définit la couleur de fond de la fenêtre. https://p5js.org/reference/p5/background/
    image(refletImage, 0, 0); // Dessine l'image du reflet à la position (0, 0). https://p5js.org/reference/p5/image/
   // copy(refletImage, 0, 0, 100, 100, width/2, height/2, 100, 100); // Copie un fragment de l'image du reflet à la position (width/2, height/2). https://p5js.org/reference/p5/copy/



}



// Dessiner en boucle.
// Fonction draw() est exécutée en boucle après la fonction setup(). C'est ici que l'on dessine les formes, les images, etc.
// Cela roule à une vitesse de 60 images par seconde par défaut, mais cela peut être modifié avec la fonction frameRate().
function draw() {

    // copy(refletImage, mouseX, mouseY, 100, 100, width/2, height/2, mouseX * .5, 100); // Copie un fragment de l'image du reflet à la position (width/2, height/2). https://p5js.org/reference/p5/copy/
    // copy(refletImage, mouseX, mouseY, 100, 100, mouseX + refletImage.width, mouseY, 100, 100); // Copie un fragment de l'image du reflet à la position (width/2, height/2). https://p5js.org/reference/p5/copy/


    rect(mouseX, mouseY, 100, 100); // Dessine un rectangle. Les 2 premieres positions sont le points de depart en x,y. Ensuite les deux autres positions sont la largeur (x) et la hauteur (y). https://p5js.org/reference/p5/rect/

}

// Fonction mouseDragged() est exécutée lorsque la souris est cliquée et déplacée. C'est ici que l'on peut dessiner avec la souris.
function mouseDragged() {
   //copy(refletImage, mouseX, mouseY, 100, 100, mouseX + refletImage.width, mouseY, 100, 100); // Copie un fragment de l'image du reflet à la position (width/2, height/2). https://p5js.org/reference/p5/copy/
   // Appeler la fonction mousePressed() pour copier l'image du reflet à la position de la souris. 
   mousePressed();

}

function mousePressed() {
    copy(refletImage, mouseX, mouseY, 100, 100, mouseX + refletImage.width, mouseY, 100, 100); // Copie un fragment de l'image du reflet à la position (width/2, height/2). https://p5js.org/reference/p5/copy/
}

/*
Pistes d’exploration — choisissez une idée ou suivez la vôtre.

- Changez la photo pour dessiner avec une image de votre choix.
- Changez la taille du fragment que vous prélevez dans la photo. Essayez un carré de 20 × 20 pixels, puis de 100 × 100 pixels.
- Dessinez avec un GIF animé pour prélever des fragments à différents moments.
- Remplacez la photo par une vidéo et dessinez avec des fragments de cette vidéo.
- Dessinez avec des formes au clic ou au glisser.
- Ajoutez deux états au sketch : un double-clic (doubleClicked()) pourrait faire passer de la photo aux formes.
*/
