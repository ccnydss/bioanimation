function makeLayout() {
  // Make the entire stage. This represents the entire, outer box containing the simulator, sidebar, and controls.
  // stage = createDiv('');
  // stage.id('stage');
  // stage.class ('flex-container');
  // stage.parent('root');
  //
  // firstBox = createDiv("");
  // firstBox.id('firstBox');
  // firstBox.parent('stage');
  //
  // secondBox = createDiv("");
  // secondBox.id('secondBox');
  // secondBox.parent('stage');

  mainSim.m_dom.setup();

  // // The right sidebar for displaying questions.
  // leftBox = createDiv("");
  // leftBox.id('leftbar');
  // leftBox.parent('firstBox');

  var leftbarStatus = document.getElementById("leftbar");
  leftbarStatus.style.display = "flex";

  // // Create the div to actually contain the questions.
  // questions = createDiv("");
  // questions.id('questionsdiv');
  // questions.parent('leftbar');
  // questionTitle = createElement("h3", "Goldman-Hodgkin-Katz").parent('questionsdiv');
  // questionTitle.id('questionTitle');
  //
  // var questionsText = "Calculate the equilibrium potential for Na and K using the Nernst equation for the following conditions";
  // var question = createElement("p", questionsText).parent('questionsdiv');
  // question.class ("questions");
  // question.id("q1");

  // // Div to contain the equation
  // equationContainer = createDiv("");
  // equationContainer.id('equationContainer');
  // equationContainer.parent('firstBox');
  //
  // // The right sidebar for displaying questions.
  // hideBar = createDiv("");
  // hideBar.id('hidebar');
  // hideBar.parent('equationContainer');
  // hideBar.mousePressed(hideQuestion);

  // hideBarText = createElement("div", "<");
  // hideBarText.id('hidebarText');
  // hideBarText.parent("hidebar");
  //
  // equation = createDiv("");
  // equation.id('equationdiv');
  // equation.parent('equationContainer');
  //
  // equi = createButton('Equilibrate');
  // equi.id('equilibrate-button');
  // equi.parent('equationContainer');
  // equi.mousePressed(startEquilibrate);

  renderMathEqn();

  // simulatorSetting = createElement("div", "Simulation Settings");
  // simulatorSetting.id('simulatorSetting');
  // simulatorSetting.parent("equationdiv");

  var table = createElement('table')
  table.id('setting');
  table.parent('simulatorSetting');
  table.addClass('setting');

  // NOTE: Move to renderUI
  document.getElementById(table.id()).style.display = "none";

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

  // // Plot window
  // dataPlot = createDiv('<canvas id="dataPlot"></canvas>');
  // dataPlot.parent('equationdiv');
  var dataPlot = document.querySelector('#dataPlot')
  // dataPlot.style.display = "none";
  mainSim.renderUI("dataPlot", false);
  //
  // simulator = createDiv("");
  // simulator.id('sim');
  // simulator.parent('secondBox');
  // simulator.size(0.65 * windowWidth, 0.65 * (windowHeight - 36));
  //
  // simCanvasPause = createElement("div", "Paused");
  // simCanvasPause.id('simCanvasPause');
  // simCanvasPause.parent('sim');
  document.getElementById('simCanvasPause').style.display = "none";

  // // Now to create the canvas
  // canvas = mainSim.m_dom.canvasCreate(simulator.size().width, simulator.size().height - 8);
  // canvas.id ('can');
  // canvas.parent('sim');

  document.getElementById("sim").onmouseover = function() {showPause(true)};
  document.getElementById("sim").onmouseout = function() {showPause(false)};

  document.getElementById('simCanvasPause').style.display = "none";

  document.getElementById('simCanvasFrame').style.display = "none";

  document.getElementById("simCanvasPauseIcon").onclick = function() {mainSim.pause()};

  // Div to contain the simulatorInput
  simulatorInputContainer = createDiv("");
  simulatorInputContainer.id('simulatorInputContainer');
  simulatorInputContainer.parent('secondBox');

  simulatorInput = createDiv('');
  simulatorInput.id('simInput');
  simulatorInput.parent('simulatorInputContainer');

  //Control UI ----------------------------
  controlsLeft = createDiv('');
  controlsLeft.class ('controls');
  controlsLeft.parent('simInput');

  controlsRight = createDiv('');
  controlsRight.class ('controls');
  controlsRight.parent('simInput');

  control0 = createDiv('');
  control0.class ('control');
  control0.parent(controlsLeft);

  control1 = createDiv('');
  control1.class ('control');
  control1.parent(controlsLeft);

  control2 = createDiv('');
  control2.class ('control');
  control2.parent(controlsLeft);

  control3 = createDiv('');
  control3.class ('control');
  control3.parent(controlsRight);

  control4 = createDiv('');
  control4.class ('control');
  control4.parent(controlsRight);

  control5 = createDiv('');
  control5.class ('control');
  control5.parent(controlsRight);

  particleControl = createDiv('');
  particleControl.id('particleControl');
  particleControl.parent('simulatorInputContainer');

  mainSim.m_dom.adjustUISize();
}

function renderMathEqn() {
  var nernstEqn = document.getElementById("NernstEqn");
  var goldmanEqn = document.getElementById("GoldmanEqn");
  document.getElementById("equationdiv").appendChild(nernstEqn);
  document.getElementById("equationdiv").appendChild(goldmanEqn);
}

function hideQuestion(evt) {
  // input: the element that triggered the event (hide buttons [arrow]);
  var show = mainSim.questionsAreHidden(); // Check if the questions are already hidden. If TRUE, we should show them. If FALSE, we should hide them.
  var hide = !show;

  //Turn the question menu off
  mainSim.renderUI("hidebarText", hide)
  mainSim.renderUI("simulatorSetting", hide)

  var curUI = (mainSim.simMode() == "Nernst") ? "NernstSetting" : "GoldmanSetting"
  mainSim.renderUI(curUI, hide)

  mainSim.renderUI("dataPlot", hide)

  mainSim.redrawUI(show);
}

function makeTable(id, parent, content, placeholder, contentUnit, contentDefaultValue, prevLength) {

  var settingPart = createDiv('');
  settingPart.id(id)
  settingPart.parent(parent);

  var tableRow = content.length;

  for (var i = 0; i < tableRow; i++) {
    var trow = createElement('tr');
    trow.parent(settingPart);

    var td0 = createElement('label', content[i]);
    td0.parent(trow);

    simSetting[i] = createInput().attribute('placeholder', placeholder[i]);;
    simSetting[i].parent(parent);
    simSetting[i].value(contentDefaultValue[i])
    simSetting[i].parent(trow);
    simSetting[i].id(i);
    simSetting[i].input(mainSim.changeSimulatorSettings.bind(mainSim));

    var td3 = createDiv(contentUnit[i]);
    td3.parent(trow);
    if(contentUnit[i]) {
      td3.addClass('unit');
    }

  }
}
