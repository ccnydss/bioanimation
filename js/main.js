var containers = {};

//Just for initializing
var particleTypes = ["Na","Cl","K"];

var inEquilbrateState = {}; // global dictionary used to flag if particle is currently in equilbrate state.
inEquilbrateState[particleTypes[0]] = false;
inEquilbrateState[particleTypes[1]] = false;

var particlesProperties = {
  "Na":{"color":"#FFC800","radius":15,"id":0,"display":true,"charge":1, "inside":2, "outside":14},
  "Cl":{"color":"#CD5C5C","radius":15,"id":1,"display":true,"charge":-1, "inside":13, "outside":1},
  "K" :{"color":"#35B235","radius":15,"id":2,"display":true,"charge":1, "inside":1, "outside":12}
};

var containerProperties = {
  "inside": {"color":"#fffbea"},
  "outside": {"color":"#e3f8fc"}
}

var velocityRange = [-1,-1.25,1.25,1];

//For local particles on each box
var MaxParticles = 25;
var particles = {"inside": {"Na":[], "Cl":[], "K":[]},
                 "outside": {"Na":[], "Cl":[], "K":[]}}

var channels = {"Na":[],"Cl":[], "K":[]};
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

  containers["outside"] = new Container(topLeft, topRight, botRight, botLeft, containerProperties["outside"]["color"],"outside");
  //containers["outside"].draw();


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

  containers["inside"] = new Container(topLeft, topRight, botRight, botLeft, containerProperties["inside"]["color"],"inside");
  //containers["inside"].draw();

  var topLeft = new Point( 0, canHeight/2 );
  var topRight = new Point( canWidth, canHeight/2 );
  var botRight = new Point( canWidth, canHeight );
  var botLeft = new Point( 0, canHeight );
  UIBoxs[1] = new UIBox( topLeft, topRight, botRight, botLeft );
  UIBoxs[1].draw();

  for (var location in particles) {
   for (var particle in particles[location]) {
     xRange = containers[location].tr.x - containers[location].tl.x - 100;
     yRange = containers[location].br.y - containers[location].tr.y - 100;
     var amount = particlesProperties[particle][location];
     for (var i=0; i<amount; i++) {
       velocities = velocityRange;
       var x_vel = Math.floor(Math.random() * (velocities.length-1)) + 0;
       var y_vel = Math.floor(Math.random() * (velocities.length-1)) + 0;
       var velocity = createVector(velocities[x_vel],velocities[y_vel]);
       // Get random location
       randomX = containers[location].tl.x + particlesProperties[particle]["radius"] + (Math.floor(Math.random() * xRange));
       randomY = containers[location].tl.y + particlesProperties[particle]["radius"] + (Math.floor(Math.random() * yRange));
       particles[location][particle].push(new factory[particle](randomX,randomY,particlesProperties[particle]["radius"],velocity, true));
     }
   }
  }

  makeUIs(true);
  startNernst();

  //Only show one particle at the beginning
  disableInputForParticle("Cl");
  disableInputForParticle("K");

  for (var i = 0; i < particles["inside"]["Cl"].length; i++) {
    setDisplay(particles["inside"]["Cl"][i], false);
  }
  for (var i = 0; i < particles["outside"]["Cl"].length; i++) {
    setDisplay(particles["outside"]["Cl"][i], false);
  }
  for (var i = 0; i < particles["inside"]["K"].length; i++) {
    setDisplay(particles["inside"]["K"][i], false);
  }
  for (var i = 0; i < particles["outside"]["K"].length; i++) {
    setDisplay(particles["outside"]["K"][i], false);
  }

  NernstFormulaInput(particleTypes[0]);
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
