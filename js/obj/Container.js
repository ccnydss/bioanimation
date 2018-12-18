class Container extends Rectangle {
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
}

Container.INSIDE_COLOR = "#fffbea";
Container.OUTSIDE_COLOR = "#e3f8fc";
