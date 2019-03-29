/** Class representing a Rectangle on the p5.js canvas. */
class Rectangle {
  /**
   * Create a new Rectangle.
   *
   * @param {Object} _points - An object of 4 points with keys named
   * appropriately { _tl: p1, _tr: p2, _bl: p3, _br: p4}
   *
   * @param {Color|string} _fill_color - A p5 Color object, or a string that can be
   * converted to a color (ex: "#ff0000"). Acts as the color for the inside area.
   *
   * @param {Color|string} _border_color - A p5 Color object, or a string that can be
   * converted to a color. Determines the border color, if a border is drawn.
   */
  constructor(_points, _fill_color, _border_color) {
    /**
      * @private
      * @type {Color|string|boolean}
      */
    this.fill_color = _fill_color || false;

    /**
      * @private
      * @type {Color|string|boolean}
      */
    this.border_color = _border_color || false;

    /**
      * @private
      * @type {integer}
      */
    this.tl;

    /**
      * @private
      * @type {integer}
      */
    this.tr;

    /**
      * @private
      * @type {integer}
      */
    this.bl;

    /**
      * @private
      * @type {integer}
      */
    this.br;

    /**
      * @private
      * @type {integer}
      */
    this.width;

    /**
      * @private
      * @type {integer}
      */
    this.height;

    /**
      * @private
      * @type {integer}
      */
    this.center;

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
    var left_aligned = _bl.x == _tl.x;
    var right_aligned = _br.x == _tr.x;
    var top_aligned = _tl.y == _tr.y;
    var bot_aligned = _bl.y == _br.y;
    var valid_number = Object.keys(_points).length == 4;  // Count the number of points being sent in.

    var valid_rect = lefts && bottoms && left_aligned && right_aligned && top_aligned && bot_aligned && valid_number;

    if (!valid_rect) throw new Error("Invalid point inputs do not form rectangle", _points);

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
