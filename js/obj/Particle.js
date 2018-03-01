function Particle (_x, _y, _diam, _vel) {
  this.x = _x;
  this.y = _y;
  this.diam = _diam;
  this.r = int(_diam/2);
  this.collidable = true;

  // Store the original vector to remember it after modifying move_velocity.
  this.orig_velocity = createVector(_vel.x, _vel.y);
  this.move_velocity = createVector(_vel.x, _vel.y);

  this.draw = function( xc = this.x, yc = this.y, rc = this.r) {
    ellipse( xc, yc, rc );
  }

  var insideContainer = true;
  this.move = function (container_context,channel) {
    // Pass in a Container object the particle should be constrained inside.
    channel.transfers(this);
    if (this.collidable) {
      container_context.clips(this);
      container_context.hit(this);
    }
    else {
      container_context.moveNoCollision(this)
    }
    

    ellipse( this.x, this.y, this.diam );
  }
}

class Cl extends Particle {
  color() {
  fill('rgba(0,255,0, 0.25)')
  }
}

class Na extends Particle {
  color() {
    fill(color(255, 204, 0));
  }
}
