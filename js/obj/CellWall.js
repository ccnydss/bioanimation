class CellWall {
  constructor(_x, _y, _width, _height, _tl, _tr, _br, _bl) {
    this.x = _x;
    this.y = _y;
    this.width = _width;
    this.height = _height;

    this.tl = _tl;
    this.tr = _tr;
    this.br = _br;
    this.bl = _bl;
  }

  draw() {
    fill(0)
    rect(this.x, this.y, this.width, this.height, this.tl, this.tr, this.br, this.bl);
  }
}
