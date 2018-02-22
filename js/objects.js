function Point (_x, _y) {
  this.x = _x;
  this.y = _y;
}

function Container (_tl, _tr, _br, _bl) {
  this.tl = _tl;
  this.tr = _tr;
  this.br = _br;
  this.bl = _bl;

  this.vertical = abs(_tr.x - _tl.x);
  this.horizontal = abs(_tl.y - _bl.y);

  this.draw = function() {
    rect( this.tl.x, this.tl.y, this.vertical, this.horizontal );
  }
}

function CellWall(_x,_y,_width,_height,_tl,_tr,_br,_bl) {
  this.x = _x;
  this.y = _y;
  this.width = _width;
  this.height = _height;

  this.draw = function() {
    fill(0)
    rect(this.x, this.y, this.width, this.height,_tl,_tr,_br,_bl);
  }
}
