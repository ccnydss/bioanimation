// Purpose: Purely manage the rendering of HTML elements, only

class SimulatorDOM {
  constructor(sim) {
    this.m_sim = sim;

    this.m_sidebar_size_multiple = 0.35;  // Equation sidebar 35% height of the screen by default. Goes to 100% (1.0) when expanded
    this.m_sidebar_current = 0.35;        // Current value of the sidebar height

    this.m_canvas_size_multiple = 0.65;   // Canvas width and height will be 65% of the screen's width and height.

    this.m_questionHeader = "Goldman-Hodgkin-Katz";

    this.m_canvas_width;
    this.m_canvas_height;

    this.m_equationResult = 0;

    this.m_sim_controls = new SimulatorInputs(this);

    this.m_settings = [] // Array of settings HTML fields, to replace 'simSetting'
  }

  setup() {
    var ec = elementCreator;

    this.m_stage = ec("div", 'stage', 'root', { className: 'flex-container' });
    this.m_firstBox = ec("div", 'firstBox', 'stage');
    this.m_secondBox = ec("div", 'secondBox', 'stage');

    // The right sidebar for displaying questions.
    this.m_leftBox = ec("div", 'leftbar', 'firstBox');
    this.m_sim.renderUI("leftbar", true);

    // Create the div to actually contain the questions.
    this.m_questions = ec("div", 'questionsdiv', 'leftbar');
    this.m_questionTitle = ec("h3", 'questionTitle', 'questionsdiv', { content: this.m_questionHeader })

    var questionsText = "Calculate the equilibrium potential for Na and K using the Nernst equation for the following conditions";
    this.m_question = ec("p", 'q1', 'questionsdiv', { className: 'questions', content: questionsText });

    // Div to contain the equation
    this.m_equationContainer = ec("div", 'equationContainer', 'firstBox');

    // The right sidebar for displaying questions.
    this.m_hideBar = ec("div", 'hidebar', 'equationContainer', { mousePressed: this.hideQuestion.bind(this) });
    this.m_hideBarText = ec("div", 'hidebarText', 'hidebar', { content: "<" });

    this.m_equation = ec("div", 'equationdiv', 'equationContainer');
    this.m_equation.child('NernstEqn');   // Attach nernst equation, defined in sketch.html with id 'NernstEqn'
    this.m_equation.child('GoldmanEqn');  // Same as nersnt, with goldman

    this.m_equi = ec("button", 'equilibrate-button', 'equationContainer', { content: "Equilibrate", mousePressed: startEquilibrate });

    this.m_simulatorSetting = ec("div", 'simulatorSetting', 'equationdiv', { content: "Simulation Settings" })
    this.m_sim.renderUI('simulatorSetting',false);

    this.m_settingTable = ec("div", 'setting', 'simulatorSetting', { className: 'setting' });
    this.m_sim.renderUI("setting", false);

    this.makeTable (
      "NernstSetting",
      "setting",
      ["T"],
      ["Enter Temperature..."],
      ["K"],
      [mainSim.m_settings.temperature]
    );

    this.makeTable (
      "GoldmanSetting",
      "setting",
      ["p<sub>Na</sub>", "p<sub>Cl</sub>", "p<sub>K</sub>"],
      ["Enter Na permeability...","Enter Cl permeability...","Enter K permeability..."],
      ["", "", ""],
      [Na.permeability, Cl.permeability, K.permeability]
    );

    // Plot window
    this.m_dataPlot = document.createElement("canvas");
    this.m_dataPlot.id = 'dataPlot';
    this.m_equation.child(this.m_dataPlot);
    this.m_sim.renderUI('dataPlot',false);

    var self=this;
    this.m_simulator = ec("div", 'sim', 'secondBox');
    this.m_simulator.mouseOver(function(e, x=true) { self.showPause(x) });
    this.m_simulator.mouseOut(function(e, x=false) { self.showPause(x) });

    this.m_simCanvasPause = ec("div", 'simCanvasPause', 'sim', { content: "Paused" });
    this.m_simCanvasPause.style('display', 'none');

    this.m_simCanvasFrame = ec("div", 'simCanvasFrame', 'sim')
    this.m_simCanvasPauseIcon = ec("div", 'simCanvasPauseIcon', 'simCanvasFrame', { content: "❚❚"})
    document.getElementById('simCanvasFrame').style.display = "none";
    document.getElementById("simCanvasPauseIcon").onclick = function() {mainSim.pause()};

    // Now to create the canvas
    this.m_canvas = this.canvasCreate(this.m_simulator.size().width, this.m_simulator.size().height - 8);
    this.m_canvas.id ('can');
    this.m_canvas.parent('sim');

    this.m_sim_controls.setup();
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

  canvasSize(w, h) {
    this.setSize(w, h);
    this.m_canvas.size(w, h);
  }

  showPause(option) {
    this.m_sim.renderUI("simCanvasFrame", option)
  }

  hideQuestion(evt) {
    // input: the element that triggered the event (hide buttons [arrow]);
    var show = this.m_sim.questionsAreHidden(); // Check if the questions are already hidden. If TRUE, we should show them. If FALSE, we should hide them.
    var hide = !show;

    //Turn the question menu off
    this.m_sim.renderUI("hidebarText", hide)
    this.m_sim.renderUI("simulatorSetting", hide)

    var curUI = (this.m_sim.simMode() == "Nernst") ? "NernstSetting" : "GoldmanSetting"
    this.m_sim.renderUI(curUI, hide)

    this.m_sim.renderUI("dataPlot", hide)

    this.m_sim.redrawUI(show);
  }

  adjustUISize() {
    // input: Floats
    // usage: Resizing the question/equation window; 0.35 (including question), 1 (excluding question)
    var adjustedWindowHeight = windowHeight - 36;

    var newCanWidth = this.m_canvas_size_multiple * windowWidth;
    var newCanHeight = (this.m_canvas_size_multiple * adjustedWindowHeight) - 4;

    this.canvasSize (
      newCanWidth,
      newCanHeight
    );
  }

  // NOTE: create a single "toggleParticleID()" method
  disableParticleID(id) {
    this.m_sim_controls.controls.inside.rows[id].enable(false);
    this.m_sim_controls.controls.outside.rows[id].enable(false);
  }

  enableParticleID(id) {
    this.m_sim_controls.controls.inside.rows[id].enable(true);
    this.m_sim_controls.controls.outside.rows[id].enable(true);
  }

  makeTable(id, parent, content, placeholder, contentUnit, contentDefaultValue, prevLength) {
    var settingPart = elementCreator("div", id, parent);

    var tableRow = content.length;

    for (var i = 0; i < tableRow; i++) {
      var trow = elementCreator("tr", '', settingPart);
      var td0 = elementCreator("label", '', trow, { content: content[i]} );

      var inputElement = elementCreator("input", this.m_settings.length, trow);
      inputElement.value(contentDefaultValue[i]);
      inputElement.attribute('placeholder', placeholder[i]);
      inputElement.input(this.m_sim.changeSimulatorSettings.bind(this.m_sim));

      this.m_settings.push(inputElement);

      var td3 = elementCreator("div", '', trow, { content: contentUnit[i] });

      if (contentUnit[i]) {
        td3.addClass('unit');
      }
    }
  }
}
