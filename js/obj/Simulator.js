class Simulator {
  constructor() {
    this.m_pause = false;
    this.m_mode = "Nernst";

    this.m_sidebar_size_multiple = 0.35;  // Equation sidebar 35% height of the screen by default. Goes to 100% (1.0) when expanded
    this.m_sidebar_current = 0.35;        // Current value of the sidebar height

    this.m_canvas_size_multiple = 0.65;   // Canvas width and height will be 65% of the screen's width and height.

    this.m_canvas_width;
    this.m_canvas_height;

    this.m_checkboxes = [];
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

  canvasSize(w, h, canvasDOM) {
    this.setSize(w, h);
    canvasDOM.size(w, h);
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

  renderUI(id, mode) {
    //Input DOM object/chartjs object, Boolean
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

    this.adjustUISize();
    animationSequencer.current().setContainerSizes(this.m_canvas_width, this.m_canvas_height);
  }

  adjustUISize() {
    // input: Floats
    // usage: Resizing the question/equation window; 0.35 (including question), 1 (excluding question)
    var adjustedWindowHeight = windowHeight - 36;

    var newCanWidth = this.m_canvas_size_multiple * windowWidth;
    var newCanHeight = (this.m_canvas_size_multiple * adjustedWindowHeight) - 4;

    // Complement's width and height
    // aka, 0.35 multiplier instead of 0.65
    var compWidth = (1 - this.m_canvas_size_multiple) * windowWidth;
    var compHeight = (1 - this.m_canvas_size_multiple) * adjustedWindowHeight;

    var sideHeight = this.m_sidebar_current * adjustedWindowHeight;
    var compSideHeight = (1 - this.m_sidebar_current) * adjustedWindowHeight;

    stage.size(windowWidth, adjustedWindowHeight);
    firstBox.size(compWidth, adjustedWindowHeight);
    secondBox.size(newCanWidth, adjustedWindowHeight);

    questions.size(compWidth, compSideHeight);
    equationContainer.size(compWidth, sideHeight);

    leftBox.size(compWidth, compSideHeight);
    hideBar.size(compWidth, 20);
    equi.size(compWidth, 40);

    equation.size(compWidth, sideHeight - 40 - 20);
    simulator.size(newCanWidth, newCanHeight);

    simulatorInputContainer.size(newCanWidth, compHeight);

    simulatorInput.size(newCanWidth, 0.90 * newCanHeight);
    controlsLeft.size(newCanWidth / 2, 0.35 * newCanHeight);
    controlsRight.size(newCanWidth / 2, 0.35 * newCanHeight);
    particleControl.size(newCanWidth, 0.1 * 0.80 * adjustedWindowHeight);

    this.canvasSize (
      newCanWidth,
      newCanHeight,
      canvas
    );
  }
}
