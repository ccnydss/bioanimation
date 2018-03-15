class Container {
  constructor(_tl, _tr, _br, _bl) {
    this.tl = _tl;
    this.tr = _tr;
    this.br = _br;
    this.bl = _bl;

    this.vertical = abs(_tr.x - _tl.x);
    this.horizontal = abs(_tl.y - _bl.y);
  }

  draw() {
    fill('#2c2b3c');
    rect( this.tl.x, this.tl.y, this.vertical, this.horizontal );
  }

  moveNoCollision(p) {
    p.x += p.move_velocity.x;
    p.y += p.move_velocity.y;
  }

  clips(p) {
    // Test if the next movement the particle makes would result in a part of it clipping past container
    var write = function (direction, particle, wall, velocity) {
      //console.log("direction: ", direction);
      // console.log("particle: ", particle);
      // console.log(direction, " wall: ", wall);
      // console.log(p.move_velocity.x,p.move_velocity.y);
    }
    var nextPastBottom = p.y + p.move_velocity.y + p.r + 0.5 > this.bl.y;
    var nextPastTop = p.y + p.move_velocity.y - p.r - 0.5 < this.tl.y;
    var nextPastRight = p.x + p.move_velocity.x + p.r + 0.5 > this.br.x;
    var nextPastLeft = p.x + p.move_velocity.x - p.r - 0.5 < this.bl.x;

    while ( nextPastBottom ) {
      // For as long as the next position increment will bring the particle
      // outside of the container, then... decelerate the particle.
      write("bottom", p.y + p.r, this.bl.y);
      p.move_velocity.y -= 1;
      // Recheck condition
      nextPastBottom = p.y + p.move_velocity.y + p.r > this.bl.y;
    }

    while ( nextPastTop ) {
      write("top", p.y - p.r, this.tl.y);
      p.move_velocity.y += 1;
      nextPastTop = p.y + p.move_velocity.y - p.r < this.tl.y;
    }

    while ( nextPastRight ) {
      write("right", p.x + p.r, this.br.x);
      p.move_velocity.x -= 1;
      nextPastRight = p.x + p.move_velocity.x + p.r > this.br.x;
    }

    while ( nextPastLeft ) {
      write("left", p.x - p.r, this.bl.x);
      p.move_velocity.x += 1;
      nextPastLeft = p.x + p.move_velocity.x - p.r < this.bl.x;
    }
  }

  hit(p) {
    var write = function (direction, particle, wall) {
      // console.log("direction: ", direction);
      // console.log("particle: ", particle);
      // console.log(direction, " wall: ", wall);
    }

    p.x += p.move_velocity.x;
    p.y += p.move_velocity.y;
    var pastBottom = p.y + p.r >= this.bl.y-1;
    var pastTop = p.y - p.r <= this.tl.y+1;
    var pastRight = p.x + p.r >= this.br.x;
    var pastLeft = p.x - p.r <= this.bl.x;

    if ( pastBottom ) {
      // Create new velocity vector based off of reflection
      write("bottom", p.y + p.r, this.bl.y);
      var newx = p.orig_velocity.x;
      var newy = -1 * p.orig_velocity.y;

      p.move_velocity = createVector (newx, newy);
      p.orig_velocity = createVector (newx, newy);

      // Begin moving the particle in the new direction
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;

    } if ( pastTop ) {
      // Create new velocity vector based off of reflection
      write("top", p.y - p.r, this.tl.y);
      var newx = p.orig_velocity.x;
      var newy = -1 * p.orig_velocity.y;

      p.orig_velocity = createVector (newx, newy);
      p.move_velocity = createVector (newx, newy);

      // Begin moving the particle in new direction
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;

    } if ( pastRight ) {
      // Create new velocity vector based off of reflection
      write("right", p.x + p.r, this.br.x);
      var newx = -1 * p.orig_velocity.x;
      var newy = p.orig_velocity.y;

      p.orig_velocity = createVector (newx, newy);
      p.move_velocity = createVector (newx, newy);

      // Move particle
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;

    } if ( pastLeft ) {
      // Create new velocity vector based off of reflection
      write("left", p.x - p.r, this.bl.x);
      var newx = -1 * p.orig_velocity.x;
      var newy = p.orig_velocity.y;

      p.orig_velocity = createVector (newx, newy);
      p.move_velocity = createVector (newx, newy);

      // Move particle
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;
    }
  }
}
