function keyPressed() {
  mainSim.keyInput();
}

function windowResized() {
  mainSim.resize();
  help.resize();
}

function FormulaInputCalculation(particleType) {
  // input: string;
  // usage: "Na", "Cl", "K"
  // output: float;
  var answer = null;
  var type = particleType;

  if (mainSim.simMode() == "Nernst" && particleType !== "Net") {
    if (particleMapper[particleType]["display"])
      answer = mainSim.m_nernst_eq.result(particleType);
  } else {
    mainSim.setAnswer(mainSim.m_nernst_eq.result("Na"), "Na");
    mainSim.setAnswer(mainSim.m_nernst_eq.result("Cl"), "Cl");
    mainSim.setAnswer(mainSim.m_nernst_eq.result("K"), "K");

    answer = mainSim.m_goldman_eq.result();
    type = "Net";
  }

  if (answer) mainSim.setAnswer(answer, type);
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
