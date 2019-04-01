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
  * Setting it to false would freeze all particles. This is useful for pausing
  * the simulation, as an example.
  *
  * @public
  * @param {boolean} [moveParticle=true] - Should the particles inside move
  *                                        every frame the Container is drawn?
  */
  draw( moveParticle=true ) {
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
  }

  addParticle(p, ptype) {
    var particle = p;
    var type = ptype;
    if (p) {
      type = p.constructor.name;
    } else {
      particle = this.createNewParticle(type);
      particle.setDisplay(true);
    }
    this.particles[type].push(particle);
  }

  deleteParticle(type, index=0) {
    var length = this.particles[type].length;
    this.particles[type].splice(index, 1);
  }

  createNewParticle(type, coordinates) {
    var xRange = this.tr.x - this.tl.x - 100;
    var yRange = this.br.y - this.tr.y - 100;

    var velocities = [-1, -1.25, 1.25, 1];
    var x_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
    var y_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;

    var velocity = createVector(velocities[x_vel], velocities[y_vel]);

    if (coordinates == null) {
      // Get random location
      var randomX = this.tl.x + particleMapper[type].diameter + (Math.floor(Math.random() * xRange));
      var randomY = this.tl.y + particleMapper[type].diameter + (Math.floor(Math.random() * yRange));

      coordinates = new Point(randomX, randomY);
    }

    return new particleMapper[type] (
      coordinates,
      velocity,
      true
    );
  }

  setParticleDisplays(type, bool) {
    for (const particle of this.particles[type]) {
      particle.setDisplay(bool);
    }
    particleMapper[type].display = bool;
  }

  countParticles(type) {
    return this.particles[type].length;
  }

  setSize(_points) {
    super.setSize(_points);
    if (this.name)
      this.label = this.createLabels();
  }

  createLabels() {
    return new Label (
      this.name,
      new Point(5, this.tl.y + 15),
      "#ffffff"
    );
  }
}

Container.INSIDE_COLOR = "#fffbea";
Container.OUTSIDE_COLOR = "#e3f8fc";
