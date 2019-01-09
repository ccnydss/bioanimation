class Simulator {
  constructor() {
    this.m_pause = false;
    this.m_mode = "Nernst";
  }

  draw() {

  }

  pause() {
    this.m_pause = !this.m_pause;

    if (!this.m_pause) {
      loop();
      document.getElementById('simCanvasPause').style.display = "none";
    } else {
      noLoop();
      document.getElementById('simCanvasPause').style.display = "flex";
    }
  }

  keyInput() {
    var spacebar = 32;
    var Q_key = 81;
    var W_key = 87;

    switch (keyCode) {
      case spacebar:
        this.pause();
        break;

      case Q_key:
        animationSequencer.prev(false);
        updateAll();
        break;

      case W_key:
        animationSequencer.next(false);
        updateAll();
        break;
    }
  }
}
