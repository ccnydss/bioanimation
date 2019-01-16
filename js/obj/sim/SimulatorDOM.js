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

    this.m_controls = [];
    this.m_checkboxes = [];

    this.m_equationResult = 0;

    this.m_sim_controls = {
      inside: {
        header: null,
        inputs: [],
        buttons: {
          "plus": [],
          "minus": []
        }
      },
      outside: {
        header: null,
        inputs: [],
        buttons: {
          "plus": [],
          "minus": []
        }
      }
    };

    this.m_buttons = {
      "plus": [],
      "minus": []
    };
    this.m_textboard = []
    this.m_inputs = []
    this.m_setting_fields = []

    this.m_settings = [] // Array of settings HTML fields, to replace 'simSetting'
  }

  addCheckbox(checkbox) {
    this.m_checkboxes.push(checkbox);
  }

  checkbox(index, bool=null) {
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

    // Div to contain the simulatorInput
    this.m_simulatorInputContainer = ec("div", 'simulatorInputContainer', 'secondBox');
    this.m_simulatorInput = ec("div", 'simInput', 'simulatorInputContainer');

    //Control UI ----------------------------
    this.m_controlsLeft = ec("div", 'controls', 'simInput', { className: 'controls' });
    this.m_controlsRight = ec("div", 'controls', 'simInput', { className: 'controls' });

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
        var particleType = this.m_sim.m_particle_types[id];
        var particleLocation = (k <= 3) ? "outside" : "inside";

        var particleSuffix = (k <= 3) ?
        "out" :
        "in";
        var particleCharge = (particleMapper[particleType].charge == 1) ?
        "+" :
        "-";
        var text = '[' + particleType + '<sup>' + particleCharge + '</sup>]' + '<sub>' + particleSuffix + '</sub>&nbsp;';
        var Value = animationSequencer.current().getNumParticles(particleLocation, particleType);
      };

      if (k == 0 || k == row) {
        this.m_textboard[k] = this.elementCreator("h4", '', this.m_controls[k], { content: text, className: 'qoptions' });
        createElement('br').parent(this.m_controls[k]);

        var table = this.elementCreator("table", 'table' + k, this.m_controls[k + 1], { className: 'table qoptions' });
      } else {
        var par = k < row ? "table0" : "table" + row;
        var trow = this.elementCreator("tr", '', par);

        var td0 = this.elementCreator("td", '', trow);
        this.m_textboard[k] = this.elementCreator("h4", '', td0, { content: text, className: 'qoptions' });

        var td1 = this.elementCreator("td", '', trow);
        this.m_inputs[k] = this.elementCreator("input", k, td1, { className: 'qoptions' });
        this.m_inputs[k].value(Value)
        this.m_inputs[k].class('qoptions');
        this.m_inputs[k].input(changeNumParticles);

        var td2 = this.elementCreator("td", '', trow);
        this.m_buttons.plus[k] = this.elementCreator("button", k, td2, { content: "+", className: 'qoptions', mousePressed: insertParticle });
        this.m_buttons.plus[k].attribute("data-ptype", particleType);
        this.m_buttons.plus[k].attribute("data-location", particleLocation);
        this.m_buttons.plus[k].style("background-color", particleMapper[particleType].color)

        var td3 = this.elementCreator("td", '', trow);
        this.m_buttons.minus[k] = this.elementCreator("button", k, td3, { content: "-", className: 'qoptions', mousePressed: removeParticle });
        this.m_buttons.minus[k].attribute("data-ptype", particleType);
        this.m_buttons.minus[k].attribute("data-location", particleLocation);
        this.m_buttons.minus[k].style("background-color", particleMapper[particleType].color)
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
  disableParticleID(inside_id, outside_id) {
    if (!this.m_inputs[inside_id].elt.disabled) {
      this.m_inputs[inside_id].attribute('disabled', '');
      this.m_inputs[outside_id].attribute('disabled', '');

      this.m_buttons.plus[inside_id].attribute('disabled', '');
      this.m_buttons.minus[inside_id].attribute('disabled', '');

      this.m_buttons.plus[outside_id].attribute('disabled', '');
      this.m_buttons.minus[outside_id].attribute('disabled', '');
    }
  }

  enableParticleID(inside_id, outside_id) {
    if (this.m_inputs[inside_id].elt.disabled) {
      this.m_inputs[inside_id].removeAttribute('disabled');
      this.m_inputs[outside_id].removeAttribute('disabled');

      this.m_buttons.plus[inside_id].removeAttribute('disabled');
      this.m_buttons.minus[inside_id].removeAttribute('disabled');

      this.m_buttons.plus[outside_id].removeAttribute('disabled');
      this.m_buttons.minus[outside_id].removeAttribute('disabled');
    }
  }

  makeTable(id, parent, content, placeholder, contentUnit, contentDefaultValue, prevLength) {
    var settingPart = this.elementCreator("div", id, parent);

    var tableRow = content.length;

    for (var i = 0; i < tableRow; i++) {
      var trow = this.elementCreator("tr", '', settingPart);
      var td0 = this.elementCreator("label", '', trow, { content: content[i]} );

      var inputElement = this.elementCreator("input", this.m_settings.length, trow);
      inputElement.value(contentDefaultValue[i]);
      inputElement.attribute('placeholder', placeholder[i]);
      inputElement.input(this.m_sim.changeSimulatorSettings.bind(this.m_sim));

      this.m_settings.push(inputElement);

      var td3 = this.elementCreator("div", '', trow, { content: contentUnit[i] });

      if (contentUnit[i]) {
        td3.addClass('unit');
      }
    }
  }
}
