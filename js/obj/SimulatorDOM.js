// Purpose: Purely manage the rendering of HTML elements, only

class SimulatorDOM {
  constructor(sim) {
    this.m_sim = sim;

    this.m_sidebar_size_multiple = 0.35;  // Equation sidebar 35% height of the screen by default. Goes to 100% (1.0) when expanded
    this.m_sidebar_current = 0.35;        // Current value of the sidebar height

    this.m_canvas_size_multiple = 0.65;   // Canvas width and height will be 65% of the screen's width and height.

    this.m_canvas_width;
    this.m_canvas_height;

    this.m_controls = [];
    this.m_checkboxes = [];

    this.m_buttons = {
      "plus": [],
      "minus": []
    };

    this.m_equationResult = 0;

    this.m_textboard = []
    this.m_inputs = []
    this.m_setting_fields = []
  }

  addCheckbox(checkbox) {
    this.m_checkboxes.push(checkbox);
  }

  checkbox(index, bool=null) {
    console.log()
    if (bool != null) {
      this.m_checkboxes[index].checked(bool);
    } else {
      return this.m_checkboxes[index].checked();
    }
  }

  setup() {
    var ec = this.elementCreator;

    this.m_stage = ec("div", 'stage', 'root', { className: 'flex-container' });
    this.m_firstBox = ec("div", 'firstBox', 'stage');
    this.m_secondBox = ec("div", 'secondBox', 'stage');

    // The right sidebar for displaying questions.
    this.m_leftBox = ec("div", 'leftbar', 'firstBox');
    this.m_sim.renderUI("leftbar", true);

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

    renderMathEqn();

    this.m_equi = ec("button", 'equilibrate-button', 'equationContainer', { content: "Equilibrate", mousePressed: startEquilibrate });

    this.m_simulatorSetting = ec("div", 'simulatorSetting', 'equationdiv', { content: "Simulation Settings" })
    this.m_sim.renderUI('simulatorSetting',false);

    this.m_settingTable = ec("div", 'setting', 'simulatorSetting', { className: 'setting' });
    this.m_sim.renderUI("setting", false);

    makeTable (
      "NernstSetting",
      "setting",
      ["T"],
      ["Enter Temperature..."],
      ["K"],
      [mainSim.m_settings.temperature]
    );

    makeTable (
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
    document.querySelector('#equationdiv').appendChild(this.m_dataPlot);
    this.m_sim.renderUI('dataPlot',false);

    this.m_simulator = ec("div", 'sim', 'secondBox');
    this.m_simulator.size(0.65 * windowWidth, 0.65 * (windowHeight - 36));

    this.m_simCanvasPause = ec("div", 'simCanvasPause', 'sim', { content: "Paused" });
    document.getElementById('simCanvasPause').style.display = "none";

    var self = this;
    document.getElementById("sim").addEventListener("mouseover", function(e, x=true) { self.showPause(x) });
    document.getElementById("sim").addEventListener("mouseout", function(e, x=false) { self.showPause(x) });

    this.m_simCanvasFrame = ec("div", 'simCanvasFrame', 'sim')
    this.m_simCanvasPauseIcon = ec("div", 'simCanvasPauseIcon', 'simCanvasFrame', { content: "❚❚"})
    document.getElementById('simCanvasFrame').style.display = "none";
    document.getElementById("simCanvasPauseIcon").onclick = function() {mainSim.pause()};

    // Now to create the canvas
    this.m_canvas = this.canvasCreate(this.m_simulator.size().width, this.m_simulator.size().height - 8);
    this.m_canvas.id ('can');
    this.m_canvas.parent('sim');

    // Div to contain the simulatorInput
    this.m_simulatorInputContainer = ec("div", 'simulatorInputContainer', 'secondBox');
    this.m_simulatorInput = ec("div", 'simInput', 'simulatorInputContainer');

    //Control UI ----------------------------
    this.m_controlsLeft = ec("div", 'controls', 'simInput');
    this.m_controlsRight = ec("div", 'controls', 'simInput');

    this.m_control0 = ec("div", 'control', this.m_controlsLeft);
    this.m_control1 = ec("div", 'control', this.m_controlsLeft);
    this.m_control2 = ec("div", 'control', this.m_controlsLeft);

    this.m_control3 = ec("div", 'control', this.m_controlsRight);
    this.m_control4 = ec("div", 'control', this.m_controlsRight);
    this.m_control5 = ec("div", 'control', this.m_controlsRight);

    this.m_controls = [this.m_control0, this.m_control1, this.m_control2, this.m_control3, this.m_control4, this.m_control5];

    this.m_particleControl = ec("div", 'particleControl', 'simulatorInputContainer');
  }

  createControls() {
    var ec = this.elementCreator;
    var answer = 0;

    this.m_equationResult = ec("h3", 'answer', 'equationdiv', { className: 'answer', content: 'Answer: ' + answer + 'V'})

    // Radio buttons to select ions to include
    for (var i = 0; i < this.m_sim.numParticleTypes(); i++) {
      var chk = createCheckbox(this.m_sim.m_particle_types[i], false);
      chk.class('checkboxes');
      chk.id('checkbox' + this.m_sim.m_particle_types[i]);
      chk.parent('particleControl');
      chk.changed(checkedEvent);

      this.addCheckbox(chk);
    }

    this.m_NernstButton = ec("button", 'NernstButton', 'particleControl', { content: "Nernst", mousePressed: startNernst });
    this.m_GoldmanButton = ec("button", 'GoldmanButton', 'particleControl', { content: "Goldman", mousePressed: startGoldman });

    var row = 4;

    for (var k = 0; k < animationSequencer.current().getNumContainers() * row; k++) {
      if (k == 0) {
        var text = 'Extracellular Control:';
      } else if (k == row) {
        var text = 'Intracellular Control:';
      } else {
        var id = (k % row) - 1;
        var particleType = mainSim.m_particle_types[id];
        var particleLocation = (k <= 3) ? "outside" : "inside";

        var particleSuffix = (k <= 3) ?
        "out" :
        "in";
        var particleCharge = (particleMapper[particleType].charge == 1) ?
        "+" :
        "-";
        var text = '[' + particleType + '<sup>' + particleCharge + '</sup>]' + '<sub>' + particleSuffix + '</sub>&nbsp;';
        var Value = animationSequencer.current().getNumParticles(particleLocation, particleType);
      }
      if (k == 0 || k == row) {
        textboard[k] = createElement('h4', text);
        textboard[k].class('qoptions');
        textboard[k].parent(mainSim.m_dom.m_controls[k]);

        createElement('br').parent(mainSim.m_dom.m_controls[k]);

        var table = createElement('table')
        table.class("table qoptions");
        table.id("table" + k);
        table.parent(mainSim.m_dom.m_controls[k + 1]);
      } else {
        var trow = createElement('tr');
        if (k < row) {
          trow.parent("table0");
        } else {
          trow.parent("table" + row);
        }

        textboard[k] = createElement('h4', text);
        textboard[k].class('qoptions');

        var td0 = createElement('td');
        textboard[k].parent(td0);
        td0.parent(trow);
        input[k] = createInput();
        input[k].value(Value)
        input[k].id(k);
        input[k].class('qoptions');
        var td1 = createElement('td');
        input[k].parent(td1);
        td1.parent(trow);
        input[k].input(changeNumParticles);

        plusButton[k] = createButton('+');
        plusButton[k].id(k);

        plusButton[k].attribute("data-ptype", particleType);
        plusButton[k].attribute("data-location", particleLocation);
        plusButton[k].style("background-color", particleMapper[particleType].color)
        plusButton[k].mousePressed(insertParticle);
        plusButton[k].class('qoptions');

        var td2 = createElement('td');
        plusButton[k].parent(td2);
        td2.parent(trow);

        minusButton[k] = createButton('-');
        minusButton[k].id(k);

        minusButton[k].attribute("data-ptype", particleType);
        minusButton[k].attribute("data-location", particleLocation);
        minusButton[k].style("background-color", particleMapper[particleType].color)
        minusButton[k].mousePressed(removeParticle);
        minusButton[k].class('qoptions');

        var td3 = createElement('td');
        minusButton[k].parent(td3);
        td3.parent(trow);
      }
    }
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

  canvasSize(w, h) {
    this.setSize(w, h);
    this.m_canvas.size(w, h);
  }

  showPause(option) {
    this.m_sim.renderUI("simCanvasFrame", option)
  }

  adjustUISize() {
    // input: Floats
    // usage: Resizing the question/equation window; 0.35 (including question), 1 (excluding question)
    var adjustedWindowHeight = windowHeight - 36;

    var newCanWidth = this.m_canvas_size_multiple * windowWidth;
    var newCanHeight = (this.m_canvas_size_multiple * adjustedWindowHeight) - 4;

    // Complement's width and height
    // aka, 0.35 multiplier instead of 0.65
    // var compWidth = (1 - this.m_canvas_size_multiple) * windowWidth;
    // var compHeight = (1 - this._canvas_size_multiple) * adjustedWindowHeight;
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
    // this.m_simulatorInputContainer.size(newCanWidth, compHeight);
    //
    // this.m_simulatorInput.size(newCanWidth, 0.90 * newCanHeight);
    // this.m_controlsLeft.size(newCanWidth / 2, 0.35 * newCanHeight);
    // this.m_controlsRight.size(newCanWidth / 2, 0.35 * newCanHeight);
    // this.m_particleControl.size(newCanWidth, 0.1 * 0.80 * adjustedWindowHeight);

    // console.log("adjustUISize", this);

    this.canvasSize (
      newCanWidth,
      newCanHeight
    );
  }
}
