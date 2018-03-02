var circles;
var outerBox = [];

var numParticles = [];
numParticles[0] = 3;
numParticles[1] = 2;

var OldnumParticles = [];
OldnumParticles[0] = 3;
OldnumParticles[1] = 2;

var numParticlesMax = [];
numParticlesMax[0] = 100;
numParticlesMax[1] = 100;

var particles0 = [];
var particles1 = [];

var cellWalls = [];
var Channels = [];
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
var UIBoxs = [];

var thickness = 25; //Make channel a square for now...
//UI

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();

  var length = 600;

  var topLeft = new Point( 0, 0 );
  var topRight = new Point( length, 0 );
  var botRight = new Point( length, length/2-thickness );
  var botLeft = new Point( 0, ( length/2-thickness ) );

  //Relative to parent coordinate

  outerBox[0] = new Container( topLeft, topRight, botRight, botLeft );
  outerBox[0].draw();


  var topLeft = new Point( 0, 0 );
  var topRight = new Point( length, 0 );
  var botRight = new Point( length, length/2 );
  var botLeft = new Point( 0, ( length/2 ) );
  UIBoxs[0] = new UIBox( topLeft, topRight, botRight, botLeft );
  UIBoxs[0].draw();

  var topLeft = new Point( 0, length/2+thickness );
  var topRight = new Point( length, length/2+thickness );
  var botRight = new Point( length, length );
  var botLeft = new Point( 0, ( length ) );

  outerBox[1] = new Container( topLeft, topRight, botRight, botLeft );
  outerBox[1].draw();


  var topLeft = new Point( 0, length/2 );
  var topRight = new Point( length, length/2 );
  var botRight = new Point( length, length );
  var botLeft = new Point( 0, ( length ) );
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
        eval("particles" + j).push(new Na(randomX,randomY,radius,velocity));
        N_Na[j] = N_Na[j] + 1;
      }else {
        eval("particles" + j).push(new Cl(randomX,randomY,2*radius,velocity));
        N_Cl[j] = N_Cl[j] + 1;
      }
    }
  }

  makeDivs();

  //UI

  //Channel
  var topLeft = new Point( length/2-thickness, length/2-thickness );
  var topRight = new Point( length/2+thickness, length/2-thickness );
  var botRight = new Point( length/2+thickness, length/2-thickness );
  var botLeft = new Point( length/2-thickness, length/2+thickness );
  Channels[0] = new Channel( topLeft, topRight, botRight, botLeft );
  Channels[0].draw();

  //Title text
  //Na Input
  //Cl Input
  var row = 3;
  for (var k = 0; k < numContainer*row; k++) {

    if (k==0) {
      var text = 'Top';
    } else if(k==row) {
      var text = 'Bottom';
    } else if(k==1 || k==(1+row)) {
      var text = 'Na Ions:&nbsp;';
      var Value = N_Na[Math.floor(k/3)]
    } else if(k==2 || k==(2+row)) {
      var text = 'Cl Ions:&nbsp;';
      var Value = N_Cl[Math.floor(k/3)]
    }

    textboard[k] = createElement('h3', text);
    textboard[k].class('qoptions');
    textboard[k].parent(eval("control" + k));

    if (k != 0 & k!= row) {


      input[k] = createInput(Value);
      input[k].id("fasf");
      input[k].class('qoptions');
      input[k].parent(eval("control" + k));

      PlusButton[k] = createButton('+');
      PlusButton[k].id(k);
      PlusButton[k].mousePressed(increase);
      PlusButton[k].class('qoptions');
      PlusButton[k].parent(eval("control" + k));

      MinusButton[k] = createButton('-');
      MinusButton[k].id(k);
      MinusButton[k].mousePressed(decrease);
      MinusButton[k].class('qoptions');
      MinusButton[k].parent(eval("control" + k));
    }
    //UI
  }
}

function draw() {
  clear();

  UIBoxs[0].draw();
  UIBoxs[1].draw();
  strokeWeight(0);
  outerBox[0].draw();
  outerBox[1].draw();
  Channels[0].draw();
  strokeWeight(1);

  for (var j = 0; j < numContainer; j++) {
    for (var i = 0; i < numParticles[j]; i++) {
      eval("particles" + j)[i].color();
      eval("particles" + j)[i].move(outerBox[j]);
    }
  }

  //UI
  // for (var j = 0; j < numContainer*row; j++) {
  //     var k;
  //   if (j==1) {
  //     k = 0;
  //   } else if (j==4) {
  //     k = 1;
  //   }
  //
  //   if (input[k].value() >= numParticlesMax[k]) {
  //     input[k].value(numParticlesMax[k]-1)
  //   } else if (!input[k].value()) {
  //     input[k].value(0)
  //   }
  //
  //   if (OldnumParticles[k] != input[k].value() & input[k].value() <= numParticlesMax[k]) {
  //
  //
  //       var velocity = createVector(-5, -4);
  //
  //
  //     if (OldnumParticles[k] > input[k].value()) { //Deleting particles
  //           eval("particles" + k).splice(input[k].value(), OldnumParticles[k]-input[k].value());
  //     }
  //
  //
  //     if (OldnumParticles[k] < input[k].value()) { //adding particles
  //       for (var i = OldnumParticles[k]; i < input[k].value(); i++) {
  //         randomX = outerBox[k].tl.x + radius + (Math.floor(Math.random() * xRange))
  //         randomY = outerBox[k].tl.y + radius + (Math.floor(Math.random() * yRange))
  //         var chance = Math.random()
  //         if (chance < 0.5) {
  //         eval("particles" + k).push(new Na(randomX,randomY,radius,velocity));
  //         }else {
  //         eval("particles" + k).push(new Cl(randomX,randomY,2*radius,velocity));
  //         }
  //       }
  //     }
  //     // if (OldnumParticles[k] > input[k].value()) {
  //     //   var high = OldnumParticles[k];
  //     //   var low = input[k].value();
  //     // }
  //     // else {
  //     //   var low = OldnumParticles[k];
  //     //   var high = input[k].value();
  //     // }
  //     //
  //     // for (var i = low; i < high; i++) {
  //     //   console.log(i+"&&&"+randomX);
  //     //   randomX = outerBox[k].tl.x + radius + (Math.floor(Math.random() * xRange))
  //     //   randomY = outerBox[k].tl.y + radius + (Math.floor(Math.random() * yRange))
  //     //
  //     //   if (i < numParticlesMax[k]) {
  //     //     eval("particles" + k)[i].x = randomX;
  //     //     eval("particles" + k)[i].y = randomY;
  //     //   }
  //     // }
  //
  //     numParticles[k] = input[k].value();
  //     OldnumParticles[k] = input[k].value();
  //   }
  //
  //   // var j = k*1/2;
  //
  //   // MinusButton[k].position(stage.position().x + 3*(stage.size().width - 600 - 10)/5, stage.position().y + stage.size().height/20 + stage.size().height*j);
  //   // PlusButton[k].position(stage.position().x + 2*(stage.size().width - 600 - 10)/5, stage.position().y + stage.size().height/20 + stage.size().height*j);
  //   // input[k].position(stage.position().x + 192, stage.position().y + stage.size().height/20 + 30 + 2 + stage.size().height*j);
  //   // textboard[k].position(stage.position().x + (stage.size().width - 600 - 10)/5, stage.position().y + stage.size().height/20 + 30 + stage.size().height*j);
  // }
  // UI
}
