// CCLab Mini Project - 9.R Particles Template

let NUM_OF_PARTICLES = 3; // Decide the initial number of particles.

let particles = [];

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("canvasWrapper");

  // generate particles
  for (let i = 0; i < NUM_OF_PARTICLES; i++) {
    particles[i] = new Particle(random(width), random(height));
  }
}

function draw() {
  background(50);

  // update and display
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.display();
  }
}

class Particle {
  // constructor function
  constructor(startX, startY) {
    // properties: particle's characteristics
    this.x = startX;
    this.y = startY;
    this.dia = 30;
  }
  // methods (functions): particle's behaviors
  update() {
    // (add) 
  }
  display() {
    // particle's appearance
    push();
    translate(this.x, this.y);

    circle(0, 0, this.dia);

    pop();
  }
}

class spiderWeb {


  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.dia = 30;
  }

}
