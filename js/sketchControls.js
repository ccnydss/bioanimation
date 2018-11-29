var largerArrayLocations = {}; // global dictionary used to prevent equilibrating one particle type from interrupting another.

var transferParticle = function(particleType, location) {
  // input: string, array
  // transfers a particle from top to bottom

  var id = particlesProperties[particleType]["id"];
  var row = 4;

  // Set names of current array is in and array to transfer particle into
  var currentArray = particles[location[particleType]][particleType];

  // Set destination container to opposite of the denser container
  var transferLocation = (location[particleType] == "outside")
  ? "inside"
  : "outside";

  var transferArray = particles[transferLocation][particleType];

  if (currentArray.length == 0) {
    return;
  }

  // Determine which cell channel the particle should move towards.
  // If the particle is in the top division
  if (location[particleType][particleType] == "outside") {
    var targetChannel = channels[id].tl;
  } else {
    // If the particle is in the bottom division
    var targetChannel = channels[id].bl;
  }

  // Get the offset from corner of the channel to its center.
  var offset = Math.floor(channels[0].width / 2 + 1);
  var xMul = 100;
  var yMul = 100;

  // Change move velocity to get particle to target channel
  var v = (targetChannel.x + offset - currentArray[0].center.x) / xMul;
  var u = (targetChannel.y - currentArray[0].center.y) / yMul;

  currentArray[0].orig_velocity = createVector(v, u);
  currentArray[0].move_velocity = createVector(v, u);

  var dist = euclideanDistance(currentArray[0].center.x, currentArray[0].center.y, targetChannel.x, targetChannel.y);

  var timeToGetToChannel = dist * 3;

  // Move particle through channel
  setTimeout(function() {
    var OriX = Math.floor(currentArray[0].center.x);
    var OriY = Math.floor(currentArray[0].center.y);
    var diam = currentArray[0].diam;
    var particle_color = currentArray[0].m_color;
    console.log("The color is", particle_color);

    // Remove the first particle from the array
    currentArray.splice(0, 1);

    var yVector = (location[particleType] == "outside")
    ? 3
    : -3;

    var velocity = createVector(0, yVector);
    currentArray.push(
      new AnimatedParticle(
        new Point(OriX, OriY),
        diam,
        velocity,
        false,
        particle_color
      )
    );
  }, 800)

  // Remove particle from its old division and create particle in the new division
  setTimeout(function() {
    var particleIndex = particles[location[particleType]][particleType].length - 1;
    var OriParticle = currentArray[particleIndex];
    var OriX = Math.floor(OriParticle.center.x);
    var OriY = Math.floor(OriParticle.center.y);
    var diam = Math.floor(OriParticle.diam);

    velocities = velocityRange;

    var x_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
    var y_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
    var velocity = createVector(velocities[x_vel], Math.abs(velocities[y_vel]));

    currentArray.splice(particleIndex, 1);

    var oldInput = location[particleType] == "outside"
    ? input[id + 1]
    : input[id + row + 1];

    var transferInput = location[particleType] == "outside"
    ? input[id + row + 1]
    : input[id + 1];

    oldInput.value(particles[location[particleType]][particleType].length);

    var newParticle = new factory[particleType](
      new Point(OriX, OriY),
      diam,
      velocity,
      true
    );

    newParticle.setDisplay(true);

    transferArray.push(newParticle);

    transferInput.value(particles[transferLocation][particleType].length);

    FormulaInputCalculation(particleType);
  }, 1200)
}

// Brings outside and inside into equilibrium
function equilibrate(particleType) {
  // input: string;
  // usage: "Na", "Cl", "K"

  outsideArray = particles["outside"][particleType];
  insideArray = particles["inside"][particleType];

  particleAmount = outsideArray.length + insideArray.length;

  // The equilibrium function: how top and bottom should be split.
  equiAmount = Math.floor(particleAmount / 2);

  // if either top or bottom has equilibrium amount, we can return
  if (outsideArray.length == equiAmount || insideArray.length == equiAmount) {
    return;
  }

  largerArrayLocation = outsideArray.length > insideArray.length
  ? "outside"
  : "inside";

  // The number of particles that need to be transferred to each equilibrium
  var transfers = particles[largerArrayLocation][particleType].length - equiAmount;

  inEquilbrateState[particleType] = true;

  setTimeout(function() {
    inEquilbrateState[particleType] = false;
  }, 1000 * transfers);

  // Perform N transfers from the denser container to the sparser container.
  largerArrayLocations[particleType] = largerArrayLocation;
  for (var i = 0; i < transfers; i++) {
    setTimeout(function() {
      transferParticle(particleType, largerArrayLocations);
    }, 1000 * i);
  }
}

