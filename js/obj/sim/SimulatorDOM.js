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
*@example
* var mainSim = new Simulator();
* var dom = new SimulatorDOM(mainSim);
*/
class SimulatorDOM {
  /**
  * Construct a new SimulatorDOM instance. It instantiates new EquationResult,
  * SimulatorInputs, and Question objects.
  * @param {Simulator} sim - The parent Simulator that will spawn this SimulatorDOM
  * instance.
  * @access public
  */
  constructor(sim) {
    /**
    * @type {Simulator}
    * @private
    */
    this.sim = sim;

    /**
    * Equation sidebar 35% height of the screen by default. Goes to 100% (1.0)
    * when expanded. This is private because it is used in Simulator, which we
    * consider to be a part of this "structure". This should remain a constant,
    * and be changed by the program.
    * @const
    * @type {double}
    * @private
    */
    this.sidebar_size_multiple = 0.35;

    /**
    * Current value of the sidebar height multiple (initially set to 35%)
    * @type {double}
    * @private
    */
    this.sidebar_current = this.sidebar_size_multiple;

    /**
    * Canvas width and height will be 65% of the screen's width and height.
    * @type {double}
    * @private
    */
    this.canvas_size_multiple = 0.65;

    /**
    * Is the canvas currently in the leftbar? This boolean is used for when the
    * user switches the canvas and plot via the keyboard shortcut `S`
    * @type {boolean}
    * @private
    */
    this.canvas_in_leftbar = false;

    /**
    * Keep track of the main canvas width (in pixels).
    * @type {int}
    * @private
    */
    this.canvas_width;

    /**
    * Keep track of the main canvas height (in pixels).
    * @type {int}
    * @private
    */
    this.canvas_height;

    /**
    * The HTML table that contains the equation results for each particle type.
    * This is the table that appears underneath the questions/settings in the
    * left sidebar. Takes this SimulatorDOM instance as an input because it
    * will need to update values in here, similar to how SimulatorDOM takes a
    * Simulator instance as an input
    * @type {EquationResult}
    * @private
    */
    this.equation_result = new EquationResult(this);

    /**
    * This represents the "Intracellular" and "Extracellular" button sets on
    * the page.
    * @type {SimulatorInputs}
    * @private
    */
    this.sim_inputs = new SimulatorInputs(this);

    /**
    * This represents the set of Questions that appear in the leftbar.
    * @type {Question}
    * @private
    */
    this.sim_question = new Question(this);

    /**
    * Array of settings HTML fields, to replace 'simSetting'
    * @type {p5.Element[]}
    * @private
    */
    this.settings = []
  }

