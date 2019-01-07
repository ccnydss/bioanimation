var containers = {};

//Just for initializing
var particleTypes = ["Na", "Cl", "K"];

var velocityRange = [-1, -1.25, 1.25, 1];

//For local particles on each box
var MaxParticles = 25;

// var channels = {
//   "Na": [],
//   "Cl": [],
//   "K": []
// };

var thickness = 25;

var plusButton = [],
  minusButton = [],
  textboard = [], // NOTE: More specific variable name
  input = [], // NOTE: above
  simSetting = [];

var equations = [];

var canWidth;
var canHeight;

var lastNernstParticle = "Na";
var questionText = [];

var tempSetting = (37 + 273.13);

var backgroundMembrane;

var bioMainSequence;
var animationSequencer;

function setup() {
  noFill();

  // Defines the simulator's layout as well as "canWidth", "canHeight"
  makeLayout();

  backgroundMembrane = new Rectangle (
    {
      _tl: new Point(0, 0),
      _tr: new Point(canWidth, 0),
      _br: new Point(canWidth, canHeight),
      _bl: new Point(0, canHeight)
    },
    color(100, 155, 180, 100)
  )
  backgroundMembrane.draw();

  // Create the animation sequencer
  bioMainSequence = new BioMain();
  animationSequencer = new SequenceManager([bioMainSequence])
  animationSequencer.setup();

  makeUIs(true);
  startNernst();

  //Only show one particle at the beginning
  disableInputForParticle("Cl");
  disableInputForParticle("K");

  // bioMainSequence.containers.inside.setParticleDisplays("Cl", false);
  // bioMainSequence.containers.outside.setParticleDisplays("Cl", false);
  //
  // bioMainSequence.containers.inside.setParticleDisplays("K", false);
  // bioMainSequence.containers.outside.setParticleDisplays("K", false);

  FormulaInputCalculation(particleTypes[0]);

  //Load all the equation at begin, otherelse will cause bug
  //For some reason, MathJax-Element will be create after few millisecond
  //Remove the Goldman preset equation
  Initializor = setTimeout(function() {
    if (document.getElementById('MathJax-Element-1-Frame')) {
      document.getElementById('MathJax-Element-1-Frame').style.display = "inline";
      document.getElementById('MathJax-Element-2-Frame').style.display = "none";
    }
    clearTimeout(Initializor);
  }, 300);
}

function draw() {
  clear();

  backgroundMembrane.draw();

  strokeWeight(0);

  animationSequencer.draw();

  // for (var i = 0; i < channels.length; i++) {
  //   channels[i].draw();
  // }

  strokeWeight(1);
}
