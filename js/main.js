var circles;
var outerBox = [];

//Just for initializing
var numParticles = [];
var particleNames = ["Na","Cl"]
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
//0 = top
//1 = bot

var cellWalls = [];
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
var PlusButton = [], MinusButton = [], titletext = [], textboard = [], input = [];
var UIBoxs = [], equations = [], equationImg;

// var length = 600;  // CAN DELETE THIS LATER
var canWidth;
var canHeight;
var thickness = 25; //Make channel a square for now...
//UI

// function preload() {
//   imgCb = loadImage("https://wikimedia.org/api/rest_v1/media/math/render/svg/59fb8dd0b3884bbb390b4cbfacdc9cb81b37bca3");
// }

function setup() {
  noFill();

  // Defines the simulator's layout as well as "canWidth", "canHeight"
  makeLayout();

  var topLeft = new Point( 0, 0 );
  var topRight = new Point( canWidth, 0 );
  var botRight = new Point( canWidth, canHeight/2-thickness );
  var botLeft = new Point( 0, ( canHeight/2-thickness ) );

  //Relative to parent coordinate

  outerBox[0] = new Container( topLeft, topRight, botRight, botLeft );
  outerBox[0].draw();


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

  outerBox[1] = new Container( topLeft, topRight, botRight, botLeft );
  outerBox[1].draw();


  var topLeft = new Point( 0, canHeight/2 );
  var topRight = new Point( canWidth, canHeight/2 );
  var botRight = new Point( canWidth, canHeight );
  var botLeft = new Point( 0, canHeight );
  UIBoxs[1] = new UIBox( topLeft, topRight, botRight, botLeft );
  UIBoxs[1].draw();


  var velocity = createVector(-5, -4);

  for (var j = 0; j < numContainer; j++) {
    for (var i = 0; i < numParticles[j]; i++) {
      velocities = [-4,-3,3,4];
      var x_vel = Math.floor(Math.random() * 3) + 0;
      var y_vel = Math.floor(Math.random() * 3) + 0;
      var velocity = createVector(velocities[x_vel],velocities[y_vel]);
      xRange = outerBox[j].tr.x - outerBox[j].tl.x - 100;
      yRange = outerBox[j].br.y - outerBox[j].tr.y - 100;

      // Get random location
      randomX = outerBox[j].tl.x + radius + (Math.floor(Math.random() * xRange));
      randomY = outerBox[j].tl.y + radius + (Math.floor(Math.random() * yRange));


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

  // UI
  makeUIs();
}

function draw() {

  equilibriumCheck()
  clear();

  UIBoxs[0].draw();
  UIBoxs[1].draw();
  strokeWeight(0);
  outerBox[0].draw();
  outerBox[1].draw();
  for (var i=0; i<channels.length; i++) {
    channels[i].draw();
  }
  strokeWeight(1);

    // image(imgCb,0, 0);
  for (var j = 0; j < numContainer; j++) {
    for (var i = 0; i < N_Na[j]; i++) {

      if(eval("NaParticles" + j)[i]) {
        eval("NaParticles" + j)[i].color();
        eval("NaParticles" + j)[i].move(outerBox[j]);
      }
    }

    for (var i = 0; i < N_Cl[j]; i++) {

      if(eval("ClParticles" + j)[i]) {
        eval("ClParticles" + j)[i].color();
        eval("ClParticles" + j)[i].move(outerBox[j]);
      }
    }
  }

  //UI
}
