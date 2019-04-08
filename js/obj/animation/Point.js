/**
* Class representing a point on the p5.js canvas.
*
* @example
* var p1 = new Point(5, 10);
*/
class Point {
  /**
   * Create a new point
   *
   * @param {number} x - Coordinate X value
   * @param {number} y - Coordinate Y value
   *
   */
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
  }

  /**
  * Function to draw the point on a p5js canvas.
  */
  draw() {
    stroke(255);
    point(this.x, this.y);
  }

  /**
  * Compute the Euclidean distance between this point and another point.
  *
  * @example <caption>Distance function</caption>
  * // create two points
  * var a = new Point(0, 0);
  * var b = new Point(3, 4);
  * var dist = a.distance(b); // returns 5
  * @param {Point} p - The external point whose distance from us we want to find.
  * @returns {number}
  */
  distance(p) {
    var xdiff = this.x - p.x;
    var ydiff = this.y - p.y;
    var result = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff))
    return result;
  }
}