var NernstButtonStatus;
var GoldmanButtonStatus;
var simulatorMode;

function startNernst(evt) {
  // input: the event DOM object; however this input is unused in this function

  //Remove old text
  if (document.getElementById('MathJax-Element-1-Frame')) {
    document.getElementById('MathJax-Element-2-Frame').style.display = "none";
    document.getElementById('MathJax-Element-1-Frame').style.display = "inline";

    if (equationContainerHeighthMul != 0.35) { //Only appear setting when question box disappear
      document.getElementById('GoldmanSetting').style.display = "none";
      document.getElementById('NernstSetting').style.display = "initial";
    }
  }

  //Add new text
  createText("questions.json", "nernst_1");
  // document.getElementById('questionTitle').innerHTML= "Nernst Equation";
  // document.getElementById('q1').innerHTML=questionText[0];

  simulatorMode = "Nernst";
  var NernstButtonStatus = document.getElementById("NernstButton");
  var GoldmanButtonStatus = document.getElementById("GoldmanButton");

  NernstButtonStatus.style.backgroundColor = "#74b9ff";
  GoldmanButtonStatus.style.backgroundColor = "#dfe6e9";

  //enable last selected Ions
  for (var j = 0; j < particleTypes.length; j++) {
    var checkBoxParticle = document.getElementById('checkbox' + particleTypes[j]).innerText;
    if (checkBoxParticle == lastNernstParticle) {

      //Just enable it by default?
      // if (!checkboxes[i].checked()) {

      //enable its particles
      checkboxes[j].checked(true)
      particlesProperties[checkBoxParticle]["display"] = true;
      enableInputForParticle(checkBoxParticle);

      for (const particle of particles["inside"][checkBoxParticle]) {
        particle.setDisplay(true);
      }

      for (const particle of particles["outside"][checkBoxParticle]) {
        particle.setDisplay(true);
      }

      FormulaInputCalculation(checkBoxParticle);
      //disable other ions if they are on?
    } else if (checkBoxParticle != lastNernstParticle & checkboxes[j].checked()) {
      //disable others particles
      checkboxes[j].checked(false)
      particlesProperties[checkBoxParticle]["display"] = false;
      disableInputForParticle(checkBoxParticle);

      for (const particle of particles["inside"][checkBoxParticle]) {
        particle.setDisplay(false);
      }

      for (const particle of particles["outside"][checkBoxParticle]) {
        particle.setDisplay(false);
      }
    }
  }
}

function startGoldman(evt) {
  // input: the element that triggered the event; however this input is unused in this function

  //Graphics & Text

  //Remove old text
  if (document.getElementById('MathJax-Element-1-Frame')) {
    document.getElementById('MathJax-Element-1-Frame').style.display = "none";
    document.getElementById('MathJax-Element-2-Frame').style.display = "inline";

    if (equationContainerHeighthMul != 0.35) { //Only appear setting when question box disappear
      document.getElementById('NernstSetting').style.display = "none";
      document.getElementById('GoldmanSetting').style.display = "initial";
    }
  }

  //Add new text
  createText("questions.json", "goldman_1");

  //Particles & functionality
  simulatorMode = "Goldman";
  var NernstButtonStatus = document.getElementById("NernstButton");
  var GoldmanButtonStatus = document.getElementById("GoldmanButton")
  GoldmanButtonStatus.style.backgroundColor = "#74b9ff";
  NernstButtonStatus.style.backgroundColor = "#dfe6e9";

  //enable all Ions
  for (var j = 0; j < particleTypes.length; j++) {
    var checkBoxParticle = document.getElementById('checkbox' + particleTypes[j]).innerText;

    if (!checkboxes[j].checked()) {

      //enable those particles
      checkboxes[j].checked(true)
      particlesProperties[checkBoxParticle]["display"] = true;
      enableInputForParticle(checkBoxParticle);

      for (const particle of particles["inside"][checkBoxParticle]) {
        particle.setDisplay(true);
      }

      for (const particle of particles["outside"][checkBoxParticle]) {
        particle.setDisplay(true);
      }
    }
  }

  FormulaInputCalculation();
}

