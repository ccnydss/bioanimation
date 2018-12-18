class Container extends Rectangle {
  constructor(_points, _color, _id) {
    // Input:     Rectangle, a P5 color string, and "inside" | "outside"
    // Function:  Generate a new Container object with its properties.
    super(_points, _color);
    this.id = _id;
    this.label = this.createLabels(_id);
    this.particles = {
      "Na" : [],
      "Cl" : [],
      "K" : []
    };
  }

  draw() {
    super.draw();
    this.label.draw();

    for (var ptype in this.particles) {
      for ( const p of this.particles[ptype] ) {
        p.color();
        p.move(this);
      }
    }
  }

  addParticle(p) {
    var type = p.constructor.name;
    this.particles[type].push(p);
  }

  pushParticle(type) {

  }

  deleteParticle(index, type) {
    this.particles[type] = this.particles[type].splice()
  }

  createLabels(id) {
    return id == "outside" ? new Label(
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
