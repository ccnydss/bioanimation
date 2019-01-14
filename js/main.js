//Just for initializing
var particleTypes = ["Na", "Cl", "K"];

var plusButton = [],
  minusButton = [],
  textboard = [],   // NOTE: More specific variable name
  input = [],       // NOTE: above
  simSetting = [];

var equations = [];

var canWidth;
var canHeight;

var lastNernstParticle = "Na";

var tempSetting = (37 + 273.13);

var mainSim = new Simulator();
var graph;
var animationSequencer;

function setup() {
  noFill();

  // Defines the simulator's layout as well as "canWidth", "canHeight"
  makeLayout();

  graph = new Plot();
  help = new Help();

  // Create the animation sequencer
  bioMainSequence = new BioMain();
  test1Seq = new Test1();
  animationSequencer = new SequenceManager([bioMainSequence, test1Seq])
  animationSequencer.setup();

  makeUIs(true);

  startNernst();

  //Only show one particle at the beginning
  disableInputForParticle("Cl");
  disableInputForParticle("K");

  FormulaInputCalculation(particleTypes[0]);
}

function draw() {
  clear();
  animationSequencer.draw();
}
