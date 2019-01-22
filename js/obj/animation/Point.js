class Point {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
  }

  draw() {
    stroke(255);
    point(this.x, this.y);
  }

  distance(p) {
    // input: another Point;
    // output: compute how far away P is from this
    var xdiff = this.x - p.x;
    var ydiff = this.y - p.y;
    var result = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff))
    return result;
  }
}
