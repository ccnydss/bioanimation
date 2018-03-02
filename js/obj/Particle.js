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
  this.move = function (container_context, cellWalls) {
    // Pass in a Container object the particle should be constrained inside.
    
    container_context.clips(this);
    container_context.hit(this);
    // for (var i=0; i<cellWalls.length; i++) {
    //   cellWalls[i].clips(this);
    //   cellWalls[i].hit(this);
    // }


    ellipse( this.x, this.y, this.diam );
  }
}

class Cl extends Particle {
  color() {
    noStroke();
    fill('#6bce25')
  }
}

class Na extends Particle {
  color() {
    noStroke();
    fill('#efec2b');
  }
}
