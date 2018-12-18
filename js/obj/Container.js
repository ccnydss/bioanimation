class Container extends Rectangle {
  constructor(_points, _color, _id) {
    // Input:     Rectangle, a P5 color string, and "inside" | "outside"
    // Function:  Generate a new Container object with its properties.

    super(_points, _color);
    this.id = _id;

    if (_id == "inside") {
      this.label = new Label(
        "Intracellular",
        new Point(5, this.tl.y + 10),
        "#ffffff"
      );
    } else if (_id == "outside" ) {
      this.label = new Label(
        "Extracellular",
        new Point(5, 15),
        "#ffffff"
      )
    }
  }

  draw() {
    super.draw();
    this.label.draw();
  }
}

Container.INSIDE_COLOR = "#fffbea";
Container.OUTSIDE_COLOR = "#e3f8fc";
