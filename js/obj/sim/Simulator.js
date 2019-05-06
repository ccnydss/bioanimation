/**
* Simulator provides an interface to control the simulation parameters and tracks
* its internal state.
*
* The Simulator is the core of the application. It is responsible for drawing
* not just the animation canvas, but also the entire page, including all buttons,
* sidebars, etc -- via its member variable, `dom`, which is an instance of
* SimulatorDOM.
*@example
* var mainSim = new Simulator();
*/

class Simulator {
  /**
  * Construct a new Simulator instance. It defines the values for Simulator
  * settings like temperature, the gas constant, and faraday's constant.
  *
  */
  constructor() {
    /**
    * @public
    *
    * @type {array}
    */
    this.particle_types = ["Na", "Cl", "K"];

    /**
    * @public
    *
    * @type {boolean}
    */
    this.paused = false;

    /**
    * @public
    *
    * @type {SimulatorDOM}
    */
    this.dom = new SimulatorDOM(this)

    /**
    *
    * Which equation mode is currently being represented by the Simulator.
    * Should ever either be "Nernst" or "Goldman".
    * @private
    *
    * @type {string}
    *
    */
    this.mode = "Nernst";

    /**
    * Contains the currently selected particle for Nernst mode.
    * @public
    *
    * @type {string}
    *
    */
    this.nernst_particle = "Na";

    /**
    * @public
    *
    * @type {NernstEq}
    */
    this.nernst_eq = new NernstEq(this);

    /**
    * @public
    *
    * @type {GoldmanEq}
    */
    this.goldman_eq = new GoldmanEq(this);

    /**
    * @public
    *
    * @type {Object}
    */
    this.settings = {
      temperature: 37 + 273.13,           // 37 is the human body temperature
      gas_constant: 8.314,                // Ideal gas constant
      faraday: 96485.3329                 // Faraday's constant
    };

    /**
    * @private
    *
    * @type {Array}
    */
    this.tab_list = ['aboutPage','contactPage','helpPage']

    /**
    * @public
    *
    * @type {Preset}
    */
    this.preset = new Preset(this);
  }

  /**
  * Pauses the Simulator.

  * @access public
  */
  pause() {
    this.paused = !this.paused;

    if (!this.paused) {
      loop();
      document.getElementById('simCanvasPause').style.display = "none";
      document.getElementById('simCanvasPauseIcon').innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      noLoop();
      document.getElementById('simCanvasPause').style.display = "flex";
      document.getElementById('simCanvasPauseIcon').innerHTML = '<i class="fas fa-play"></i>';
    }
  }

  /**
  * Called on every key press, trigger different events based on user input.

  * @Example
  * var mainSim = new Simulator();//if the simulation isn't declared
  * keyInput(){
  * var Q_key = 81;
  * switch(keyCode)//keyCode is a p5.js variable
  * { case Q_key:
  *   alert('Q is pressed')
  *   break;}
  *}
  * mainSim.keyInput();//called on every key press on the start of the simulation. It would alert on press of Q.
  * @access public
  */
  keyInput() {
    var spacebar = 32;
    var Q_key = 81;
    var W_key = 87;
    var S_key = 83;

    switch (keyCode) {
      case spacebar:
      this.pause();
      break;

      case Q_key:
      animationSequencer.prev(false);
      this.dom.sim_inputs.updateAll();
      break;

      case W_key:
      animationSequencer.next(false);
      this.dom.sim_inputs.updateAll();
      break;

      case S_key:
      this.dom.swapChart();
      break;
    }
  }

  /**
  * Function that returns the number of particle_types
  * @Example
  * var mainSim = new Simulator();//if the simulation isn't declared
  * mainSim.particle_types = ["Na", "Cl", "K"];
  * mainSim.numParticleTypes();//returns 3;

  * @returns length of the particle_types array.
  * @access public
  */
  numParticleTypes() {
    return this.particle_types.length;
  }

