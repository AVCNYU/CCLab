let particles = [];
let angle = 0;
let spiralRadius = 50; // Adjust this value for the desired spiral radius
let isMousePressed = false;
let mouseReleasePosition;


//small change 

function setup() {
    createCanvas(800, 800);
    colorMode(HSB);
}

function draw() {
    background(0);

    // Update the angle to create the spinning effect
    angle += 0.02;

    // Create new particles in a spiral pattern
    let x = width / 2 + spiralRadius * cos(angle);
    let y = height / 2 + spiralRadius * sin(angle);
    particles.push(new Particle(x, y));

    // Update and display particles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.update();
        p.display();
        if (p.isOffscreen()) {
            particles.splice(i, 1);
        }
    }

    // If the mouse is released, push particles away from the release point
    if (!mouseIsPressed && isMousePressed) {
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.pushAway(mouseReleasePosition);
        }
        isMousePressed = false;
    }
}

function mouseReleased() {
    isMousePressed = true;
    mouseReleasePosition = createVector(mouseX, mouseY);
}

class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D(); // Random initial direction
        this.color = color(random(360), 100, 100, 100); // Random HSB color with alpha
        this.size = random(5, 15); // Random particle size
    }

    update() {
        this.pos.add(this.vel);
    }

    display() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size, this.size);
        this.color.setAlpha(map(this.pos.y, height / 2, height, 100, 0)); // Gradual fading
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
}