  /**
  * The setup() function is run once when p5.js is setting up the canvas for the
  * first time. Here, HTML elements are first defined and placed into the web
  * page via JavaScript. The `ec()` function is a helper function for creating
  * p5 HTML elements (p5.Element type).
  * @example
  * var mainSim =new Simulator();
  * var dom = new SimulatorDOM(mainSim);
  * mainSim.dom.setup();
  * @access public
  */
  setup() {
    var ec = elementCreator;

    /**
    * The stage is the entire application that's displayed on the screen.
    * @type {p5.Element}
    * @private
    */
    this.stage = ec("div", 'stage', 'root', {
      className: 'flex-container'
    });

    /**
    * The firstBox is the entire left sidebar, with a width of 35%.
    * @type {p5.Element}
    * @private
    */
    this.first_box = ec("div", 'firstBox', 'stage', {
      className: 'firstBox'
    });

    /**
    * The secondBox is the entire right "half" of the screen, with a width of
    * 65%.
    * @type {p5.Element}
    * @private
    */
    this.second_box = ec("div", 'secondBox', 'stage', {
      className: 'secondBox'
    });

    /**
    * The leftBar corresponds to the section of the right sidebar for
    * displaying Questions.
    * @type {p5.Element}
    * @private
    */
    this.left_bar = ec("div", 'leftbar', 'firstBox', {
      className: 'leftbar'
    });
    this.sim.renderUI("leftbar", true);

    /**
    * The hidebar is the horizontal divider that users can click on to hide the
    * questions, and display the settings + plot.
    * @type {p5.Element}
    * @private
    */
    this.hide_bar = ec("div", 'hidebar', 'firstBox', {
      className: 'hidebar',
      mousePressed: this.hideQuestion.bind(this)
    });

    /**
    * This text is what the hidebar displays inside of it. Initially, the
    * Questions are displayed. So the hidebar text is an up arrow followed by
    * "Settings" to let the user know that clicking the hidebar will hide it
    * upwards and reveal the Settings (and Plot).
    * @type {p5.Element}
    * @private
    */
    this.hide_bar_text = ec("div", 'hidebarText', 'hidebar', {
      content: '<i class="fas fa-arrow-up"></i> Settings'
    });

    /**
    * HTML div to contain the equation as well as result table under the leftbar.
    * @type {p5.Element}
    * @private
    */
    this.equation_container = ec("div", 'equationContainer', 'firstBox', {
      className: 'equationContainer'
    });

    /**
    * HTML div to contain the equation, exclusively.
    * @type {p5.Element}
    * @private
    */
    this.equation = ec("div", 'equationdiv', 'equationContainer', {
      className: 'equationdiv'
    });
    this.equation.child('NernstEqn');   // Attach nernst equation LaTeX, defined in sketch.html with id 'NernstEqn'
    this.equation.child('GoldmanEqn');  // Same as nersnt, with goldman

    // Initialize the DOM elements inside the equation result, like what is
    // being done here.
    this.equation_result.setup();

    /**
    * The Equilibrate button. We attach a function to the mousePressed event.
    * @type {p5.Element}
    * @private
    */
    this.equi = ec("button", 'equilibrateButton', 'firstBox', {
      className: 'equilibrateButton',
      content: "Equilibrate",
      mousePressed: startEquilibrate
    });

    /**
    * The HTML div that will contain the setting table. Hierarchically,
    * it is contained within the Equation div, but starts off hidden.
    * @type {p5.Element}
    * @private
    */
    this.simulator_setting = ec("div", 'simulatorSetting', 'equationdiv', {
      className: 'simulatorSetting',
      content: "Simulation Settings"
    });
    this.sim.renderUI('simulatorSetting', false);

    /**
    * Setting table contains the text fields in table rows to be used as
    * simulator setting modifiers.
    * @type {p5.Element}
    * @private
    */
    this.setting_table = ec("div", 'setting', 'simulatorSetting', {
      className: 'setting'
    });
    this.sim.renderUI("setting", false);

    var temperatureIcon = '<i class="fas fa-thermometer-half"></i>';
    this.makeTable (
      "NernstSetting",
      "setting",
      [temperatureIcon],
      ["Enter Temperature..."],
      ["K"],
      [this.sim.settings.temperature]
    );

    this.makeTable (
      "GoldmanSetting",
      "setting",
      ["p<sub>Na</sub>", "p<sub>Cl</sub>", "p<sub>K</sub>"],
      ["Enter Na permeability...","Enter Cl permeability...","Enter K permeability..."],
      ["", "", ""],
      [Na.permeability, Cl.permeability, K.permeability]
    );

    /**
    * The left window will always contain a _secondary_ HTML5 canvas element.
    * This canvas, by default, will be used to display the voltage Plot.
    * However, when a user presses `S` on the keyboard, the main animation and
    * the Plot swap places. The main animation will go into leftWindow, and the
    * Plot will get the designated main canvas on the right side.
    * @type {p5.Element}
    * @private
    */
    this.left_window = ec("div", 'leftWindow', 'equationdiv', {
      className: 'leftWindow'
    });

    /**
    * This stores the actual HTML canvas for the leftbar, which starts off
    * showing the Plot but may also show the main animation if it is swapped.
    * @type {HTMLCanvasElementPrototype}
    * @private
    */
    this.data_plot = document.createElement("canvas");
    this.data_plot.id = 'dataPlot';
    this.left_window.child(this.data_plot);
    this.sim.renderUI('leftWindow', false);

    /**
    * This is a div in the secondBox that contains only the cell animation.
    * @type {p5.Element}
    * @private
    */
    this.simulator = ec("div", 'sim', 'secondBox', {
      className: 'sim'
    });

    // Reveal the `this.sim_canvas_frame` div on mouse hover.
    var self=this;
    this.simulator.mouseOver(function(e, x=true) { self.showPause(x) });
    this.simulator.mouseOut(function(e, x=false) { self.showPause(x) });

    /**
    * The div that overlays on top of the simulator div when the animation is
    * paused.
    * @type {p5.Element}
    * @private
    */
    this.sim_canvas_pause = ec("div", 'simCanvasPause', 'sim', {
      content: "Paused"
    });
    this.sim_canvas_pause.style('display', 'none');

    /**
    * The div container that overlays on top of the simulator div, and displays
    * the pause button as well as the preset picker. This only shows up when
    * the mouse hovers over that section.
    * @type {p5.Element}
    * @private
    */
    this.sim_canvas_frame = ec("div", 'simCanvasFrame', 'sim');

    /**
    * The div that displays the current simulation preset mode. On hover, it
    * displays the dropdown options. This div stretches out along the bottom
    * of the simulator frame div.
    * @type {p5.Element}
    * @private
    */
    this.sim_canvas_preset = ec("div", 'simCanvasPreset', 'simCanvasFrame');

    /**
    * The div that contains the actual button for the dropdown.
    * @type {p5.Element}
    * @private
    */
    this.sim_canvas_preset_dropdown = ec("div", 'simCanvasPresetDropdown', 'simCanvasPreset', {
      className: 'dropdown'
    });

    /**
    * The link element that is used for selecting a dropdown element.
    * @type {p5.Element}
    * @private
    */
    this.sim_canvas_preset_dropbtn = ec("a", 'simCanvasPresetDropBtn', 'simCanvasPresetDropdown', {
      content: 'Default', className: 'dropbtn'
    });

    /**
    * The div that contains the actual list of preset options. Populates based
    * off of Simulator.preset member variable.
    * @type {p5.Element}
    * @private
    */
    this.sim_canvas_preset_content = ec("div", 'simCanvasPresetContent', 'simCanvasPresetDropdown', {
      className: 'dropdown-content'
    });

    this.sim_canvas_preset_dropbtn_list = []
    for (let i = 0; i < this.sim.preset.preset_list.length; i++) {
      this.sim_canvas_preset_dropbtn_list[i] = ec (
        "a",
        'simCanvasPresetDropBtnList' + i,
        'simCanvasPresetContent',
        { content: this.sim.preset.preset_list[i].name }
      );
      var parent = this;

      this.sim_canvas_preset_dropbtn_list[i].elt.onclick = function() {
        parent.sim.preset.changePreset(parent.sim_canvas_preset_dropbtn_list[i].elt)
      };
    }

    /**
    * The pause icon that shows up on the Simulator div overlay when a mouse
    * hovers over it.
    * @type {p5.Element}
    * @private
    */
    this.sim_canvas_pause_icon = ec (
      "div",
      'simCanvasPauseIcon',
      'simCanvasFrame',
      { content: '<i class="fas fa-pause"></i>' }
    );

    this.sim_canvas_frame.elt.style.display = "none";
    this.sim_canvas_pause_icon.elt.onclick = function() { mainSim.pause() };

    /**
    * This stores the actual HTML canvas for the actual animation, which starts
    * off showing the cell and ion particles, but may also show the plot if it
    * is swapped.
    * @type {HTMLCanvasElementPrototype}
    * @private
    */
    this.canvas = this.canvasCreate(
      this.simulator.size().width,
      this.simulator.size().height
    );
    this.canvas.id ('can');
    this.canvas.parent('sim');

    // Execute the setup functions for the other DOM elements. These guys are
    // grouped into their own classes.
    this.sim_inputs.setup();
    this.sim_question.setup();
  }

