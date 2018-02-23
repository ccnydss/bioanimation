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
    rect( this.tl.x, this.tl.y, this.vertical, this.horizontal );
  }

  clips(p) {
    // Test if the next movement the particle makes would result in a part of it clipping past container
    var nextPastBottom = p.y + p.move_velocity.y + p.r + 0.5 > this.bl.y;
    var nextPastTop = p.y + p.move_velocity.y - p.r - 0.5 < this.tl.y;
    var nextPastRight = p.x + p.move_velocity.x + p.r + 0.5 > this.br.x;
    var nextPastLeft = p.x + p.move_velocity.x - p.r - 0.5 < this.bl.x;

    while ( nextPastBottom ) {
      console.log("\nAH! BOTTOM------------------------------------------");
      console.log ("MOVE VEC --- ", p.move_velocity.toString());
      console.log ("ORIG VEC --- ", p.orig_velocity.toString());
      console.log ("x", p.x);
      console.log ("vx", p.move_velocity.x);
      console.log ("r", p.r);
      console.log ("POS", p.x + p.move_velocity.x - p.r);
      console.log( "CONT", this.bl.x);
      console.log("END! BOTTOM------------------------------------------\n");

      // For as long as the next position increment will bring the particle
      // outside of the container, then... decelerate the particle.
      p.move_velocity.y -= 1;

      // Recheck condition
      nextPastBottom = p.y + p.move_velocity.y + p.r > this.bl.y;
    }

    while ( nextPastTop ) {
      console.log("\nAH! TOP------------------------------------------");
      console.log ("MOVE VEC --- ", p.move_velocity.toString());
      console.log ("ORIG VEC --- ", p.orig_velocity.toString());
      console.log ("x", p.x);
      console.log ("vx", p.move_velocity.x);
      console.log ("r", p.r);
      console.log ("POS", p.x + p.move_velocity.x - p.r);
      console.log( "CONT", this.bl.x);
      console.log("END! TOP------------------------------------------\n");

      p.move_velocity.y += 1;
      nextPastTop = p.y + p.move_velocity.y - p.r < this.tl.y;
    }

    while ( nextPastRight ) {
      console.log("\nAH! RIGHT------------------------------------------");
      console.log ("MOVE VEC --- ", p.move_velocity.toString());
      console.log ("ORIG VEC --- ", p.orig_velocity.toString());
      console.log ("x", p.x);
      console.log ("vx", p.move_velocity.x);
      console.log ("r", p.r);
      console.log ("POS", p.x + p.move_velocity.x - p.r);
      console.log( "CONT", this.bl.x);
      console.log("END! RIGHT------------------------------------------\n");

      p.move_velocity.x -= 1;
      nextPastRight = p.x + p.move_velocity.x + p.r > this.br.x;
    }

    while ( nextPastLeft ) {
      console.log("\nAH! LEFT------------------------------------------");
      console.log ("MOVE VEC --- ", p.move_velocity.toString());
      console.log ("ORIG VEC --- ", p.orig_velocity.toString());
      console.log ("x", p.x);
      console.log ("vx", p.move_velocity.x);
      console.log ("r", p.r);
      console.log ("POS", p.x + p.move_velocity.x - p.r);
      console.log( "CONT", this.bl.x);
      console.log("END! LEFT------------------------------------------\n");

      p.move_velocity.x += 1;
      nextPastLeft = p.x + p.move_velocity.x - p.r < this.bl.x;
    }
  }

  hit(p) {
    var pastBottom = p.y + p.r + 0.5 >= this.bl.y;
    var pastTop = p.y - p.r - 0.5 <= this.tl.y;
    var pastRight = p.x + p.r + 0.5 >= this.br.x;
    var pastLeft = p.x - p.r - 0.5<= this.bl.x;

    if ( pastBottom ) {
      print( "pb" );
      console.log("before", p.move_velocity.toString());
      console.log("boriginal", p.orig_velocity.toString());

      // Create new velocity vector based off of reflection
      var newx = p.orig_velocity.x;
      var newy = -1 * p.orig_velocity.y;

      p.move_velocity = createVector (newx, newy);
      p.orig_velocity = createVector (newx, newy);

      console.log("**SWITCHED**");
      console.log("after", p.move_velocity.toString());

      // Begin moving the particle in the new direction
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;

    } if ( pastTop ) {
      print( "pt" );

      // Create new velocity vector based off of reflection
      var newx = p.orig_velocity.x;
      var newy = -1 * p.orig_velocity.y;

      p.orig_velocity = createVector (newx, newy);
      p.move_velocity = createVector (newx, newy);

      console.log("**SWITCHED**");
      // Begin moving the particle in new direction
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;

    } if ( pastRight ) {
      print( "pr" );

      console.log("ONE", p.orig_velocity.toString());
      console.log("TWO", p.move_velocity.toString());

      // Create new velocity vector based off of reflection
      var newx = -1 * p.orig_velocity.x;
      var newy = p.orig_velocity.y;

      p.orig_velocity = createVector (newx, newy);
      p.move_velocity = createVector (newx, newy);

      console.log("**SWITCHED**");
      // Move particle
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;

    } if ( pastLeft ) {
      print( "pl" );

      // Create new velocity vector based off of reflection
      var newx = -1 * p.orig_velocity.x;
      var newy = p.orig_velocity.y;

      p.orig_velocity = createVector (newx, newy);
      p.move_velocity = createVector (newx, newy);

      console.log("**SWITCHED**");
      // Move particle
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;
    } else {
      print( "within" );

      console.log("MOVIN ORIGN", p.orig_velocity.toString());
      console.log("MOVIN TEMP", p.move_velocity.toString());

      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;
    }
  }
}

