var containers = {};

//Just for initializing
var particleTypes = ["Na","Cl"];

var inEquilbrateState = {}; // global dictionary used to flag if particle is currently in equilbrate state.
inEquilbrateState[particleTypes[0]] = false;
inEquilbrateState[particleTypes[1]] = false;

var particlesProperties = {
  "Na":{"color":"#F5CE28","radius":20},
  "Cl":{"color":"#01ABAA","radius":40}
};

//For local particles on each box
var MaxParticles = 25;
var particles = {"inside": {"Na":[], "Cl":[]},
                 "outside": {"Na":[], "Cl":[]}}

var channels = {"Na":[],"Cl":[]};
var radius = 20;

var numContainer = 2;
var plusButton = [], minusButton = [], textboard = [], input = [];
var UIBoxs = [], equations = [];

var canWidth;
var canHeight;
var thickness = 25; // Make channel a square for now...

function setup() {
  noFill();

  // Defines the simulator's layout as well as "canWidth", "canHeight"
  makeLayout();

  var topLeft = new Point( 0, 0 );
  var topRight = new Point( canWidth, 0 );
  var botRight = new Point( canWidth, canHeight/2-thickness );
  var botLeft = new Point( 0, ( canHeight/2-thickness ) );

  //Relative to parent coordinate

  containers["outside"] = new Container(topLeft, topRight, botRight, botLeft, "#A9B7C0");
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

  containers["inside"] = new Container(topLeft, topRight, botRight, botLeft, "#EAE3EA");
  containers["inside"].draw();

  var topLeft = new Point( 0, canHeight/2 );
  var topRight = new Point( canWidth, canHeight/2 );
  var botRight = new Point( canWidth, canHeight );
  var botLeft = new Point( 0, canHeight );
  UIBoxs[1] = new UIBox( topLeft, topRight, botRight, botLeft );
  UIBoxs[1].draw();


  var velocity = createVector(-5, -4);

  for (var location in particles) {
   for (var particle in particles[location]) {
     velocities = [-4,-3,3,4];
     var x_vel = Math.floor(Math.random() * (velocities.length-1)) + 0;
     var y_vel = Math.floor(Math.random() * (velocities.length-1)) + 0;
     var velocity = createVector(velocities[x_vel],velocities[y_vel]);
     xRange = containers[location].tr.x - containers[location].tl.x - 100;
     yRange = containers[location].br.y - containers[location].tr.y - 100;

     // Get random location
     randomX = containers[location].tl.x + radius + (Math.floor(Math.random() * xRange));
     randomY = containers[location].tl.y + radius + (Math.floor(Math.random() * yRange));

     var chance = Math.random();

     if (chance < 0.5) {
       particles[location][particleTypes[0]].push(new Na(randomX,randomY,radius,velocity, true));
     } else {
       particles[location][particleTypes[1]].push(new Cl(randomX,randomY,2*radius,velocity, true));
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

  for (var location in particles) {
   for (var particle in particles[location]) {
     for (var i = 0; i < particles[location][particle].length; i++) {
       particles[location][particle][i].color();
       particles[location][particle][i].move(containers[location]);
     }
   }
  }
}