  /**
  * Set the size of the main animation canvas in the right side of the app.
  * @example
  * var mainSim =new Simulator();
  * var dom = new SimulatorDOM(mainSim);
  * mainSim.dom.setSize(585,366);
  * @param {integer} w - The width for the canvas.
  * @param {integer} h - The height for the canvas.
  *@access private
  */
  setSize(w, h) {
    this.canvas_width = w;
    this.canvas_height = h;
  }

  /**
  * Getter to get the width and height of the current size of the main
  * animation canvas in the right side of the application.
  * @example
  * var mainSim =new Simulator();
  * var dom = new SimulatorDOM(mainSim);
  * mainSim.dom.getSize();
  * @returns {object} an object like: { width: 10, height: 10 }
  * @access public
  */
  getSize() {
    return { width: this.canvas_width, height: this.canvas_height };
  }

  /**
  * Create a canvas for the first time, during p5 sketch setup.
  * @Example
  * var mainSim =new Simulator();
  * var dom = new SimulatorDOM(mainSim);
  * mainSim.dom.canvasCreate(500,340);
  * @param {integer} w - The width for the canvas.
  * @param {integer} h - The height for the canvas.
  * @access private
  * @returns {p5.Element}
  */
  canvasCreate(w, h) {
    this.setSize(w, h);
    return createCanvas(w, h);
  }

