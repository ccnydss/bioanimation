class Rectangle {
  constructor(_tl, _tr, _br, _bl) {
    // Add verification to make sure that top left, top right, bot right, bot left form a proper rectangle
    var lefts = (_tl.x < _tr.x) && (_bl.x < _br.x);
    var bottoms = (_bl.y > _tl.y) && (_br.y > _tr.y);
    var leftAligned = _bl.x == _tl.x;
    var rightAligned = _br.x == _tr.x;
    var topAligned = _tl.y == _tr.y;
    var botAligned = _bl.y == _br.y;

    var validRect = lefts && bottoms && leftAligned && rightAligned && topAligned && botAligned;

    if (!validRect) throw new Error("Invalid point inputs do not form rectangle");

    this.tl = _tl;
    this.tr = _tr;
    this.br = _br;
    this.bl = _bl;
    this.height = Math.abs(_tr.x - _tl.x);
    this.width = Math.abs(_tl.y - _bl.y);
  }
}
