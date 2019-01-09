//Just for initializing
var particleTypes = ["Na", "Cl", "K"];

var plusButton = [],
  minusButton = [],
  textboard = [], // NOTE: More specific variable name
  input = [], // NOTE: above
  simSetting = [];

var equations = [];

var canWidth;
var canHeight;

var lastNernstParticle = "Na";

var tempSetting = (37 + 273.13);

var animationSequencer;

function setup() {
  noFill();

  // Defines the simulator's layout as well as "canWidth", "canHeight"
  makeLayout();

  // Create the animation sequencer
  bioMainSequence = new BioMain();
  animationSequencer = new SequenceManager([bioMainSequence])
  animationSequencer.setup();

  makeUIs(true);

  dataChartInitialize = false; //This variable is used to solve Synchronous problem
  startNernst();
  dataChartInitialize = true;

  //Only show one particle at the beginning
  disableInputForParticle("Cl");
  disableInputForParticle("K");

  FormulaInputCalculation(particleTypes[0]);
}

function draw() {
  clear();
  animationSequencer.draw();
}
