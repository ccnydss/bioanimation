/** Create a Goldman Equation system. *///
class GoldmanEq {
  /**
  * Create a Goldman Equation .
  * @param {Object} sim - Current simulation object
  */
  constructor(m_sim) {
    this.m_sim = m_sim;
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
      this.m_sim.renderUI('NernstEqn', false);
      this.m_sim.renderUI('GoldmanEqn', true);

      if (this.m_sim.questionsAreHidden()) { //Only appear setting when question box disappear
        this.m_sim.renderUI('GoldmanSetting', true);
      }
    }

    //Add new text
    this.m_sim.m_dom.m_sim_question.init("Goldman");

    //Particles & functionality
    this.m_sim.simMode("Goldman");

    //enable the net in the plot
    graph.hidePlot(3, false);

    //enable all Ions
    for (var j = 0; j < this.m_sim.numParticleTypes(); j++) {
      //enable all the particle in the plot
      graph.hidePlot(j, false);

      var checkBoxParticle = this.m_sim.m_dom.m_sim_controls.checkboxes[j].elt.innerText;

      if (!this.m_sim.m_dom.m_sim_controls.checkbox(j)) {

        //enable those particles
        this.m_sim.m_dom.m_sim_controls.checkbox(j, true);
        animationSequencer.current().setContainerDisplays(checkBoxParticle, true);
        enableInputForParticle(checkBoxParticle);
      }
    }

    FormulaInputCalculation();
  }

    /**
    * compute a Goldman Equation based on current simulation setting.
    * @access private
    * @returns {number}
    */
  compute() {
    var R = this.m_sim.m_settings.gas_constant;   // ideal gas constant
    var T = this.m_sim.m_settings.temperature;    // 37 is the Human Body temperature
    var F = this.m_sim.m_settings.faraday;        // Faraday's constant

    var numerator = 0;
    var denominator = 0;
    // Accumulate sums for numerator and denominator

    for (var i = 0; i < this.m_sim.numParticleTypes(); i++) {
      var particleType = this.m_sim.m_particle_types[i];
      if (particleMapper[particleType].display) {
        var numOutside = this.m_sim.m_dom.m_sim_controls.concentration(particleType, "outside");
        var numInside = this.m_sim.m_dom.m_sim_controls.concentration(particleType, "inside");

        if (particleMapper[particleType].charge > 0) {
          numerator += particleMapper[particleType].permeability * numOutside;

          denominator += particleMapper[particleType].permeability * numInside;
        } else {
          numerator += particleMapper[particleType].permeability * numInside;
          denominator += particleMapper[particleType].permeability * numOutside;
        }
      }
    };

    var answer = ((R * T) / F) * Math.log(numerator / denominator);
    return answer;
  }

  /**
  * compute a Goldman Equation based on current simulation setting to 4 decimal points.
  * @access public
  * @returns {number}
  */
  result() {
    return this.compute().toFixed(4);
  }
}
