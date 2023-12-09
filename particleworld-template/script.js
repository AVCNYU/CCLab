let clouds = [];
let birds = [];

function setup() {
  createCanvas(800, 400);
  for (let i = 0; i < 3; i++) {
    clouds.push(new Cloud());
  }
  for (let i = 0; i < 5; i++) {
    birds.push(new Bird());
  }
}

function draw() {
  background(200, 240, 255);

  for (let cloud of clouds) {
    cloud.move();
    cloud.display();
  }

  for (let bird of birds) {
    bird.move();
    bird.display();
  }
}

class Cloud {
  constructor() {
    this.x = random(width);
    this.y = random(100, 200);
    this.speed = random(1, 2);
  }

  move() {
    this.x += this.speed;
    if (this.x > width) {
      this.x = -200;
    }
  }

  display() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, 80, 40);
    ellipse(this.x + 20, this.y - 20, 60, 30);
    ellipse(this.x + 40, this.y, 80, 40);
  }
}

class Bird {
  constructor() {
    this.x = random(width);
    this.y = random(100, 250);
    this.speed = random(2, 4);
  }

  move() {
    this.x += this.speed;
    if (this.x > width) {
      this.x = -20;
      this.y = random(100, 250);
    }
  }

  display() {
    fill(0);
    stroke(0);
    triangle(this.x, this.y, this.x - 10, this.y + 10, this.x + 10, this.y + 10);
    line(this.x, this.y, this.x, this.y + 20);
  }
}

