class Container extends Rectangle {
  static INSIDE_COLOR() { return "#fffbea" };
  static OUTSIDE_COLOR() { return "#e3f8fc"};

  constructor(_points, _color, _id) {
    // Input:     Rectangle, a P5 color string, and "inside" | "outside"
    // Function:  Generate a new Container object with its properties.

    super(_points, _color);
    this.id = _id;
  }

  draw() {
    super.draw();

    if (this.id == "outside") {
      fill(255, 255, 255);
      rect(5, this.bl.y + 60, textWidth("Intracellular") + 10, 20);
      rect(5, 15, textWidth("Extracellular") + 10, 20);
      fill(50);
      text("Intracellular", 10, this.bl.y + 75);
      text("Extracellular", 10, 20 + 8);
    }
  }

  bounce(p) {
    // NOTE: Might make more sense to put this inside the Particle class,
    //      because this function modifies "p"s values.

    // Input: Particle
    // Function: Reverse velocity components when particle collides with wall

    var bl = this.bl;
    var br = this.br;
    var tl = this.tl;

    var nextPastBottom = function() {
      // Will particle cross bottom wall in next frame?
      return p.center.y + p.m_velocity.y + p.r > bl.y;
    }

    var nextPastTop = function() {
      // Will particle cross top wall in next frame?
      return p.center.y + p.m_velocity.y - p.r < tl.y;
    }

    var nextPastRight = function() {
      // Will particle cross right wall in next frame?
      return p.center.x + p.m_velocity.x + p.r > br.x;
    }

    var nextPastLeft = function() {
      // Will particle cross left wall in next frame?
      return p.center.x + p.m_velocity.x - p.r < bl.x;
    }

    p.computeNewDirection(nextPastBottom, false, true);
    p.computeNewDirection(nextPastTop, false, true);
    p.computeNewDirection(nextPastRight, true, false);
    p.computeNewDirection(nextPastLeft, true, false);

    // Begin moving the particle in the newly set direction
    p.moveCenter();
  }
}
