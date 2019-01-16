// Purpose: Provide an interface to control the simulation parameters and track state

class Simulator {
  constructor() {
    this.m_pause = false;

    this.m_dom = new SimulatorDOM(this)

    this.m_mode = "Nernst";
    this.m_particle_types = ["Na", "Cl", "K"];

    this.m_settings = {
      temperature: 37 + 273.13,           // 37 is the human body temperature
      gas_constant: 8.314,                // Ideal gas constant
      faraday: 96485.3329                 // Faraday's constant
    };

    this.m_nernst_particle = "Na";       // For Nernst mode
  }

  pause() {
    this.m_pause = !this.m_pause;

    if (!this.m_pause) {
      loop();
      document.getElementById('simCanvasPause').style.display = "none";
      document.getElementById('simCanvasPauseIcon').innerText = "❚❚";
    } else {
      noLoop();
      document.getElementById('simCanvasPause').style.display = "flex";
      document.getElementById('simCanvasPauseIcon').innerText = "►";
    }
  }

  keyInput() {
    var spacebar = 32;
    var Q_key = 81;
    var W_key = 87;

    switch (keyCode) {
      case spacebar:
      this.pause();
      break;

      case Q_key:
      animationSequencer.prev(false);
      updateAll();
      break;

      case W_key:
      animationSequencer.next(false);
      updateAll();
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
      document.getElementById("hidebarText").innerText = (mode) ? ">" : "<";
      break;

      case "setting":
      document.getElementById("setting").style.display = (mode) ? "initial" : "none";
      break;

      case "simulatorSetting":
      document.getElementById('simulatorSetting').className = (mode) ? "" : "hidden";
      break;

      case "questionsdiv":
      document.getElementById('questionsdiv').className = (mode) ? "" : "hidden";
      document.getElementById('leftbar').className = (mode) ? "" : "hidden";
      document.getElementById('equationContainer').className = (mode) ? "" : "fullsize";
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

      case "dataPlot":
      document.getElementById('dataPlot').className = (mode) ? "" : "hidden";
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

  questionsAreHidden() {
    return this.m_dom.m_sidebar_current != this.m_dom.m_sidebar_size_multiple;
  }

  simMode(mode=null) {
    if (mode) {
      this.m_mode = mode;
    } else {
      return this.m_mode;
    };

    this.buttonModeSwitch();
  }

  changeSimulatorSettings(evt) {
    // input: the element that triggered the event (Input buttons);

    var eventID = evt.target.id;
    //0 = temperature
    //1 = charge *Removed*
    //1 = temperature
    //2 = Pna
    //3 = Pcl
    //4 = Pk

    if (eventID == 0) {
      tempSetting = updatedAmount;
      simSetting[0].value(updatedAmount);
    }
    if (eventID == 1) {
      Na.permeability = updatedAmount;
      // NOTE: Why is this function call empty?
      FormulaInputCalculation();
    }
    if (eventID == 2) {
      Cl.permeability = updatedAmount;
      FormulaInputCalculation();
    }
    if (eventID == 3) {
      K.permeability = updatedAmount;
      FormulaInputCalculation();
    }

    if (simulatorMode == "Goldman") {
      FormulaInputCalculation();
    } else {
      if (Na.display == true) {
        FormulaInputCalculation("Na");
      } else if (Cl.display == true) {
        FormulaInputCalculation("Cl");
      } else if (K.display == true) {
        FormulaInputCalculation("K");
      }
    }
  }

  setAnswer(answer) {
    this.m_dom.m_equationResult.html('Answer: ' + answer);
  }

  buttonModeSwitch() {
    var NernstButtonStatus = document.getElementById("NernstButton");
    var GoldmanButtonStatus = document.getElementById("GoldmanButton");

    if (this.m_mode == "Nernst") {
      NernstButtonStatus.style.backgroundColor = "#74b9ff";
      GoldmanButtonStatus.style.backgroundColor = "#dfe6e9";
    } else {
      NernstButtonStatus.style.backgroundColor = "#dfe6e9";
      GoldmanButtonStatus.style.backgroundColor = "#74b9ff";
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
