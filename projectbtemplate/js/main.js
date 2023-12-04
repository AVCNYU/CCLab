let players = [];
let finishLine;
let maxSpeed = 10;
let recoveryTime = 3000; // 3 seconds recovery time
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
  // Load car images
  // Load sound files
  carSound = loadSound('assets/car_sound.wav'); // Adjust the path and file names
  crashSound = loadSound('assets/crash_sound.wav'); // Adjust the path and file names
  for (let i = 0; i < keys.length; i++) {
    carImages[i] = loadImage('assets/car_image_' + i + '.png'); // Adjust the path and file names accordingly
  }
}

function setup() {
  createCanvas(windowWidth, 650);

  // Create players and meters
  for (let i = 0; i < keys.length; i++) {
    players.push(new Player(100, 100 + i * 150, color(random(255), random(255), random(255)), keys[i]));
    meters.push(new Meter(20, 100 + i * 150, keys[i]));
  }

  // Create finish line
  finishLine = width - 50;

  // Create restart button
  restartButton = createButton('Restart');
  restartButton.position(width / 2 - 40, height / 2);
  restartButton.mousePressed(restartGame);
  restartButton.hide();

  // Create start button
  startButton = createButton('Start');
  startButton.position(width / 2 - 40, height / 2 + 50);
  startButton.mousePressed(startGame);
}

function draw() {
  // Set background color to a greenish tone
  background(100, 200, 100);

  // Draw the race track
  fill(150); // Set fill color to a grayish tone
  rect(100, 50, width - 200, height - 100); // Adjust the rectangle dimensions as needed

  // Draw center line
  stroke(255); // Set stroke color to white
  strokeWeight(4);
  line(width / 2, 50, width / 2, height - 50);

  // Draw checkered finish line
  for (let i = 0; i < height; i += 20) {
    if (i % 40 === 0) {
      fill(255);
    } else {
      fill(0);
    }
    rect(width - 50, i, 20, 20);
  }

  // Display players and meters
  for (let i = 0; i < players.length; i++) {
    players[i].update();
    players[i].display();
    meters[i].display(players[i].recovering);
  }

  // Check for winner
  for (let i = 0; i < players.length; i++) {
    if (players[i].x > width - 50 && winner === null) {
      winner = players[i];
      restartButton.show();
    }
  }

  // Display winning player and restart button on the canvas
  if (winner !== null) {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Player " + winner.key.toUpperCase() + " wins!", width / 2, height / 2 - 50);
    restartButton.show();
  }

  // Display start button if the game has not started
  if (!gameStarted) {
    startButton.show();
  } else {
    startButton.hide();
  }

  // Display countdown timer
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
  // Check if a valid key is pressed
  if (keys.includes(key) && gameStarted) {
    // Find the player corresponding to the pressed key and accelerate
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
    // Increase speed, but check for spinning out of control
    if (!this.recovering) {
      this.speed += 2;
      if (this.speed > maxSpeed) {
        this.speed = 0; // Spin out of control
        this.recovering = true;
        this.recoveryStart = millis();

        // Generate more smoke particles during a crash
        for (let i = 0; i < 30; i++) {
          this.particles.push(new Particle(this.x, this.y));
        }

        // Play the crash sound
        crashSound.play();
      } else {
        // Play the car sound when accelerating
        carSound.play();
      }
    }
  }

  display() {
    // Display particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      this.particles[i].display();
      if (this.particles[i].isFinished()) {
        this.particles.splice(i, 1);
      }
    }

    // Display the car image
    image(carImages[keys.indexOf(this.key)], this.x - 10, this.y - 10, 200, 50);
  }


  update() {
    if (this.recovering) {
      // Check if recovery time has passed
      if (millis() - this.recoveryStart > recoveryTime) {
        this.recovering = false;
        this.speed = 0; // Reset speed after recovery
      }
    } else {
      // Move player based on speed
      this.x += this.speed;

      // Check if player has crossed the finish line
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
    // Display meter background
    fill(200);
    rect(this.x, this.y - 10, 50, 20);

    if (isSpunOut) {
      fill(255, 0, 0);
    } else {
      fill(0, 255, 0);
    }

    // Adjust the meter fill based on recovery time
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
    this.lifespan = 200; // Adjust the lifespan of the particle
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