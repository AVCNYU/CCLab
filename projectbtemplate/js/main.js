let bgColor;
function setup() {
  let canvas = createCanvas(1000, 600);
  canvas.parent('canvas-container');

  bgColor = color(255);
  background(bgColor);
}

function draw() {
  background(bgColor);
}

function changeBackground() {
  bgColor = color(random(255), random(255), random(255));
}
let particles = [];
let angle = 0;
let spiralRadius = 50;
let isMousePressed = false;
let mouseReleasePosition;
let sourcePosition;
let instructions = "WASD to move source\nClick to scatter";

function setup() {
  let canvas = createCanvas(1000, 600);
  canvas.parent('canvas-container');
  colorMode(RGB);
  sourcePosition = createVector(width / 2, height / 2);
  textSize(16);
}

function draw() {

  if (isMousePressed) {
    background(255);
  } else {
    background(0);
  }

  // Move the source of particles using WASD keys
  if (keyIsDown(87)) { // W key, move up
    sourcePosition.y -= 1;
  }
  if (keyIsDown(83)) { // S key, move down
    sourcePosition.y += 1;
  }
  if (keyIsDown(65)) { // A key, move left
    sourcePosition.x -= 1;
  }
  if (keyIsDown(68)) { // D key, move right
    sourcePosition.x += 1;
  }

  // Update the angle of the source to create a spiral effect
  angle += 0.02;

  let x = sourcePosition.x + spiralRadius * cos(angle);
  let y = sourcePosition.y + spiralRadius * sin(angle);
  particles.push(new Particle(x, y));

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    if (p.isOffscreen()) {
      particles.splice(i, 1);
    }
  }

  if (!mouseIsPressed && isMousePressed) {
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.changeColor();
      p.pushAway(mouseReleasePosition);
    }
    isMousePressed = false;
  }

  fill(255);
  text(instructions, 20, 20);
}

function mouseReleased() {
  isMousePressed = true;
  mouseReleasePosition = createVector(mouseX, mouseY);
}

function keyPressed() {
  if (key === ' ') {
    // Reset the source position to the center of the canvas
    sourcePosition = createVector(width / 2, height / 2);
  }
}

function keyReleased() {
  if (key === ' ') {
    isMousePressed = false;
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.color = color(255);
    this.size = random(1.2, 2.2) ** 3;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.999);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    this.color.setAlpha(map(this.pos.y, height / 2, height, 100, 0));
  }

  isOffscreen() {
    return this.pos.y > height;
  }

  pushAway(target) {
    let direction = p5.Vector.sub(this.pos, target);
    direction.normalize();
    direction.mult(5);
    this.vel.add(direction);
  }

  changeColor() {
    this.color = color(random(255), random(255), random(255));
  }
}
