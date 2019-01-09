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

  // NOTE: Split this into a separate function
  function hideQuestion(evt) {
    // input: the element that triggered the event (hide buttons [arrow]);

    if (equationContainerHeighthMul == equationHeightPercent) { //Turn the question menu off
      document.getElementById("hidebarText").innerText = ">"
      document.getElementById('simulatorSetting').style.display = "flex";

      // Enable all the setting menu
      if (simulatorMode == "Nernst") {
        document.getElementById('NernstSetting').style.display = "initial";
      } else {
        document.getElementById('GoldmanSetting').style.display = "initial";
      }
      document.getElementById('dataPlot').style.display = "initial"

      document.getElementById('helpQuestion').style.display = "none";
      document.getElementById('helpSetting').style.height = "100%";
      redrawUI(false);
    } else { //Turn the question menu on
      document.getElementById("hidebarText").innerText = "<"
      document.getElementById('simulatorSetting').style.display = "none";

      // Disable all the setting menu
      if (simulatorMode == "Nernst") {
        document.getElementById('NernstSetting').style.display = "none";
      } else {
        document.getElementById('GoldmanSetting').style.display = "none";
      }
      document.getElementById('dataPlot').style.display = "none";

      document.getElementById('helpQuestion').style.display = "initial";
      document.getElementById('helpSetting').style.height = "35%";
      redrawUI(true);
    }

  }

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

  makeNeqMML();
  makeGoldmanEqn();

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

function makeNeqMML() {
  math = document.getElementById("matheqn");
    document.getElementById("equationdiv").appendChild(math);


}

