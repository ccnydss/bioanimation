/** Class representing a Rectangle on the p5.js canvas. */
class Rectangle {
  /**
   * Create a new Rectangle.
   *
   * @param {Object} _points - An object of 4 points with keys named
   * appropriately { _tl: p1, _tr: p2, _bl: p3, _br: p4}
   *
   * @param {Color|string} _fillColor - A p5 Color object, or a string that can be
   * converted to a color (ex: "#ff0000"). Acts as the color for the inside area.
   *
   * @param {Color|string} _borderColor - A p5 Color object, or a string that can be
   * converted to a color. Determines the border color, if a border is drawn.
   */
  constructor(_points, _fillColor, _borderColor) {
    /** @protected */
    this.fill_color = _fillColor || false;

    /** @protected */
    this.border_color = _borderColor || false;

    /** @private
      * @type {int}
      */
    this.tl;

    /** @private */
    this.tr;

    /** @private */
    this.bl;

    /** @private */
    this.br;

    /** @private */
    this.width;

    /** @private */
    this.height = Math.abs(_tl.y - _bl.y);

    /** @private */
    this.center = new Point(this.width / 2, this.height / 2);

    this.setSize(_points);
  }

  /**
   * Function to draw the Rectangle on a p5.js canvas.
   */
  draw() {
    if (this.fill_color) fill(this.fill_color);
    if (this.border_color) stroke(this.border_color);
    rect(this.tl.x, this.tl.y, this.width, this.height);
  }

  /**
   * Set the fill Color of the Rectangle
   * @public
   * @param {Color} color - A p5 Color object or color string.
   */
  setColor(color) {
    this.fill_color = color;
  }

  /**
   * Get the fill Color of the Rectangle
   * @public
   *
   * @returns {Color} A p5 Color object or color string.
   */
  color() {
    return this.fill_color;
  }

  /**
   * Resize the Rectangle. Does not allow defining the size in terms of
   * length/width
   *
   * @public
   * @param {Object} _points - An object of 4 points with keys named
   * appropriately { _tl: p1, _tr: p2, _bl: p3, _br: p4}
   */
  setSize(_points) {
    var { _tl, _tr, _bl, _br } = _points;  // Destructure points object

    // Test multiple conditions to see if rectangle is valid.
    var lefts = (_tl.x < _tr.x) && (_bl.x < _br.x);
    var bottoms = (_bl.y > _tl.y) && (_br.y > _tr.y);
    var leftAligned = _bl.x == _tl.x;
    var rightAligned = _br.x == _tr.x;
    var topAligned = _tl.y == _tr.y;
    var botAligned = _bl.y == _br.y;
    var validNumber = Object.keys(_points).length == 4;  // Count the number of points being sent in.

    var validRect = lefts && bottoms && leftAligned && rightAligned && topAligned && botAligned && validNumber;

    if (!validRect) throw new Error("Invalid point inputs do not form rectangle", _points);

    this.tl = _tl;
    this.tr = _tr;
    this.bl = _bl;
    this.br = _br;
    this.width = Math.abs(_tr.x - _tl.x);
    this.height = Math.abs(_tl.y - _bl.y);
    this.center = new Point(this.width / 2, this.height / 2);
  }
}

/** Construct a Rectangle from width/height specifications
 * @memberof Rectangle
 * @param {Point} _corner - Top left corner for the new Rectangle
 * @param {integer} _width - The width, in pixels, of the Rectangle
 * @param {integer} _height - The height, in pixels, of the Rectangle
 * @param {Color} _fill - A p5 Color object or string
 * @param {Color} _border - A p5 Color object or string
 *
 * @returns {Rectangle}
 */
Rectangle.fromDimensions = function (_corner, _width, _height, _fill, _border) {
  var _tl = new Point(_corner.x, _corner.y);
  var _tr = new Point(_corner.x + _width, _corner.y);
  var _br = new Point(_corner.x + _width, _corner.y + _height);
  var _bl = new Point(_corner.x, _corner.y + _height);
  var points = { _tl, _tr, _br, _bl };

  return new Rectangle(
    points,
    _fill,
    _border
  );
}
