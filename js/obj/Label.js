class Label extends Rectangle {
  constructor(_text, _offset, _bgcolor) {
    // label text, (X, Y) position, and background color
    var width = textWidth(_text) + 10;
    var height = 20;

    var rect = new Rectangle.fromDimensions(_offset, width, height);
    var points = {
      _tl: rect.tl,
      _tr: rect.tr,
      _br: rect.br,
      _bl: rect.bl
    }

    super(points, _bgcolor)
    this.text = _text;
  }

  draw() {
    super.draw();

    fill(50);
    text(this.text, 10, this.tl.y + (this.height / 1.3));
  }
}