  /**
  * The function that handles displaying different sections of the user interface
  * under different conditions. Mostly for things like the left bar with
  * questions, settings, plot, etc.
  * @public
  *
  * @param {string} id - The string identifier for which UI element we want to
  *                       display or hide.
  * @param {boolean} mode - The setting to use (true/false) for displaying the
  *                           UI element.
  * @access public
  */
  renderUI(id, mode) {
    switch (id) {
      case "hidebarText":
      document.getElementById("hidebarText").innerHTML = (mode) ? '<i class="fas fa-arrow-down"></i> Questions' : '<i class="fas fa-arrow-up"></i> Settings';
      break;

      case "setting":
      document.getElementById("setting").style.display = (mode) ? "initial" : "none";
      break;

      case "simulatorSetting":
      if (mode) {
        document.getElementById('simulatorSetting').classList.remove("hidden");
      } else {
        document.getElementById('simulatorSetting').classList.add("hidden");
      }
      break;

      case "questionsdiv":
      if (mode) {

        if(!this.canvas_in_leftbar) {
          document.getElementById('questionsdiv').classList.remove("hidden")
        }

        document.getElementById('leftbar').classList.remove("hidden")

        document.getElementById('equationContainer').classList.remove("fullsize")
      } else {
        if(!this.canvas_in_leftbar) {
          document.getElementById('questionsdiv').classList.add("hidden")
        }

        document.getElementById('leftbar').classList.add("hidden")
        document.getElementById('equationContainer').classList.add("fullsize")
      }

      break;

      case "NernstEqn":
      document.getElementById('NernstEqn').style.display = (mode) ? "initial" : "none";
      break;

      case "GoldmanEqn":
      document.getElementById('GoldmanEqn').style.display = (mode) ? "initial" : "none";
      break;

      case "NernstSetting":
      // document.getElementById('NernstSetting').style.display = (mode) ? "block" : "none";
      document.getElementById('setting').style.display = (mode) ? "initial" : "none";
      break;

      case "GoldmanSetting":
      document.getElementById('GoldmanSetting').style.display = (mode) ? "flex" : "none";
      document.getElementById('setting').style.display = (mode) ? "initial" : "none";
      break;

      case "leftWindow":
      if (mode) {
        document.getElementById('leftWindow').classList.remove("hidden");
        document.getElementById('dataPlot').classList.remove("hide");
        if(document.getElementById('can'))
        document.getElementById('can').classList.remove("hidden");
      } else {
        document.getElementById('leftWindow').classList.add("hidden");
        document.getElementById('dataPlot').classList.add("hide");
        if(document.getElementById('can') && this.canvas_in_leftbar)
        document.getElementById('can').classList.add("hidden");
      };
      break;

      case "dataPlot":
      if (mode) {
        document.getElementById('dataPlot').classList.remove("hide")
      } else {
        document.getElementById('dataPlot').classList.add("hide")
      }
      //Note chartjs chart has a class called 'chartjs-render-monitor' by default, but this class is conflict with our animation
      break;

      case "simCanvasPause":
      document.getElementById('simCanvasPause').style.display = (mode) ? "flex" : "none";
      break;

      case "leftbar":
      document.getElementById('leftbar').style.display = (mode) ? "flex" : "none";
      break;

      case "simCanvasFrame":
      document.getElementById('simCanvasFrame').style.display = (mode) ? "flex" : "none";
      break;
    }
  }

  /**
  * Used for toggling the tabs at the top of the Simulator, like the About and
  * Help pages.
  * @public
  *
  * @param {string} target - The tab target to open.
  * @access public
  */
  toggleTab(target) {
    //First, close all other tabs
    for (let i = 0; i < this.tab_list.length; i++) {
      if (this.tab_list[i] != target) {
        document.getElementById(this.tab_list[i]).style.display = 'none'
        if (this.tab_list[i] == 'helpPage') help.clear()
      }
    }

    var page = document.getElementById(target);

    if (page.style.display == "flex") {
      page.style.display = 'none'

      if (target =='helpPage') help.clear();
    } else {
      page.style.display = 'flex';

      if (target=='helpPage')
      help.initialize()
      help.resize()
    }
  }

  /**
  * Check if the question sidebar is currently being displayed, or hidden
  * @Example
  * if(questionsAreHidden()) alert("No // QUESTION:")
  * @access private
  * @returns {boolean}
  */
  questionsAreHidden() {
    return this.dom.sidebar_current != this.dom.sidebar_size_multiple;
  }

  /**
  * A getter and setter for changing the Simulator mode.
  * @Example
  * var mainSim = new Simulator();//if the simulation isn't declared
  * mainsim.simMode("Nernst");//sets the mode to Nernst
  * mainsim.simMode()//gets the mode from the mainSim object
  * @param {string | null} [mode=null] - If supplied, change the Simulator to the
  * specified simulator mode. If left empty, will return the current simulator mode.
  * @access public
  */
  simMode(mode = null) {
    if (mode) {
      if (mode != "Nernst" && mode != "Goldman") throw new Error("Sim mode must be Nernst or Goldman.");

      var header = "Goldman-Hodgkin-Katz";
      if (mode == "Nernst") header = "Nernst Equation";
      this.dom.sim_question.header = header;
      this.dom.sim_question.title.html(header);
      this.mode = mode;
    } else {
      return this.mode;
    };

    this.buttonModeSwitch();
  }

