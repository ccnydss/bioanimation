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

  mainSim.m_dom.m_sim_controls.create();
  mainSim.m_nernst_eq.start();
  mainSim.renderUI('NernstEqn', true);

  //Only show one particle at the beginning
  disableInputForParticle("Cl");
  disableInputForParticle("K");
}

function draw() {
  clear();
  animationSequencer.draw();
}
