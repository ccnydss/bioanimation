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

    // Temporary fix for the speed issue
    this.m_speed = 3;
    this.speedUp(3);

    this.velocity_mul = createVector(1, 1); // NOTE: Still using this attribute?
  }

  color(c = this.m_color) {
    this.m_color = c;
    noStroke();
    fill(c);
  }

  draw(xc = this.center.x, yc = this.center.y, d = this.diam) {
    if (this.display) ellipse(xc, yc, d);
  }

  speedUp(factor) {
    // Speed or slow the particle by a multiplier, called factor
    var {x, y} = this.orig_velocity;

    this.orig_velocity = createVector(
      factor * x, factor * y
    );

    this.move_velocity = createVector(
      factor * x, factor * y
    );
  }

  move(container_context) {
    // Pass in a Container object the particle should be constrained inside.

    // channel.transfers(this);
    if (this.collidable) {
      container_context.clips(this);
      container_context.hit(this);
    } else {
      this.center.x += this.move_velocity.x;
      this.center.y += this.move_velocity.y;
      // this.onContainerChange(this.center.x, this.center.y, this.doOnCC);
      this.onContainerChange(this.center.x, this.center.y);
    }

    this.draw();
  };

  setDisplay(disp) {
    this.display = disp;
  }

  setVelocity(in_vector = p5.Vector.random2D()) {
    this.orig_velocity = in_vector.setMag(this.m_speed);
    this.move_velocity = in_vector.setMag(this.m_speed);
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

  move() {
    // Force the animated particle to move straight down.
    this.center.y = this.center.y + this.move_velocity.y;
    ellipse(this.center.x, this.center.y, this.diam);
  }
}