  /**
  * Resize the canvas to a new width and height.
  * @example
  * var mainSim =new Simulator();
  * var dom = new SimulatorDOM(mainSim);
  * mainSim.dom.canvasSize(500,340);
  * @param {integer} w - The width for the canvas.
  * @param {integer} h - The height for the canvas.
  * @access private
  */
  canvasSize(w, h) {
    this.setSize(w, h);
    this.canvas.size(w, h);
  }

  /**
  * Function that gets called to display the canvas frame div, which contains
  * the pause button and preset setting list. This function is called whenever
  * the mouse hovers over the simulator div.
  * @example
  * var mainSim =new Simulator();
  * var dom = new SimulatorDOM(mainSim);
  * mainSim.dom.showPause(false);
  * @param {boolean} option - "True" to show the buttons, "False" to hide them.
  * @access private
  */
  showPause(option) {
    this.sim.renderUI("simCanvasFrame", option)
  }

  /**
  * This function is called when the user clicks on the settings bar. If the
  * questions are currently being displayed, they will get collapsed to reveal
  * the Simulator settings underneath. If the Simulator settings are already
  * showing, the drawer will close them to display the questions again.
  * @example
  * var mainSim =new Simulator();
  * var dom = new SimulatorDOM(mainSim);
  * mainSim.dom.hideQuestion(event);
  * @param {} evt - The callback from attaching this function to
  * the hidebar's onclick event handler.
  * @access private
  */
  hideQuestion(evt) {
    // Check if the questions are already hidden. If TRUE, we should show them. If FALSE, we should hide them.
    var show = this.sim.questionsAreHidden();
    var hide = !show;

    //Turn the question menu off
    this.sim.renderUI("hidebarText", hide)
    this.sim.renderUI("simulatorSetting", hide)

    var curUI = (this.sim.simMode() == "Nernst") ? "NernstSetting" : "GoldmanSetting"
    this.sim.renderUI(curUI, hide)

    this.sim.renderUI("leftWindow", hide)

    this.sim.resize();
    this.sim.redrawUI(show);
  }

  /**
  * When the browser window is resized, we need to adjust the application UI
  * for the new width and height. Specifically, this determines and applies
  * new canvas dimensions. The function also allows new values for width and
  * height to get passed in, overriding the current browser values.
  * @example
  * var mainSim =new Simulator();
  * var dom = new SimulatorDOM(mainSim);
  * mainSim.dom.adjustUISize(500,300);
  * @param {integer} [width=null] - The new width to override browser settings with.
  * @param {integer} [height=null] - The new height to overrise browser settings with.
  * @access private
  */
  adjustUISize(width, height) {
    var newCanWidth = this.simulator.elt.clientWidth;
    var newCanHeight = this.simulator.elt.clientHeight;

    if (this.canvas_in_leftbar) {
      newCanHeight = 0.75 * newCanWidth;
    }

    if (width && height) {
      newCanWidth = width;
      newCanHeight = height;
    }

    this.canvasSize (
      newCanWidth,
      newCanHeight
    );
  }

