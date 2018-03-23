var transferParticle = function(particleType,location) {
  var xMul = 100;
  var yMul = 100;

  // Set names of current array is in and array to transfer particle into
  var currentArray = particles[location][particleType];// eval(particle+"Particles"+currentNum);
  var transferLocation = (location == "outside")? "inside" : "outside";
  var transferArray = particles[transferLocation][particleType];
  var offset = Math.floor(channels[0].width/2+10);

  if (currentArray.length == 0) {
    return;
  }
  // If the particle is in the top division
  if (location == "outside") {
    var targetChannel = (particleType == particleTypes[0]) ? channels[0].tl : channels[1].tl;
  }
  // If the particle is in the bottom division
  else {
    var targetChannel = (particleType == particleTypes[0]) ? channels[0].bl : channels[1].bl;
  }
  // Change move velocity to get particle to target channel
  var v = (targetChannel.x+ offset - currentArray[0].x)/xMul;
  var u = (targetChannel.y - currentArray[0].y)/yMul;
  currentArray[0].orig_velocity = createVector(v, u);
  currentArray[0].move_velocity = createVector(v, u);

  // Move particle through channel
  setTimeout(function() {
    var OriX = Math.floor(currentArray[0].x);
    var OriY = Math.floor(currentArray[0].y);
    var diam = currentArray[0].diam;
    currentArray.splice(0, 1);
    var yVector = (location == "outside") ? 3 : -3;
    var velocity = createVector(0, yVector);
    currentArray.push(new AnimatedParticle(OriX,OriY,diam,velocity, false, particleType));
  }, 800)
  // Remove particle from its old division and create particle in the new division
  setTimeout(function() {
    var particleIndex = particles[location][particleType].length - 1;
    var OriParticle = currentArray[particleIndex];
    var OriX = Math.floor(OriParticle.x);
    var OriY = Math.floor(OriParticle.y);
    var diam = Math.floor(OriParticle.diam);
    var velocities = [-4,-3,3,4];
    var x_vel = Math.floor(Math.random() * 3) + 0;
    var y_vel = Math.floor(Math.random() * 3) + 0;
    var velocity = createVector(velocities[x_vel],Math.abs(velocities[y_vel]));
    currentArray.splice(particleIndex, 1);

    if (particleType == particleTypes[0]) {
      var oldInput = location == "outside" ? input[1] : input[4];
      var transferInput = location == "outside"?  input[4] : input[1];
    }
    else {
      var oldInput = location == "outside" ? input[2] : input[5];
      var transferInput = location == "outside"?  input[5] : input[2];
    }
    oldInput.value(particles[location][particleType].length);
    transferArray.push(new factory[particleType](OriX,OriY,diam,velocity,true));
    transferInput.value(particles[transferLocation][particleType].length);
  }, 1200)
}

// Brings outside and inside into equilibrium
function equilibrate(particleType) {
  outsideArray = particles["outside"][particleType];
  insideArray = particles["inside"][particleType];

  particleAmount = outsideArray.length + insideArray.length;
  equiAmount = Math.floor(particleAmount/2);
  // if either top or bottom has equilibrium amount, we can return
  if (outsideArray.length == equiAmount || insideArray.length == equiAmount) {
    return;
  }
  largerArrayLocation  = outsideArray.length > insideArray.length? "outside" : "inside";

  var transfers = particles[largerArrayLocation][particleType].length - equiAmount;
  for (var i = 0; i < transfers; i++) {
    setTimeout(function(){
        transferParticle(particleType,largerArrayLocation);
    }, 1000*i);
  }
}

function startEquilibrate(evt) {
  console.log("equilibrate");
  for (var i = 0; i < 2; i++) {
    equilibrate(particleTypes[i]);
  }
}


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
  var spacebar = 32;
  var Q_key = 81;
  var W_key = 87;
  var A_key = 65;
  var S_key = 83;
  var E_key = 69;

  switch (keyCode) {
    case spacebar:
    toggleLoop();
    break;

    case Q_key:
    transferParticle(particleTypes[0], "outside");
    break;

    case W_key:
    transferParticle(particleTypes[1], "outside");
    break;

    case A_key:
    transferParticle(particleTypes[0], "inside");
    break;

    case S_key:
    transferParticle(particleTypes[1], "inside");
    break;

    case E_key:
    equilibrate(particleTypes[0]);
    equilibrate(particleTypes[1]);
  }
}

