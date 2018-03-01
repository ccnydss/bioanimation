var circles;
var outerBox = [];

var numParticles = [];
numParticles[0] = 1;
numParticles[1] = 2;

var OldnumParticles = [];
OldnumParticles[0] = 1;
OldnumParticles[1] = 2;

var numParticlesMax = [];
numParticlesMax[0] = 100;
numParticlesMax[1] = 100;

var particles0 = [];
var particles1 = [];

var cellWalls = [];
var radius = 20;

//UI
var numContainer = 2;
var PlusButton = [], MinusButton = [], titletext = [], textboard = [], input = [];
//UI

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();

  var length = 600;

  var topLeft = new Point( 0, 0 );
  var topRight = new Point( length, 0 );
  var botRight = new Point( length, length/2 );
  var botLeft = new Point( 0, ( length/2 ) );

  //Relative to parent coordinate

  outerBox[0] = new Container( topLeft, topRight, botRight, botLeft );
  outerBox[0].draw();

  var topLeft = new Point( 0, length/2 );
  var topRight = new Point( length, length/2 );
  var botRight = new Point( length, length );
  var botLeft = new Point( 0, ( length ) );

  outerBox[1] = new Container( topLeft, topRight, botRight, botLeft );
  outerBox[1].draw();

  var velocity = createVector(-5, -4);

  for (var j = 0; j < numContainer; j++) {
    for (var i = 0; i < numParticles[j]; i++) {
      xRange = outerBox[j].tr.x - outerBox[j].tl.x - 100;
      yRange = outerBox[j].br.y - outerBox[j].tr.y - 100;

      // Get random location
      randomX = outerBox[j].tl.x + radius + (Math.floor(Math.random() * xRange));
      randomY = outerBox[j].tl.y + radius + (Math.floor(Math.random() * yRange));

      var chance = Math.random()
      if (chance < 0.5) {
      eval("particles" + j).push(new Na(randomX,randomY,radius,velocity));
      }else {
      eval("particles" + j).push(new Cl(randomX,randomY,2*radius,velocity));
      }
    }
  }

  makeDivs();

  for (var k = 0; k < numContainer; k++) {

    if (k==0) {
      var text = 'Top';
    } else { var text = 'Bottom'; }
    textboard[k] = createElement('h3', text+' Number:');
    textboard[k].class('qoptions');
    textboard[k].parent(eval("control" + k));

    input[k] = createInput(numParticles[k]);
    input[k].id("fasf");
    input[k].class('qoptions');
    input[k].parent(eval("control" + k));

    input[k].style('width', '20px','font-size', '12px','vertical-align','middle');

    PlusButton[k] = createButton('+');

    PlusButton[k].id(k);
    PlusButton[k].mousePressed(increase);
    PlusButton[k].class('qoptions');
    PlusButton[k].parent(eval("control" + k));

    PlusButton[k].style('width', '20px');

    MinusButton[k] = createButton('-');
    MinusButton[k].id(k);
    MinusButton[k].mousePressed(decrease);
    MinusButton[k].class('qoptions');
    MinusButton[k].parent(eval("control" + k));
    MinusButton[k].style('width', '20px');
  }
  //UI
}

function draw() {
  clear();

  stroke(15, 15, 15, 100);
  // noStroke();
  fill(180, 180, 180, 255);

  outerBox[0].draw();
  outerBox[1].draw();

  for (var j = 0; j < numContainer; j++) {
    for (var i = 0; i < numParticles[j]; i++) {

            eval("particles" + j)[i].color();
      eval("particles" + j)[i].move(outerBox[j]);
    }
  }

  //UI
  for (var k = 0; k < numContainer; k++) {
    if (input[k].value() >= numParticlesMax[k]) {
      input[k].value(numParticlesMax[k]-1)
    } else if (!input[k].value()) {
      input[k].value(0)
    }

    if (OldnumParticles[k] != input[k].value() & input[k].value() <= numParticlesMax[k]) {


        var velocity = createVector(-5, -4);


      if (OldnumParticles[k] > input[k].value()) { //Deleting particles
            eval("particles" + k).splice(input[k].value(), OldnumParticles[k]-input[k].value());
      }


      if (OldnumParticles[k] < input[k].value()) { //adding particles
        for (var i = OldnumParticles[k]; i < input[k].value(); i++) {
          randomX = outerBox[k].tl.x + radius + (Math.floor(Math.random() * xRange))
          randomY = outerBox[k].tl.y + radius + (Math.floor(Math.random() * yRange))
          var chance = Math.random()
          if (chance < 0.5) {
          eval("particles" + k).push(new Na(randomX,randomY,radius,velocity));
          }else {
          eval("particles" + k).push(new Cl(randomX,randomY,2*radius,velocity));
          }
        }
      }
      // if (OldnumParticles[k] > input[k].value()) {
      //   var high = OldnumParticles[k];
      //   var low = input[k].value();
      // }
      // else {
      //   var low = OldnumParticles[k];
      //   var high = input[k].value();
      // }
      //
      // for (var i = low; i < high; i++) {
      //   console.log(i+"&&&"+randomX);
      //   randomX = outerBox[k].tl.x + radius + (Math.floor(Math.random() * xRange))
      //   randomY = outerBox[k].tl.y + radius + (Math.floor(Math.random() * yRange))
      //
      //   if (i < numParticlesMax[k]) {
      //     eval("particles" + k)[i].x = randomX;
      //     eval("particles" + k)[i].y = randomY;
      //   }
      // }

      numParticles[k] = input[k].value();
      OldnumParticles[k] = input[k].value();
    }

    var j = k*1/2;

    // MinusButton[k].position(stage.position().x + 3*(stage.size().width - 600 - 10)/5, stage.position().y + stage.size().height/20 + stage.size().height*j);
    // PlusButton[k].position(stage.position().x + 2*(stage.size().width - 600 - 10)/5, stage.position().y + stage.size().height/20 + stage.size().height*j);
    // input[k].position(stage.position().x + 192, stage.position().y + stage.size().height/20 + 30 + 2 + stage.size().height*j);
    // textboard[k].position(stage.position().x + (stage.size().width - 600 - 10)/5, stage.position().y + stage.size().height/20 + 30 + stage.size().height*j);
  }
  // UI
}

function makeDivs() {
  //UI
  stage = createDiv('');
  stage.id('stage');

  questions = createDiv("");
  questions.id('qdiv');
  questions.parent('stage');

  simulator = createDiv("");
  simulator.id('sim');
  simulator.parent('stage');

  canvas = createCanvas(600, 600);
  canvas.class('can');
  canvas.parent('sim');

//Control UI
  controls = createDiv('');
  controls.id('controls');
  controls.parent('sim');

  control0 = createDiv('');
  control0.class('control');
  control0.parent('controls');

  control1 = createDiv('');
  control1.class('control');
  control1.parent('controls');
}
