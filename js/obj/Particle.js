class Particle {
  constructor(_x, _y, _diam, _vel) {
    this.x = _x;
    this.y = _y;
    this.diam = _diam;
    this.r = int(_diam/2);
    this.collidable = true;

    // Store the original vector to remember it after modifying move_velocity.
    this.orig_velocity = createVector(_vel.x, _vel.y);
    this.move_velocity = createVector(_vel.x, _vel.y);
  }

  draw(xc = this.x, yc = this.y, rc = this.r) {
    ellipse( xc, yc, rc );
  }


  move(container_context,channels) {
    // Pass in a Container object the particle should be constrained inside.
    //channel.transfers(this);
    if (this.collidable) {
      container_context.clips(this);
      container_context.hit(this);
    }
    else {
      container_context.moveNoCollision(this)
    }

    container_context.clips(this);
    container_context.hit(this);

    ellipse( this.x, this.y, this.diam );
  }
}


class Na extends Particle {
  color() {
    noStroke();
    fill(particlesColor[0]);
  }
}

class Cl extends Particle {
  color() {
    noStroke();
    fill(particlesColor[1])
  }
}
