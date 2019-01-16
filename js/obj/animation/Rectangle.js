class Rectangle {
  constructor(_points, _fillColor, _borderColor) {
    this.setSize(_points);

    this.fill_color = _fillColor || false;
    this.border_color = _borderColor || false;
  }

  draw() {
    if (this.fill_color) fill(this.fill_color);
    if (this.border_color) stroke(this.border_color);
    rect(this.tl.x, this.tl.y, this.width, this.height);
  }

  setColor(color) {
    this.fill_color = color;
  }

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

    if (!validRect) throw new Error("Invalid point inputs do not form rectangle", points);

    this.tl = _tl;
    this.tr = _tr;
    this.bl = _bl;
    this.br = _br;
    this.width = Math.abs(_tr.x - _tl.x);
    this.height = Math.abs(_tl.y - _bl.y);
    this.center = new Point(width / 2, height / 2);
  }
}

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
