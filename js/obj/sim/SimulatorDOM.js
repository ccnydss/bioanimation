/**
* SimulatorDOM is used to manage the display and values of HTML elements on the
* screen. This includes things like: the sidebar, with questions/settings; the
* main canvas with the animation; the controls at the bottom of the animation
* (text inputs, buttons, etc); the equilibrate button; the particle switcher;
* and simulator mode HTML buttons.
*
* An instance of SimulatorDOM is defined as a member of a Simulator instance.
* As such, this is a "private" class, in a sense, because nobody would create
* a SimulatorDOM without it being inside a Simulator.
*
* The "parent" Simulator instance is passed in as a parameter for the constructor,
* and be accessed internally by `this.sim`.
*
*/
class SimulatorDOM {
  /**
  * Construct a new SimulatorDOM instance. It defines the values for Simulator
  * settings like temperature, the gas constant, and faraday's constant.
  *
  */
  constructor(sim) {
    this.sim = sim;

    this.sidebar_size_multiple = 0.35;  // Equation sidebar 35% height of the screen by default. Goes to 100% (1.0) when expanded
    this.sidebar_current = 0.35;        // Current value of the sidebar height

    this.canvas_size_multiple = 0.65;   // Canvas width and height will be 65% of the screen's width and height.
    this.canvas_in_leftbar = false;

    this.canvas_width;
    this.canvas_height;

    this.equationResult = new EquationResult(this);

    this.sim_inputs = new SimulatorInputs(this);
    this.sim_question = new Question(this);

    this.settings = [] // Array of settings HTML fields, to replace 'simSetting'
  }

  setup() {
    var ec = elementCreator;

    this.stage = ec("div", 'stage', 'root', { className: 'flex-container' });
    this.firstBox = ec("div", 'firstBox', 'stage', { className: 'firstBox' });
    this.secondBox = ec("div", 'secondBox', 'stage', { className: 'secondBox' });

    // The right sidebar for displaying questions.
    this.leftBox = ec("div", 'leftbar', 'firstBox', { className: 'leftbar' });
    this.sim.renderUI("leftbar", true);

    // Drawer button to go up
    this.hideBar = ec("div", 'hidebar', 'firstBox', { className: 'hidebar', mousePressed: this.hideQuestion.bind(this) });
    this.hideBarText = ec("div", 'hidebarText', 'hidebar', { content: '<i class="fas fa-arrow-up"></i> Settings' });

    // Div to contain the equation
    this.equationContainer = ec("div", 'equationContainer', 'firstBox', { className: 'equationContainer' });

    this.equation = ec("div", 'equationdiv', 'equationContainer', { className: 'equationdiv' });
    this.equation.child('NernstEqn');   // Attach nernst equation LaTeX, defined in sketch.html with id 'NernstEqn'
    this.equation.child('GoldmanEqn');  // Same as nersnt, with goldman

    this.equationResult.setup();

    this.equi = ec("button", 'equilibrateButton', 'firstBox', { className: 'equilibrateButton', content: "Equilibrate", mousePressed: startEquilibrate });

    this.simulatorSetting = ec("div", 'simulatorSetting', 'equationdiv', { className: 'simulatorSetting', content: "Simulation Settings" })
    this.sim.renderUI('simulatorSetting',false);

    this.settingTable = ec("div", 'setting', 'simulatorSetting', { className: 'setting' });
    this.sim.renderUI("setting", false);

    var temperatureIcon = '<i class="fas fa-thermometer-half"></i>';
    this.makeTable (
      "NernstSetting",
      "setting",
      [temperatureIcon],
      ["Enter Temperature..."],
      ["K"],
      [mainSim.settings.temperature]
    );

    this.makeTable (
      "GoldmanSetting",
      "setting",
      ["p<sub>Na</sub>", "p<sub>Cl</sub>", "p<sub>K</sub>"],
      ["Enter Na permeability...","Enter Cl permeability...","Enter K permeability..."],
      ["", "", ""],
      [Na.permeability, Cl.permeability, K.permeability]
    );

    this.leftWindow = ec("div", 'leftWindow', 'equationdiv', {className: 'leftWindow' });

    // Plot window
    this.sim_controls = document.createElement("canvas");
    this.sim_controls.id = 'dataPlot';
    this.leftWindow.child(this.sim_controls);
    this.sim.renderUI('leftWindow', false);


    var self=this;
    this.simulator = ec("div", 'sim', 'secondBox', {className: 'sim'});
    this.simulator.mouseOver(function(e, x=true) { self.showPause(x) });
    this.simulator.mouseOut(function(e, x=false) { self.showPause(x) });

    this.simCanvasPause = ec("div", 'simCanvasPause', 'sim', { content: "Paused" });
    this.simCanvasPause.style('display', 'none');

    this.simCanvasFrame = ec("div", 'simCanvasFrame', 'sim');

    this.simCanvasPreset = ec("div", 'simCanvasPreset', 'simCanvasFrame');
    this.simCanvasPreset_dropdown = ec("div", 'simCanvasPresetDropdown', 'simCanvasPreset', { className: 'dropdown' });
    this.simCanvasPreset_dropbtn = ec("a", 'simCanvasPresetDropBtn', 'simCanvasPresetDropdown', { content: 'Default', className: 'dropbtn' });
    this.simCanvasPreset_Content = ec("div", 'simCanvasPresetContent', 'simCanvasPresetDropdown', { className: 'dropdown-content' });
    this.simCanvasPreset_dropbtn_list = []

    for(let i = 0; i < this.sim.preset.preset_list.length; i++) {
      this.simCanvasPreset_dropbtn_list[i] = ec("a", 'simCanvasPresetDropBtnList'+i, 'simCanvasPresetContent', { content: this.sim.preset.preset_list[i].name });
      var parent = this;

      this.simCanvasPreset_dropbtn_list[i].elt.onclick = function() {
        parent.sim.preset.changePreset(parent.simCanvasPreset_dropbtn_list[i].elt)
      };
      // this.simCanvasPreset_dropbtn_list[i].mouseClicked(parent.sim.preset.changePreset(parent.simCanvasPreset_dropbtn_list[i].elt))
    }

    this.simCanvasPauseIcon = ec("div", 'simCanvasPauseIcon', 'simCanvasFrame', { content: '<i class="fas fa-pause"></i>' })
    document.getElementById('simCanvasFrame').style.display = "none";
    document.getElementById("simCanvasPauseIcon").onclick = function() {mainSim.pause()};

    // Now to create the canvas
    this.canvas = this.canvasCreate(this.simulator.size().width, this.simulator.size().height - 8);
    this.canvas.id ('can');
    this.canvas.parent('sim');

    this.sim_inputs.setup();
    this.sim_question.setup();
  }