function increase(evt) {
  var eventID = evt.target.id;
  var row = 3;

  var particleType = (eventID == 1 || eventID == (1+row)) ? particleTypes[0] : particleTypes[1];
  var particleLocation = (eventID == 1 || eventID == 2) ? "outside" : "inside";
  var particleArray = particles[particleLocation][particleType];

  randomX = containers[particleLocation].tl.x + particlesProperties[particleType].radius + (Math.floor(Math.random() * xRange));
  randomY = containers[particleLocation].tl.y + particlesProperties[particleType].radius + (Math.floor(Math.random() * yRange));

  var velocity = createVector(-5, -4);

  if(particleArray.length >= MaxParticles) {
    return;
  }

  particleArray.push(new factory[particleType](randomX,randomY,particlesProperties[particleType].radius,velocity, true));
  var updatedParticleAmount = particleArray.length;
  NernstFormulaInput(particleType);
  input[eventID].value(updatedParticleAmount);
}

function decrease(evt) {
  var eventID = evt.target.id;
  var row = 3;

  var particleType = (eventID == 1 || eventID == (1+row)) ? particleTypes[0] : particleTypes[1];
  var particleLocation = (eventID == 1 || eventID == 2) ? "outside" : "inside";
  var particleArray = particles[particleLocation][particleType];

  randomX = containers[particleLocation].tl.x + particlesProperties[particleType].radius + (Math.floor(Math.random() * xRange));
  randomY = containers[particleLocation].tl.y + particlesProperties[particleType].radius + (Math.floor(Math.random() * yRange));

  if(particleArray.length <= 0) {
    return;
  }

  particleArray.splice(particleArray.length - 1, 1);

  var updatedParticleAmount = particleArray.length;
  NernstFormulaInput(particleType);
  input[eventID].value(updatedParticleAmount);
}

function ChangeNumParticles(evt) {
  var eventID = evt.target.id;

  var particleType = (eventID == 1 || eventID == (1+row)) ?  particleTypes[0] : particleTypes[1];
  var particleLocation = (eventID == 1 || eventID == 2) ? "outside" : "inside";
  var particleArray = particles[particleLocation][particleType];
  var updatedAmount = input[eventID].value();

  // If the amount entered is invalid, alert user
  if (isNaN(updatedAmount) || Math.floor(updatedAmount) != updatedAmount || updatedAmount < 0) {
    alert("Please enter valid input.");
    return;
  }

  // If the amount entered is greater than the maximum, force it to maximum and alert user
  else if (updatedAmount > MaxParticles) {
    input[eventID].value(MaxParticles);
    alert("Maximum amount is " + MaxParticles + ".");
  }

  // If the amount entered is less than 0, increase the amount
  if (updatedAmount > particleArray.length) {
    increase(evt);
  }
  else if (updatedAmount < particleArray.length) {
    decrease(evt);
  }
}

