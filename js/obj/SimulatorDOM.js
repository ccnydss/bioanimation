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

    this.m_stage = ec("div", 'stage', 'root', { className: 'flex-container' });
    this.m_firstBox = ec("div", 'firstBox', 'stage');
    this.m_secondBox = ec("div", 'secondBox', 'stage');

    // The right sidebar for displaying questions.
    this.m_leftBox = ec("div", 'leftbar', 'firstBox');
    this.m_sim.renderUI("leftbar",true)

    // Create the div to actually contain the questions.
    this.m_questions = ec("div", 'questionsdiv', 'leftbar');
    this.m_questionTitle = ec("h3", 'questionTitle', 'questionsdiv', { content: 'Goldman-Hodgkin-Katz' })

    var questionsText = "Calculate the equilibrium potential for Na and K using the Nernst equation for the following conditions";
    this.m_question = ec("p", 'q1', 'questionsdiv', { className: 'questions', content: questionsText });

    // Div to contain the equation
    this.m_equationContainer = ec("div", 'equationContainer', 'firstBox');

    // The right sidebar for displaying questions.
    this.m_hideBar = ec("div", 'hidebar', 'equationContainer', { mousePressed: hideQuestion });
    this.m_hideBarText = ec("div", 'hidebarText', 'hidebar', { content: "<" });
    this.m_equation = ec("div", 'equationdiv', 'equationContainer');
    this.m_equi = ec("button", 'equilibrate-button', 'equationContainer', { content: "Equilibrate", mousePressed: startEquilibrate });

    this.m_simulatorSetting = ec("div", 'simulatorSetting', 'equationdiv', { content: "Simulation Settings" })
    this.m_sim.renderUI('simulatorSetting',false);

    // Plot window
    this.m_dataPlot = document.createElement("canvas");
    this.m_dataPlot.id = 'dataPlot';

    document.querySelector('#equationdiv').appendChild(this.m_dataPlot);
    this.m_sim.renderUI('dataPlot',false);


    this.m_simulator = ec("div", 'sim', 'secondBox');
    this.m_simulator.size(0.65 * windowWidth, 0.65 * (windowHeight - 36));

    this.m_simCanvasPause = ec("div", 'simCanvasPause', 'sim', { content: "Paused" });

    this.m_simCanvasFrame = ec("div", 'simCanvasFrame', 'sim')
    this.m_simCanvasPauseIcon = ec("div", 'simCanvasPauseIcon', 'simCanvasFrame', { content: "❚❚"})

    // Now to create the canvas
    this.m_canvas = this.canvasCreate(this.m_simulator.size().width, this.m_simulator.size().height - 8);
    this.m_canvas.id ('can');
    this.m_canvas.parent('sim');
  }

  elementCreator(element, eid, parent, options = { content: '', className: '', mousePressed: null }) {
    var { content, className, mousePressed } = options;

    var elm = createElement(element, content);
    elm.id(eid);
    elm.class(className);
    elm.parent(parent);

    if (mousePressed) {
      elm.mousePressed(mousePressed);
    }

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

  // canvasSize(w, h) {
  //   this.setSize(w, h);
  //   this.m_canvas.size(w, h);
  // }


// function showPause(option) {
// renderUI("simCanvasFrame",option)
// }

  adjustUISize() {
    // input: Floats
    // usage: Resizing the question/equation window; 0.35 (including question), 1 (excluding question)
    var adjustedWindowHeight = windowHeight - 36;

    var newCanWidth = this.m_canvas_size_multiple * windowWidth;
    var newCanHeight = (this.m_canvas_size_multiple * adjustedWindowHeight) - 4;

    // Complement's width and height
    // aka, 0.35 multiplier instead of 0.65
    // var compWidth = (1 - this.m_canvas_size_multiple) * windowWidth;
    // var compHeight = (1 - this.m_canvas_size_multiple) * adjustedWindowHeight;
    //
    // var sideHeight = this.m_sidebar_current * adjustedWindowHeight;
    // var compSideHeight = (1 - this.m_sidebar_current) * adjustedWindowHeight;
    //
    // this.m_stage.size(windowWidth, adjustedWindowHeight);
    // this.m_firstBox.size(compWidth, adjustedWindowHeight);
    // this.m_secondBox.size(newCanWidth, adjustedWindowHeight);
    //
    // this.m_questions.size(compWidth, compSideHeight);
    // this.m_equationContainer.size(compWidth, sideHeight);
    //
    // this.m_leftBox.size(compWidth, compSideHeight);
    //
    // this.m_hideBar.size(compWidth, 20);
    // this.m_equi.size(compWidth, 40);
    //
    // this.m_equation.size(compWidth, sideHeight - 40 - 20);
    // this.m_simulator.size(newCanWidth, newCanHeight);
    //
    // simulatorInputContainer.size(newCanWidth, compHeight);

    // simulatorInput.size(newCanWidth, 0.50 * newCanHeight);
    // controlsLeft.size(newCanWidth / 2, 0.35 * newCanHeight);
    // controlsRight.size(newCanWidth / 2, 0.35 * newCanHeight);
    // particleControl.size(newCanWidth, 0.1 * 0.80 * adjustedWindowHeight);

    this.canvasSize (
      newCanWidth,
      newCanHeight
    );
  }
}
