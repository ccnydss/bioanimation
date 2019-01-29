class Container extends Rectangle {
  constructor(_points, _color, _id) {
    // Input:     Rectangle, a P5 color string, and "inside" | "outside"
    // Function:  Generate a new Container object with its properties.
    super(_points, _color);
    this.id = _id;
    this.label = this.createLabels();
    this.particles = {
      "Na" : [],
      "Cl" : [],
      "K" : []
    };
  }

  draw(drawOnce=false) {
    super.draw();
    this.label.draw();

    for (var ptype in this.particles) {
      for ( const p of this.particles[ptype] ) {
        p.color();
        
        if (drawOnce) p.draw();
        else p.move(this);
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

  createNewParticle(type) {
    var xRange = this.tr.x - this.tl.x - 100;
    var yRange = this.br.y - this.tr.y - 100;

    var velocities = [-1, -1.25, 1.25, 1];
    var x_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
    var y_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;

    var velocity = createVector(velocities[x_vel], velocities[y_vel]);

    // Get random location
    var randomX = this.tl.x + particleMapper[type].diameter + (Math.floor(Math.random() * xRange));
    var randomY = this.tl.y + particleMapper[type].diameter + (Math.floor(Math.random() * yRange));

    return new particleMapper[type](
      new Point(randomX, randomY),
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
    this.label = this.createLabels();
  }

  createLabels() {
    return this.id == "outside" ? new Label(
      "Extracellular",
      new Point(5, 15),
      "#ffffff"
    ) : new Label(
      "Intracellular",
      new Point(5, this.tl.y + 10),
      "#ffffff"
    );
  }
}

Container.INSIDE_COLOR = "#fffbea";
Container.OUTSIDE_COLOR = "#e3f8fc";
