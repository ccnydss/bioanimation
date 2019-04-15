
class GoldmanEq {
  /**
  * Create a Goldman Equation system.
  * @example <caption>Create a Goldman Equation.</caption>
  mainSim.goldman_eq = new GoldmanEq(mainSim);
  var net_voltage = mainSim.goldman_eq.result()
  *

  * @param {Object} sim - Current simulation object
  */
  constructor(_sim) {
    /**
    * @private
    * @type {string}
    */
    this.sim = _sim;
  }

  /**
  * start a Goldman Equation and clear all Nernst Equation setting.
  * @access public
  */
  start() {
    // input: the element that triggered the event; however this input is unused in this function

    //Graphics & Text

    //Remove old text
    if (document.getElementById('MathJax-Element-1-Frame')) {
      this.sim.renderUI('NernstEqn', false);
      this.sim.renderUI('GoldmanEqn', true);

      if (this.sim.questionsAreHidden()) { //Only appear setting when question box disappear
        this.sim.renderUI('GoldmanSetting', true);
      }
    }

    //Add new text
    this.sim.dom.sim_question.init("Goldman");

    //Particles & functionality
    this.sim.simMode("Goldman");

    //enable the net in the plot
    graph.hidePlot(3, false);

    //enable all Ions
    for (var j = 0; j < this.sim.numParticleTypes(); j++) {
      //enable all the particle in the plot
      graph.hidePlot(j, false);

      var checkBoxParticle = this.sim.dom.sim_inputs.checkboxes[j].elt.innerText;

      if (!this.sim.dom.sim_inputs.checkbox(j)) {
        this.sim.toggleInputForParticle(checkBoxParticle, true);
      }
    }

    FormulaInputCalculation();
  }

  /**
  * compute a Goldman Equation based on current simulation setting.
  * @access public
  * @param {Dictionary} condition - Optional: Particle conditions in simulator
  * @returns {number}
  */
  compute(condition) {
    var R = this.sim.settings.gas_constant;   // ideal gas constant
    var T = this.sim.settings.temperature;    // 37 is the Human Body temperature
    var F = this.sim.settings.faraday;        // Faraday's constant

    if(!condition)
    var condition = this.obtainCondition()

    var numerator = condition.numerator;
    var denominator = condition.denominator;

    // Accumulate sums for numerator and denominator
    var answer = ((R * T) / F) * Math.log(numerator / denominator);
    return answer;
  }

  /**
  * obtain current simulation Condition.
  * @access private
  * @returns {Dictionary}
  */
  obtainCondition() {
    var numerator = 0;
    var denominator = 0;

    for (var i = 0; i < this.sim.numParticleTypes(); i++) {
      var particleType = this.sim.particle_types[i];
      if (particleMapper[particleType].display) {
        var numOutside = this.sim.dom.sim_inputs.concentration(particleType, "outside");
        var numInside = this.sim.dom.sim_inputs.concentration(particleType, "inside");

        if (particleMapper[particleType].charge > 0) {
          numerator += particleMapper[particleType].permeability * numOutside;

          denominator += particleMapper[particleType].permeability * numInside;
        } else {
          numerator += particleMapper[particleType].permeability * numInside;
          denominator += particleMapper[particleType].permeability * numOutside;
        }
      }
    };

    return {numerator: numerator, denominator: denominator}
  }

  /**
  * compute a Goldman Equation based on current simulation setting to 4 decimal points.
  * @access public
  * @returns {string}
  */
  result() {
    return this.compute().toFixed(4);
  }
}
