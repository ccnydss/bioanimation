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
} finally {
  // cleanup
  // document.write("<script ...src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML' async></script>");
  // console.log('not IE')
}

var graph;
var animationSequencer;

function setup() {
  if ( getOS()== 'iOS' || getOS()== 'Android' ) {
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
  mainSim.dom.adjustUISize();

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

  mainSim.dom.sim_inputs.create();
  mainSim.nernst_eq.start();
  mainSim.renderUI('NernstEqn', true);

  //Only show one particle at the beginning
  disableInputForParticle("Cl");
  disableInputForParticle("K");
}

function draw() {
  clear();
  animationSequencer.draw();
}
