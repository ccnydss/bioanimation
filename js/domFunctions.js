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

  var leftbarStatus = document.getElementById("leftbar");
  leftbarStatus.style.display = "flex";

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
  document.getElementById('simulatorSetting').style.display = "none";

  makeTable(
    "NernstSetting",
    "equationdiv",
    ["T"],
    ["K"],
    [tempSetting, Na.charge]
  );

  makeTable(
    "GoldmanSetting",
    "equationdiv",
    ["T", "p<sub>Na</sub>", "p<sub>Cl</sub>", "p<sub>K</sub>"],
    ["K", "", "", ""],
    [tempSetting, Na.permeability, Cl.permeability, K.permeability]
  );

  // Plot window
  dataPlot = createDiv('<canvas id="dataPlot"></canvas>');
  dataPlot.parent('equationdiv');
  var dataPlot = document.querySelector('#dataPlot')
  dataPlot.style.display = "none";
  // Plot window

  simulator = createDiv("");
  simulator.id('sim');
  simulator.parent('secondBox');
  simulator.size(0.65 * windowWidth, 0.65 * (windowHeight - 36));

  // Define the global canWidth & canHeight variables~
  canWidth = simulator.size().width;
  canHeight = simulator.size().height - 8;

  simCanvasPause = createElement("div", "Paused");
  simCanvasPause.id('simCanvasPause');
  simCanvasPause.parent('sim');
  document.getElementById('simCanvasPause').style.display = "none";

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
  if (equationContainerHeighthMul == equationHeightPercent) {
    //Turn the question menu off
    renderUI("hidebarText",true)
    renderUI("simulatorSetting",true)

    var curUI = (simulatorMode == "Nernst") ? "NernstSetting" : "GoldmanSetting"
    renderUI(curUI,true)

    renderUI("dataPlot",true)
    renderUI("helpSetting",true)
    renderUI("helpQuestion",false)

    redrawUI(false);
  } else {
    //Turn the question menu on
    renderUI("hidebarText",false)
    renderUI("simulatorSetting",false)

    var curUI = (simulatorMode == "Nernst") ? "NernstSetting" : "GoldmanSetting"
    renderUI(curUI,false)

    renderUI("dataPlot",false)
    renderUI("helpSetting",false)
    renderUI("helpQuestion",true)

    redrawUI(true);
  }
}

function makeTable(id, parent, content, contentUnit, contentDefaultValue, prevLength) {
  var table = createElement('table')

  table.id(id);
  table.parent(parent);

  var tableRow = content.length;

  document.getElementById(table.id()).style.display = "none";

  for (var i = 0; i < tableRow; i++) {
    var trow = createElement('tr');
    trow.parent(table);

    var td0 = createElement('td');
    td0.parent(trow);

    var td1 = createElement('td');
    td1.parent(trow);

    simSettingText = createElement('h4', content[i]);
    simSettingText.parent(td0);

    simSetting[i] = createInput();
    simSetting[i].parent(parent);
    simSetting[i].value(contentDefaultValue[i])
    simSetting[i].parent(td1);
    simSetting[i].id(i);
    simSetting[i].input(ChangesimulatorSetting);

    var td3 = createElement('td', contentUnit[i]);
    td3.parent(trow);
  }
}
