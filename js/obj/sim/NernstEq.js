
class NernstEq {
  /**
  * Create a Nernst Equation system.
  * @example <caption>Create a Nernst Equation.</caption>
  mainSim.m_nernst_eq = new NernstEq(mainSim);
  var Na_voltage = mainSim.m_nernst_eq.result("Na")
  var Cl_voltage = mainSim.m_nernst_eq.result("Cl")
  var K_voltage = mainSim.m_nernst_eq.result("K")
  *
  * @param {Object} sim - Current simulation object
  */
  constructor(m_sim) {
    this.m_sim = m_sim;
  }

  /**
  * start a Nernst Equation and clear all Goldman Equation setting.
  * @access public
  */
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

  /**
  * compute a Nernst Equation based on current ion and simulation setting.
  * @access public
  * @param {String} particleType - ion type, such as 'Na','Cl','K'
  * @param {Dictionary} condition - Optional: current particle condition in simulator
  * @returns {number}
  */
  compute(particleType,condition) {
    // input: string;
    var R = this.m_sim.m_settings.gas_constant; // ideal gas constant
    var T = this.m_sim.m_settings.temperature; // 37 is the Human Body temperature
    var F = this.m_sim.m_settings.faraday; // Faraday's constant

    if(!condition)
    var condition = this.obtainCondition(particleType)

    var Xout = condition.Xout;
    var Xin = condition.Xin;
    var z = condition.z;

    var answer = (R * T) / (z * F) * Math.log(Xout / Xin);
    return answer;
  }

  /**
  * obtain current simulation Condition.
  * @access private
  * @param {String} particleType - ion type, such as 'Na','Cl','K'
  * @returns {Dictionary}
  */
  obtainCondition(particleType) {
    var Xout = this.m_sim.m_dom.m_sim_controls.concentration(particleType, "outside");
    var Xin = this.m_sim.m_dom.m_sim_controls.concentration(particleType, "inside");
    var z = particleMapper[particleType]["charge"];

    return {Xout: Xout, Xin: Xin, z: z}
  }

  /**
  * compute a Nernst Equation based on current ion and simulation setting to 4 decimal points.
  * @access public
  * @param {String} particleType - ion type, such as 'Na','Cl','K'
  * @returns {String}
  */
  result(type) {
    return this.compute(type).toFixed(4);
  }
}
