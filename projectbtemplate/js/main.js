let players = [];
let finishLine;
let maxSpeed = 10;
let recoveryTime = 3000;
let keys = ['q', 'z', 'p', 'm'];
let meters = [];
let winner = null;
let restartButton;
let startButton;
let gameStarted = false;
let startTime;
let carImages = [];
let carSound;
let crashSound;


function preload() {

  carSound = loadSound('assets/car_sound.wav');
  crashSound = loadSound('assets/crash_sound.wav');
  for (let i = 0; i < keys.length; i++) {
    carImages[i] = loadImage('assets/car_image_' + i + '.png');
  }
}

function setup() {
  createCanvas(windowWidth, 650);

  for (let i = 0; i < keys.length; i++) {
    players.push(new Player(100, 100 + i * 150, color(random(255), random(255), random(255)), keys[i]));
    meters.push(new Meter(20, 100 + i * 150, keys[i]));
  }

  finishLine = width - 50;

  restartButton = createButton('Restart');
  restartButton.position(width / 2 - 40, height / 2);
  restartButton.mousePressed(restartGame);
  restartButton.hide();

  startButton = createButton('Start');
  startButton.position(width / 2 - 40, height / 2 + 50);
  startButton.mousePressed(startGame);
}

function draw() {
  background(100, 200, 100);

  fill(150);
  rect(100, 50, width - 200, height - 100);
  stroke(255);
  strokeWeight(4);
  line(width / 2, 50, width / 2, height - 50);

  for (let i = 0; i < height; i += 20) {
    if (i % 40 === 0) {
      fill(255);
    } else {
      fill(0);
    }
    rect(width - 50, i, 20, 20);
  }

  for (let i = 0; i < players.length; i++) {
    players[i].update();
    players[i].display();
    meters[i].display(players[i].recovering);
  }

  for (let i = 0; i < players.length; i++) {
    if (players[i].x > width - 50 && winner === null) {
      winner = players[i];
      restartButton.show();
    }
  }

  if (winner !== null) {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Player " + winner.key.toUpperCase() + " wins!", width / 2, height / 2 - 50);
    restartButton.show();
  }

  if (!gameStarted) {
    startButton.show();
  } else {
    startButton.hide();
  }

  if (gameStarted && millis() - startTime < 3000) {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    let countdown = ceil((3000 - (millis() - startTime)) / 1000);
    text(countdown, width / 2, height / 2);
  }
}

function restartGame() {
  winner = null;
  restartButton.hide();
  gameStarted = false;
  startButton.show();
  for (let i = 0; i < players.length; i++) {
    players[i].x = 100;
    players[i].speed = 0;
    players[i].recovering = false;
  }
  loop();
}

function keyPressed() {
  if (keys.includes(key) && gameStarted) {
    let index = keys.indexOf(key);
    players[index].accelerate();
  }
}

function startGame() {
  gameStarted = true;
  startTime = millis();
  startButton.hide();
}

class Player {
  constructor(x, y, col, key) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.speed = 0;
    this.recovering = false;
    this.recoveryStart = 0;
    this.key = key;
    this.particles = [];

  }

  accelerate() {
    if (!this.recovering) {
      this.speed += 2;
      if (this.speed > maxSpeed) {
        this.speed = 0;
        this.recovering = true;
        this.recoveryStart = millis();

        for (let i = 0; i < 30; i++) {
          this.particles.push(new Particle(this.x, this.y));
        }

        crashSound.play();
      } else {
        carSound.play();
      }
    }
  }

  display() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      this.particles[i].display();
      if (this.particles[i].isFinished()) {
        this.particles.splice(i, 1);
      }
    }

    image(carImages[keys.indexOf(this.key)], this.x - 10, this.y - 10, 200, 50);
  }


  update() {
    if (this.recovering) {
      if (millis() - this.recoveryStart > recoveryTime) {
        this.recovering = false;
        this.speed = 0;
      }
    } else {
      this.x += this.speed;

      if (this.x > finishLine) {
        console.log('Player ' + this.key + ' wins!');
        noLoop(); // Stop the game
      }
    }
  }
}
class Meter {
  constructor(x, y, key) {
    this.x = x;
    this.y = y;
    this.key = key;
  }

  display(isSpunOut) {
    fill(200);
    rect(this.x, this.y - 10, 50, 20);

    if (isSpunOut) {
      fill(255, 0, 0);
    } else {
      fill(0, 255, 0);
    }

    let recoveryProgress = constrain((millis() - players[keys.indexOf(this.key)].recoveryStart) / recoveryTime, 0, 1);
    rect(this.x, this.y - 10, 50 * recoveryProgress, 20);
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = createVector(random(-1, 1), random(-2, 0));
    this.alpha = 255;
    this.lifespan = 200;
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 2;
    this.lifespan--;

    if (this.lifespan <= 0) {
      this.alpha = 0;
    }
  }

  display() {
    noStroke();
    fill(100, 100, 100, this.alpha);
    ellipse(this.x, this.y, 10, 10);
  }

  isFinished() {
    return this.alpha <= 0;
  }
}