  /**
  * This function will run when the user wants to switch between selected
  * particles in Nernst mode ( the default mode ).
  * @example
  * var mainSim =new Simulator();
  * var dom = new SimulatorDOM(mainSim);
  * mainSim.dom.toggleParticleID(0, true);
  * @param {integer} id - The array index for the particle to select, in the
  * array ["Na", "Cl", "K"].
  * @param {boolean} toggle - Whether to enable or disable the selected particle.
  * @access public
  */
  toggleParticleID(id, toggle) {
    this.sim_inputs.controls_list.inside.rows[id].enable(toggle);
    this.sim_inputs.controls_list.outside.rows[id].enable(toggle);
    this.sim_inputs.checkbox(id, toggle);

    if (toggle) {
      var ptype = this.sim.particle_types[id];
      this.equation_result.setSelected(ptype);
    }
  }

  /**
  * This function is called when the user presses the "S" key on their keyboard.
  * It swaps the two HTML elements for the Plot and the main animation canvas.
  * This places the particle animation into the leftbar, and the plot into the
  * main right viewport.
  * @Example
  * var mainSim =new Simulator();
  * var dom = new SimulatorDOM(mainSim);
  * mainSim.dom.swapChart();
  * @access private
  */
  swapChart() {
    swapElements(this.data_plot, this.simulator);

    if(!this.canvas_in_leftbar) {
      this.data_plot.classList.add('visable');
      this.canvas.elt.classList.remove('visable');
    } else {
      this.data_plot.classList.remove('visable');
      this.canvas.elt.classList.add('visable');
    }

    this.canvas_size_multiple = (this.canvas_in_leftbar) ? 0.65 : 0.35;
    this.canvas_in_leftbar = !this.canvas_in_leftbar;

    this.sim.resize();

    if (helpPage.style.display != 'none') {
      help.clear();
      help.initialize();
      help.resize();
    }
  }

  /**
  * Function to create the table for the simulator settings component. Currently,
  * it is only being used in `SimulatorDOM.js`, within the `setup` function.
  * @example
  * var mainSim =new Simulator();
  * var dom = new SimulatorDOM(mainSim);
  * mainSim.dom.makeTable("GoldmanSetting","setting",["p<sub>Na</sub>", "p<sub>Cl</sub>", "p<sub>K</sub>"],
  * ["Enter Na permeability...","Enter Cl permeability...","Enter K permeability..."],
  * ["", "", ""],[Na.permeability, Cl.permeability, K.permeability]);
  * @param {} id - ?
  * @param {} parent - ?
  * @param {} content - ?
  * @param {} placeholder - ?
  * @param {} content_unit - ?
  * @param {} content_default_value - ?
  * @param {} prev_length - ?
  * @access private
  */
  makeTable(id, parent, content, placeholder, content_unit, content_default_value, prev_length) {
    var settingPart = elementCreator("div", id, parent);

    var tableRow = content.length;

    for (var i = 0; i < tableRow; i++) {
      var trow = elementCreator("tr", '', settingPart);
      var td0 = elementCreator("label", '', trow, { content: content[i]} );

      var inputElement = elementCreator("input", this.settings.length, trow);
      inputElement.value(content_default_value[i]);
      inputElement.attribute('placeholder', placeholder[i]);
      inputElement.input(this.sim.changeSimulatorSettings.bind(this.sim));

      this.settings.push(inputElement);

      var td3 = elementCreator("div", '', trow, { content: content_unit[i] });

      if (content_unit[i]) {
        td3.addClass('unit');
      }
    }
  }
}
