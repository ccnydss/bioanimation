class Particle {
  constructor(_x, _y, _diam, _vel, _collidable) {
    // Input: int, int, int, p5 vector, boolean
    // Function: Instantiate a Particle object
    this.x = _x;
    this.y = _y;
    this.diam = _diam;
    this.r = int(_diam / 2);
    this.collidable = _collidable;

    // Store the original vector to remember it after modifying move_velocity.
    this.orig_velocity = createVector(_vel.x, _vel.y);
    this.move_velocity = createVector(_vel.x, _vel.y);
    this.velocity_mul = createVector(1, 1); // NOTE: Still using this attribute?
    this.display = true;
  }

  draw(xc = this.x, yc = this.y, rc = this.r) {
    if (this.display) {
      ellipse(xc, yc, rc);
    } else {
      //console.log(display);
    }
  }

  move(container_context, channels) {
    // Pass in a Container object the particle should be constrained inside.
    // channel.transfers(this);
    if (this.collidable) {
      container_context.clips(this);
      container_context.hit(this);
    } else {
      container_context.moveNoCollision(this)
    }

    // NOTE: Why is this repeated even though it is done above, in the "if"-statement?
    container_context.clips(this);
    container_context.hit(this);

    // NOTE: Shouldn't we just call the "draw" method directly?
    if (this.display) {
      ellipse(this.x, this.y, this.diam);
    }

  }
}

class Na extends Particle {
  color() {
    noStroke();
    fill(particlesProperties["Na"].color);
  }
}

class Cl extends Particle {
  color() {
    noStroke();
    fill(particlesProperties["Cl"].color);
  }
}

class K extends Particle {
  color() {
    noStroke();
    fill(particlesProperties["K"].color);
  }
}

// NOTE: Is this the best name for this object?
var factory = {
  "Na": Na,
  "Cl": Cl,
  "K": K
}

// NOTE: This should be a child class of Particle
class AnimatedParticle {
  constructor(_x, _y, _diam, _vel, _collidable, _particle) {
    this.x = _x;
    this.y = _y;
    this.diam = _diam;
    this.r = int(_diam / 2);
    this.collidable = _collidable;
    this.particle = _particle;

    // Store the original vector to remember it after modifying move_velocity.
    this.orig_velocity = createVector(_vel.x, _vel.y);
    this.move_velocity = createVector(_vel.x, _vel.y);
  }

  draw(xc = this.x, yc = this.y, rc = this.r) {
    ellipse(xc, yc, rc);
  }

  color() {
    noStroke();
    fill(particlesProperties[this.particle].color);
  }

  move() {
    // Pass in a Container object the particle should be constrained inside.
    this.y = this.y + this.move_velocity.y;
    ellipse(this.x, this.y, this.diam);
  }
}

var setDisplay = function(particle, value) {
  particle.display = value;
}
