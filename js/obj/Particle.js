class Particle {
  constructor(_center, _diam, _vel, _collidable, _color, _display=true) {
    // Input: int, int, int, p5 vector, boolean
    // Function: Instantiate a Particle object
    this.center = _center;
    this.diam = _diam;
    this.r = int(_diam / 2);
    this.collidable = _collidable;

    this.display = _display;
    this.m_color = _color;

    // Store the original vector to remember it after modifying move_velocity.
    this.orig_velocity = createVector(_vel.x, _vel.y);
    this.move_velocity = createVector(_vel.x, _vel.y);
    this.velocity_mul = createVector(1, 1); // NOTE: Still using this attribute?
  }

  color() {
    noStroke();
    fill(this.m_color);
  }

  draw(xc = this.center.x, yc = this.center.y, rc = this.r) {
    if (this.display) ellipse(xc, yc, rc);
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
      ellipse(this.center.x, this.center.y, this.diam);
    }
  }

  setDisplay(disp) {
    this.display = disp;
  }
}

class Na extends Particle {
  constructor(_center, _diam, _vel, _collidable) {
    super(_center, _diam, _vel, _collidable, "#F5CE28");

    this.display = true;
    this.charge = 1;
    this.permeability = 0.03;
  }
}

class Cl extends Particle {
  constructor(_center, _diam, _vel, _collidable) {
    super(_center, _diam, _vel, _collidable, "#CD5C5C");

    this.display = false;
    this.charge = -1;
    this.permeability = 0.1;
  }
}

class K extends Particle {
  constructor(_center, _diam, _vel, _collidable) {
    super(_center, _diam, _vel, _collidable, "#35B235");

    this.display = false;
    this.charge = 1;
    this.permeability = 1;
  }
}

// NOTE: Is this the best name (and place) for this object?
// Used to instantiate a particle child class dynamically (without knowing if it will be a Na, Cl, or K)
var factory = {
  "Na": Na,
  "Cl": Cl,
  "K": K
}

// NOTE: This should be a child class of Particle
class AnimatedParticle extends Particle {
  constructor(_center, _diam, _vel, _collidable, _color, _display) {
    super(_center, _diam, _vel, _collidable, _color, _display);
  }

  // draw(xc = this.center.x, yc = this.center.y, rc = this.r) {
  //   ellipse(xc, yc, rc);
  // }

  move() {
    // Force the animated particle to move straight down.
    this.center.y = this.center.y + this.move_velocity.y;
    ellipse(this.center.x, this.center.y, this.diam);
  }
}
