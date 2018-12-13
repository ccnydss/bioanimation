class Particle {
  constructor(_center, _diam, _vel, _collidable, _color, _display=true) {
    // Input: int, int, int, p5 vector, boolean
    // Function: Instantiate a Particle object

    // NOTE: Eventually re-name all member variables to be prefaced with "m_varname"
    this.center = _center;
    this.diam = _diam;
    this.r = int(_diam / 2);
    this.collidable = _collidable;

    this.display = _display;
    this.m_color = _color;

    this.m_speed = 5;
    this.m_velocity = createVector(_vel.x, _vel.y);
    this.setVelocity(this.m_velocity);
  }

  color(c = this.m_color) {
    this.m_color = c;
    noStroke();
    fill(c);
  }

  draw(xc = this.center.x, yc = this.center.y, d = this.diam) {
    if (this.display) ellipse(xc, yc, d);
  }

  moveCenter() {
    this.center.x += this.m_velocity.x;
    this.center.y += this.m_velocity.y;
  }

  move(container_context) {
    // Pass in a Container object the particle should be constrained inside.

    if (this.collidable) {
      container_context.bounce(this);
    } else {
      this.moveCenter();
      this.onContainerChange (
        this.center.x,
        this.center.y
      );
    }

    this.draw();
  }

  computeNewDirection(collisionDetector, reverseX, reverseY) {
    // Boolean function, and two bools
    // Check if the particle is about to collide and modify velocity appropriately
    if (collisionDetector()) {
      var newx = this.m_velocity.x;
      var newy = this.m_velocity.y;

      if (reverseX) newx = newx * -1;
      if (reverseY) newy = newy * -1;

      var newVector = createVector(newx, newy);

      // Create slight random variation in the reflected angle to prevent
      //  particles from travelling along parallel paths (looks unnatural)
      var currentRadian = newVector.heading();
      var radianVariation = random(0, 0.2);
      if ( random([0, 1]) ) {
        radianVariation = radianVariation * -1;
      }

      if (abs(currentRadian + radianVariation) < 0.25) {
        console.log(newVector.heading());
        if (currentRadian >= 0) {
          radianVariation += 0.15;
        } else {
          radianVariation -= 0.15;
        }
      };

      newVector.rotate(radianVariation);

      this.setVelocity(newVector);
    }
  }

  setDisplay(disp) {
    this.display = disp;
  }

  setVelocity(in_vector = p5.Vector.random2D()) {
    this.m_velocity = in_vector.setMag(this.m_speed);
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
