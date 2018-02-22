function Particle (_x, _y, _diam, _vel) {
  this.x = _x;
  this.y = _y;
  this.diam = _diam;
  this.r = int(_diam/2);

  // Store the original vector to remember it after modifying move_velocity.
  this.orig_velocity = createVector(_vel.x, _vel.y);
  this.move_velocity = createVector(_vel.x, _vel.y);

  this.draw = function( xc = this.x, yc = this.y, rc = this.r) {
    ellipse( xc, yc, rc );
  }

  var insideContainer = true;
  this.move = function (container_context) {
    // Pass in a Container object the particle should be constrained inside.

    // Test if the particle is with the
    // Test if the particle is within the container
    var pastBottom = (this.y + this.r >= container_context.bl.y) || ((this.y + this.r >= cellWalls[0].y) && ((this.x - this.r <= cellWalls[0].x + cellWalls[0].width) || (this.x + this.r >= cellWalls[1].x)));
    var pastTop = this.y - this.r <= container_context.tl.y; //|| (this.y - this.r <= cellWalls[0].y + cellWalls[0].height);// && ((this.x - this.r <= cellWalls[0].x + cellWalls[0].width) || (this.x + this.r >= cellWalls[1].x)));
    var pastRight = this.x + this.r >= container_context.br.x; // || ((this.x + this.r >= cellWalls[1].x) && (this.y + this.r >= cellWalls[0].y) && (this.y - this.r <= cellsWalls[0].y + cellsWalls[0].height));
    var pastLeft = this.x - this.r <= container_context.bl.x; // || ((this.x - this.r <= cellWalls[0].x+cellWalls[0].width) && (this.y + this.r >= cellWalls[0].y) && (this.y - this.r <= cellsWalls[0].y + cellsWalls[0].height));
    //hit = collideRectCircle(200,200,100,150,mouseX,mouseY,100)

    // Test if the next movement the particle makes would result in a part of it clipping past container
    var nextPastBottom = this.y + this.move_velocity.y + this.r > container_context.bl.y;
    var nextPastTop = this.y + this.move_velocity.y - this.r < container_context.tl.y;
    var nextPastRight = this.x + this.move_velocity.x + this.r > container_context.br.x;
    var nextPastLeft = this.x + this.move_velocity.x - this.r < container_context.bl.x;



    console.log("X", container_context.bl.x, "Y", container_context.tl.y);
    console.log("X:", this.x, "Y:", this.y, "Radius", this.r);
    while ( nextPastBottom ) {
      console.log("\nAH! BOTTOM------------------------------------------");
      console.log ("MOVE VEC --- ", this.move_velocity.toString());
      console.log ("ORIG VEC --- ", this.orig_velocity.toString());
      console.log ("x", this.x);
      console.log ("vx", this.move_velocity.x);
      console.log ("r", this.r);
      console.log ("POS", this.x + this.move_velocity.x - this.r);
      console.log( "CONT", container_context.bl.x);
      console.log("END! BOTTOM------------------------------------------\n");

      // For as long as the next position increment will bring the particle outside of the container, then...
      // Reduce the amount it moves.
      this.move_velocity.y -= 1;

      // Recheck condition
      nextPastBottom = this.y + this.move_velocity.y + this.r > container_context.bl.y;
    }

    while ( nextPastTop ) {
      console.log("\nAH! TOP------------------------------------------");
      console.log ("MOVE VEC --- ", this.move_velocity.toString());
      console.log ("ORIG VEC --- ", this.orig_velocity.toString());
      console.log ("x", this.x);
      console.log ("vx", this.move_velocity.x);
      console.log ("r", this.r);
      console.log ("POS", this.x + this.move_velocity.x - this.r);
      console.log( "CONT", container_context.bl.x);
      console.log("END! TOP------------------------------------------\n");

      this.move_velocity.y += 1;
      nextPastTop = this.y + this.move_velocity.y - this.r < container_context.tl.y;
    }

    while ( nextPastRight ) {
      console.log("\nAH! RIGHT------------------------------------------");
      console.log ("MOVE VEC --- ", this.move_velocity.toString());
      console.log ("ORIG VEC --- ", this.orig_velocity.toString());
      console.log ("x", this.x);
      console.log ("vx", this.move_velocity.x);
      console.log ("r", this.r);
      console.log ("POS", this.x + this.move_velocity.x - this.r);
      console.log( "CONT", container_context.bl.x);
      console.log("END! RIGHT------------------------------------------\n");

      this.move_velocity.x -= 1;
      nextPastRight = this.x + this.move_velocity.x + this.r > container_context.br.x;
    }

    while ( nextPastLeft ) {
      console.log("\nAH! LEFT------------------------------------------");
      console.log ("MOVE VEC --- ", this.move_velocity.toString());
      console.log ("ORIG VEC --- ", this.orig_velocity.toString());
      console.log ("x", this.x);
      console.log ("vx", this.move_velocity.x);
      console.log ("r", this.r);
      console.log ("POS", this.x + this.move_velocity.x - this.r);
      console.log( "CONT", container_context.bl.x);
      console.log("END! LEFT------------------------------------------\n");

      this.move_velocity.x += 1;
      nextPastLeft = this.x + this.move_velocity.x - this.r < container_context.bl.x;
    }

    if ( pastBottom ) {
      print( "pb" );
      console.log("before", this.move_velocity.toString());
      console.log("boriginal", this.orig_velocity.toString());

      // Create new velocity vector based off of reflection
      var newx = this.orig_velocity.x;
      var newy = -1 * this.orig_velocity.y;
      this.move_velocity = createVector (newx, newy);
      this.orig_velocity = createVector (newx, newy);

      console.log("after", this.move_velocity.toString());

      // Begin moving the particle in the new direction
      this.x += this.move_velocity.x;
      this.y += this.move_velocity.y;

    } if ( pastTop ) {
      print( "pt" );

      // Create new velocity vector based off of reflection
      var newx = this.orig_velocity.x;
      var newy = -1 * this.orig_velocity.y;
      this.orig_velocity = createVector (newx, newy);
      this.move_velocity = createVector (newx, newy);

      // Begin moving the particle in new direction
      this.x += this.move_velocity.x;
      this.y += this.move_velocity.y;

    } if ( pastRight ) {
      print( "pr" );

      console.log("ONE", this.orig_velocity.toString());
      console.log("TWO", this.move_velocity.toString());

      // Create new velocity vector based off of reflection
      var newx = -1 * this.orig_velocity.x;
      var newy = this.orig_velocity.y;
      this.orig_velocity = createVector (newx, newy);
      this.move_velocity = createVector (newx, newy);

      // Move particle
      this.x += this.move_velocity.x;
      this.y += this.move_velocity.y;

    } if ( pastLeft ) {
      print( "pl" );

      // Create new velocity vector based off of reflection
      var newx = -1 * this.orig_velocity.x;
      var newy = this.orig_velocity.y;
      this.orig_velocity = createVector (newx, newy);
      this.move_velocity = createVector (newx, newy);

      // Move particle
      this.x += this.move_velocity.x;
      this.y += this.move_velocity.y;
    } else {
      print( "within" );

      console.log("MOVIN ORIGN", this.orig_velocity.toString());
      console.log("MOVIN TEMP", this.move_velocity.toString());

      this.x += this.move_velocity.x;
      this.y += this.move_velocity.y;
    }

    ellipse( this.x, this.y, this.diam );
  }
}