  /**
  * Updates the text fields for concentration amounts for a specified particle
  * type. Applies the same amount to the inside and the outside. Currently
  * being used for equilibrating.

  *@Example
  *  var mainSim = new Simulator();//if the simulation isn't declared
  *  var concOutside = mainSim.dom.sim_inputs.concentration(particleType, "outside");
  *  var concInside = mainSim.dom.sim_inputs.concentration(particleType, "inside");
  *  var concEqui = (concOutside + concInside) / 2;
  *  var id = particleMapper[particleType].id;
  *  mainSim.updateInputs(concEqui, id);
  * @param {float} amount - the concentration amount to be set to.

  * @param {int} particle_id - the ID number of the particle to update.
  * @access public
  */
  updateInputs(amount, particle_id) {
    this.dom.sim_inputs.controls_list["outside"].rows[particle_id].value(amount);
    this.dom.sim_inputs.controls_list["inside"].rows[particle_id].value(amount);
  }

  /**
  * Updates the text fields for concentration amounts for a specified particle
  * type, within a specified location ("inside" or "outside"). Currently
  * being used by updateParticles()

  * @Example
  * var mainSim = new Simulator();//if the simulation isn't declared
  * var id = particleMapper["Na"].id;
  * mainSim.updateInputLoc(0.45, id, "inside");

  *
  * @param {double} amount - the concentration amount to be set to.
  * @param {int} particleID - the ID number of the particle to update.
  * @param {string} location - which location to target, can be "inside" or "outside".
  * @access private
  */
  updateInputLoc(amount, particle_id, location) {
    if (location != "inside" && location != "outside") throw new Error("Location must be 'inside' or 'outside'.");
    this.dom.sim_inputs.controls_list[location].rows[particle_id].value(amount);
  }

  /**
  * updateParticles is used when the user changes the number of particles by
  * typing in the text field or clicking the plus/minus buttons.

  * @Example
  * var mainSim = new Simulator();//if the simulation isn't declared
  * mainSim.updateParticles("Na","inside", 111, true);

  * @param {string} ptype - The name of the particle to update ("Na", "Cl", or "K").
  * @param {string} ploc - The location which this particle is in ("inside" or "outside").
  * @param {double} updated_amount - The concentration amount to update this particle at this location to.
  * @param {boolean} no_compute - Whether or not to compute the new equation values.
  * @access public
  */
  updateParticles(ptype, ploc, updated_amount, no_compute) {
    var num_particles = animationSequencer.current().getNumParticles(ploc, ptype);
    var max_particles = animationSequencer.current().MAX_PARTICLES;
    var min_particles = animationSequencer.current().MIN_PARTICLES;

    // If the amount entered is invalid, alert user
    if (
      isNaN(updated_amount) ||
      updated_amount < 0
    ) {
      alert("Please enter a valid number.");
      evt.target.value = updated_amount.slice(0, -1); // Erase the last character
      return;
    } else if (updated_amount > max_particles) {
      // If the amount entered is greater than the maximum, force it to maximum and alert user
      alert("Maximum amount is " + max_particles + ".");
      updated_amount = max_particles;
    } else if (updated_amount <= 1 && updated_amount > 0) {
      updated_amount = min_particles;
    } else if (updated_amount <= min_particles) {
      alert("Must have at least " + min_particles + " particle.");
      updated_amount = min_particles;
    }

    if(!no_compute)
    this.computeAll(ptype);

    var updated_particles = round(updated_amount);
    var difference = Math.abs(updated_particles - num_particles);

    // If the amount entered is less than 0, increase the amount
    if (updated_particles > num_particles) {
      for (var i = 0; i < difference; i++) {
        animationSequencer.current().insertNewParticle(ploc, ptype);
      }
    } else if (updated_particles < num_particles) {
      for (var i = 0; i < difference; i++) {
        animationSequencer.current().removeParticle(ploc, ptype, 0);
      }
    }

    var id = particleMapper[ptype].id;
    this.updateInputLoc(updated_amount, id, ploc);
  }

