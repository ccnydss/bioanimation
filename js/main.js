var containers = {};

//Just for initializing
var numParticles = [];
var particleTypes = ["Na","Cl"]
numParticles[0] = 3;
numParticles[1] = 2;
//0 = top
//1 = bot

var particlesColor = {};
particlesColor["Na"] = '#efec2b';
particlesColor["Cl"] = '#6bce25';

//For local particles on each box
var MaxParticles = 25;
var NaParticles0 = [];
var NaParticles1 = [];
var ClParticles0 = [];
var ClParticles1 = [];

var channels = [];
var radius = 20;

//UI
var N_Na = [];
N_Na[0] = 0;
N_Na[1] = 0;
var N_Cl = [];
N_Cl[0] = 0;
N_Cl[1] = 0;

var numContainer = 2;
var plusButton = [], minusButton = [], textboard = [], input = [];
var UIBoxs = [], equations = [];

var canWidth;
var canHeight;
var thickness = 25; //Make channel a square for now...
//UI

function setup() {
  noFill();

  // Defines the simulator's layout as well as "canWidth", "canHeight"
  makeLayout();

  var topLeft = new Point( 0, 0 );
  var topRight = new Point( canWidth, 0 );
  var botRight = new Point( canWidth, canHeight/2-thickness );
  var botLeft = new Point( 0, ( canHeight/2-thickness ) );

  //Relative to parent coordinate

  containers["outside"] = new Container( topLeft, topRight, botRight, botLeft );
  containers["outside"].draw();


  var topLeft = new Point( 0, 0 );
  var topRight = new Point( canWidth, 0 );
  var botRight = new Point( canWidth, canHeight/2 );
  var botLeft = new Point( 0, canHeight/2 );
  UIBoxs[0] = new UIBox( topLeft, topRight, botRight, botLeft );
  UIBoxs[0].draw();

  var topLeft = new Point( 0, canHeight/2+thickness );
  var topRight = new Point( canWidth, canHeight/2+thickness );
  var botRight = new Point( canWidth, canHeight );
  var botLeft = new Point( 0, canHeight );

  containers["inside"] = new Container( topLeft, topRight, botRight, botLeft );
  containers["inside"].draw();

  var topLeft = new Point( 0, canHeight/2 );
  var topRight = new Point( canWidth, canHeight/2 );
  var botRight = new Point( canWidth, canHeight );
  var botLeft = new Point( 0, canHeight );
  UIBoxs[1] = new UIBox( topLeft, topRight, botRight, botLeft );
  UIBoxs[1].draw();


  var velocity = createVector(-5, -4);

  for (key in containers) {
    for (var i = 0; i < numParticles[j]; i++) {
      velocities = [-3,-2,2,3];
      var x_vel = Math.floor(Math.random() * (velocities.length-1)) + 0;
      var y_vel = Math.floor(Math.random() * (velocities.length-1)) + 0;
      var velocity = createVector(velocities[x_vel],velocities[y_vel]);
      xRange = containers[key].tr.x - containers[key].tl.x - 100;
      yRange = containers[key].br.y - containers[key].tr.y - 100;

      // Get random location
      randomX = containers[key].tl.x + radius + (Math.floor(Math.random() * xRange));
      randomY = containers[key].tl.y + radius + (Math.floor(Math.random() * yRange));

      var chance = Math.random()
      if (chance < 0.5) {
        eval("NaParticles" + j).push(new Na(randomX,randomY,radius,velocity, true));
        N_Na[j] = N_Na[j] + 1;
      }else {
        eval("ClParticles" + j).push(new Cl(randomX,randomY,2*radius,velocity, true));
        N_Cl[j] = N_Cl[j] + 1;
      }
    }
  }

  makeUIs();
}

function draw() {

  clear();

  UIBoxs[0].draw();
  UIBoxs[1].draw();
  strokeWeight(0);
  containers["inside"].draw();
  containers["outside"].draw();
  for (var i=0; i<channels.length; i++) {
    channels[i].draw();
  }
  strokeWeight(1);

  for (key in containers) {
    for (var i = 0; i < N_Na[j]; i++) {

      if(eval("NaParticles" + j)[i]) {
        eval("NaParticles" + j)[i].color();
        eval("NaParticles" + j)[i].move(containers[key]);
      }
    }

    for (var i = 0; i < N_Cl[j]; i++) {

      if(eval("ClParticles" + j)[i]) {
        eval("ClParticles" + j)[i].color();
        eval("ClParticles" + j)[i].move(containers[key]);
      }
    }
  }

  //UI
}
