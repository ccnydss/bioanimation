class Channel {
  constructor(_tl, _tr, _br, _bl, _particle) {
    this.tl = _tl;
    this.tr = _tr;
    this.br = _br;
    this.bl = _bl;
    this.particle = _particle;
    this.height = abs(_tr.x - _tl.x);
    this.width = abs(_tl.y - _bl.y);
  }

  draw() {
    fill(particlesProperties[this.particle].color)
    rect(this.tl.x, this.tl.y, this.height, this.width)
  }

  isInTransferRange(p) {
    var thickness = 25;
    var entranceGap = 15;

    var gapTL = new Point(this.tl.x, this.tl.y - entranceGap);
    var gapTR = new Point(this.tl.x - 2 * thickness + 2 * this.width, this.tl.y - entranceGap);
    var gapBR = new Point(this.tl.x - 2 * thickness + 2 * this.width, this.tl.y + this.height + entranceGap);
    var gapBL = new Point(this.tl.x, this.tl.y + this.height + entranceGap);

    gapTL.draw();
    gapTR.draw();
    gapBR.draw();
    gapBL.draw();

    var pastyRange = (p.y + p.r >= gapTL.y) && (p.y - p.r <= gapBL.y);
    var pastxRange = (p.x + p.r >= gapTL.x) && (p.x - p.r <= gapTR.x);

    return pastxRange && pastyRange;

  }

  transfers(p) {
    var isInTransferRange = this.isInTransferRange(p);

    rect(this.tl.x - thickness, this.tl.y, this.height + 2 * thickness, this.width); //Gap
    fill('rgba(100,155,200, 0.9)')
    rect(this.tl.x - thickness, this.tl.y, this.height / 2, this.width); //Border left
    rect(this.tl.x + 2 * thickness, this.tl.y, this.height / 2, this.width); //Border Right
  }
}

class UIBox {
  constructor(_tl, _tr, _br, _bl) {
    this.tl = _tl;
    this.tr = _tr;
    this.br = _br;
    this.bl = _bl;

    this.height = abs(_tr.x - _tl.x);
    this.width = abs(_tl.y - _bl.y);
  }

  draw() {
    fill(100, 155, 180, 100);
    rect(this.tl.x, this.tl.y, this.height, this.width);
  }
}

var createChannels = function(tl, tr, br, bl, numOfChannels) {
  var channels = [];
  var offset = 30;
  var channelHeight = abs(tl.y - bl.y);
  var cellWallWidth = abs(tr.x - tl.x);
  for (var i = 1; i <= numOfChannels; i++) {
    // Get center x coordinate for cell wall
    var center = (i) * Math.floor(cellWallWidth / (numOfChannels + 1));
    // Get coordinates of channel rectangle
    var channelTL = new Point(center - offset, tl.y);
    var channelTR = new Point(center + offset, tr.y);
    var channelBR = new Point(center + offset, br.y);
    var channelBL = new Point(center - offset, bl.y);
    // Add new channel to channels array
    channels.push(new Channel(channelTL, channelTR, channelBR, channelBL, particleTypes[i - 1]));
  }
  return channels;
}
