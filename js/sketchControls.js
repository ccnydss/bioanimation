function startNernst(evt) {
  // input: the event DOM object; however this input is unused in this function

  //Remove old text
  if (document.getElementById('MathJax-Element-1-Frame')) {
    document.getElementById('NernstEqn').style.display = "inline";
    document.getElementById('GoldmanEqn').style.display = "none";

    if (mainSim.questionsAreHidden()) { //Only appear setting when question box disappear
      document.getElementById('GoldmanSetting').style.display = "none";
      document.getElementById('NernstSetting').style.display = "initial";
    }
  }

  //Add new text
  loadText("questions.json", "nernst_1");

  mainSim.simMode("Nernst");

  //disable the net in the plot
  graph.hidePlot(3, true);

  //enable last selected Ions
  for (var j = 0; j < particleTypes.length; j++) {
    var checkBoxParticle = document.getElementById('checkbox' + particleTypes[j]).innerText;
    if (checkBoxParticle == mainSim.m_nernst_particle) {

      //Just enable it by default?

      //enable its particles
      mainSim.checkbox(j, true);
      enableInputForParticle(checkBoxParticle);
      animationSequencer.current().setContainerDisplays(checkBoxParticle, true);

      //Also enable the particle in the plot
      graph.hidePlot(j, false);

      FormulaInputCalculation(checkBoxParticle);

      //disable other ions if they are on?
    } else if (checkBoxParticle != mainSim.m_nernst_particle && mainSim.checkbox(j)) {
      //disable others particles
      mainSim.checkbox(j, false);
      disableInputForParticle(checkBoxParticle);
      animationSequencer.current().setContainerDisplays(checkBoxParticle, false);

      //Also disable the particle in the plot
      graph.hidePlot(j, true);
    }
  }
}

function startGoldman(evt) {
  // input: the element that triggered the event; however this input is unused in this function

  //Graphics & Text

  //Remove old text
  if (document.getElementById('MathJax-Element-1-Frame')) {
    document.getElementById('NernstEqn').style.display = "none";
    document.getElementById('GoldmanEqn').style.display = "inline";

    if (mainSim.questionsAreHidden()) { //Only appear setting when question box disappear
      document.getElementById('NernstSetting').style.display = "none";
      document.getElementById('GoldmanSetting').style.display = "initial";
    }
  }

  //Add new text
  loadText("questions.json", "goldman_1");

  //Particles & functionality
  mainSim.simMode("Goldman");

  //enable the net in the plot
  graph.hidePlot(3, false);

  //enable all Ions
  for (var j = 0; j < particleTypes.length; j++) {
    //enable all the particle in the plot
    graph.hidePlot(j, false);

    var checkBoxParticle = document.getElementById('checkbox' + particleTypes[j]).innerText;

    if (!mainSim.checkbox(j)) {

      //enable those particles
      mainSim.checkbox(j, true);
      animationSequencer.current().setContainerDisplays(checkBoxParticle, true);
      enableInputForParticle(checkBoxParticle);
    }
  }

  FormulaInputCalculation();
}

function keyPressed() {
  mainSim.keyInput();
}

function windowResized() {
  mainSim.resize();
}

function checkedEvent(evt) {
  // input: the element that triggered the event (Input buttons);

  if (mainSim.simMode() == "Goldman") {
    // evt.target.checked(true); //Left checkbox checked by default
  } else {
    var particleType = this.elt.innerText;

    animationSequencer.current().setContainerDisplays(particleType, this.checked());

    if (this.checked() == false) {
      disableInputForParticle(particleType);
    } else {
      enableInputForParticle(particleType);

      //Nernst Mode, only allow enable of one particle
      if (mainSim.simMode() == "Nernst") {

        mainSim.m_nernst_particle = this.elt.innerText;

        for (var j = 0; j < particleTypes.length; j++) {

          // var checkBox = document.getElementById('checkbox'+particleTypes[i])
          var checkBoxParticle = document.getElementById('checkbox' + particleTypes[j]).innerText;

          if (mainSim.checkbox(j) && checkBoxParticle != particleType && particleMapper[checkBoxParticle].display == true) {

            //Disable those particles
            mainSim.checkbox(j, false);
            animationSequencer.current().setContainerDisplays(checkBoxParticle, false);
            disableInputForParticle(checkBoxParticle);

            //Also disable the particle in the plot
            graph.hidePlot(j, true);
        } else if (particleMapper[checkBoxParticle]["display"] == true) {
            //Enable the particle in the plot
            graph.hidePlot(j, false);
          }
        }
      }
    }
    FormulaInputCalculation(particleType)
  }
}

function FormulaInputCalculation(particleType) {
  // input: string;
  // usage: "Na", "Cl", "K"
  // output: float;

  if (mainSim.simMode() == "Nernst") {
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
  var R = mainSim.m_settings.gas_constant; // ideal gas constant
  var T = mainSim.m_settings.temperature; // 37 is the Human Body temperature
  var F = mainSim.m_settings.faraday; // Faraday's constant
  var z = particleMapper[particleType]["charge"];

  var Xout = animationSequencer.current().getNumParticles("outside", particleType);
  var Xin = animationSequencer.current().getNumParticles("inside", particleType);

  return (R * T) / (z * F) * Math.log(Xout / Xin);
}

function calculateGoldman() {
  var R = mainSim.m_settings.gas_constant; // ideal gas constant
  var T = mainSim.m_settings.temperature; // 37 is the Human Body temperature
  var F = mainSim.m_settings.faraday; // Faraday's constant

  var numerator = 0;
  var denominator = 0;
  // Accumulate sums for numerator and denominator
  for (var i = 0; i < particleTypes.length; i++) {
    var particleType = particleTypes[i];
    if (particleMapper[particleType].display) {
      var numOutside = animationSequencer.current().getNumParticles("outside", particleType);
      var numInside = animationSequencer.current().getNumParticles("inside", particleType);

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
}

function updateAll() {
  updateInputs("Na", "outside", 0);
  updateInputs("Na", "inside", 0);
  updateInputs("Cl", "outside", 1);
  updateInputs("Cl", "inside", 1);
  updateInputs("K", "outside", 2);
  updateInputs("K", "inside", 2);

  FormulaInputCalculation("Na");
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

  var oldAmount = animationSequencer.current().getNumParticles(location, particleType);
  var transferAmount = animationSequencer.current().getNumParticles(transferLocation, particleType);

  oldInput.value(oldAmount);
  transferInput.value(transferAmount);

  FormulaInputCalculation(particleType);
}
