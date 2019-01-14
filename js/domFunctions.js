const equationHeightPercent = 0.35;
equationContainerHeighthMul = equationHeightPercent;

function makeLayout() {
  // Make the entire stage. This represents the entire, outer box containing the simulator, sidebar, and controls.
  stage = createDiv('');
  stage.id('stage');
  stage.class ('flex-container');
  stage.parent('root');

  firstBox = createDiv("");
  firstBox.id('firstBox');
  firstBox.parent('stage');

  secondBox = createDiv("");
  secondBox.id('secondBox');
  secondBox.parent('stage');

  // The right sidebar for displaying questions.
  leftBox = createDiv("");
  leftBox.id('leftbar');
  leftBox.parent('firstBox');
  renderUI("leftbar",true)

  // Create the div to actually contain the questions.
  questions = createDiv("");
  questions.id('questionsdiv');
  questions.parent('leftbar');
  questionTitle = createElement("h3", "Goldman-Hodgkin-Katz").parent('questionsdiv');
  questionTitle.id('questionTitle');

  var questionsText = "Calculate the equilibrium potential for Na and K using the Nernst equation for the following conditions";
  var question = createElement("p", questionsText).parent('questionsdiv');
  question.class ("questions");
  question.id("q1");

  // Div to contain the equation
  equationContainer = createDiv("");
  equationContainer.id('equationContainer');
  equationContainer.parent('firstBox');

  // The right sidebar for displaying questions.
  hideBar = createDiv("");
  hideBar.id('hidebar');
  hideBar.parent('equationContainer');
  hideBar.mousePressed(hideQuestion);

  hideBarText = createElement("div", "<");
  hideBarText.id('hidebarText');
  hideBarText.parent("hidebar");

  equation = createDiv("");
  equation.id('equationdiv');
  equation.parent('equationContainer');

  equi = createButton('Equilibrate');
  equi.id('equilibrate-button');
  equi.parent('equationContainer');
  equi.mousePressed(startEquilibrate);

  renderMathEqn();

  simulatorSetting = createElement("div", "Simulation Settings");
  simulatorSetting.id('simulatorSetting');
  simulatorSetting.parent("equationdiv");
  renderUI('simulatorSetting',false);

  var table = createElement('table')
  table.id('setting');
  table.parent('simulatorSetting');
  table.addClass('setting');
  document.getElementById(table.id()).style.display = "none";

  makeTable(
    "NernstSetting",
    "setting",
    ["T"],
    ["Enter Temperature..."],
    ["K"],
    [tempSetting]
  );

  makeTable(
    "GoldmanSetting",
    "setting",
    ["p<sub>Na</sub>", "p<sub>Cl</sub>", "p<sub>K</sub>"],
    ["Enter Na permeability...","Enter Cl permeability...","Enter K permeability..."],
    ["", "", ""],
    [Na.permeability, Cl.permeability, K.permeability]
  );


  // Plot window
  var dataPlot = document.createElement("canvas");
  dataPlot.id = 'dataPlot';
  document.querySelector('#equationdiv').appendChild(dataPlot);
  renderUI('dataPlot',false);

  simulator = createDiv("");
  simulator.id('sim');
  document.getElementById("sim").onmouseover = function() {showPause(true)};
  document.getElementById("sim").onmouseout = function() {showPause(false)};
  simulator.parent('secondBox');
  simulator.size(0.65 * windowWidth, 0.65 * (windowHeight - 36));

  // Define the global canWidth & canHeight variables~
  canWidth = simulator.size().width;
  canHeight = simulator.size().height - 8;

  simCanvasPause = createElement("div", "Paused");
  simCanvasPause.id('simCanvasPause');
  simCanvasPause.parent('sim');
  document.getElementById('simCanvasPause').style.display = "none";

  simCanvasFrame = createElement("div", "");
  simCanvasFrame.id('simCanvasFrame');
  simCanvasFrame.parent('sim');
  document.getElementById('simCanvasFrame').style.display = "none";

  simCanvasPauseIcon = createElement("div", "❚❚");
  simCanvasPauseIcon.id('simCanvasPauseIcon');
  simCanvasPauseIcon.parent('simCanvasFrame');
  document.getElementById("simCanvasPauseIcon").onclick = function() {mainSim.pause()};

  // Now to create the canvas
  canvas = createCanvas(canWidth, canHeight);
  canvas.id ('can');
  canvas.parent('sim');

  window.onresize = function() {
    if (equationContainerHeighthMul == 0.35) {
      redrawUI(true);
    } else {
      redrawUI(false);
    }
  };

  // Div to contain the simulatorInput
  simulatorInputContainer = createDiv("");
  simulatorInputContainer.id('simulatorInputContainer');
  simulatorInputContainer.parent('secondBox');

  simuWidth = 0.65 * windowWidth;

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

  adjustUISize(equationHeightPercent);
}

function renderMathEqn() {
  var nernstEqn = document.getElementById("NernstEqn");
  var goldmanEqn = document.getElementById("GoldmanEqn");
    document.getElementById("equationdiv").appendChild(nernstEqn);
    document.getElementById("equationdiv").appendChild(goldmanEqn);
}

function hideQuestion(evt) {
  // input: the element that triggered the event (hide buttons [arrow]);
  var hide = equationContainerHeighthMul == equationHeightPercent;

  //Turn the question menu off
  renderUI("hidebarText", hide)
  renderUI("simulatorSetting", hide)

  var curUI = (simulatorMode == "Nernst") ? "NernstSetting" : "GoldmanSetting"
  renderUI(curUI,hide)

  renderUI("dataPlot", hide)

  redrawUI(!hide);
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
    simSetting[i].input(changeSimulatorSetting);

    var td3 = createDiv(contentUnit[i]);
    td3.parent(trow);
    if(contentUnit[i]) {
    td3.addClass('unit');
    }

  }
}
