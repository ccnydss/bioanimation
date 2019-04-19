/**
* Container classes are Rectangles that define particle boundaries.
* They maintain internal lists of particles and particles waiting to be
* transferred out, as well as a label.
*
*/
class Container extends Rectangle {
  /**
   * Create a new Rectangle.
   *
   * @param {Object} _points - An object of 4 points with keys named
   * appropriately { _tl: p1, _tr: p2, _bl: p3, _br: p4}
   *
   * @param {Color|string} _color - A p5 Color object, or a string that can be
   * converted to a color (ex: "#ff0000"). Acts as the color for the inside area.
   *
   * @param {string} _id - Must be either "inside" or "outside".
   */
  constructor(_points, _color, _id) {
    if (_id != "inside" && _id != "outside") {
      throw new Error("Invalid Container ID: " + _id);
    }

    super(_points, _color);

    /**
      * @public
      * @type {string}
      */
    this.id = _id;

    /**
      * @public
      * @type {string}
      */
    this.name = _id == "inside" ? "Intracellular" : "Extracellular";

    /**
      * @private
      * @type {Label}
      */
    this.label = this.createLabels();

    /**
      * @private
      * @type {Object}
      */
    this.particles = {
      "Na" : [],
      "Cl" : [],
      "K" : []
    };

    /**
      * @private
      * @type {Object}
      */
    this.transfers = {
      "Na" : [],
      "Cl" : [],
      "K" : []
    };
  }

  /**
  * The Container draw function. We may supply a boolean to move each particle
  * inside this Container or to draw them without moving. By default, the
  * Container will move each particle inside of it.
  *
  * Changing the default will cause the particles to freeze, as that is not the norm. This is useful for pausing
  * the simulation, as an example.
  *
  * @public
  * @param {boolean} [moveParticle=true] - Should the particles inside move
  *                                        every frame the Container is drawn?
  */
  draw( moveParticle=true ) {
    fps.start('container')
    super.draw();
    this.label.draw();

    for (var ptype in this.particles) {
      for ( const p of this.particles[ptype] ) {
        p.color();

        if (moveParticle) p.move(this);
        else p.draw();
      }

      for ( const t of this.transfers[ptype] ) {
        t.color();

        if (moveParticle) t.move(this);
        else t.draw();
      }
    }
      fps.end('container')
  }

  /**
  * Add particle is the method to use for inserting a new particle into this
  * Container. If `p` is not supplied, then a random particle of type `ptype` is
  * created instead.
  *
  * @public
  * @param {Particle} p - The input particle to add to the Container. If null,
  *                       then the function looks at `ptype`.
  * @param {string} ptype - The type ("Na", "Cl", "K") of particle that should
  *                       be added to the container. If using this option, p
  *                       MUST be set to `null`.
  *
  * @example <caption>Add a particle to my_container from p</caption>
  *var my_particle = // ... create a particle
  *var my_container = // ... create a container
  *
  *  my_container.addParticle(my_particle);
  *
  * @example <caption>Add a potassium ion to my_container</caption>
  *var my_container = // ... create a container
  *
  *  my_container.addParticle(null, "K");
  */
  addParticle(p, ptype) {
    var particle = p;
    var type = ptype;

    if (p) {
      type = p.constructor.name;
    } else {
      particle = this.createNewParticle(type);
    }
    this.particles[type].push(particle);
  }
  /**
  * Delete particle will remove the particle of type "type" at the supplied index
  * in the Container's array.
  *
  * @public
  * @param {string} type - Particle types to delete.
  * @param {integer} [index=0] - Which particle to delete, defaults to the first.
  *
  * @example <caption>Delete a particle from my_container from p</caption>
  *var my_particle = // creates a particle
  *var my_container = // creates a container
  *
  *  my_container.deleteParticle(my_particle);
  *
  * @example <caption>Delete a sodium ion from my_container</caption>
  *var my_container = // ... creates the container
  *
  *  my_container.deleteParticle(null, 0); // deletes the first one
  *
  */

  deleteParticle(type, index=0) {
    var length = this.particles[type].length;
    this.particles[type].splice(index, 1);
  }

  /**
  * Create a particle of type "type" heading in a random direction, at
  * supplied coordinates.
  *
  * @public
  * @param {string} type - The name of the type of particle to create.
  * @param {Point | null} coordinates - The coordinates to put the particle.
  *                                     Leave blank for random.
  * @returns {Particle}
  *
  * @example
  * var sodium = // creates a particle, in this case sodium
  *
  * sodium_createNewParticle("Na",coordinates); // creates the particle, Na, allowing it to move in random directions
  */


  createNewParticle(type, coordinates) {
    var velocities = [-1, -1.25, 1.25, 1];
    var x_vel = Math.floor(Math.random() * (velocities.length - 1));
    var y_vel = Math.floor(Math.random() * (velocities.length - 1));

    var velocity = createVector(velocities[x_vel], velocities[y_vel]);

    if (coordinates == null) {
      var x_range = this.tr.x - this.tl.x - 100;
      var y_range = this.br.y - this.tr.y - 100;
      // Get random location
      var randomX = this.tl.x + particleMapper[type].diameter + (Math.floor(Math.random() * x_range));
      var randomY = this.tl.y + particleMapper[type].diameter + (Math.floor(Math.random() * y_range));

      coordinates = new Point(randomX, randomY);
    }

    return new particleMapper[type] (
      coordinates,
      velocity,
      true
    );
  }

  /**
  * Sets the display property of all particles of the supplied type inside the
  * Container.
  *
  * @public
  * @param {string} type - The name of the type of particle to create.
  * @param {boolean} bool - The display setting to use.
  *
  * @example
  *var my_particle = // creates the particle
  *
  *my_particle.setParticleDisplays(type, bool)
  */
  setParticleDisplays(type, bool) {
    if (typeof bool != "boolean") throw new Error("Bool must be true or false.");

    for (const particle of this.particles[type]) {
      particle.setDisplay(bool);
    }
  }

  /**
  * Returns the number of particles of the supplied type inside the Container.
  *
  * @public
  * @param {string} type - The name of the particle type.
  *
  * @returns {integer}
  */

  countParticles(type) {
    return this.particles[type].length;
  }

  /**
  * Set the Container size.
  *
  * @public
  * @param {Object} _points - A set of 4 points that dictate the new size of the
  *                           Container.
  *
  * @example
  * var rectangle= // create your container or Object
  *
  * rectangle.setSize(_points) // gives four points that sets size of container
  */

  setSize(_points) {
    super.setSize(_points);
    if (this.name) this.label = this.createLabels();
  }

  /**
  * Create the label for this Container based off of its name.
  *
  * @private
  * @returns {Label}
  */
  createLabels() {
    return new Label (
      this.name,
      new Point(5, this.tl.y + 15),
      "#ffffff"
    );
  }
}

/**
 * Define the color inside of the cell.
 *
 * @memberof Container
 * @static
 * @type {string}
 */
Container.INSIDE_COLOR = "#fffbea";

/**
 * Define the color of the outside of the cell.
 *
 * @memberof Container
 * @static
 * @type {string}
 */
Container.OUTSIDE_COLOR = "#e3f8fc";
