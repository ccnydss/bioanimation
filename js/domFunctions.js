function makeLayout() {
  // Make the entire stage. This represents the entire, outer box containing the simulator, sidebar, and controls.
  stage = createDiv('');
  stage.id('stage');
  stage.size(windowWidth, windowHeight);

  // The right sidebar for displaying questions.
  leftBox = createDiv("");
  leftBox.id('leftbar');
  leftBox.parent('stage');
  leftBox.size(0.25 * windowWidth, windowHeight - 8);  // subtract stage 4px border from top and bottom to remove scrollbars in the parent iframe. (so, 8px total)

  // Create the div to actually contain the questions.
  questions = createDiv("");
  questions.id('questionsdiv');
  questions.parent('leftbar');
  questions.size(leftBox.size().width, leftBox.size().height);

  createElement("h3", "hi questions").parent('questionsdiv');

  // Div to contain the equation
  equation = createDiv("");
  equation.id('equationdiv');
  equation.parent('leftbar');
  equation.size(leftBox.size().width, 0.20 * leftBox.size().height);

  makeNeqMML();

  simulator = createDiv("");
  simulator.id('sim');
  simulator.parent('stage');
  simulator.size(0.75 * windowWidth, windowHeight - 8);

  // Define the global canWidth & canHeight variables~
  canWidth = simulator.size().width;
  canHeight = 0.75 * (simulator.size().height - 8);

  // Now to create the canvas!!
  canvas = createCanvas(canWidth, canHeight);
  canvas.class('can');
  canvas.parent('sim');

  simulatorInput = createDiv('');
  simulatorInput.id('simInput');
  simulatorInput.parent('sim');
  simulatorInput.size(canWidth, 0.33 * canHeight);

  //Control UI ----------------------------
  controlsLeft = createDiv('');
  controlsLeft.class('controls');
  controlsLeft.parent('simInput');
  controlsLeft.size(canWidth / 2, 0.33 * canHeight);

  controlsRight = createDiv('');
  controlsRight.class('controls');
  controlsRight.parent('simInput');
  controlsRight.size(canWidth / 2, 0.33 * canHeight);

  control0 = createDiv('');
  control0.class('control');
  control0.parent(controlsLeft);

  control1 = createDiv('');
  control1.class('control');
  control1.parent(controlsLeft);

  control2 = createDiv('');
  control2.class('control');
  control2.parent(controlsLeft);

  control3 = createDiv('');
  control3.class('control');
  control3.parent(controlsRight);

  control4 = createDiv('');
  control4.class('control');
  control4.parent(controlsRight);

  control5 = createDiv('');
  control5.class('control');
  control5.parent(controlsRight);
}

function makeNeqMML() {
  math = createElement("math");
  math.attribute("xmlns", "http://www.w3.org/1998/Math/MathML");
  math.id('math');
  math.parent('equationdiv');

  mrow0 = createElement("mrow");
  mrow0.id('mrow0');
  mrow0.parent('math');

  msub0 = createElement("msub");
  msub0.id('msub0');
  msub0.parent("mrow0");

  mi0 = createElement("mi", "V");
  mi0.parent("msub0");

  mi1 = createElement("mi", "Eq.");
  mi1.parent("msub0");

  eqSign = createElement("mo", "=");
  eqSign.parent("math");

  // -------------------------------------

  mrow1 = createElement("mrow");
  mrow1.id("mrow1");
  mrow1.parent("math");

  mfrac0 = createElement("mfrac");
  mfrac0.id("mfrac0");
  mfrac0.parent("mrow1");

  mrow2 = createElement("mrow");
  mrow2.id("mrow2");
  mrow2.parent("mfrac0");

  mi2 = createElement("mi", "R");
  mi2.parent("mrow2");

  mi3 = createElement("mi", "T");
  mi3.parent("mrow2");

  mrow3 = createElement("mrow");
  mrow3.id("mrow3");
  mrow3.parent("mfrac0");

  mi4 = createElement("mi", "z");
  mi4.parent("mrow3");

  mi5 = createElement("mi", "F");
  mi5.parent("mrow3");

  // -----------------------------------------
  mrow4 = createElement("mrow");
  mrow4.id("mrow4");
  mrow4.parent("math");

  mi6 = createElement("mi", "ln");
  mi6.parent("mrow4");

  mfence0 = createElement("mfenced");
  mfence0.id("mfence0");
  mfence0.parent("mrow4");

  mfrac1 = createElement("mfrac");
  mfrac1.id("mfrac1");
  mfrac1.parent("mfence0");

  sem0 = createElement("semantics");
  sem0.id("sem0");
  sem0.parent("mfrac1");

  anno0 = createElement("annotation-xml");
  anno0.attribute("encoding", "application/xhtml+xml");
  anno0.parent("sem0");
  anno0.id("neq-top");

  sem1 = createElement("semantics");
  sem1.id("sem1");
  sem1.parent("mfrac1");

  anno1 = createElement("annotation-xml");
  anno1.attribute("encoding", "application/xhtml+xml");
  anno1.parent("sem1");
  anno1.id("neq-bot");
}