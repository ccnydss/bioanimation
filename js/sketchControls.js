function keyPressed() {
  mainSim.keyInput();
}

function windowResized() {
  mainSim.resize();
  help.resize();
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

        for (var j = 0; j < mainSim.numParticleTypes(); j++) {

          var checkBoxParticle = document.getElementById('checkbox' + mainSim.m_particle_types[j]).innerText;

          if (mainSim.m_dom.m_sim_controls.checkbox(j) && checkBoxParticle != particleType && particleMapper[checkBoxParticle].display == true) {

            //Disable those particles
            mainSim.m_dom.m_sim_controls.checkbox(j, false);
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
  var answer = null;

  if (mainSim.simMode() == "Nernst") {
    if (particleMapper[particleType]["display"])
      answer = mainSim.m_nernst_eq.result(particleType);
  } else {
    answer = mainSim.m_goldman_eq.result();
  }

  if (answer) mainSim.setAnswer(answer);
}

function disableInputForParticle(particleType) {
  // input: string;
  // usage: "Na", "Cl", "K"
  var particle_id = particleMapper[particleType].id;

  mainSim.m_dom.disableParticleID(particle_id);

  animationSequencer.current().setContainerDisplays(particleType, false);
}

function enableInputForParticle(particleType) {
  // input: string;
  // usage: "Na", "Cl", "K"
  var particle_id = particleMapper[particleType].id;

  mainSim.m_dom.enableParticleID(particle_id);

  animationSequencer.current().setContainerDisplays(particleType, true);
}
