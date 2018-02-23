class CellWall {
  constructor(_x, _y, _width, _height, _tl, _tr, _br, _bl) {
    this.x = _x;
    this.y = _y;
    this.width = _width;
    this.height = _height;

    this.tl = _tl;
    this.tr = _tr;
    this.br = _br;
    this.bl = _bl;
  }

  draw() {
    fill(0)
    rect(this.x, this.y, this.width, this.height, this.tl, this.tr, this.br, this.bl);
  }

  clips(p) {
    // Test if the next movement the particle makes would result in a part of it clipping past container
    var nextPastTop =       (p.y + p.move_velocity.y + p.r > this.y) && 
                            (p.x + p.move_velocity.x + p.r < this.x + this.width) &&
                            //(p.move_velocity.y >= 0) && 
                            (p.x + p.move_velocity.x - p.r > this.x);
    // var nextPastBottom =    (p.y + p.move_velocity.y - p.r - 0.5 <= this.y + this.height) && 
    //                         (p.y + p.move_velocity.y + p.r + 0.5 <= this.y) && 
    //                         (p.x + p.move_velocity.x + p.r + 0.5 <= this.x + this.width) &&
    //                         (p.x + p.move_velocity.x - p.r - 0.5 >= this.x);
    var nextPastRight = (p.x + p.move_velocity.x - p.r < this.x + this.width) && // is not past right edge of wall
                        // (p.x + p.move_velocity.x - p.r >= this.x + this.width-50) &&
                        (p.y + p.move_velocity.y + p.r < this.y + this.height /*+ (p.r*2)*/) && // is within the lower bound of the cell wall
                        (p.y + p.move_velocity.y - p.r > this.y /* -(p.r*2) */); // is within the upper bound of the cell wall
    // var nextPastLeft =  (p.x + p.move_velocity.x - p.r - 0.5 < this.x + this.width+(p.move_velocity.x*2)) && // is not past left edge of wall
    //                     (p.x + p.move_velocity.x - p.r - 0.5 <= this.x + this.width)
    //                     (p.y + p.move_velocity.y + p.r + 0.5 <= this.y + this.height + (p.r*1.5)) && // is within the upper bound of the cell wall
    //                     (p.y + p.move_velocity.y - p.r - 0.5 >= this.y+(p.r*1.5)); // is within the lower bound of the cell wall

    console.log ("p x", p.x);
    console.log ("p y", p.y);
    console.log ("p y with radius", p.y + p.r);
    console.log ("cw y", this.x);
    console.log ("cw y", this.y);

    while ( nextPastTop ) {
      console.log("\nAH! TOP--CW--------------------------------------");
      p.move_velocity.y -= 1;
      nextPastTop = (p.y + p.move_velocity.y + p.r > this.y) && 
                            (p.x + p.move_velocity.x + p.r < this.x + this.width) &&
                            //(p.move_velocity.y >= 0) && 
                            (p.x + p.move_velocity.x - p.r > this.x);
    }

     // while ( nextPastBottom ) {
    //   console.log("\nAH! BOTTOM-1-----------------------------------------");
    //   p.move_velocity.y += 1;
    //   nextPastBottom = p.y + p.move_velocity.y + p.r > this.bl.y;
    // }

    while ( nextPastRight ) {
      console.log("\nAH! RIGHT--CW--------------------------------------");
      p.move_velocity.x += 1;
      nextPastRight = (p.x + p.move_velocity.x - p.r < this.x + this.width) && // is not past right edge of wall
                        // (p.x + p.move_velocity.x - p.r >= this.x + this.width-50) &&
                        (p.y + p.move_velocity.y + p.r < this.y + this.height) && // is within the lower bound of the cell wall
                        (p.y + p.move_velocity.y - p.r > this.y); // is within the upper bound of the cell wall
    }

    // while ( nextPastLeft ) {
    //   console.log("\nAH! LEFT------------------------------------------");
    //   nextPastLeft = p.x + p.move_velocity.x - p.r < this.bl.x;
    // }
  }

  hit(p) {
    var pastTop =   (p.y + p.r >= this.y) && 
                    // (p.y - p.r <= this.y + this.height) &&
                    (p.x + p.r <= this.x + this.width) &&
                    (p.x - p.r >= this.x);
    // var pastBottom =  (p.y - p.r - 0.5 <= this.y + this.height) && 
    //                   (p.y + p.r + 0.5 <= this.y) && 
    //                   (p.x + p.r + 0.5 <= this.x + this.width) &&
    //                   (p.x - p.r - 0.5 >= this.x);
    var pastRight = (p.x - p.r <= this.x + this.width) && // is not past right edge of wall
                    (p.y + p.r <= this.y + this.height /*+ (p.r*2) */) && // is within the lower bound of the cell wall
                    (p.y - p.r >= this.y /* -(p.r*2) */); // is within the upper bound of the cell wall
    // var pastLeft =  (p.x - p.r - 0.5 <= this.x + this.width) && // is not past left edge of wall
    //                 (p.y + p.r + 0.5 <= this.y + this.height + (p.r*1.5)) && // is within the upper bound of the cell wall
    //                 (p.y - p.r - 0.5 >= this.y+(p.r*1.5)); // is within the lower bound of the cell wall

      
    if ( pastTop ) {
      print( "pt" );

      // Create new velocity vector based off of reflection
      var newx = p.orig_velocity.x;
      var newy = -1 * p.orig_velocity.y;

      p.orig_velocity = createVector (newx, newy);
      p.move_velocity = createVector (newx, newy);

      console.log("**HIT THE TOP**");
      // Begin moving the particle in new direction
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;

    } 

    // if ( pastBottom ) {
    //   print( "pb" );
    //   console.log("before", p.move_velocity.toString());
    //   console.log("boriginal", p.orig_velocity.toString());

    //   // Create new velocity vector based off of reflection
    //   var newx = p.orig_velocity.x;
    //   var newy = -1 * p.orig_velocity.y;

    //   p.move_velocity = createVector (newx, newy);
    //   p.orig_velocity = createVector (newx, newy);

    //   console.log("**SWITCHED**");
    //   console.log("after", p.move_velocity.toString());

    //   // Begin moving the particle in the new direction
    //   p.x += p.move_velocity.x;
    //   p.y += p.move_velocity.y;

    // } 

    if ( pastRight ) {

      console.log("ONE", p.orig_velocity.toString());
      console.log("TWO", p.move_velocity.toString());

      // Create new velocity vector based off of reflection
      var newx = -1 * p.orig_velocity.x;
      var newy = p.orig_velocity.y;

      p.orig_velocity = createVector (newx, newy);
      p.move_velocity = createVector (newx, newy);

      console.log("**HIT THE RIGHT**");
      // Move particle
      p.x += p.move_velocity.x;
      p.y += p.move_velocity.y;

    } 

    // if ( pastLeft ) {
    //   print( "pl" );

    //   // Create new velocity vector based off of reflection
    //   var newx = -1 * p.orig_velocity.x;
    //   var newy = p.orig_velocity.y;

    //   p.orig_velocity = createVector (newx, newy);
    //   p.move_velocity = createVector (newx, newy);


    //   console.log("**SWITCHED**");
    //   // Move particle
    //   p.x += p.move_velocity.x;
    //   p.y += p.move_velocity.y;
    // } 
  }
}