function makeGoldmanEqn() {
  mathGoldman = createElement("math");
  mathGoldman.attribute("xmlns", "http://www.w3.org/1998/Math/MathML");
  mathGoldman.id('mathGoldman');
  mathGoldman.parent('equationdiv');

  msub0Goldman = createElement("msub");
  msub0Goldman.id('msub0Goldman');
  msub0Goldman.parent('mathGoldman');

  mi0Goldman = createElement("mi", "V");
  mi0Goldman.parent("msub0Goldman");

  mi1Goldman = createElement("mi", "rest");
  mi1Goldman.parent("msub0Goldman");

  eqSignGoldman = createElement("mo", "=");
  eqSignGoldman.parent("mathGoldman");

  // -------------------------------------
  // RT/F
  mrow1Goldman = createElement("mrow");
  mrow1Goldman.id("mrow1Goldman");
  mrow1Goldman.parent("mathGoldman");

  mfrac0Goldman = createElement("mfrac");
  mfrac0Goldman.id("mfrac0Goldman");
  mfrac0Goldman.parent("mrow1Goldman");

  mrow2pGoldman = createElement("mrow");
  mrow2pGoldman.id("mrow2pGoldman");
  mrow2pGoldman.parent("mfrac0Goldman");
  mi2Goldman = createElement("mi", "R");
  mi2Goldman.parent("mrow2pGoldman");
  mi2pGoldman = createElement("mi", "T");
  mi2pGoldman.parent("mrow2pGoldman");

  mrow2Goldman = createElement("mrow");
  mrow2Goldman.id("mrow2Goldman");
  mrow2Goldman.parent("mfrac0Goldman");

  mi3Goldman = createElement("mi", "F");
  mi3Goldman.parent("mrow2Goldman");

  // -------------------------------------
  mi4Goldman = createElement("mi", "ln");
  mi4Goldman.parent("mathGoldman");

  // -------------------------------------
  mrow3Goldman = createElement("mrow");
  mrow3Goldman.id("mrow3Goldman");
  mrow3Goldman.parent("mathGoldman");

  mfrac1Goldman = createElement("mfrac");
  mfrac1Goldman.id("mfrac1Goldman");
  mfrac1Goldman.parent("mrow3Goldman");

  mrow4Goldman = createElement("mrow");
  mrow4Goldman.id("mrow4Goldman");
  mrow4Goldman.parent("mfrac1Goldman");

  // Na+
  msub1Goldman = createElement("msub");
  msub1Goldman.id("msub1Goldman");
  msub1Goldman.parent("mrow4Goldman");

  mi6Goldman = createElement("mi", "P");
  mi6Goldman.parent("msub1Goldman");

  mi7Goldman = createElement("mi", "Na");
  mi7Goldman.parent("msub1Goldman");

  mi8Goldman = createElement("mi", "[N");
  mi8Goldman.parent("mrow4Goldman");

  msup0Goldman = createElement("msup");
  msup0Goldman.id("msup0Goldman");
  msup0Goldman.parent("mrow4Goldman");

  mi9Goldman = createElement("mi", "a");
  mi9Goldman.parent("msup0Goldman");
  mo0Goldman = createElement("mo", "+");
  mo0Goldman.parent("msup0Goldman");

  msub2Goldman = createElement("msub");
  msub2Goldman.id("msub2Goldman");
  msub2Goldman.parent("mrow4Goldman");
  mo1Goldman = createElement("mo", "]");
  mo1Goldman.parent("msub2Goldman");
  mi10Goldman = createElement("mi", "out");
  mi10Goldman.parent("msub2Goldman");

  mo1Goldman = createElement("mo", "+");
  mo1Goldman.parent("mrow4Goldman");
  // -------------------------------------
  //Top

  // Cl

  msub3Goldman = createElement("msub");
  msub3Goldman.id("msub3Goldman");
  msub3Goldman.parent("mrow4Goldman");

  mi11Goldman = createElement("mi", "P");
  mi11Goldman.parent("msub3Goldman");

  mi12Goldman = createElement("mi", "Cl");
  mi12Goldman.parent("msub3Goldman");

  mi13Goldman = createElement("mi", "[C");
  mi13Goldman.parent("mrow4Goldman");

  msup1Goldman = createElement("msup");
  msup1Goldman.id("msup1Goldman");
  msup1Goldman.parent("mrow4Goldman");

  mi14Goldman = createElement("mi", "l");
  mi14Goldman.parent("msup1Goldman");
  mo2Goldman = createElement("mo", "-");
  mo2Goldman.parent("msup1Goldman");

  msub4Goldman = createElement("msub");
  msub4Goldman.id("msub4Goldman");
  msub4Goldman.parent("mrow4Goldman");
  mo3Goldman = createElement("mo", "]");
  mo3Goldman.parent("msub4Goldman");
  mi14Goldman = createElement("mi", "in");
  mi14Goldman.parent("msub4Goldman");

  mo2Goldman = createElement("mo", "+");
  mo2Goldman.parent("mrow4Goldman");

  // K

  msub5Goldman = createElement("msub");
  msub5Goldman.id("msub5Goldman");
  msub5Goldman.parent("mrow4Goldman");

  mi15Goldman = createElement("mi", "P");
  mi15Goldman.parent("msub5Goldman");

  mi16Goldman = createElement("mi", "K");
  mi16Goldman.parent("msub5Goldman");

  mo3Goldman = createElement("mo", "[");
  mo3Goldman.parent("mrow4Goldman");

  msup2 = createElement("msup");
  msup2.id("msup2Goldman");
  msup2.parent("mrow4Goldman");

  mi18Goldman = createElement("mi", "K");
  mi18Goldman.parent("msup2Goldman");
  mo3Goldman = createElement("mo", "-");
  mo3Goldman.parent("msup2Goldman");

  msub6Goldman = createElement("msub");
  msub6Goldman.id("msub6Goldman");
  msub6Goldman.parent("mrow4Goldman");
  mo4Goldman = createElement("mo", "]");
  mo4Goldman.parent("msub6Goldman");
  mi19Goldman = createElement("mi", "out");
  mi19Goldman.parent("msub6Goldman");

  // -------------------------------------
  //Bottom

  mrow5Goldman = createElement("mrow");
  mrow5Goldman.id("mrow5Goldman");
  mrow5Goldman.parent("mfrac1Goldman");

  // Na+
  msub7Goldman = createElement("msub");
  msub7Goldman.id("msub7Goldman");
  msub7Goldman.parent("mrow5Goldman");

  mi20Goldman = createElement("mi", "P");
  mi20Goldman.parent("msub7Goldman");

  mi21Goldman = createElement("mi", "Na");
  mi21Goldman.parent("msub7Goldman");

  mi22Goldman = createElement("mi", "[N");
  mi22Goldman.parent("mrow5Goldman");

  msup3Goldman = createElement("msup");
  msup3Goldman.id("msup3Goldman");
  msup3Goldman.parent("mrow5Goldman");

  mi23Goldman = createElement("mi", "a");
  mi23Goldman.parent("msup3Goldman");
  mo5Goldman = createElement("mo", "+");
  mo5Goldman.parent("msup3Goldman");

  msub8 = createElement("msub");
  msub8.id("msub8Goldman");
  msub8.parent("mrow5Goldman");
  mo6Goldman = createElement("mo", "]");
  mo6Goldman.parent("msub8Goldman");
  mi24Goldman = createElement("mi", "in");
  mi24Goldman.parent("msub8Goldman");

  mo7Goldman = createElement("mo", "+");
  mo7Goldman.parent("mrow5Goldman");

  // Cl

  msub9Goldman = createElement("msub");
  msub9Goldman.id("msub9Goldman");
  msub9Goldman.parent("mrow5Goldman");

  mi25Goldman = createElement("mi", "P");
  mi25Goldman.parent("msub9Goldman");

  mi26Goldman = createElement("mi", "Cl");
  mi26Goldman.parent("msub9Goldman");

  mi27Goldman = createElement("mi", "[C");
  mi27Goldman.parent("mrow5Goldman");

  msup4Goldman = createElement("msup");
  msup4Goldman.id("msup4Goldman");
  msup4Goldman.parent("mrow5Goldman");

  mi28Goldman = createElement("mi", "l");
  mi28Goldman.parent("msup4Goldman");
  mo8Goldman = createElement("mo", "-");
  mo8Goldman.parent("msup4Goldman");

  msub10Goldman = createElement("msub");
  msub10Goldman.id("msub10Goldman");
  msub10Goldman.parent("mrow5Goldman");

  mo9Goldman = createElement("mo", "]");
  mo9Goldman.parent("msub10Goldman");
  mi29Goldman = createElement("mi", "out");
  mi29Goldman.parent("msub10Goldman");

  mo7Goldman = createElement("mo", "+");
  mo7Goldman.parent("mrow5Goldman");

  // K
  msub11Goldman = createElement("msub");
  msub11Goldman.id("msub11Goldman");
  msub11Goldman.parent("mrow5Goldman");

  mi30Goldman = createElement("mi", "P");
  mi30Goldman.parent("msub11Goldman");

  mi31Goldman = createElement("mi", "K");
  mi31Goldman.parent("msub11Goldman");

  mo8Goldman = createElement("mo", "[");
  mo8Goldman.parent("mrow5Goldman");

  msup5Goldman = createElement("msup");
  msup5Goldman.id("msup5Goldman");
  msup5Goldman.parent("mrow5Goldman");

  mi32Goldman = createElement("mi", "K");
  mi32Goldman.parent("msup5Goldman");
  mo9Goldman = createElement("mo", "-");
  mo9Goldman.parent("msup5Goldman");

  msub12Goldman = createElement("msub");
  msub12Goldman.id("msub12Goldman");
  msub12Goldman.parent("mrow5Goldman");
  mo10Goldman = createElement("mo", "]");
  mo10Goldman.parent("msub12Goldman");
  mi33Goldman = createElement("mi", "in");
  mi33Goldman.parent("msub12Goldman");
}

