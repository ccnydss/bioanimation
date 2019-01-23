// Nernst Equation
class NernstEq {
  constructor(m_sim) {
    this.m_sim = m_sim;
  }

  start(evt) {
    var sim = this.m_sim;

    //Graphics & Text
    sim.renderUI('GoldmanSetting', false)

    //Remove old text
    if (document.getElementById('MathJax-Element-1-Frame')) {
      sim.renderUI('GoldmanEqn',false)
      sim.renderUI('NernstEqn',true)

      if (sim.questionsAreHidden()) { //Only appear setting when question box disappear
        sim.renderUI('NernstSetting', true);
      }
    }

    //Add new text
    sim.m_dom.m_sim_question.init("Nernst");

    sim.simMode("Nernst");

    //disable the net in the plot
    graph.hidePlot(3, true);

    //enable last selected Ions
    for (var j = 0; j < sim.numParticleTypes(); j++) {
      var checkBoxParticle = sim.m_dom.m_sim_controls.checkboxes[j].elt.innerText;
      if (checkBoxParticle == sim.m_nernst_particle) {

        //Just enable it by default?

        //enable its particles
        sim.m_dom.m_sim_controls.checkbox(j, true);
        enableInputForParticle(checkBoxParticle);
        animationSequencer.current().setContainerDisplays(checkBoxParticle, true);

        //Also enable the particle in the plot
        graph.hidePlot(j, false);

        FormulaInputCalculation(checkBoxParticle);

        //disable other ions if they are on?
      } else if (checkBoxParticle != sim.m_nernst_particle && sim.m_dom.m_sim_controls.checkbox(j)) {
        //disable others particles
        sim.m_dom.m_sim_controls.checkbox(j, false);
        disableInputForParticle(checkBoxParticle);
        animationSequencer.current().setContainerDisplays(checkBoxParticle, false);

        //Also disable the particle in the plot
        graph.hidePlot(j, true);
      }
    }
  }

  compute(particleType) {
    // input: string;
    var R = this.m_sim.m_settings.gas_constant; // ideal gas constant
    var T = this.m_sim.m_settings.temperature; // 37 is the Human Body temperature
    var F = this.m_sim.m_settings.faraday; // Faraday's constant
    var z = particleMapper[particleType]["charge"];

    var Xout = animationSequencer.current().getNumParticles("outside", particleType);
    var Xin = animationSequencer.current().getNumParticles("inside", particleType);

    var answer = (R * T) / (z * F) * Math.log(Xout / Xin);
    return answer;
  }

  result(type) {
    return this.compute(type).toFixed(4) + " V";
  }
}
