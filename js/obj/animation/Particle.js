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
    this.m_velocity = createVector(_vel.x, _vel.y).setMag(this.m_speed);
  }

  color(c = this.m_color) {
    this.m_color = c;
    noStroke();
    fill(c);
  }

  draw(xc = this.center.x, yc = this.center.y, d = this.diam) {
    if (this.display) ellipse(xc, yc, d);
  }

  move(container_context) {
    // Pass in a Container object the particle should be constrained inside.
    if (this.collidable) {
      this.bounce(container_context);
    } else {
      this.moveCenter();
      this.onContainerChange (
        this.center.x,
        this.center.y
      );
    }

    this.draw();
  }

  moveCenter() {
    this.center.x += this.m_velocity.x;
    this.center.y += this.m_velocity.y;
  }

  bounce(container) {
    // Input: Particle
    // Function: Reverse velocity components when particle collides with wall

    var bl = container.bl;
    var br = container.br;
    var tl = container.tl;

    this.checkOutOfBounds(container);

    this.computeNewDirection(this.nextPastBottom(bl), false, true);
    this.computeNewDirection(this.nextPastTop(tl), false, true);
    this.computeNewDirection(this.nextPastRight(br), true, false);
    this.computeNewDirection(this.nextPastLeft(bl), true, false);

    // Begin moving the particle in the newly set direction
    this.moveCenter();
  }

  nearToPoint(point, range=0) {
    // Method to determine if the given particle is close to, or nearby, a single
    // point within a given radius (range) of pixels.

    var distanceBetween = this.center.distance(point);
    return distanceBetween <= this.r + range;
  }

  checkOutOfBounds(container) {
    var outRight = this.center.x + this.r > container.br.x;
    var outLeft = this.center.x - this.r < container.tl.x;
    var outTop = this.center.y - this.r < container.tl.y;
    var outBot = this.center.y + this.r > container.br.y;

    if (outRight || outLeft || outTop || outBot) {
      this.center.x = container.center.x;
      this.center.y = container.tl.y + (container.center.y / 2);
    }
  }

  computeNewDirection(willCollide, reverseX, reverseY) {
    // Boolean function, and two bools
    // Check if the particle is about to collide and modify velocity appropriately
    if (willCollide) {
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

      // Prevent angle of reflection from being too narrow
      if (abs(currentRadian + radianVariation) < 0.25) {
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

  nextPastBottom(bl) {
    // Will particle cross bottom wall in next frame?
    return this.center.y + this.m_velocity.y + this.r > bl.y;
  }

  nextPastTop(tl) {
    // Will particle cross top wall in next frame?
    return this.center.y + this.m_velocity.y - this.r < tl.y;
  }

  nextPastRight(br) {
    // Will particle cross right wall in next frame?
    return this.center.x + this.m_velocity.x + this.r > br.x;
  }

  nextPastLeft(bl) {
    // Will particle cross left wall in next frame?
    return this.center.x + this.m_velocity.x - this.r < bl.x;
  }

  setDisplay(disp) {
    this.display = disp;
    setClassMember(this, "display", disp);
  }

  randomDirection(toTop) {
    var afterDirection;
    if (toTop) {
      afterDirection = randomFromRanges(
        [
          [ PI / 6 , PI / 3 ],
          [ 2*PI / 3 , 5*PI / 6 ]
        ]
      )
    } else {
      afterDirection = randomFromRanges(
        [
          [ 7*PI / 6, 4*PI / 3],
          [ 5*PI / 3, 11*PI / 6]
        ]
      )
    };
    return p5.Vector.fromAngle(afterDirection);
  }

  setVelocity(in_vector) {
    this.m_velocity = in_vector.setMag(this.m_speed);
  }

  setSpeed(speed) {
    this.m_speed = speed;
  }
}

class Na extends Particle {
  constructor(_center, _vel, _collidable) {
    super(_center, Na.diameter, _vel, _collidable, Na.color);

    this.display = true;
  }
}

// Attach properties directly to the Na class itself, not an object/instance of the class.
Na.id = 0;
Na.diameter = 15;
Na.display = true;
Na.color = "#F5CE28";
Na.sign = "+";
Na.charge = 1;
Na.permeability = 0.03;
Na.inside = 1;
Na.outside = 2;

class Cl extends Particle {
  constructor(_center, _vel, _collidable) {
    super(_center, Cl.diameter, _vel, _collidable, Cl.color);

    this.display = false;
  }
}

Cl.id = 1;
Cl.diameter = 15;
Cl.display = false;
Cl.color = "#CD5C5C";
Cl.sign = "-";
Cl.charge = -1;
Cl.permeability = 0.1;
Cl.inside = 2;
Cl.outside = 1;

class K extends Particle {
  constructor(_center, _vel, _collidable) {
    super(_center, K.diameter, _vel, _collidable, K.color);

    this.display = false;
  }
}

K.id = 2;
K.diameter = 15;
K.display = false;
K.color = "#35B235";
K.sign = "+";
K.charge = 1;
K.permeability = 1;
K.inside = 5;
K.outside = 3;

// Used to instantiate a particle child class dynamically (without knowing if it will be a Na, Cl, or K)
var particleMapper = {
  "Na": Na,
  "Cl": Cl,
  "K": K
}
