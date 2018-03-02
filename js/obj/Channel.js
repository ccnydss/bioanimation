class Channel {
  constructor(_tl, _tr, _br, _bl) {
    this.tl = _tl;
    this.tr = _tr;
    this.br = _br;
    this.bl = _bl;

    this.vertical = abs(_tr.x - _tl.x);
    this.horizontal = abs(_tl.y - _bl.y);
  }

  draw() {
    var thickness = 25;

    rect( this.tl.x-thickness, this.tl.y, this.vertical+2*thickness, this.horizontal ); //Gap

    fill('rgba(100,155,200, 0.9)')
    rect( this.tl.x-thickness, this.tl.y, this.vertical/2, this.horizontal ); //Border left
    rect( this.tl.x+2*thickness, this.tl.y, this.vertical/2, this.horizontal ); //Border Right
  }
}

class UIBox {
  constructor(_tl, _tr, _br, _bl) {
    this.tl = _tl;
    this.tr = _tr;
    this.br = _br;
    this.bl = _bl;

    this.vertical = abs(_tr.x - _tl.x);
    this.horizontal = abs(_tl.y - _bl.y);
  }

  draw() {
    fill(100, 155, 180, 100);
    stroke(255, 0, 0);
    rect( this.tl.x, this.tl.y, this.vertical, this.horizontal );
  }
}
