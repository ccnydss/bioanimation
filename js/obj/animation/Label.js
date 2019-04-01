/**
* Label class is used to label Containers in the canvas.
* The foreground text is always black.
*/
class Label extends Rectangle {
  /**
  * @param {string} _text - Text string to display.
  * @param {Point} _offset - The top-left corner for the label to be rendered at.
  * @param {Color | string} _bgcolor - The p5.Color object or string to use to color the label background.
  */
  constructor(_text, _offset, _bgcolor) {
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

    /**
      * @private
      * @type {string}
      */
    this.text = _text;
  }

  /**
  * The draw function for the label.
  */
  draw() {
    super.draw();

    fill(50);
    text(this.text, 10, this.tl.y + (this.height / 1.3));
  }
}