// NOTE: Might want to rename this function
function redrawUI(questionBox) {
  // input: Boolean
  // usage: True is for initializing the UI; False is for recreating UI when browser window is resized (responsive UI)

  if (questionBox == true) {
    equationContainerHeighthMul = equationHeightPercent;
  } else {
    equationContainerHeighthMul = 1;
  }

  adjustUISize(equationContainerHeighthMul);
  canvas.size(canWidth, canHeight);

  //Relative to parent coordinate
  animationSequencer.current().setContainerSizes(canWidth, canHeight, thickness);

  // NOTE: does this still do anything? When uncommented, it seems to have no effect.
  makeUIs(false)
}

function adjustUISize(multiple) {
  // input: Floats
  // usage: Resizing the question/equation window; 0.35 (including question), 1 (excluding question)

  simuWidth = 0.65 * windowWidth;
  stage.size(windowWidth, (windowHeight - 36));
  firstBox.size(0.35 * windowWidth, (windowHeight - 36));
  secondBox.size(0.65 * windowWidth, (windowHeight - 36));
  questions.size(0.35 * windowWidth, (1 - multiple) * (windowHeight - 36));

  equationContainer.size(0.35 * windowWidth, multiple * (windowHeight - 36));
  leftBox.size(0.35 * windowWidth, (1 - multiple) * (windowHeight - 36));
  hideBar.size(0.35 * windowWidth, 20);
  equi.size(0.35 * windowWidth, 40);
  equation.size(0.35 * windowWidth, multiple * (windowHeight - 36) - 40 - 20);
  simulator.size(0.65 * windowWidth, 0.65 * (windowHeight - 36));

  // Define the global canWidth & canHeight variables
  canWidth = simulator.size().width;

  canHeight = 1 * (simulator.size().height - 4);

  simulatorInputContainer.size(0.65 * windowWidth, 0.35 * (windowHeight - 36));
  simulatorInput.size(simuWidth, 0.35 * 0.90 * (windowHeight - 36));
  controlsLeft.size(simuWidth / 2, 0.35 * canHeight);
  controlsRight.size(simuWidth / 2, 0.35 * canHeight);
  particleControl.size(simuWidth, 0.1 * 0.80 * (windowHeight - 36));
  canvas.size(canWidth, canHeight);
}

function hideQuestion(evt) {
  // input: the element that triggered the event (hide buttons [arrow]);

  if (equationContainerHeighthMul == equationHeightPercent) { //Turn the question menu off
    document.getElementById("hidebarText").innerText = ">"
    document.getElementById('simulatorSetting').style.display = "flex";

    if (simulatorMode == "Nernst") {
      document.getElementById('NernstSetting').style.display = "initial";
    } else {
      document.getElementById('GoldmanSetting').style.display = "initial";
    }
    document.getElementById('helpQuestion').style.display = "none";
    document.getElementById('helpSetting').style.height = "100%";
    redrawUI(false);
  } else { //Turn the question menu on
    document.getElementById("hidebarText").innerText = "<"
    document.getElementById('simulatorSetting').style.display = "none";

    if (simulatorMode == "Nernst") {
      document.getElementById('NernstSetting').style.display = "none";
    } else {
      document.getElementById('GoldmanSetting').style.display = "none";
    }
    document.getElementById('helpQuestion').style.display = "initial";
    document.getElementById('helpSetting').style.height = "35%";
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
