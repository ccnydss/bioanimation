// Browser Checking
try {
  var mainSim = new Simulator();
}
catch(error) {
  if(error) {
    document.getElementsByTagName('body')[0].style.backgroundColor = '#ecf0f1';
    document.getElementById('browserDetection').style.display = '';
    document.getElementById('containerHeader').style.display = 'none';
    document.getElementById('root').style.display = 'none';
    document.getElementById('root').innerHTML = '';
  }
}

var graph;
var animationSequencer;

function setup() {
  if ( getOS() == 'iOS' || getOS() == 'Android' ) {
      document.getElementsByTagName('body')[0].style.backgroundColor = '#ecf0f1';
      document.getElementById('platformDetection').style.display = '';
      document.getElementById('containerHeader').style.display = 'none';
      document.getElementById('root').style.display = 'none';
      document.getElementById('root').innerHTML = '';
      return;
  }

  noFill();

  // Defines the simulator's HTML DOM layout as well as "canWidth", "canHeight"
  mainSim.dom.setup();

  fps = new Fps();
  graph = new Plot(mainSim);
  help = new Help(mainSim);
  globals = new globals(mainSim);

  // Create the animation sequences
  var cw = mainSim.dom.getSize().width;
  var ch = mainSim.dom.getSize().height;

  bioMainSequence = new BioMain(cw, ch);
  test1Seq = new Test1(cw, ch);

  animationSequencer = new SequenceManager([bioMainSequence, test1Seq])
  animationSequencer.setup();

  mainSim.nernst_eq.start();
  mainSim.renderUI('NernstEqn', true);

  //Only show the Na particles at the beginning
  mainSim.toggleInputForParticle("Cl", false);
  mainSim.toggleInputForParticle("K", false);
}

function draw() {
  clear();
  animationSequencer.draw();
}