function makeUIs() {
  // Channel
  var topLeft = new Point( canWidth/2-thickness, canHeight/2-thickness );
  var topRight = new Point( canWidth/2+thickness, canHeight/2-thickness );
  var botRight = new Point( canWidth/2+thickness, canHeight/2-thickness );
  var botLeft = new Point( canWidth/2-thickness, canHeight/2+thickness );
  // Containers
  var divisionTL = new Point(containers["outside"].bl.x,containers["outside"].bl.y);
  var divisionTR = new Point(containers["outside"].br.x,containers["outside"].br.y);
  var divisionBR = new Point(containers["inside"].tr.x,containers["inside"].tr.y);
  var divisionBL = new Point(containers["inside"].tl.x,containers["inside"].tl.y);

  // Create channels
  channels = createChannels(divisionTL,divisionTR,divisionBR,divisionBL,2);

  for (var i=0; i<channels.length; i++) {
    channels[i].draw();
  }

  // Set up the section where answers are displayed
  var answer = 0;
  equations[1] = createElement('h3', 'Answer: '+answer+'V');
  equations[1].class('qoptions');
  equations[1].parent('equationdiv');

  equations[2] = createSelect();
  equations[2].id(2);
  equations[2].attribute("xmlns", "http://www.w3.org/1999/xhtml")
  equations[2].class('eqninput');
  equations[2].parent('neq-top');
  equations[2].option(particleTypes[0]);
  equations[2].option(particleTypes[1]);
  equations[2].changed(NernstFormula);

  equations[3] = createSelect();
  equations[3].id(3);
  equations[3].attribute("xmlns", "http://www.w3.org/1999/xhtml")
  equations[3].class('eqninput');
  equations[3].parent('neq-bot');
  equations[3].option(particleTypes[0]);
  equations[3].option(particleTypes[1]);
  equations[3].changed(NernstFormula);

  equi = createButton('Equilibrate');
  equi.id('equilibrate-button');
  equi.parent('leftbar');
  equi.mousePressed(startEquilibrate);
  var row = 3;
  for (var k = 0; k < Object.keys(containers).length*row; k++) {
    if (k==0) {
      var text = 'Outside';
    } else if(k==row) {
      var text = 'Inside';
    } else {
      var particleType = (k == 1 || k == (1+row)) ? particleTypes[0] : particleTypes[1];
      var particleLocation = (k == 1 || k == 2) ? "outside" : "inside";
      var particleArray = particles[particleLocation][particleType];
      var text = particleType + ' Ions:&nbsp;';
      var Value = particleArray.length;
    }
    if (k == 0 || k == row) {
      textboard[k] = createElement('h3', text);
      textboard[k].class('qoptions');
      textboard[k].parent(eval("control" + k));

      createElement('br').parent(eval("control" + k));

      var table = createElement('table')
      table.class("table qoptions");
      table.id("table" + k);
      table.parent(eval("control" + (k + 1)));
    } else {
      var trow = createElement('tr');
      if (k < row) {
        trow.parent("table0");
      } else {
        trow.parent("table" + row);
      }

      textboard[k] = createElement('h4', text);
      textboard[k].class('qoptions');

      var td0 = createElement('td');
      textboard[k].parent(td0);
      td0.parent(trow);
      input[k] = createInput();
      input[k].value(Value)
      input[k].id("fasf");
      input[k].class('qoptions');

      var td1 = createElement('td');
      input[k].parent(td1);
      td1.parent(trow);

      plusButton[k] = createButton('+');
      plusButton[k].id(k);

      plusButton[k].attribute("data-ptype", particleType);
      plusButton[k].attribute("data-location", particleLocation);
      plusButton[k].style("background-color",particlesProperties[particleType].color)
      plusButton[k].mousePressed(increase);
      plusButton[k].class('qoptions');

      var td2 = createElement('td');
      plusButton[k].parent(td2);
      td2.parent(trow);

      minusButton[k] = createButton('-');
      minusButton[k].id(k);

      minusButton[k].attribute("data-ptype", particleType);
      minusButton[k].attribute("data-location", particleLocation);
      minusButton[k].style("background-color",particlesProperties[particleType].color)
      minusButton[k].mousePressed(decrease);
      minusButton[k].class('qoptions');

      var td3 = createElement('td');
      minusButton[k].parent(td3);
      td3.parent(trow);
    }
  }
}

function NernstFormula(evt) {
  var eventID = evt.target.id;
  var particleType = (eventID == 1 || eventID == (1+row)) ?  particleTypes[0] : particleTypes[1];
  NernstFormulaInput(particleType);
}

function NernstFormulaInput(particleType) {
    var R = 8.314;
    var T = 37 + 273.13
    var z = (particleType == particleTypes[0]) ? 1 : -1;
    Xout = particles["outside"][particleType].length;
    Xin = particles["inside"][particleType].length;
    var F = 96485.3329;//0.096485;
    var answer = (R*T)/(z*F)*Math.log(Xout/Xin);
    equations[1].html('Answer: '+answer.toFixed(4)+'V');
}
