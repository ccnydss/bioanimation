// Purpose: Provide an interface to control the simulation parameters and track state
class Simulator {
  constructor() {
    this.particle_types = ["Na", "Cl", "K"];

    this.pause = false;

    this.dom = new SimulatorDOM(this)

    this.mode = "Nernst";
    this.nernst_particle = "Na";       // Contains the currently selected particle in Nernst mode

    this.nernst_eq = new NernstEq(this);
    this.goldman_eq = new GoldmanEq(this);

    this.settings = {
      temperature: 37 + 273.13,           // 37 is the human body temperature
      gas_constant: 8.314,                // Ideal gas constant
      faraday: 96485.3329                 // Faraday's constant
    };

    this.tabList = ['aboutPage','contactPage','helpPage']
    this.preset = new Preset(this);
  }

  pause() {
    this.pause = !this.pause;

    if (!this.pause) {
      loop();
      document.getElementById('simCanvasPause').style.display = "none";
      document.getElementById('simCanvasPauseIcon').innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      noLoop();
      document.getElementById('simCanvasPause').style.display = "flex";
      document.getElementById('simCanvasPauseIcon').innerHTML = '<i class="fas fa-play"></i>';
    }
  }

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

  numParticleTypes() {
    return this.particle_types.length;
  }

  renderUI(id, mode) {
    //Input DOM object/chartjs object, Boolean
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
      document.getElementById('NernstSetting').style.display = (mode) ? "block" : "none";
      document.getElementById('setting').style.display = (mode) ? "initial" : "none";
      break;

      case "GoldmanSetting":
      document.getElementById('GoldmanSetting').style.display = (mode) ? "block" : "none";
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
      } else { document.getElementById('dataPlot').classList.add("hide")}
      //Note chartjs chart has a class called 'chartjs-render-monitor' by default, but this class is conflict with our animation
      break;

      case "simCanvasPause":
      document.getElementById('simCanvasPause').style.display = (mode) ? "flex" : "none";
      if(mode) {noloop();} else {loop()};
      break;

      case "leftbar":
      document.getElementById('leftbar').style.display = (mode) ? "flex" : "none";
      break;

      case "simCanvasFrame":
      document.getElementById('simCanvasFrame').style.display = (mode) ? "flex" : "none";
      break;
    }
  }

  toggleTab(target) {
    //Input 1: String

    //First, close all other tabs
    for(let i = 0;i<this.tabList.length;i++) {
      if(this.tabList[i] != target) {
        document.getElementById(this.tabList[i]).style.display = 'none'
        if(this.tabList[i]=='helpPage')
        help.clear()
      }
    }

    var page = document.getElementById(target);

    if(page.style.display == "flex") {
      page.style.display = 'none'

      if(target=='helpPage')
      help.clear()
    } else {
      page.style.display = 'flex'
      if(target=='helpPage')
      help.initialize()
      help.resize()
    }


  }

  questionsAreHidden() {
    return this.dom.sidebar_current != this.dom.sidebar_size_multiple;
  }

  simMode(mode=null) {
    if (mode) {
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

  updateInputs(amount, particleID) {
    this.dom.sim_inputs.controls_list["outside"].rows[particleID].value(amount);
    this.dom.sim_inputs.controls_list["inside"].rows[particleID].value(amount);
  }

  updateInputLoc(particleID, location, amount) {
    this.dom.sim_inputs.controls_list[location].rows[particleID].value(amount);
  }

  updateParticles(ptype, ploc, updatedAmount, noCompute) {
    //mainSim.updateParticles("Na","outside",13)
    var numParticles = animationSequencer.current().getNumParticles(ploc, ptype);
    var maxParticles = animationSequencer.current().MAX_PARTICLES;
    var minParticles = animationSequencer.current().MIN_PARTICLES;

    // If the amount entered is invalid, alert user
    if (
      isNaN(updatedAmount) ||
      updatedAmount < 0
    ) {
      alert("Please enter a valid number.");
      evt.target.value = updatedAmount.slice(0, -1); // Erase the last character
      return;
    } else if (updatedAmount > maxParticles) {
      // If the amount entered is greater than the maximum, force it to maximum and alert user
      alert("Maximum amount is " + maxParticles + ".");
      updatedAmount = maxParticles;
    } else if (updatedAmount <= 1 && updatedAmount>0) {
      updatedAmount = minParticles;
    } else if (updatedAmount <= minParticles) {
      alert("Must have at least " + minParticles + " particle.");
      updatedAmount = minParticles;
    }

    if(!noCompute)
    this.computeAll(ptype);

    var updatedParticles = round(updatedAmount);
    var difference = Math.abs(updatedParticles - numParticles);

    // If the amount entered is less than 0, increase the amount
    if (updatedParticles > numParticles) {
      for (var i = 0; i < difference; i++) {
        animationSequencer.current().insertNewParticle(ploc, ptype);
      }
    } else if (updatedParticles < numParticles) {
      for (var i = 0; i < difference; i++) {
        animationSequencer.current().removeParticle(ploc, ptype, 0);
      }
    }

    var id = particleMapper[ptype].id;
    this.updateInputLoc(id, ploc, updatedAmount);
  }

  changeSimulatorSettings(evt) {
    // input: the element that triggered the event (Input buttons);

    var updatedAmount = evt.target.value;
    var eventID = evt.target.id;

    if (eventID == 0) {
      // Set temperature
      if (evt.target.value <= 313.15) {
        this.settings.temperature = updatedAmount;
        this.dom.settings[eventID].value(updatedAmount);
      } else {
        alert("Max temperature is 40 C");
        this.settings.temperature = 313.15;
        this.dom.settings[eventID].value(313.15);
      }
    }
    if (eventID == 1) {
      Na.permeability = updatedAmount;
    }
    if (eventID == 2) {
      Cl.permeability = updatedAmount;
    }
    if (eventID == 3) {
      K.permeability = updatedAmount;
    }

    FormulaInputCalculation(this.nernst_particle);
  }

  setAnswer(answer, type) {
    this.dom.equationResult.setAnswer(answer, type);
  }

  computeAll(selected) {
    this.setAnswer(this.nernst_eq.result("Na"), "Na");
    this.setAnswer(this.nernst_eq.result("K"), "K");
    this.setAnswer(this.nernst_eq.result("Cl"), "Cl");
    this.setAnswer(this.goldman_eq.result(), "Net");

    this.dom.equationResult.setSelected(selected);
  }

  buttonModeSwitch() {
    if (this.mode == "Nernst") {
      this.dom.sim_inputs.NernstButton.style('backgroundColor', "#74b9ff");
      this.dom.sim_inputs.GoldmanButton.style('backgroundColor', "#dfe6e9");
    } else {
      this.dom.sim_inputs.NernstButton.style('backgroundColor', "#dfe6e9");
      this.dom.sim_inputs.GoldmanButton.style('backgroundColor', "#74b9ff");
    }
  }

  resize() {
    var drawWithQuestions = !this.questionsAreHidden();
    this.redrawUI(drawWithQuestions);
  }

  redrawUI(hide) {
    // input: Boolean
    // usage: True is for initializing the UI; False is for recreating UI when browser window is resized (responsive UI)

    this.dom.sidebar_current = hide ? this.dom.sidebar_size_multiple : 1;
    this.dom.adjustUISize();

    var { width, height } = this.dom.getSize();
    animationSequencer.current().setContainerSizes(width, height);

    this.renderUI("questionsdiv", hide)
  }
}
