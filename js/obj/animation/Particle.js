class Particle {
  /**
  * Particles are the main class of the application. They possess a radius,
  * color, position (maintained by their centers), and velocity. Every time a
  * particle is drawn to the screen, its position vector is incremented by
  * the velocity vector. There are 3 types of particles: Cl-, K+, and Na+ ions.
  *
  * @param {Point} _center - The starting position of the new Particle
  *
  * @param {integer} _diam - The diameter of the particle
  *
  * @param {Point} _vel - The input velocity is represented as a Point object
  *                       with (x, y) components.
  *
  * @param {boolean} _collidable - Determines if the particle will be impacted
  *                                 by collisions with Container objects.
  *
  * @param {Color|string} _color - A p5 Color object/string.
  *
  * @param {boolean} [_display=true] - Determines if the particle object should be
  *                               drawn to the screen at all.
  */
  constructor(_center, _diam, _vel, _collidable, _color, _display=true) {
    if (_diam <= 0) {
      throw new Error("Diameter must be positive and greater than 0.");
    }

    if (typeof _collidable != "boolean") {
      throw new Error("Collidability property must be a boolean value.");
    }

    /**
    * @protected
    * @type {Point}
    */
    this.center = _center;

    /**
    * @private
    * @type {integer}
    */
    this.diameter = _diam;

    /**
    * @private
    * @type {integer}
    */
    this.radius = int(_diam / 2);

    /**
    * @private
    * @type {boolean}
    */
    this.collidable = _collidable;

    /**
    * @private
    * @type {boolean}
    */
    this.display = _display;

    /**
    * @private
    * @type {Color|string}
    */
    this.fill_color = _color;

    /**
    * @private
    * @type {integer}
    */
    this.speed = 5;

    /**
    * @private
    * @type {p5.Vector}
    */
    this.velocity = createVector(_vel.x, _vel.y).setMag(this.speed);
  }

  /**
  * Setter and getter for the fill color of the particle.
  *
  * @param {Color | string} [c=this.fill_color] - The color to set the particle to
  * @returns {Color | string} - The particle's new or current color
  */
  color(c = this.fill_color) {
    this.fill_color = c;
    noStroke();
    fill(c);

    return this.fill_color;
  }

    /**
    * Set and get the fill color of the particle.
    *
    * @param {integer} [xc=this.center.x] - The x-coordinate to draw the particle at. Defaults to the center point's x-value.
    * @param {integer} [yc=this.center.y] - The y-coordinate to draw the particle at. Defaults to the center point's y-value.
    * @param {integer} [d=this.diameter] - The diameter of the Particle circle that gets drawn. Defaults to member variable-specified diameter.
    */
  draw(xc = this.center.x, yc = this.center.y, d = this.diameter) {
    // if (this.display) ellipse(xc, yc, d);
    if(particleMapper[this.type]["display"]) ellipse(xc, yc, d);
  }

  /**
  * Method to determine if the given particle is close to, or nearby, a single
  * point within a given radius (range) of pixels from the particle's border.
  *
  * @param {Point} point - The point to compare this one to.
  * @param {integer} [range=0] - The distance (in pixels) that specifies how
  *  far away the point should be from the Particle's boundary to trigger
  *  this function. Defaults to 0 (i.e., checks to see if the Point is actually within this Particle).
  *
  * @returns {boolean} - True if `point` is within `range`, otherwise false.
  */
  nearToPoint(point, range=0) {
    if (range < 0 || isNaN(range) || parseInt(range) != range) {
      throw new Error("Range must be zero, or a positive integer.");
    }

    var distanceBetween = this.center.distance(point);
    return distanceBetween <= this.radius + range;
  }

  /**
  * Public method to set the particle's velocity. It enforces the speed of the
  * of the particle by modifying the input vector's magnitude no matter what it
  * was initially.
  *
  * @param {p5.Vector} in_vector - The P5 vector object to use.
  */
  setVelocity(in_vector) {
    this.velocity = in_vector.setMag(this.speed);
  }

  /**
  * Public method to set the particle's speed. This will be used to force all
  * velocity vectors to maintain this given speed.
  *
  * @param {integer} speed - The speed to use, in terms of pixels per frame.
  * Typically, something like 1-5 is pretty good.
  */
  setSpeed(speed) {
    if (speed <= 0 || isNaN(speed) || parseInt(speed) != speed) {
      throw new Error("Speed must be a positive integer.");
    }

    this.velocity.setMag(speed);
    this.speed = speed;
  }

  /**
  * Public method to set the particle's display property.
  *
  * @param {boolean} disp - True/False for display the particle or not.
  */
  setDisplay(disp) {
    if (typeof disp != "boolean") {
      throw new Error("Display must be true or false.");
    }

    this.display = disp;
    setClassMember(this, "display", disp);
  }

  /**
  * Public method to set the particle's direction to a random value. Used
  * during the equilibrium function to give particles a random direction
  * after they cross the cell membrane.
  *
  * @param {boolean} toTop - True/False if the particle's y-component is
  * negative (moving upwards) or positive (moving downwards).
  *
  * @returns {p5.Vector} - The velocity vector that is going in this random direction.
  */
  randomDirection(toTop) {
    if (typeof toTop != "boolean") {
      throw new Error("toTop must be true or false.");
    }
    
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

  /**
  * Move the particle within the context of a Container.
  *
  * @private
  * @param {Container} container_context - The container (Rectangle) that contains this particle inside of it.
  */
  move(container_context) {
    if(particleMapper[this.type]["display"]) {
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

  }

  /**
  * Move the particle within the context of a Container.
  *
  * @private
  * @param {Container} container_context - The container (Rectangle) that contains this particle inside of it.
  */
  moveCenter() {
    this.center.x += this.velocity.x;
    this.center.y += this.velocity.y;
  }

  /**
  * Detect if the particle is out of bounds of a Container or needs to be bounced.
  * Reverse the velocity component if the particle collides with a wall.
  *
  * @private
  * @param {Container} container - The container (Rectangle) that contains this particle inside of it.
  */
  bounce(container) {
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

  /**
  * Detect if the particle is out of bounds of a Container. If it is, the particle
  * is repositioned to the center of the container.
  *
  * @private
  * @param {Container} container - The container (Rectangle) that contains this particle inside of it.
  */
  checkOutOfBounds(container) {
    var outRight = this.center.x + this.radius > container.br.x;
    var outLeft = this.center.x - this.radius < container.tl.x;
    var outTop = this.center.y - this.radius < container.tl.y;
    var outBot = this.center.y + this.radius > container.br.y;

    if (outRight || outLeft || outTop || outBot) {
      this.center.x = container.center.x;
      this.center.y = container.tl.y + (container.center.y / 2);
    }
  }

  /**
  * Reverse the velocity component if the particle collides with a wall. Whether
  * the x-component, y-component, or both of them get reversed depends on which
  * wall is getting hit.
  *
  * @private
  * @param {boolean} willCollide - A boolean corresponding to whether a particle
  *   is touching or positioned past a given Container wall.
  * @param {boolean} reverseX - Determines if we reverse the particle's x-component
  *   (i.e., a vertical reflection).
  * @param {boolean} reverseY - Determines if we reverse the particle's y-component
  *   (i.e., a horizontal reflection).
  */
  computeNewDirection(willCollide, reverseX, reverseY) {
    if (willCollide) {
      var newx = this.velocity.x;
      var newy = this.velocity.y;

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

  /**
  * Detect if the particle has collided with or moved past the bottom of the
  * container if it moves forward one more time (one more frame).
  *
  * @private
  * @param {Point} bl - The bottom left point of the Container.
  */
  nextPastBottom(bl) {
    return this.center.y + this.velocity.y + this.radius > bl.y;
  }

  /**
  * Detect if the particle has collided with or moved past the top of the
  * container if it moves forward one more time (one more frame).
  *
  * @private
  * @param {Point} tl - The top left point of the Container.
  */
  nextPastTop(tl) {
    return this.center.y + this.velocity.y - this.radius < tl.y;
  }

  /**
  * Detect if the particle has collided with or moved past the right of the
  * container if it moves forward one more time (one more frame).
  *
  * @private
  * @param {Point} br - The bottom right point of the Container.
  */
  nextPastRight(br) {
    return this.center.x + this.velocity.x + this.radius > br.x;
  }

  /**
  * Detect if the particle has collided with or moved past the left of the
  * container if it moves forward one more time (one more frame).
  *
  * @private
  * @param {Point} bl - The bottom left point of the Container.
  */
  nextPastLeft(bl) {
    return this.center.x + this.velocity.x - this.radius < bl.x;
  }
}

class Na extends Particle {
  /**
  * All ions will inherit from the parent Particle class. Thus they can share
  * methods and functionality with only cosmetic differences.
  *
  * The Na ion has its own properties listed below that are attached directly
  * on the "Na" JavaScript class instead of each object instance. The point is to
  * emulate static member variables, which JavaScript doesn't have.
  *
  *
  * @param {Point} _center - The starting position of the new Na Particle
  *
  * @param {Point} _vel - The input velocity is represented as a Point object
  *                       with (x, y) components.
  *
  * @param {boolean} _collidable - Determines if the particle will be impacted
  *                                 by collisions with Container objects.
  */
  constructor(_center, _vel, _collidable) {
    super(_center, Na.diameter, _vel, _collidable, Na.color, Na.display);

    this.type = 'Na';
  }
}

// Attach properties directly to the Na class itself, not an object/instance of the class.
/**
* ID is a field used to index the ion class itself. We maintain the ordering as follows:
* Na, K, Cl. Everything expects this ordering to hold true, which probably isn't good.
*
* @memberof Na
* @type {integer}
*/
Na.id = 0;

/**
* Specifies the diameter of the particle ion type in question. Right now this is only
* being used by Container.js when creating a new random particle.
*
* @memberof Na
* @type {integer}
*/
Na.diameter = 15;

/**
* Used during initializer first startup/initialization to show or hide the ion.
* It SHOULD also be updated during runtime as the user ticks the boxes/switches
* between Goldman and Nernst mode, but I don't know if it actually stays
* synchronized with the object instance's display property.
*
* @memberof Na
* @type {boolean}
*/
Na.display = true;

/**
* This sets the color for the ion type. This color string is used for coloring the
* membrane channels to match the ion.
*
* @memberof Na
* @type {p5.Color | string}
*/
Na.color = "#F5CE28";

/**
* Used for the ion label names in the simulator controls section.
*
* @memberof Na
* @type {string}
*/
Na.sign = "+";

/**
* Charge property used for computing Nernst & Goldman equations.
*
* @memberof Na
* @type {integer}
*/
Na.charge = 1;

/**
* Permeability property used for computing the Goldman equation.
*
* @memberof Na
* @type {float}
*/
Na.permeability = 0.03;

/**
* Number of Na ions inside of the cell upon startup/initialization.
*
* @memberof Na
* @type {integer}
*/
Na.inside = 1;

/**
* Number of Na ions outside of the cell upon startup/initialization.
*
* @memberof Na
* @type {integer}
*/
Na.outside = 2;

class Cl extends Particle {
  /**
  * The class representing Cl ions
  *
  *
  * @param {Point} _center - The starting position of the new Na Particle
  *
  * @param {Point} _vel - The input velocity is represented as a Point object
  *                       with (x, y) components.
  *
  * @param {boolean} _collidable - Determines if the particle will be impacted
  *                                 by collisions with Container objects.
  */
  constructor(_center, _vel, _collidable) {
    super(_center, Cl.diameter, _vel, _collidable, Cl.color, Cl.display);
    this.type = 'Cl';
  }
}

/**
* ID is a field used to index the ion class itself. We maintain the ordering as follows:
* Na, K, Cl. Everything expects this ordering to hold true, which probably isn't good.
*
* @memberof Cl
* @type {integer}
*/
Cl.id = 1;

/**
* Specifies the diameter of the particle ion type in question. Right now this is only
* being used by Container.js when creating a new random particle.
*
* @memberof Cl
* @type {integer}
*/
Cl.diameter = 15;

/**
* Used during initializer first startup/initialization to show or hide the ion.
* It SHOULD also be updated during runtime as the user ticks the boxes/switches
* between Goldman and Nernst mode, but I don't know if it actually stays
* synchronized with the object instance's display property.
*
* @memberof Cl
* @type {boolean}
*/
Cl.display = false;

/**
* This sets the color for the ion type. This color string is used for coloring the
* membrane channels to match the ion.
*
* @memberof Cl
* @type {p5.Color | string}
*/
Cl.color = "#CD5C5C";

/**
* Used for the ion label names in the simulator controls section.
*
* @memberof Cl
* @type {string}
*/
Cl.sign = "-";

/**
* Charge property used for computing Nernst & Goldman equations.
*
* @memberof Cl
* @type {integer}
*/
Cl.charge = -1;

/**
* Permeability property used for computing the Goldman equation.
*
* @memberof Cl
* @type {float}
*/
Cl.permeability = 0.1;

/**
* Number of Cl ions inside of the cell upon startup/initialization.
*
* @memberof Cl
* @type {integer}
*/
Cl.inside = 2;

/**
* Number of Cl ions outside of the cell upon startup/initialization.
*
* @memberof Cl
* @type {integer}
*/
Cl.outside = 1;

class K extends Particle {
  /**
  * The class representing K ions
  *
  *
  * @param {Point} _center - The starting position of the new Na Particle
  *
  * @param {Point} _vel - The input velocity is represented as a Point object
  *                       with (x, y) components.
  *
  * @param {boolean} _collidable - Determines if the particle will be impacted
  *                                 by collisions with Container objects.
  */
  constructor(_center, _vel, _collidable) {
    super(_center, K.diameter, _vel, _collidable, K.color, K.display);
    this.type = 'K';
  }
}

/**
* ID is a field used to index the ion class itself. We maintain the ordering as follows:
* Na, K, Cl. Everything expects this ordering to hold true, which probably isn't good.
*
* @memberof K
* @type {integer}
*/
K.id = 2;

/**
* Specifies the diameter of the particle ion type in question. Right now this is only
* being used by Container.js when creating a new random particle.
*
* @memberof K
* @type {integer}
*/
K.diameter = 15;

/**
* Used during initializer first startup/initialization to show or hide the ion.
* It SHOULD also be updated during runtime as the user ticks the boxes/switches
* between Goldman and Nernst mode, but I don't know if it actually stays
* synchronized with the object instance's display property.
*
* @memberof K
* @type {integer}
*/
K.display = false;

/**
* This sets the color for the ion type. This color string is used for coloring the
* membrane channels to match the ion.
*
* @memberof K
* @type {p5.Color | string}
*/
K.color = "#35B235";

/**
* Used for the ion label names in the simulator controls section.
*
* @memberof K
* @type {string}
*/
K.sign = "+";

/**
* Charge property used for computing Nernst & Goldman equations.
*
* @memberof K
* @type {integer}
*/
K.charge = 1;

/**
* Permeability property used for computing the Goldman equation.
*
* @memberof K
* @type {float}
*/
K.permeability = 1.0;

/**
* Number of K ions inside of the cell upon startup/initialization.
*
* @memberof K
* @type {integer}
*/
K.inside = 5;

/**
* Number of K ions outside of the cell upon startup/initialization.
*
* @memberof K
* @type {integer}
*/
K.outside = 3;

/**
* particleMapper is an object that can be used to convert a string representation
* of a specific ion type to its JavaScript class. It is used to instantiate a particle
* child class dynamically (without knowing if it will be a Na, Cl, or K).
*
*/
var particleMapper = {
  "Na": Na,
  "Cl": Cl,
  "K": K
}
