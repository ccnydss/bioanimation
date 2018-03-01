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

  isInTransferRange(p) {
    var thickness = 25;
    var entranceGap = 15;

    var gapTL = new Point (this.tl.x, this.tl.y-entranceGap);
    var gapTR = new Point (this.tl.x-2*thickness + 2*this.horizontal, this.tl.y-entranceGap);
    var gapBR = new Point (this.tl.x-2*thickness + 2*this.horizontal, this.tl.y+this.vertical+entranceGap);
    var gapBL = new Point (this.tl.x, this.tl.y+this.vertical+entranceGap);

    gapTL.draw();
    gapTR.draw();
    gapBR.draw();
    gapBL.draw();

    var pastyRange = (p.y + p.r >= gapTL.y) && (p.y -p.r <= gapBL.y);
    var pastxRange = (p.x + p.r >= gapTL.x) && (p.x - p.r <= gapTR.x);

    return pastxRange && pastyRange;

  }

  transfers(p) {
    var isInTransferRange = this.isInTransferRange(p);
    if (isInTransferRange) {
      console.log(isInTransferRange);
    }
    // while (isInTransferRange) {
    //   // p.collidable = false;
    // }

    // p.collidable = true;

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
