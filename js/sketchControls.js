// Pause / unpause the animation (debug purposes)
var togLoop = false;
function toggleLoop() {
  if (togLoop) {
    loop();
    togLoop = false;
  } else {
    noLoop();
    togLoop = true;
  }
}

function keyPressed() {
  if (keyCode == 32) {
    toggleLoop();
  }
}

//UI
function increase(evt) {
  console.log(evt.target.id);
  var j = evt.target.id;

  var i = Math.floor(j/3);
  var row = 3;

  randomX = outerBox[i].tl.x + radius + (Math.floor(Math.random() * xRange))
  randomY = outerBox[i].tl.y + radius + (Math.floor(Math.random() * yRange))

  if (numParticles[i] >= numParticlesMax[i]){numParticles[i]=numParticlesMax[i]-1} else {

    //textboard[i].html('Current Number:'+numParticles[i]);


    numParticles[i]++;

    var velocity = createVector(-5, -4);

    if (j==1 || j==(1+row) ) {
      eval("particles" + i).push(new Na(randomX,randomY,radius,velocity));
      N_Na[Math.floor(j/3)] = N_Na[Math.floor(j/3)] + 1;
      var Value = N_Na[Math.floor(j/3)]

    } else if(j==2 || j==(2+row) ) {
      eval("particles" + i).push(new Cl(randomX,randomY,2*radius,velocity));
      N_Cl[Math.floor(j/3)] = N_Cl[Math.floor(j/3)] + 1;
      var Value = N_Cl[Math.floor(j/3)]
    }

    //Random position when spawn
    // eval("particles" + i)[numParticles[i]].x = randomX;
    // eval("particles" + i)[numParticles[i]].y = randomY;


    OldnumParticles[i] = numParticles[i]
    input[j].value(Value);
  }
}

function decrease(evt) {
  console.log(evt.target.id);
  var j = evt.target.id;

  var i;
  if (j==1) {
    i = 0;
  } else if (j==4) {
    i = 1;
  }

  randomX = outerBox[i].tl.x + radius + (Math.floor(Math.random() * xRange))
  randomY = outerBox[i].tl.y + radius + (Math.floor(Math.random() * yRange))

  if (numParticles[i] <= 0){numParticles[i]=0} else {

    //textboard[i].html('Current Number:'+numParticles[i]);
    // eval("particles" + i)[numParticles[i]].x = randomX;
    // eval("particles" + i)[numParticles[i]].y = randomY;

    eval("particles" + i).splice(numParticles[i]-1, 1);

    numParticles[i]--;

    OldnumParticles[i] = numParticles[i]
    input[j].value(numParticles[i]);
  }
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

  simulatorInput = createDiv('');
  simulatorInput.id('simInput');
  simulatorInput.parent('sim');
  //Control UI
  controlsLeft = createDiv('');
  controlsLeft.class('controls');
  controlsLeft.parent('simInput');

  controlsRight = createDiv('');
  controlsRight.class('controls');
  controlsRight.parent('simInput');

  // NOt Working
  // for (var i = 0; i<2; i++) {
  //   eval("control" + i) = createDiv('');
  // }
  control0 = createDiv('');
  control0.class('control');
  control0.parent(controlsLeft);

  control1 = createDiv('');
  control1.class('control');
  control1.parent(controlsLeft);

  control2 = createDiv('');
  control2.class('control');
  control2.parent(controlsLeft);

  control3 = createDiv('');
  control3.class('control');
  control3.parent(controlsRight);

  control4 = createDiv('');
  control4.class('control');
  control4.parent(controlsRight);

  control5 = createDiv('');
  control5.class('control');
  control5.parent(controlsRight);
}
