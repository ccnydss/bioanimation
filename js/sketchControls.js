var largerArrayLocations = {}; // global dictionary used to prevent equilibrating one particle type from interrupting another.

var transferParticle = function(particleType,location) {
  var xMul = 100;
  var yMul = 100;
  var id = particlesProperties[particleType]["id"];
  var row = 4;
  // Set names of current array is in and array to transfer particle into
  var currentArray = particles[location[particleType]][particleType];// eval(particle+"Particles"+currentNum);
  var transferLocation = (location[particleType] == "outside")? "inside" : "outside";
  var transferArray = particles[transferLocation][particleType];
  var offset = Math.floor(channels[0].width/2+10);

  if (currentArray.length == 0) {
    return;
  }
  // If the particle is in the top division
  console.log(channels);
  if (location[particleType][particleType] == "outside") {
    var targetChannel = channels[id].tl;
  }
  // If the particle is in the bottom division
  else {
    var targetChannel = channels[id].bl;
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
    var yVector = (location[particleType] == "outside") ? 3 : -3;
    var velocity = createVector(0, yVector);
    currentArray.push(new AnimatedParticle(OriX,OriY,diam,velocity, false, particleType));
  }, 800)
  // Remove particle from its old division and create particle in the new division
  setTimeout(function() {
    var particleIndex = particles[location[particleType]][particleType].length - 1;
    var OriParticle = currentArray[particleIndex];
    var OriX = Math.floor(OriParticle.x);
    var OriY = Math.floor(OriParticle.y);
    var diam = Math.floor(OriParticle.diam);
    var velocities = [-4,-3,3,4];
    var x_vel = Math.floor(Math.random() * 3) + 0;
    var y_vel = Math.floor(Math.random() * 3) + 0;
    var velocity = createVector(velocities[x_vel],Math.abs(velocities[y_vel]));
    currentArray.splice(particleIndex, 1);

    var oldInput = location[particleType] == "outside" ? input[id+1] : input[id+row+1];
    var transferInput = location[particleType] == "outside"?  input[id+row+1] : input[id+1];
    oldInput.value(particles[location[particleType]][particleType].length);
    transferArray.push(new factory[particleType](OriX,OriY,diam,velocity,true));
    transferInput.value(particles[transferLocation][particleType].length);
    NernstFormulaInput(particleType);
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
  inEquilbrateState[particleType] = true;
  setTimeout(function() {
    inEquilbrateState[particleType] = false;
  }, 1000*transfers);

  largerArrayLocations[particleType] = largerArrayLocation;
  for (var i = 0; i < transfers; i++) {
    setTimeout(function(){
      transferParticle(particleType,largerArrayLocations);
      console.log(inEquilbrateState);
    }, 1000*i);

  }

}

function startEquilibrate(evt) {
  console.log(inEquilbrateState);
  for (var i=0; i<particleTypes.length; i++) {
    if (!inEquilbrateState[particleTypes[i]]) {
      equilibrate(particleTypes[i]);
    }
  }
}

function disableButton() {
  console.log("DISABLED");
  document.getElementById('equilibrate-button').disabled = true;
}
function enableButton() {
  console.log("ENABLED");
  document.getElementById('equilibrate-button').disabled = false;
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
  var row = 4;
  var id = (eventID % row)-1;
  var particleType = particleTypes[id];
  var particleLocation = (eventID < row) ? "outside" : "inside";
  var particleArray = particles[particleLocation][particleType];

  randomX = containers[particleLocation].tl.x + particlesProperties[particleType].radius + (Math.floor(Math.random() * xRange));
  randomY = containers[particleLocation].tl.y + particlesProperties[particleType].radius + (Math.floor(Math.random() * yRange));

  var velocity = createVector(-3, -3);

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
  var row = 4;
  var id = (eventID % row)-1;
  var particleType = particleTypes[id];
  var particleLocation = (eventID < row) ? "outside" : "inside";
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
  var row = 4;
  var id =  (eventID % row)-1;
  var particleType = particleTypes[id];
  var particleLocation = (eventID < row) ? "outside" : "inside";
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


  var difference =  Math.abs(updatedAmount - particleArray.length)
    // If the amount entered is less than 0, increase the amount
  if (updatedAmount > particleArray.length) {
    for (var i=0; i<difference; i++) {
      randomX = containers[particleLocation].tl.x + particlesProperties[particleType].radius + (Math.floor(Math.random() * xRange));
      randomY = containers[particleLocation].tl.y + particlesProperties[particleType].radius + (Math.floor(Math.random() * yRange));
      var velocity = createVector(-3, -3);
      particleArray.push(new factory[particleType](randomX,randomY,particlesProperties[particleType].radius,velocity, true));
      NernstFormulaInput(particleType);
    }
  }
  else if (updatedAmount < particleArray.length) {
    for (var i=0; i<difference; i++) {
      particleArray.splice(particleArray.length - 1, 1);
      NernstFormulaInput(particleType);
    }
  }
}

function checkedEvent(evt) {
  var particleType = this.elt.innerText;
  particlesProperties[particleType]["display"] = this.checked();
  for (var i = 0; i < particles["inside"][particleType].length; i++) {
    setDisplay(particles["inside"][particleType][i], this.checked());
  }
  for (var i = 0; i < particles["outside"][particleType].length; i++) {
    setDisplay(particles["outside"][particleType][i],this.checked());
  }
  if (this.checked() == false) {
    disableInputForParticle(particleType);
  }
  else {
    enableInputForParticle(particleType);
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
  channels = createChannels(divisionTL,divisionTR,divisionBR,divisionBL,particleTypes.length);
  console.log(channels);
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
  for (var i=0; i<particleTypes.length; i++){
    equations[2].option(particleTypes[i]);
  }

  equations[2].changed(NernstFormula);

  equations[3] = createSelect();
  equations[3].id(3);
  equations[3].attribute("xmlns", "http://www.w3.org/1999/xhtml")
  equations[3].class('eqninput');
  equations[3].parent('neq-bot');
  for (var i=0; i<particleTypes.length; i++){
    equations[3].option(particleTypes[i]);
  }
  equations[3].changed(NernstFormula);

  
  // Radio buttons to select ions to include
  for (var i=0; i<particleTypes.length; i++) {
    var checkbox = createCheckbox(particleTypes[i],true);
    checkbox.class('checkboxes')
    checkbox.id('checkbox'+particleTypes[i])
    checkbox.parent('particleControl');
    checkbox.changed(checkedEvent);
  }

  equi = createButton('Equilibrate');
  equi.id('equilibrate-button');
  equi.parent('leftbar');
  equi.mousePressed(startEquilibrate);
  var row = 4;
  for (var k = 0; k < Object.keys(containers).length*row; k++) {
    if (k==0) {
      var text = 'Number of particles outside the cell';
    } else if(k==row) {
      var text = 'Number of particles inside the cell';
    } else {
      var id = (k % row)-1;
      var particleType = particleTypes[id];
      console.log(particleType);
      var particleLocation = (k <= 3) ? "outside" : "inside";
      var particleArray = particles[particleLocation][particleType];
      var text = particleType + ' Ions:&nbsp;';
      var Value = particleArray.length;
    }
    if (k == 0 || k == row) {
      textboard[k] = createElement('h4', text);
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
      input[k].id(k);
      input[k].class('qoptions');
      var td1 = createElement('td');
      input[k].parent(td1);
      td1.parent(trow);
      input[k].input(ChangeNumParticles);

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
  var row = 4;
  var id = eventID%row - 1;
  var particleType = particleTypes[id];
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

function disableInputForParticle(particleType) {
  var row = 4;
  var particle_id = particlesProperties[particleType]["id"];
  inside_id = particle_id + 1; 
  outside_id = particle_id + 1 + row;
  input[inside_id].attribute('disabled', '');
  plusButton[inside_id].attribute('disabled', '');
  minusButton[inside_id].attribute('disabled', '');
  plusButton[outside_id].attribute('disabled', '');
  minusButton[outside_id].attribute('disabled', '');
}

function enableInputForParticle(particleType) {
  var row = 4;
  var particle_id = particlesProperties[particleType]["id"];
  inside_id = particle_id + 1; 
  outside_id = particle_id + 1 + row;
  input[inside_id].removeAttribute('disabled');
  plusButton[inside_id].removeAttribute('disabled');
  minusButton[inside_id].removeAttribute('disabled');
  plusButton[outside_id].removeAttribute('disabled');
  minusButton[outside_id].removeAttribute('disabled');
}


