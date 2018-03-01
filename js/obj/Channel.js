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

  fill(180, 180, 180, 255);
    //fill(color(255, 204, 0));
  rect( this.tl.x-thickness, this.tl.y, this.vertical+2*thickness, this.horizontal ); //Gap

  fill('rgba(0,255,0, 0.25)')
  rect( this.tl.x-thickness, this.tl.y, this.vertical/2, this.horizontal ); //Border left
  rect( this.tl.x+2*thickness, this.tl.y, this.vertical/2, this.horizontal ); //Border Right
    // stroke(51);
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

    fill(180, 180, 180, 255);
    rect( this.tl.x, this.tl.y, this.vertical, this.horizontal );
    }
  }
