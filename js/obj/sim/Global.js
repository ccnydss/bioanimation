/** All the global valuables in the simulation. */
class globals {
  /**
  * Create an new global valuable list.
  * @param {Object} sim - Current simulation object
  * @access public
  */
  constructor(sim) {
    // this.equation_result = sim.dom.equation_result;
    // this.nernst_eq = sim.nernst_eq;
    // this.goldman_eq = sim.goldman_eq;

    this.computeAll = sim.computeAll

  }
}
