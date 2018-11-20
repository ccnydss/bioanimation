class Container extends Rectangle {
  constructor(_points, _color, _id) {
    // Input:     Rectangle, a P5 color string, and "inside" | "outside"
    // Function:  Generate a new Container object with its properties.

    super(_points);

    this.color = _color;
    this.id = _id;
  }

  draw() {
    fill(this.color);
    rect(this.tl.x, this.tl.y, this.height, this.width);

    if (this.id == "outside") {
      fill(255, 255, 255);
      rect(5, this.bl.y + 60, textWidth("Intracellular") + 10, 20);
      rect(5, 15, textWidth("Extracellular") + 10, 20);
      fill(50);
      text("Intracellular", 10, this.bl.y + 75);
      text("Extracellular", 10, 20 + 8);
    }
  }

  // NOTE: Gets used in Particle.js
  //        Migrate this to Particle class because it only modifies "p"s values.
  moveNoCollision(p) {
    p.x += p.move_velocity.x;
    p.y += p.move_velocity.y;
  }

  clips(p) {
    // NOTE: Might make more sense to put this inside the Particle class,
    //      because this function modifies "p"s values.

    // Input: Particle
    // Function: Decelerate the Particle as it approaches this container

    var write = function(direction, particle, wall, p) {
      var debug = false;
      if ((direction == "left" || direction == "right") && debug) {
        console.log("CLIPS!")
        console.log("direction: ", direction);
        console.log("particle: ", particle);
        console.log(direction, "wall: ", wall);
        console.log('velocity: (', p.move_velocity.x, p.move_velocity.y, ')');
        console.log("leftball:", p.x - p.r);
        console.log("rightball:", p.x + p.r);
      }
    }

    // Boolean expressions
    // Detect if the particle will cross any container walls if it moves forward by its current velocity.

    var nextPastBottom = p.y + p.move_velocity.y + p.r > this.bl.y; // Crosses bottom wall?
    var nextPastTop = p.y + p.move_velocity.y - p.r < this.tl.y; // Crosses top wall?
    var nextPastRight = p.x + p.move_velocity.x + p.r > this.br.x; // Crosses right wall?
    var nextPastLeft = p.x + p.move_velocity.x - p.r < this.bl.x; // Crosses left wall?

    // console.log(p);
    // NOTE: Perhaps turn this single while loop into a function for reuse
    while (nextPastBottom) {
      // For as long as the next position increment will bring the particle
      // outside of the container, then... decelerate the particle.

      write("bottom", p.y + p.r, this.bl.y, p);
      p.move_velocity.y -= 1;

      // Recheck condition
      // NOTE: Find a way to avoid repeating this expression from the beginning
      nextPastBottom = p.y + p.move_velocity.y + p.r > this.bl.y;
    }

    while (nextPastTop) {
      write("top", p.y - p.r, this.tl.y, p);
      p.move_velocity.y += 1;

      // Recheck condition
      nextPastTop = p.y + p.move_velocity.y - p.r < this.tl.y;
    }

    while (nextPastRight) {
      write("right", p.x + p.r, this.br.x, p);
      p.move_velocity.x = p.move_velocity.x - 1;

      // Recheck condition
      nextPastRight = p.x + p.move_velocity.x + p.r > this.br.x;
    }

    while (nextPastLeft) {
      write("left", p.x - p.r, this.bl.x, p);
      p.move_velocity.x += 1;

      // Recheck condition
      nextPastLeft = p.x + p.move_velocity.x - p.r < this.bl.x;
    }
  }

  hit(p, mul = -1) {
    // Input:     Particle
    // Function:  Make the particle bounce away (reflect velocity vector) when it comes into contact with a container

    // NOTE: Extract debug function to reuse for hit and clips
    var write = function(direction, particle, wall) {
      var debug = false;
      if ((direction == "left" || direction == "right") && debug) {
        console.log("HITS!")
        console.log("direction: ", direction);
        console.log("particle: ", particle);
        console.log(direction, " wall: ", wall);
        console.log('velocity: (', p.move_velocity.x, p.move_velocity.y, ')');
        console.log("leftball:", p.x - p.r);
        console.log("rightball:", p.x + p.r);
      }
    }

    // Move particle forward -- we should know it is safe to do so and remain within Container_Context, because of clips()
    p.x += p.move_velocity.x;
    p.y += p.move_velocity.y;


    var errorCorrection = 1;  // Sometimes the sum has rounding errors (i.e, 1.00001)

    var pastBottom = p.y + p.r + errorCorrection >= this.bl.y - errorCorrection;
    var pastTop = p.y - p.r - errorCorrection <= this.tl.y + errorCorrection;
    var pastRight = p.x + p.r + errorCorrection >= this.br.x;
    var pastLeft = p.x - p.r - errorCorrection <= this.bl.x;

    // Choose random angle of reflection
    // NOTE: Where do these constants come from?
    if (mul == -1) {
      // NOTE: This is a temporary step of refactoring the multiplier to come from outside
      var reflectionRange = [0.5, 1.2];
      var mul = ((Math.random() * reflectionRange[1]) + reflectionRange[0]).toFixed(3);
    }

    // NOTE: Try to DRY these if statements
    if (pastBottom) {
      // Create new velocity vector based off of reflection
      write("bottom", p.y + p.r, this.bl.y, p);

      var newx = p.orig_velocity.x;
      var newy = -1 * mul / p.velocity_mul.y * p.orig_velocity.y;

      p.move_velocity = createVector(newx, newy);
      p.orig_velocity = createVector(newx, newy);

      // Begin moving the particle in the new direction
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;

      // NOTE: Why do we need to store the previous multiplier?
      p.velocity_mul.y = mul;
    }

    if (pastTop) {
      // Create new velocity vector based off of reflection
      write("top", p.y - p.r, this.tl.y, p);

      var newx = p.orig_velocity.x;
      var newy = -1 * mul / p.velocity_mul.y * p.orig_velocity.y;

      p.orig_velocity = createVector(newx, newy);
      p.move_velocity = createVector(newx, newy);

      // Begin moving the particle in new direction
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;

      p.velocity_mul.y = mul;
    }

    if (pastRight) {
      // Create new velocity vector based off of reflection
      write("right", p.x + p.r, this.br.x, p);

      var newx = -1 * mul / p.velocity_mul.x * p.orig_velocity.x;
      var newy = p.orig_velocity.y;

      p.orig_velocity = createVector(newx, newy);
      p.move_velocity = createVector(newx, newy);

      // Move particle
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;
      p.velocity_mul.x = mul;

    }

    if (pastLeft) {
      // Create new velocity vector based off of reflection
      write("left", p.x - p.r, this.bl.x, p);

      var newx = -1 * mul / p.velocity_mul.x * p.orig_velocity.x;
      var newy = p.orig_velocity.y;

      p.orig_velocity = createVector(newx, newy);
      p.move_velocity = createVector(newx, newy);

      // Move particle
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;
      p.velocity_mul.x = mul;
    }
  }
}