function startEquilibrate(evt) {
  // input: the element that triggered the event; however this input is unused in this function

  for (var i = 0; i < particleTypes.length; i++) {
    if (!inEquilbrateState[particleTypes[i]] && particlesProperties[particleTypes[i]]["display"]) {
      equilibrate(particleTypes[i]);
    }
  }
}

function disableButton() {
  document.getElementById('equilibrate-button').disabled = true;
}

function enableButton() {
  document.getElementById('equilibrate-button').disabled = false;
}

// Pause / unpause the animation (debug purposes)
var togLoop = false;
function toggleLoop() {
  if (togLoop) {
    loop();
    togLoop = false;

    document.getElementById('simCanvasPause').style.display = "none";
  } else {
    noLoop();
    togLoop = true;

    document.getElementById('simCanvasPause').style.display = "flex";
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

    // NOTE: These no longer work because second param should be array
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
    // NOTE: "E" key breaks when pushed in Nernst mode -- it transfers the Cl particles too
    equilibrate(particleTypes[0]);
    equilibrate(particleTypes[1]);
  }
}

function increase(evt) {
  // input: the element that triggered the event (Input buttons);
  // Add an element to the thing

  var eventID = evt.target.id;
  var row = 4;
  var id = (eventID % row) - 1;
  var particleType = particleTypes[id];
  var particleLocation = (eventID < row)
  ? "outside"
  : "inside";

  var particleArray = particles[particleLocation][particleType];

  randomX = containers[particleLocation].tl.x + particlesProperties[particleType].radius + (Math.floor(Math.random() * xRange));
  randomY = containers[particleLocation].tl.y + particlesProperties[particleType].radius + (Math.floor(Math.random() * yRange));

  // var velocity = createVector(-3, -3);
  velocities = velocityRange;
  var x_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
  var y_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
  var velocity = createVector(velocities[x_vel], Math.abs(velocities[y_vel]));
  if (particleArray.length >= MaxParticles) {
    return;
  }

  var newParticle = new factory[particleType](
    new Point(randomX, randomY),
    particlesProperties[particleType].radius,
    velocity,
    true
  );
  newParticle.setDisplay(true);
  particleArray.push( newParticle );

  var updatedParticleAmount = particleArray.length;
  // if (particleType == document.getElementById('particleSelect').value) {
  FormulaInputCalculation(particleType);
  // }
  input[eventID].value(updatedParticleAmount);
}

function decrease(evt) {
  // input: the element that triggered the event (Input buttons);

  var eventID = evt.target.id;
  var row = 4;
  var id = (eventID % row) - 1;
  var particleType = particleTypes[id];
  var particleLocation = (eventID < row)
  ? "outside"
  : "inside";
  var particleArray = particles[particleLocation][particleType];

  randomX = containers[particleLocation].tl.x + particlesProperties[particleType].radius + (Math.floor(Math.random() * xRange));
  randomY = containers[particleLocation].tl.y + particlesProperties[particleType].radius + (Math.floor(Math.random() * yRange));

  if (particleArray.length <= 0) {
    return;
  }

  particleArray.splice(particleArray.length - 1, 1);

  var updatedParticleAmount = particleArray.length;
  // if (particleType == document.getElementById('particleSelect').value) {
  FormulaInputCalculation(particleType);
  // }
  input[eventID].value(updatedParticleAmount);
}

