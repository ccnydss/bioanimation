var circles;
var outerBox;
var numParticles = 4;
var particles = [];
var radius = 50;


function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();

  var length = 600;
  var topLeft = new Point( ( windowWidth - length ) / 2, ( windowHeight - length ) / 2 );
  var topRight = new Point( ( windowWidth + length ) / 2, ( windowHeight - length ) / 2 );
  var botRight = new Point( ( windowWidth + length ) / 2, ( windowHeight + length ) / 2 );
  var botLeft = new Point( ( windowWidth - length ) / 2, ( windowHeight + length ) / 2 );

  outerBox = new Container( topLeft, topRight, botRight, botLeft );
  outerBox.draw();

  var velocity = createVector(-2.5, -2);

  // inner box - (x > outerBox.tl.x+50 || x < outerBox.br.x - 50) && (y > outerBox.tl.y+50 || y < outerBox.bl.y-50 )
  // maxX = outerBox.br.x-52;
  // minX = outerBox.tl.x+52;
  // maxY = outerBox.bl.y-52;
  // minY = outerBox.tl.y+52;

  xRange = outerBox.tr.x - outerBox.tl.x - 100
  yRange = outerBox.br.y - outerBox.tr.y - 100
  for (var i = 0; i < numParticles; i++) {
    // Get random location
    randomX = outerBox.tl.x + radius + (Math.floor(Math.random() * xRange))
    randomY = outerBox.tl.y + radius + (Math.floor(Math.random() * yRange))
    console.log(randomX,randomY);
    //particles.push(new Particle( (outerBox.tl.x + radius + 50), outerBox.tl.y + radius+1, 2*radius, velocity) );
    
    particles.push(new Particle(randomX,randomY,2*radius,velocity));
  }
}

function draw() {
  clear();
  console.log("---------------------- CLEARED ------------------------------- ", frameCount);
  drawCellWall(outerBox.tl.x,outerBox.tl.y,outerBox.tr.x,outerBox.bl.y);


  stroke(15, 15, 15, 100);
  fill(15, 15, 15, 100);
  // line(outerBox.tl.x+50,outerBox.tl.y+50, outerBox.tr.x-50, outerBox.tl.y+50);
  outerBox.draw();

  var randomColor = getRandomColor();
  for (var i = 0; i < numParticles; i++) {
    fill(color(50, 55, 100));

    particles[i].move(outerBox);
  }

}

function Point (_x, _y) {
  this.x = _x;
  this.y = _y;
}

function Container (_tl, _tr, _br, _bl) {
  this.tl = _tl;
  this.tr = _tr;
  this.br = _br;
  this.bl = _bl;

  this.vertical = abs(_tr.x - _tl.x);
  this.horizontal = abs(_tl.y - _bl.y);

  this.draw = function() {
    rect( this.tl.x, this.tl.y, this.vertical, this.horizontal );
  }
}

function Particle (_x, _y, _diam, _vel) {
  this.x = _x;
  this.y = _y;
  this.diam = _diam;
  this.r = _diam/2;

  // Store the original vector to remember it after modifying move_velocity.
  this.orig_velocity = createVector(_vel.x, _vel.y);
  this.move_velocity = createVector(_vel.x, _vel.y);

  this.draw = function( xc = this.x, yc = this.y, rc = this.r) {
    
    ellipse( xc, yc, rc );
  }

  var insideContainer = true;
  this.move = function (container_context) {
    // Pass in a Container object the particle should be constrained inside.

    // Test if the particle is within the container
    var pastBottom = this.y + this.r >= container_context.bl.y;
    var pastTop = this.y - this.r <= container_context.tl.y;
    var pastRight = this.x + this.r >= container_context.br.x;
    var pastLeft = this.x - this.r <= container_context.bl.x;

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

// Pause / unpause the animation (debug purposes)
var togLoop = false;
function toggleLoop() {
  if (togLoop) {
    loop();
    togLoop = false;
  } else {
    noLoop();
    togLoop = true;
  }
}

function keyPressed() {
  if (keyCode == 32) {
    toggleLoop();
  }
}

function getRandomColor() {
  randomColor = [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)];
  return randomColor;
}

function drawCellWall(x1,y1,x2,y2) {
  var channelGap = 100;
  var wallThickness = 50;
  boxWidth = x2 - x1;
  boxHeight = y2 - y1;
  background(255);
  fill(0);
  rect(x1, y1 + boxHeight/2, (boxWidth/2) - (channelGap/2), wallThickness, 0, 10, 10, 0);
  rect(x1 + (boxWidth/2) + (channelGap/2), y1 + boxHeight/2, (boxWidth/2) - (channelGap/2), wallThickness, 10, 0, 0, 10);
}

