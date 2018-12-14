class Rectangle {
  constructor(_points, _fillColor, _borderColor) {
    // Add verification to make sure that top left, top right, bot right, bot left form a proper rectangle
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
    this.br = _br;
    this.bl = _bl;
    this.height = Math.abs(_tr.x - _tl.x);
    this.width = Math.abs(_tl.y - _bl.y);

    this.fill_color = _fillColor || false;
    this.border_color = _borderColor || false;
  }

  draw() {
    if (this.fill_color) fill(this.fill_color);
    if (this.border_color) stroke(this.border_color);
    rect(this.tl.x, this.tl.y, this.height, this.width);
  }
}