  setSize(w, h) {
    this.canvas_width = w;
    this.canvas_height = h;
  }

  getSize() {
    return { width: this.canvas_width, height: this.canvas_height };
  }

  canvasCreate(w, h) {
    this.setSize(w, h);
    return createCanvas(w, h);
  }

  canvasSize(w, h) {
    this.setSize(w, h);
    this.canvas.size(w, h);
  }

  showPause(option) {
    this.sim.renderUI("simCanvasFrame", option)
  }

  hideQuestion(evt) {
    // input: the element that triggered the event (hide buttons [arrow]);
    var show = this.sim.questionsAreHidden(); // Check if the questions are already hidden. If TRUE, we should show them. If FALSE, we should hide them.
    var hide = !show;

    //Turn the question menu off
    this.sim.renderUI("hidebarText", hide)
    this.sim.renderUI("simulatorSetting", hide)

    var curUI = (this.sim.simMode() == "Nernst") ? "NernstSetting" : "GoldmanSetting"
    this.sim.renderUI(curUI, hide)

    this.sim.renderUI("leftWindow", hide)

    this.sim.resize();
    this.sim.redrawUI(show);
    // this.adjustUISize(this.getSize().width, this.getSize().height);
  }

  adjustUISize(width, height) {
    // input: Floats
    // usage: Resizing the question/equation window; 0.35 (including question), 1 (excluding question)
    var adjustedWindowHeight = windowHeight - 36;

    // var newCanWidth = this.canvas_size_multiple * windowWidth;
    // var newCanHeight = (this.canvas_size_multiple * adjustedWindowHeight) - 4;

    var newCanWidth = this.simulator.elt.clientWidth;
    var newCanHeight = this.simulator.elt.clientHeight;

    if (this.canvas_in_leftbar) {
      newCanHeight = 0.75 * newCanWidth;
    }

    if (width, height) {
      newCanWidth = width;
      newCanHeight = height;
    }

    this.canvasSize (
      newCanWidth,
      newCanHeight
    );
  }

  // NOTE: create a single "toggleParticleID()" method
  disableParticleID(id) {
    this.sim_inputs.controls_list.inside.rows[id].enable(false);
    this.sim_inputs.controls_list.outside.rows[id].enable(false);
    this.sim_inputs.checkbox(id, false);
  }

  enableParticleID(id) {
    var ptype = this.sim.particle_types[id];

    this.sim_inputs.controls_list.inside.rows[id].enable(true);
    this.sim_inputs.controls_list.outside.rows[id].enable(true);
    this.equationResult.setSelected(ptype);
    this.sim_inputs.checkbox(id, true);
  }

  swapChart() {
    swapElements(this.sim_controls, this.simulator);

    if(!this.canvas_in_leftbar) {
      document.getElementById('dataPlot').classList.add('visable')
        document.getElementById('can').classList.remove('visable')
  } else {
      document.getElementById('dataPlot').classList.remove('visable')
        document.getElementById('can').classList.add('visable')
  }

    this.canvas_size_multiple = (this.canvas_in_leftbar) ? 0.65 : 0.35;
    this.canvas_in_leftbar = !this.canvas_in_leftbar;

    this.sim.resize();

    if(helpPage.style.display != 'none') {
    help.clear();
    help.initialize();
    help.resize();
    }
  }

  makeTable(id, parent, content, placeholder, contentUnit, contentDefaultValue, prevLength) {
    var settingPart = elementCreator("div", id, parent);

    var tableRow = content.length;

    for (var i = 0; i < tableRow; i++) {
      var trow = elementCreator("tr", '', settingPart);
      var td0 = elementCreator("label", '', trow, { content: content[i]} );

      var inputElement = elementCreator("input", this.settings.length, trow);
      inputElement.value(contentDefaultValue[i]);
      inputElement.attribute('placeholder', placeholder[i]);
      inputElement.input(this.sim.changeSimulatorSettings.bind(this.sim));

      this.settings.push(inputElement);

      var td3 = elementCreator("div", '', trow, { content: contentUnit[i] });

      if (contentUnit[i]) {
        td3.addClass('unit');
      }
    }
  }
}
