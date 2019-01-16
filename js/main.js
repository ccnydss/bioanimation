//Just for initializing
var plusButton = [],
  minusButton = [],
  textboard = [],   // NOTE: More specific variable name
  input = [],       // NOTE: above
  simSetting = [];

var mainSim = new Simulator();
var graph;
var animationSequencer;

function setup() {
  noFill();

  // Defines the simulator's HTML DOM layout as well as "canWidth", "canHeight"
  mainSim.m_dom.setup();
  mainSim.m_dom.adjustUISize();

  graph = new Plot();
  help = new Help();

  // Create the animation sequences
  var cw = mainSim.m_dom.getSize().width;
  var ch = mainSim.m_dom.getSize().height;

  bioMainSequence = new BioMain(cw, ch);
  test1Seq = new Test1(cw, ch);

  animationSequencer = new SequenceManager([bioMainSequence, test1Seq])
  animationSequencer.setup();

  mainSim.m_dom.createControls();

  startNernst();

  //Only show one particle at the beginning
  disableInputForParticle("Cl");
  disableInputForParticle("K");

  FormulaInputCalculation("Na");
}

function draw() {
  clear();
  animationSequencer.draw();
}
