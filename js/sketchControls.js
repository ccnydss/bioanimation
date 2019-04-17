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
  // output: double;
  var answer = null;
  var type = particleType;

  if (mainSim.simMode() == "Nernst" && particleType !== "Net") {
    if (particleMapper[particleType]["display"])
      answer = mainSim.nernst_eq.result(particleType);
  } else {
    mainSim.setAnswer(mainSim.nernst_eq.result("Na"), "Na");
    mainSim.setAnswer(mainSim.nernst_eq.result("Cl"), "Cl");
    mainSim.setAnswer(mainSim.nernst_eq.result("K"), "K");

    answer = mainSim.goldman_eq.result();
    type = "Net";
  }

  if (answer) mainSim.setAnswer(answer, type);
}
