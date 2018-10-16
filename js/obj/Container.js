class Container {
  constructor(_tl, _tr, _br, _bl, _color, _id) {
    this.tl = _tl;
    this.tr = _tr;
    this.br = _br;
    this.bl = _bl;
    this.color = _color;
    this.vertical = abs(_tr.x - _tl.x);
    this.horizontal = abs(_tl.y - _bl.y);
    this.id = _id;
  }

  draw() {
    fill(this.color);
    rect(this.tl.x, this.tl.y, this.vertical, this.horizontal);
    if (this.id == "outside") {
      fill(255, 255, 255);
      rect(5, this.bl.y + 60, 70, 20);
      rect(5, 15, 75, 20);
      fill(50);
      text("Intracellular", 10, this.bl.y + 75);
      text("Extracellular", 10, 20 + 8);
    }
  }

  moveNoCollision(p) {
    p.x += p.move_velocity.x;
    p.y += p.move_velocity.y;
  }

  clips(p) {
    // Test if the next movement the particle makes would result in a part of it clipping past container
    var write = function(direction, particle, wall, p) {
      // if (direction == "left" || direction == "right") {
      //   console.log("CLIPS!")
      //   console.log("direction: ", direction);
      //   console.log("particle: ", particle);
      //   console.log(direction, "wall: ", wall);
      //   console.log('velocity: (',p.move_velocity.x,p.move_velocity.y,')');
      //   console.log("leftball:",p.x - p.r);
      //   console.log("rightball:",p.x + p.r);
      // }
    }
    var nextPastBottom = p.y + p.move_velocity.y + p.r + 0.5 > this.bl.y;
    var nextPastTop = p.y + p.move_velocity.y - p.r - 0.5 < this.tl.y;
    var nextPastRight = p.x + p.move_velocity.x + p.r + 0.5 > this.br.x;
    var nextPastLeft = p.x + p.move_velocity.x - p.r - 0.5 < this.bl.x;

    while (nextPastBottom) {
      // For as long as the next position increment will bring the particle
      // outside of the container, then... decelerate the particle.
      write("bottom", p.y + p.r, this.bl.y, p);
      p.move_velocity.y -= 1;
      // Recheck condition
      nextPastBottom = p.y + p.move_velocity.y + p.r > this.bl.y;
    }

    while (nextPastTop) {
      write("top", p.y - p.r, this.tl.y, p);
      p.move_velocity.y += 1;
      nextPastTop = p.y + p.move_velocity.y - p.r < this.tl.y;
    }

    while (nextPastRight) {
      write("right", p.x + p.r, this.br.x, p);
      p.move_velocity.x -= 1;
      nextPastRight = p.x + p.move_velocity.x + p.r > this.br.x;
    }

    while (nextPastLeft) {
      write("left", p.x - p.r, this.bl.x, p);
      p.move_velocity.x += 1;
      nextPastLeft = p.x + p.move_velocity.x - p.r < this.bl.x;
    }
  }

  hit(p) {
    var write = function(direction, particle, wall) {
      // if (direction == "left" || direction == "right") {
      //   console.log("HITS!")
      //   console.log("direction: ", direction);
      //   console.log("particle: ", particle);
      //   console.log(direction, " wall: ", wall);
      //   console.log('velocity: (',p.move_velocity.x,p.move_velocity.y,')');
      //   console.log("leftball:",p.x - p.r);
      //   console.log("rightball:",p.x + p.r);
      // }
    }

    p.x += p.move_velocity.x;
    p.y += p.move_velocity.y;
    var pastBottom = p.y + p.r + 1 >= this.bl.y - 1;
    var pastTop = p.y - p.r - 1 <= this.tl.y + 1;
    var pastRight = p.x + p.r + 1 >= this.br.x;
    var pastLeft = p.x - p.r - 1 <= this.bl.x;
    //p.x + p.move_velocity.x - p.r - 0.5 < this.bl.x;

    var reflectionRange = [0.5, 1.2];
    var mul = ((Math.random() * reflectionRange[1]) + reflectionRange[0]).toFixed(3);
    // var mul = Math.sin(45*Math.PI/360);

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
