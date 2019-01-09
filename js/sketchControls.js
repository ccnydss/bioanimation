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
  loadText("questions.json", "nernst_1");
  // document.getElementById('questionTitle').innerHTML= "Nernst Equation";
  // document.getElementById('q1').innerHTML=questionText[0];

  simulatorMode = "Nernst";
  var NernstButtonStatus = document.getElementById("NernstButton");
  var GoldmanButtonStatus = document.getElementById("GoldmanButton");

  NernstButtonStatus.style.backgroundColor = "#74b9ff";
  GoldmanButtonStatus.style.backgroundColor = "#dfe6e9";

    //disable the net in the plot
    if(dataChartInitialize)
    dataChart.getDatasetMeta(3).hidden = true;

  //enable last selected Ions
  for (var j = 0; j < particleTypes.length; j++) {
    var checkBoxParticle = document.getElementById('checkbox' + particleTypes[j]).innerText;
    if (checkBoxParticle == lastNernstParticle) {

      //Just enable it by default?
      // if (!checkboxes[i].checked()) {

      //enable its particles
      checkboxes[j].checked(true)
      particleMapper[checkBoxParticle].display = true;

      enableInputForParticle(checkBoxParticle);
      //Also enable the particle in the plot

      if(dataChartInitialize)
      dataChart.getDatasetMeta(j).hidden = false;

      bioMainSequence.setContainerDisplays(checkBoxParticle, true);

      FormulaInputCalculation(checkBoxParticle);
      //disable other ions if they are on?
    } else if (checkBoxParticle != lastNernstParticle & checkboxes[j].checked()) {
      //disable others particles
      checkboxes[j].checked(false)
      particleMapper[checkBoxParticle].display = false;
      disableInputForParticle(checkBoxParticle);
      //Also disable the particle in the plot

      if(dataChartInitialize)
      dataChart.getDatasetMeta(j).hidden = true;

      bioMainSequence.setContainerDisplays(checkBoxParticle, false);
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
  loadText("questions.json", "goldman_1");

  //Particles & functionality
  simulatorMode = "Goldman";
  var NernstButtonStatus = document.getElementById("NernstButton");
  var GoldmanButtonStatus = document.getElementById("GoldmanButton")
  GoldmanButtonStatus.style.backgroundColor = "#74b9ff";
  NernstButtonStatus.style.backgroundColor = "#dfe6e9";

  //enable the net in the plot
  dataChart.getDatasetMeta(3).hidden = false;

  //enable all Ions
  for (var j = 0; j < particleTypes.length; j++) {

  //enable all the particle in the plot
  dataChart.getDatasetMeta(j).hidden = false;

    var checkBoxParticle = document.getElementById('checkbox' + particleTypes[j]).innerText;

    if (!checkboxes[j].checked()) {

      //enable those particles
      checkboxes[j].checked(true)
      particleMapper[checkBoxParticle].display = true;
      enableInputForParticle(checkBoxParticle);

      bioMainSequence.setContainerDisplays(checkBoxParticle, true);
    }
  }

  FormulaInputCalculation();
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
    Na.permeability = updatedAmount;
    // NOTE: Why is this function call empty?
    FormulaInputCalculation();
  }
  if (eventID == 3) {
    Cl.permeability = updatedAmount;
    FormulaInputCalculation();
  }
  if (eventID == 4) {
    K.permeability = updatedAmount;
    FormulaInputCalculation();
  }

  if (simulatorMode == "Goldman") {
    FormulaInputCalculation();
  } else {
    if (Na.display == true) {
      FormulaInputCalculation("Na");
    } else if (Cl.display == true) {
      FormulaInputCalculation("Cl");
    } else if (K.display == true) {
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
    particleMapper[particleType].display = this.checked();

    bioMainSequence.setContainerDisplays(particleType, this.checked());

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

          if (checkboxes[j].checked() & checkBoxParticle != particleType & particleMapper[checkBoxParticle].display == true) {

            //Disable those particles
            checkboxes[j].checked(false)
            particleMapper[checkBoxParticle].display = false;
            disableInputForParticle(checkBoxParticle);

            bioMainSequence.setContainerDisplays(checkBoxParticle, false);

            //Also disable the particle in the plot
            dataChart.getDatasetMeta(j).hidden = true;
        } else if(particleMapper[checkBoxParticle]["display"] == true) {
            //Enable the particle in the plot
            dataChart.getDatasetMeta(j).hidden = false;
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

  // Set up the section where answers are displayed
  if (creation == true) {
    var answer = 0;

    equations[1] = createElement('h3', 'Answer: ' + answer + 'V');
    equations[1].class('qoptions');
    equations[1].parent('equationdiv');

    // Radio buttons to select ions to include
    for (var i = 0; i < particleTypes.length; i++) {
      checkboxes[i] = createCheckbox(particleTypes[i], false);
      checkboxes[i].class('checkboxes');
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
    for (var k = 0; k < bioMainSequence.getNumContainers() * row; k++) {
      if (k == 0) {
        var text = 'Extracellular Control:';
      } else if (k == row) {
        var text = 'Intracellular Control:';
      } else {
        var id = (k % row) - 1;
        var particleType = particleTypes[id];
        var particleLocation = (k <= 3) ? "outside" : "inside";

        var particleSuffix = (k <= 3) ?
          "out" :
          "in";
        var particleCharge = (particleMapper[particleType].charge == 1) ?
          "+" :
          "-";
        var text = '[' + particleType + '<sup>' + particleCharge + '</sup>]' + '<sub>' + particleSuffix + '</sub>&nbsp;';
        var Value = bioMainSequence.getNumParticles(particleLocation, particleType);
      }
      if (k == 0 || k == row) {
        textboard[k] = createElement('h4', text);
        textboard[k].class('qoptions');
        textboard[k].parent(eval("control" + k));

        createElement('br').parent(eval("control" + k));

        var table = createElement('table')
        table.class("table qoptions");
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
        input[k].input(changeNumParticles);

        plusButton[k] = createButton('+');
        plusButton[k].id(k);

        plusButton[k].attribute("data-ptype", particleType);
        plusButton[k].attribute("data-location", particleLocation);
        plusButton[k].style("background-color", particleMapper[particleType].color)
        plusButton[k].mousePressed(insertParticle);
        plusButton[k].class('qoptions');

        var td2 = createElement('td');
        plusButton[k].parent(td2);
        td2.parent(trow);

        minusButton[k] = createButton('-');
        minusButton[k].id(k);

        minusButton[k].attribute("data-ptype", particleType);
        minusButton[k].attribute("data-location", particleLocation);
        minusButton[k].style("background-color", particleMapper[particleType].color)
        minusButton[k].mousePressed(removeParticle);
        minusButton[k].class('qoptions');

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
  // output: float;

  if (simulatorMode == "Nernst") {
    if (particleMapper[particleType]["display"]) {
    var answer = calculateNernst(particleType);
    } else {
      equations[1].html('Answer: N/A - Particle Disabled');
      return;
    }
  } else {
    var answer = calculateGoldman();
  }
  equations[1].html('Answer: ' + answer.toFixed(4) + 'V');
}

function calculateNernst(particleType) {
  // input: string;
  var R = 8.314; // ideal gas constant
  var T = tempSetting; // 37 is the Human Body temperature
  var F = 96485.3329; // Faraday's constant
  var z = particleMapper[particleType]["charge"];
  var Xout = bioMainSequence.getNumParticles("outside", particleType);
  var Xin = bioMainSequence.getNumParticles("inside", particleType);

  return (R * T) / (z * F) * Math.log(Xout / Xin);
}

function calculateGoldman() {
  var R = 8.314; // ideal gas constant
  var T = tempSetting; // 37 is the Human Body temperature
  var F = 96485.3329; // Faraday's constant
  var numerator = 0;
  var denominator = 0;
  // Accumulate sums for numerator and denominator
  for (var i = 0; i < particleTypes.length; i++) {
    var particleType = particleTypes[i];
    if (particleMapper[particleType].display) {
      var numOutside = bioMainSequence.getNumParticles("outside", particleType);
      var numInside = bioMainSequence.getNumParticles("inside", particleType);

      if (particleMapper[particleType].charge > 0) {
        numerator += particleMapper[particleType].permeability * numOutside;

        denominator += particleMapper[particleType].permeability * numInside;
      } else {
        numerator += particleMapper[particleType].permeability * numInside;
        denominator += particleMapper[particleType].permeability * numOutside;
      }
    }
  }
  return answer = ((R * T) / F) * Math.log(numerator / denominator);
}

function disableInputForParticle(particleType) {
  // input: string;
  // usage: "Na", "Cl", "K"

  var row = 4;
  var particle_id = particleMapper[particleType].id;
  inside_id = particle_id + 1;
  outside_id = particle_id + 1 + row;
  input[inside_id].attribute('disabled', '');
  input[outside_id].attribute('disabled', '');
  plusButton[inside_id].attribute('disabled', '');
  minusButton[inside_id].attribute('disabled', '');
  plusButton[outside_id].attribute('disabled', '');
  minusButton[outside_id].attribute('disabled', '');

  animationSequencer.current().setContainerDisplays(particleType, false);

  particleMapper[particleType]["display"] = false;
}

function enableInputForParticle(particleType) {
  // input: string;
  // usage: "Na", "Cl", "K"

  var row = 4;
  var particle_id = particleMapper[particleType].id;
  inside_id = particle_id + 1;
  outside_id = particle_id + 1 + row;

  input[inside_id].removeAttribute('disabled');
  input[outside_id].removeAttribute('disabled');
  plusButton[inside_id].removeAttribute('disabled');
  minusButton[inside_id].removeAttribute('disabled');
  plusButton[outside_id].removeAttribute('disabled');
  minusButton[outside_id].removeAttribute('disabled');

  animationSequencer.current().setContainerDisplays(particleType, true);

  particleMapper[particleType].display = true;
}

function updateInputs(particleType, location, id) {
  var row = 4;
  var transferLocation = (location == "outside")
  ? "inside"
  : "outside";

  var oldInput = location == "outside"
    ? input[id + 1]
    : input[id + row + 1];

  var transferInput = location == "outside"
    ? input[id + row + 1]
    : input[id + 1];

  var oldAmount = bioMainSequence.getNumParticles(location, particleType);
  var transferAmount = bioMainSequence.getNumParticles(transferLocation, particleType);

  oldInput.value(oldAmount);
  transferInput.value(transferAmount);

  FormulaInputCalculation(particleType);
}
