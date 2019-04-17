
class NernstEq {
  /**
  * Create a Nernst Equation system.
  * @example <caption>Create a Nernst Equation.</caption>
  mainSim.nernst_eq = new NernstEq(mainSim);
  var Na_voltage = mainSim.nernst_eq.result("Na")
  var Cl_voltage = mainSim.nernst_eq.result("Cl")
  var K_voltage = mainSim.nernst_eq.result("K")
  *
  * @param {Object} sim - Current simulation object
  */
  constructor(_sim) {
    this.sim = _sim;
  }

  /**
  * start a Nernst Equation and clear all Goldman Equation setting.
  * @access public
  */
  start(evt) {
    var sim = this.sim;

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
    sim.dom.sim_question.init("Nernst");

    sim.simMode("Nernst");

    //disable the net in the plot
    graph.hidePlot(3, true);

    //enable last selected Ions
    for (var j = 0; j < sim.numParticleTypes(); j++) {
      var checkBoxParticle = sim.dom.sim_inputs.checkboxes[j].elt.innerText;
      if (checkBoxParticle == sim.nernst_particle) {
        //enable its particles
        sim.toggleInputForParticle(checkBoxParticle, true);

        //Also enable the particle in the plot
        graph.hidePlot(j, false);

        FormulaInputCalculation(checkBoxParticle);
      } else if (checkBoxParticle != sim.nernst_particle && sim.dom.sim_inputs.checkbox(j)) {
        //disable others particles
        sim.toggleInputForParticle(checkBoxParticle, false);

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
    var R = this.sim.settings.gas_constant; // ideal gas constant
    var T = this.sim.settings.temperature; // 37 is the Human Body temperature
    var F = this.sim.settings.faraday; // Faraday's constant

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
    var Xout = this.sim.dom.sim_inputs.concentration(particleType, "outside");
    var Xin = this.sim.dom.sim_inputs.concentration(particleType, "inside");
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
