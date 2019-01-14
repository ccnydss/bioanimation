// Purpose: Purely manage the rendering of HTML elements, only

class SimulatorDOM {
  constructor(sim) {
    this.m_sim = sim;

    this.m_sidebar_size_multiple = 0.35;  // Equation sidebar 35% height of the screen by default. Goes to 100% (1.0) when expanded
    this.m_sidebar_current = 0.35;        // Current value of the sidebar height

    this.m_canvas_size_multiple = 0.65;   // Canvas width and height will be 65% of the screen's width and height.

    this.m_canvas_width;
    this.m_canvas_height;

    this.m_buttons = {
      "plus": [],
      "minus": []
    };

    this.m_textboard = []
    this.m_inputs = []
    this.m_setting_fields = []
    this.m_equations = []
  }

  setup() {
    var ec = this.elementCreator;

    this.m_stage = ec("div", 'stage', 'flex-container', 'root', { content: '' });
    this.m_firstBox = ec("div", 'firstBox', '', 'stage', { content: '' });
    this.m_secondBox = ec("div", 'secondBox', '', 'stage', { content: '' });
  }

  elementCreator(element, id, className, parent, options={}) {
    var { content } = options;

    var elm = createElement(element, content);
    elm.id(id);
    elm.class(className);
    elm.parent(parent);

    return elm;
  }

  setSize(w, h) {
    this.m_canvas_width = w;
    this.m_canvas_height = h;
  }

  getSize() {
    return { width: this.m_canvas_width, height: this.m_canvas_height };
  }

  canvasCreate(w, h) {
    this.setSize(w, h);
    return createCanvas(w, h);
  }

  canvasSize(w, h, canvasDOM) {
    this.setSize(w, h);
    canvasDOM.size(w, h);
  }

  adjustUISize() {
    // input: Floats
    // usage: Resizing the question/equation window; 0.35 (including question), 1 (excluding question)
    var adjustedWindowHeight = windowHeight - 36;

    var newCanWidth = this.m_canvas_size_multiple * windowWidth;
    var newCanHeight = (this.m_canvas_size_multiple * adjustedWindowHeight) - 4;

    // Complement's width and height
    // aka, 0.35 multiplier instead of 0.65
    var compWidth = (1 - this.m_canvas_size_multiple) * windowWidth;
    var compHeight = (1 - this._canvas_size_multiple) * adjustedWindowHeight;

    var sideHeight = this.m_sidebar_current * adjustedWindowHeight;
    var compSideHeight = (1 - this.m_sidebar_current) * adjustedWindowHeight;

    this.m_stage.size(windowWidth, adjustedWindowHeight);
    this.m_firstBox.size(compWidth, adjustedWindowHeight);
    this.m_secondBox.size(newCanWidth, adjustedWindowHeight);

    questions.size(compWidth, compSideHeight);
    equationContainer.size(compWidth, sideHeight);

    leftBox.size(compWidth, compSideHeight);
    hideBar.size(compWidth, 20);
    equi.size(compWidth, 40);

    equation.size(compWidth, sideHeight - 40 - 20);
    simulator.size(newCanWidth, newCanHeight);

    simulatorInputContainer.size(newCanWidth, compHeight);

    simulatorInput.size(newCanWidth, 0.90 * newCanHeight);
    controlsLeft.size(newCanWidth / 2, 0.35 * newCanHeight);
    controlsRight.size(newCanWidth / 2, 0.35 * newCanHeight);
    particleControl.size(newCanWidth, 0.1 * 0.80 * adjustedWindowHeight);

    this.canvasSize (
      newCanWidth,
      newCanHeight,
      canvas
    );
  }
}
