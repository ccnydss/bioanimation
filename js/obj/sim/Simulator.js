// Purpose: Provide an interface to control the simulation parameters and track state
class Simulator {
  constructor() {
    this.m_particle_types = ["Na", "Cl", "K"];

    this.m_pause = false;

    this.m_dom = new SimulatorDOM(this)

    this.m_mode = "Nernst";
    this.m_nernst_particle = "Na";       // Contains the currently selected particle in Nernst mode

    this.m_nernst_eq = new NernstEq(this);
    this.m_goldman_eq = new GoldmanEq(this);

    this.m_settings = {
      temperature: 37 + 273.13,           // 37 is the human body temperature
      gas_constant: 8.314,                // Ideal gas constant
      faraday: 96485.3329                 // Faraday's constant
    };

    this.m_tabList = ['aboutPage','contactPage','helpPage']
  }

  pause() {
    this.m_pause = !this.m_pause;

    if (!this.m_pause) {
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
      this.m_dom.m_sim_controls.updateAll();
      break;

      case W_key:
      animationSequencer.next(false);
      this.m_dom.m_sim_controls.updateAll();
      break;

      case S_key:
      this.m_dom.swapChart();
      break;
    }
  }

  numParticleTypes() {
    return this.m_particle_types.length;
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
        document.getElementById('questionsdiv').classList.remove("hidden")
        document.getElementById('leftbar').classList.remove("hidden")
        document.getElementById('equationContainer').classList.remove("fullsize")
      } else {
        document.getElementById('questionsdiv').classList.add("hidden")
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
      } else {
        document.getElementById('leftWindow').classList.add("hidden");
      };
      break;

      case "dataPlot":
      if (mode) {
        document.getElementById('dataPlot').classList.remove("hidden")
      } else { document.getElementById('dataPlot').classList.add("hidden")}
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
    for(let i = 0;i<this.m_tabList.length;i++) {
      if(this.m_tabList[i] != target) {
        document.getElementById(this.m_tabList[i]).style.display = 'none'
        if(this.m_tabList[i]=='helpPage')
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
    }


  }

  questionsAreHidden() {
    return this.m_dom.m_sidebar_current != this.m_dom.m_sidebar_size_multiple;
  }

  simMode(mode=null) {
    if (mode) {
      var header = "Goldman-Hodgkin-Katz";
      if (mode == "Nernst") header = "Nernst Equation";
      this.m_dom.m_sim_question.m_header = header;
      this.m_dom.m_sim_question.m_title.html(header);
      this.m_mode = mode;
    } else {
      return this.m_mode;
    };

    this.buttonModeSwitch();
  }

  updateInputs(amount, particleID) {
    this.m_dom.m_sim_controls.controls["outside"].rows[particleID].value(amount);
    this.m_dom.m_sim_controls.controls["inside"].rows[particleID].value(amount);
  }

  changeSimulatorSettings(evt) {
    // input: the element that triggered the event (Input buttons);

    var updatedAmount = evt.target.value;
    var eventID = evt.target.id;

    if (eventID == 0) {
      // Set temperature
      if (evt.target.value <= 313.15) {
        this.m_settings.temperature = updatedAmount;
        this.m_dom.m_settings[eventID].value(updatedAmount);
      } else {
        alert("Max temperature is 40 C");
        this.m_settings.temperature = 313.15;
        this.m_dom.m_settings[eventID].value(313.15);
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

    FormulaInputCalculation(this.m_nernst_particle);
  }

  setAnswer(answer, type) {
    this.m_dom.m_equationResult.setAnswer(answer, type);
  }

  computeAll(selected) {
    this.setAnswer(this.m_nernst_eq.result("Na"), "Na");
    this.setAnswer(this.m_nernst_eq.result("K"), "K");
    this.setAnswer(this.m_nernst_eq.result("Cl"), "Cl");
    this.setAnswer(this.m_goldman_eq.result(), "Net");

    this.m_dom.m_equationResult.setSelected(selected);
  }

  buttonModeSwitch() {
    if (this.m_mode == "Nernst") {
      this.m_dom.m_sim_controls.m_NernstButton.style('backgroundColor', "#74b9ff");
      this.m_dom.m_sim_controls.m_GoldmanButton.style('backgroundColor', "#dfe6e9");
    } else {
      this.m_dom.m_sim_controls.m_NernstButton.style('backgroundColor', "#dfe6e9");
      this.m_dom.m_sim_controls.m_GoldmanButton.style('backgroundColor', "#74b9ff");
    }
  }

  resize() {
    var drawWithQuestions = !this.questionsAreHidden();
    this.redrawUI(drawWithQuestions);
  }

  redrawUI(hide) {
    // input: Boolean
    // usage: True is for initializing the UI; False is for recreating UI when browser window is resized (responsive UI)

    this.m_dom.m_sidebar_current = hide ? this.m_dom.m_sidebar_size_multiple : 1;
    this.m_dom.adjustUISize();

    var { width, height } = this.m_dom.getSize();
    animationSequencer.current().setContainerSizes(width, height);

    this.renderUI("questionsdiv", hide)
  }
}