function ChangeNumParticles(evt) {
  // input: the element that triggered the event (Input buttons);

  var eventID = evt.target.id;
  var row = 4;
  var id = (eventID % row) - 1;
  var particleType = particleTypes[id];
  var particleLocation = (eventID < row)
  ? "outside"
  : "inside";
  var particleArray = particles[particleLocation][particleType];
  var updatedAmount = input[eventID].value();
  // If the amount entered is invalid, alert user
  if (isNaN(updatedAmount) || Math.floor(updatedAmount) != updatedAmount || updatedAmount < 0) {
    alert("Please enter valid input.");
    // If the amount entered is greater than the maximum, force it to maximum and alert user
    return;
  } else if (updatedAmount > MaxParticles) {
    input[eventID].value(MaxParticles);
    updatedAmount = MaxParticles;
    alert("Maximum amount is " + MaxParticles + ".");
  }

  var difference = Math.abs(updatedAmount - particleArray.length)
  // If the amount entered is less than 0, increase the amount
  if (updatedAmount > particleArray.length) {
    for (var i = 0; i < difference; i++) {
      randomX = containers[particleLocation].tl.x + particlesProperties[particleType].radius + (Math.floor(Math.random() * xRange));
      randomY = containers[particleLocation].tl.y + particlesProperties[particleType].radius + (Math.floor(Math.random() * yRange));
      // var velocity = createVector(-3, -3);
      velocities = velocityRange;
      var x_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
      var y_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
      var velocity = createVector(velocities[x_vel], velocities[y_vel]);
      particleArray.push(
        new factory[particleType](
          new Point(randomX, randomY),
          particlesProperties[particleType].radius,
          velocity,
          true
        )
      );
      // if (particleType == document.getElementById('particleSelect').value) {
      FormulaInputCalculation(particleType);
      // }
    }
  } else if (updatedAmount < particleArray.length) {
    for (var i = 0; i < difference; i++) {
      particleArray.splice(particleArray.length - 1, 1);
      // if (particleType == document.getElementById('particleSelect').value) {
      FormulaInputCalculation(particleType);
      // }
    }
  }
}

function ChangesimulatorSetting(evt) {
  // input: the element that triggered the event (Input buttons);

  var eventID = evt.target.id;
  //0 = temperature
  //1 = charge *Removed*
  //1 = temperature
  //2 = Pna
  //3 = Pcl
  //4 = Pk
  var updatedAmount = simSetting[eventID].value();

  if (eventID == 0 || eventID == 1) {
    tempSetting = updatedAmount;
    simSetting[0].value(updatedAmount);
    simSetting[1].value(updatedAmount);
  }
  if (eventID == 2) {
    particlesProperties["Na"]["permeability"] = updatedAmount;
    FormulaInputCalculation();
  }
  if (eventID == 3) {
    particlesProperties["Cl"]["permeability"] = updatedAmount;
    FormulaInputCalculation();
  }
  if (eventID == 4) {
    particlesProperties["K"]["permeability"] = updatedAmount;
    FormulaInputCalculation();
  }

  if (simulatorMode == "Goldman") {
    FormulaInputCalculation();
  } else {
    if (particlesProperties["Na"]["display"] == true) {
      FormulaInputCalculation("Na");
    } else if (particlesProperties["Cl"]["display"] == true) {
      FormulaInputCalculation("Cl");
    } else if (particlesProperties["K"]["display"] == true) {
      FormulaInputCalculation("K");
    }
  }
}

function checkedEvent(evt) {
  // input: the element that triggered the event (Input buttons);

  if (simulatorMode == "Goldman") {
    this.checked(true); //Left checkbox checked by default
  } else {
    var particleType = this.elt.innerText;
    particlesProperties[particleType]["display"] = this.checked();

    for (const particle of particles["inside"][particleType]) {
      particle.setDisplay(this.checked());
    }

    for (const particle of particles["outside"][particleType]) {
      particle.setDisplay(this.checked());
    }

    if (this.checked() == false) {
      disableInputForParticle(particleType);
    } else {
      enableInputForParticle(particleType);

      //Nernst Mode, only allow enable of one particle
      if (simulatorMode == "Nernst") {

        lastNernstParticle = this.elt.innerText;

        for (var j = 0; j < particleTypes.length; j++) {

          // var checkBox = document.getElementById('checkbox'+particleTypes[i])
          var checkBoxParticle = document.getElementById('checkbox' + particleTypes[j]).innerText;

          // console.log(checkBox+ " " + checkBoxParticle+ " " + particlesProperties[checkBoxParticle]["display"] + " ")

          if (checkboxes[j].checked() & checkBoxParticle != particleType & particlesProperties[checkBoxParticle]["display"] == true) {

            //Disable those particles
            checkboxes[j].checked(false)
            particlesProperties[checkBoxParticle]["display"] = false;
            disableInputForParticle(checkBoxParticle);

            for (const particle of particles["inside"][checkBoxParticle]) {
              particle.setDisplay(false);
            }

            for (const particle of particles["outside"][checkBoxParticle]) {
              particle.setDisplay(false);
            }
          }
        }
      }
    }
    FormulaInputCalculation(particleType)
  }
}

//Store as global array, so we can checked and unchecked later
var checkboxes = [];

