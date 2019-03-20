/** All the global valuables in the simulation. */
class globals {
  /**
  * Create an new global valuable list.
  * @param {Object} sim - Current simulation object
  * @access public
  */
  constructor(sim) {
    // this.m_equationResult = sim.m_dom.m_equationResult;
    // this.m_nernst_eq = sim.m_nernst_eq;
    // this.m_goldman_eq = sim.m_goldman_eq;

    this.computeAll = sim.computeAll
  }
}