  /**
  * Called by the text fields under "Simulation Settings" in the app.

  * @Example
  * var mainSim = new Simulator();//if the simulation isn't declared
  * mainSim.changeSimulatorSettings.bind(mainSim.simMode("Goldman"));
  * @param {Object} evt - The evt object that is passed into the callback upon
  * user input.
  * @access private
  */
  changeSimulatorSettings(evt) {
    // input: the element that triggered the event (Input buttons);
    var updated_amount = evt.target.value;
    var event_id = evt.target.id;

    if (event_id == 0) {
      // Set temperature
      if (evt.target.value <= 313.15) {
        this.settings.temperature = updated_amount;
        this.dom.settings[event_id].value(updated_amount);
      } else {
        alert("Max temperature is 40 C");
        this.settings.temperature = 313.15;
        this.dom.settings[event_id].value(313.15);
      }
    }
    if (event_id == 1) {
      Na.permeability = updated_amount;
    }
    if (event_id == 2) {
      Cl.permeability = updated_amount;
    }
    if (event_id == 3) {
      K.permeability = updated_amount;
    }

    FormulaInputCalculation(this.nernst_particle);
  }

  /**
  * Public method for toggling the inputs of a particle type in Nernst mode.
  * Used for when the user switches between particles in Nernst.
  * @public
  *
  * @param {String} particleType - The name for the particle type ["Na", "Cl", "K"]
  * @param {boolean} toggle - True to enable, false to disable the particle type inputs.
  */
  toggleInputForParticle(particleType, toggle) {
    var particle_id = particleMapper[particleType].id;

    this.dom.toggleParticleID(particle_id, toggle);
    animationSequencer.current().setContainerDisplays(particleType, toggle);
  }

  /**
  * A top-level interface for setting the equation result answer. Just created
  * for the convenience of avoiding the internal this > dom > equation_result >
  * setAnswer chain.

  *@example
  * mainSim.setAnswer(mainSim.nernst_eq.result("Na"), "Na");

  * @param {Object} answer - The evt object that is passed into the callback upon
  * user input.
  * @param {Object} type - The evt object that is passed into the callback upon
  * user input.
  * @access public
  */
  setAnswer(answer, type) {
    this.dom.equation_result.setAnswer(answer, type);
  }

  /**
  * This function is used to compute the answers for every particle type at the
  * same time.

  *@Example
  * mainSim.computeAll("Na");

  * @param {String} selected - Which particle to select in the result table.
  * @access public
  */
  computeAll(selected) {
    this.setAnswer(this.nernst_eq.result("Na"), "Na");
    this.setAnswer(this.nernst_eq.result("K"), "K");
    this.setAnswer(this.nernst_eq.result("Cl"), "Cl");
    this.setAnswer(this.goldman_eq.result(), "Net");

    this.dom.equation_result.setSelected(selected);
  }

  /**
  * Button to switch the button colors when the simulator mode is changed. Only
  * gets called by this.simMode()

  *@example
  * mainSim.buttonModeSwitch("Goldman");
  * @access private

  */
  buttonModeSwitch() {
    if (this.mode == "Nernst") {
      this.dom.sim_inputs.NernstButton.style('backgroundColor', "#74b9ff");
      this.dom.sim_inputs.GoldmanButton.style('backgroundColor', "#dfe6e9");
    } else {
      this.dom.sim_inputs.NernstButton.style('backgroundColor', "#dfe6e9");
      this.dom.sim_inputs.GoldmanButton.style('backgroundColor', "#74b9ff");
    }
  }

  /**
  * This is triggered whenever the browser window is resized or the sidebar is
  * hidden/shown.

  *@example
  * mainSim.resize();
  * @access public

  */
  resize() {
    var draw_with_questions = !this.questionsAreHidden();
    this.redrawUI(draw_with_questions);
  }

  /**
  * This function is called by this.resize(), and handles the actual resizing.
  * It sets new container sizes and displays or hides the settings in the side
  * bar according to the hide parameter.

  *@Example
  * mainSim.redrawUI(true);

  * @param {boolean} hide - True is for expanding the settings window, and false
  * is for collapsing it.
  * @access private
  */
  redrawUI(hide) {
    this.dom.sidebar_current = hide ? this.dom.sidebar_size_multiple : 1;
    this.dom.adjustUISize();

    var { width, height } = this.dom.getSize();
    animationSequencer.current().setContainerSizes(width, height);

    this.renderUI("questionsdiv", hide)
  }
}