function makeUIs(creation) {
  // input: Boolean;
  // usage: True is for initializing the UI; False is for recreating UI when browser window is resized (responsive UI)

  // Channel
  var topLeft = new Point(canWidth / 2 - thickness, canHeight / 2 - thickness);
  var topRight = new Point(canWidth / 2 + thickness, canHeight / 2 - thickness);
  var botRight = new Point(canWidth / 2 + thickness, canHeight / 2 - thickness);
  var botLeft = new Point(canWidth / 2 - thickness, canHeight / 2 + thickness);
  // Containers
  var divisionTL = new Point(containers["outside"].bl.x, containers["outside"].bl.y);
  var divisionTR = new Point(containers["outside"].br.x, containers["outside"].br.y);
  var divisionBR = new Point(containers["inside"].tr.x, containers["inside"].tr.y);
  var divisionBL = new Point(containers["inside"].tl.x, containers["inside"].tl.y);

  // Create channels
  channels = createChannels(divisionTL, divisionTR, divisionBR, divisionBL, particleTypes.length);
  for (var i = 0; i < channels.length; i++) {
    channels[i].draw();
  }

  // Set up the section where answers are displayed
  if (creation == true) {
    var answer = 0;

    // equations[4] = createSelect();
    // equations[4].id("particleSelect");
    // for (var i=0; i<particleTypes.length; i++){
    //   equations[4].option(particleTypes[i]);
    // }
    // equations[4].class('qoptions');
    // equations[4].parent('equationdiv');
    // equations[4].changed(NernstFormula);
    equations[1] = createElement('h3', 'Answer: ' + answer + 'V');
    equations[1].class ('qoptions');
    equations[1].parent('equationdiv');

    // Radio buttons to select ions to include
    for (var i = 0; i < particleTypes.length; i++) {

      // if (i==0) {
      //   checkboxes[i] = createCheckbox(particleTypes[i],true);
      // } else {
      checkboxes[i] = createCheckbox(particleTypes[i], false);
      // }
      checkboxes[i].class ('checkboxes');
      checkboxes[i].id('checkbox' + particleTypes[i]);
      checkboxes[i].parent('particleControl');
      checkboxes[i].changed(checkedEvent);
    }

    NernstButton = createButton('Nernst');
    NernstButton.id('NernstButton');
    NernstButton.parent('particleControl');
    NernstButton.mousePressed(startNernst);
    GoldmanButton = createButton('Goldman');
    GoldmanButton.id('GoldmanButton');
    GoldmanButton.parent('particleControl');
    GoldmanButton.mousePressed(startGoldman);

    var row = 4;
    for (var k = 0; k < Object.keys(containers).length * row; k++) {
      if (k == 0) {
        var text = 'Extracellular Control:';
      } else if (k == row) {
        var text = 'Intracellular Control:';
      } else {
        var id = (k % row) - 1;
        var particleType = particleTypes[id];
        var particleLocation = (k <= 3)
        ? "outside"
        : "inside";
        var particleArray = particles[particleLocation][particleType];

        var particleSuffix = (k <= 3)
        ? "out"
        : "in";
        var particleCharge = (particlesProperties[particleType].charge == 1)
        ? "+"
        : "-";
        var text = '[' + particleType + '<sup>' + particleCharge + '</sup>]' + '<sub>' + particleSuffix + '</sub>&nbsp;';
        var Value = particleArray.length;
      }
      if (k == 0 || k == row) {
        textboard[k] = createElement('h4', text);
        textboard[k].class ('qoptions');
        textboard[k].parent(eval("control" + k));

        createElement('br').parent(eval("control" + k));

        var table = createElement('table')
        table.class ("table qoptions");
        table.id("table" + k);
        table.parent(eval("control" + (
          k + 1)));
        } else {
          var trow = createElement('tr');
          if (k < row) {
            trow.parent("table0");
          } else {
            trow.parent("table" + row);
          }

          textboard[k] = createElement('h4', text);
          textboard[k].class ('qoptions');

          var td0 = createElement('td');
          textboard[k].parent(td0);
          td0.parent(trow);
          input[k] = createInput();
          input[k].value(Value)
          input[k].id(k);
          input[k].class ('qoptions');
          var td1 = createElement('td');
          input[k].parent(td1);
          td1.parent(trow);
          input[k].input(ChangeNumParticles);

          plusButton[k] = createButton('+');
          plusButton[k].id(k);

          plusButton[k].attribute("data-ptype", particleType);
          plusButton[k].attribute("data-location", particleLocation);
          plusButton[k].style("background-color", particlesProperties[particleType].color)
          plusButton[k].mousePressed(increase);
          plusButton[k].class ('qoptions');

          var td2 = createElement('td');
          plusButton[k].parent(td2);
          td2.parent(trow);

          minusButton[k] = createButton('-');
          minusButton[k].id(k);

          minusButton[k].attribute("data-ptype", particleType);
          minusButton[k].attribute("data-location", particleLocation);
          minusButton[k].style("background-color", particlesProperties[particleType].color)
          minusButton[k].mousePressed(decrease);
          minusButton[k].class ('qoptions');

          var td3 = createElement('td');
          minusButton[k].parent(td3);
          td3.parent(trow);
        }
      }
    }
  }

  function NernstFormula(evt) {
    // input: the element that triggered the event (Input buttons);

    var eventID = evt.target.id;
    var newParticleType = equations[eventID].value();
    var particleType = newParticleType;
    FormulaInputCalculation(particleType);
  }

  function FormulaInputCalculation(particleType) {
    // input: string;
    // usage: "Na", "Cl", "K"

    if (simulatorMode == "Nernst") {
      var R = 8.314;
      var T = tempSetting;
      var z = particlesProperties[particleType]["charge"];
      if (particlesProperties[particleType]["display"]) {
        var Xout = particles["outside"][particleType].length;
        var Xin = particles["inside"][particleType].length;
      } else {
        equations[1].html('Answer: N/A - Particle Disabled');
        return;
      }
      var F = 96485.3329; //0.096485;
      var answer = (R * T) / (z * F) * Math.log(Xout / Xin);

    } else {
      var R = 8.314; // ideal gas constant
      var T = tempSetting; // 37 is the Human Body temperature
      var F = 96485.3329; // Faraday's constant
      var numerator = 0;
      var denominator = 0;
      // Accumulate sums for numerator and denominator
      for (var i = 0; i < particleTypes.length; i++) {
        var particleType = particleTypes[i];
        // console.log(particleType, ": ", particlesProperties[particleType]["display"]);
        if (particlesProperties[particleType]["display"]) {
          if (particlesProperties[particleType]["charge"] > 0) {
            numerator += particlesProperties[particleType]["permeability"] * particles["outside"][particleType].length;
            denominator += particlesProperties[particleType]["permeability"] * particles["inside"][particleType].length;
          } else {
            numerator += particlesProperties[particleType]["permeability"] * particles["inside"][particleType].length;
            denominator += particlesProperties[particleType]["permeability"] * particles["outside"][particleType].length;
          }
        }
      }
      var answer = ((R * T) / F) * Math.log(numerator / denominator);
    }

    equations[1].html('Answer: ' + answer.toFixed(4) + 'V');
  }

  function disableInputForParticle(particleType) {
    // input: string;
    // usage: "Na", "Cl", "K"

    var row = 4;
    var particle_id = particlesProperties[particleType]["id"];
    inside_id = particle_id + 1;
    outside_id = particle_id + 1 + row;
    input[inside_id].attribute('disabled', '');
    input[outside_id].attribute('disabled', '');
    plusButton[inside_id].attribute('disabled', '');
    minusButton[inside_id].attribute('disabled', '');
    plusButton[outside_id].attribute('disabled', '');
    minusButton[outside_id].attribute('disabled', '');
  }

  function enableInputForParticle(particleType) {
    // input: string;
    // usage: "Na", "Cl", "K"

    var row = 4;
    var particle_id = particlesProperties[particleType]["id"];
    inside_id = particle_id + 1;
    outside_id = particle_id + 1 + row;
    input[inside_id].removeAttribute('disabled');
    input[outside_id].removeAttribute('disabled');
    plusButton[inside_id].removeAttribute('disabled');
    minusButton[inside_id].removeAttribute('disabled');
    plusButton[outside_id].removeAttribute('disabled');
    minusButton[outside_id].removeAttribute('disabled');
  }

  function euclideanDistance(x1, y1, x2, y2) {
    // input: integer;

    var xdiff = x2 - x1;
    var ydiff = y2 - y1;
    return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
  }

  function createText(url, tag) {
    // input1: string;
    // usage: 'questions.json' (filename)
    // input2: string
    // usage: 'goldman_1', 'nernst_1' (Data.name)

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText)
        document.getElementById("q1").innerHTML = myArr[tag].join('');;
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
