// Purpose: Provide an interface to control the simulation parameters and track state

class Simulator {
  constructor() {
    this.m_pause = false;

    this.m_dom = new SimulatorDOM(this)

    this.m_mode = "Nernst";
    this.m_particle_types = ["Na", "Cl", "K"];

    this.m_checkboxes = [];

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
    } else {
      noLoop();
      document.getElementById('simCanvasPause').style.display = "flex";
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

  numParticleTypes() {
    return this.m_particle_types.length;
  }

  renderUI(id, mode) {
    // Inputs: HTML id name (str), Boolean
    switch (id) {
      case "hidebarText":
      document.getElementById("hidebarText").innerText = (mode) ? ">" : "<";
      break;

      case "simulatorSetting":
      document.getElementById('simulatorSetting').style.display = (mode) ? "flex" : "none";
      break;

      case "NernstSetting":
      document.getElementById('NernstSetting').style.display = (mode) ? "initial" : "none";
      break;

      case "GoldmanSetting":
      document.getElementById('GoldmanSetting').style.display = (mode) ? "initial" : "none";
      break;

      case "helpQuestion":
      document.getElementById('helpQuestion').style.display = (mode) ? "initial" : "none";
      break;

      case "helpSetting":
      document.getElementById('helpSetting').style.height = (mode) ? "initial" : "100%";
      break;

      case "dataPlot":
      document.getElementById('dataPlot').style.display = (mode) ? "initial" : "none";
      break;
    }
  }

  questionsAreHidden() {
    return this.m_sidebar_current != this.m_sidebar_size_multiple;
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
    console.log("changing settings", this);

    var eventID = evt.target.id;
    //0 = temperature
    //1 = charge *Removed*
    //1 = temperature
    //2 = Pna
    //3 = Pcl
    //4 = Pk
    var updatedAmount = simSetting[eventID].value();

    if (eventID == 0 || eventID == 1) {
      this.m_settings.temperature = updatedAmount;
      simSetting[0].value(updatedAmount);
      simSetting[1].value(updatedAmount);
    }
    if (eventID == 2) {
      Na.permeability = updatedAmount;
      // NOTE: Why is this function call empty?
      FormulaInputCalculation();
    }
    if (eventID == 3) {
      Cl.permeability = updatedAmount;
      FormulaInputCalculation();
    }
    if (eventID == 4) {
      K.permeability = updatedAmount;
      FormulaInputCalculation();
    }

    if (mainSim.simMode() == "Goldman") {
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

  redrawUI(enableQuestionBox) {
    // input: Boolean
    // usage: True is for initializing the UI; False is for recreating UI when browser window is resized (responsive UI)
    this.m_sidebar_current = enableQuestionBox ? this.m_sidebar_size_multiple : 1;

    this.m_dom.adjustUISize();
    animationSequencer.current().setContainerSizes(this.m_dom.m_canvas_width, this.m_dom.m_canvas_height);
  }
}
