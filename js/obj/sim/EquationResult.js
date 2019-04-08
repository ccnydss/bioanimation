
class EquationResult {
  /**
  * Calculate an equation table menu.
  * @example <caption>Create an new equation table.</caption>
  mainSim.dom.equationResult = new EquationResult(mainSim.dom);
  mainSim.dom.equationResult.setup();
  mainSim.dom.equationResult.setAnswer(33,'Na')
  *
  * @param {Object} _dom - Current simulator DOM object
  * @access public
  */
  constructor(_dom) {
    this.dom = _dom;

    /** @property {Dictionary} - The numberical value of ion(s) */
    this.values = {
      "Na": 0,
      "Cl": 0,
      "K": 0,
      "Net": 0
    };

    this.table = { "Na" : null, "Cl" : null, "K" : null, "Net" : null };
  }

  /**
  * Function to initialize DOM element in the equation table
  * @access public
  */
  setup() {
    this.display = elementCreator("table", 'answer', 'equationContainer', { className: 'answer' });

    this.table.Na = elementCreator("tr", 'answer-Na', 'answer', { className: 'answer-row na-bg' });
    this.td0 = elementCreator("td", '', this.table.Na, { content: 'Na<sup>+</sup>' });
    this.td1 = elementCreator("td", '', this.table.Na, { content: this.values.Na });

    this.table.Cl = elementCreator("tr", 'answer-Cl', 'answer', { className: 'answer-row cl-disabled' });
    this.td2 = elementCreator("td", '', this.table.Cl, { content: 'Cl<sup>-</sup>' });
    this.td3 = elementCreator("td", '', this.table.Cl, { content: this.values.Cl });

    this.table.K = elementCreator("tr", 'answer-K', 'answer', { className: 'answer-row k-disabled' });
    this.td4 = elementCreator("td", '', this.table.K, { content: 'K<sup>+</sup>' });
    this.td5 = elementCreator("td", '', this.table.K, { content: this.values.K });

    this.table.Net = elementCreator("tr", 'answer-Net', 'answer', { className: 'answer-row net-disabled' });
    this.td6 = elementCreator("td", '', this.table.Net, { content: 'Net' });
    this.td7 = elementCreator("td", '', this.table.Net, { content: this.values.Net });
  }

  /**
  * Function to update the answer of ion(s) column in the equation table
  * @access private
  * @param {Float} answer - The numerical answer
  * @param {String} type - The type of ion(s), Na/Cl/K/Net
  */
  update(answer, type) {
    this.table[type].child()[1].innerText = answer + " V";
  }

  /**
  * Function to toggle the CSS of ion(s) column in the equation table
  * @access private
  * @param {String} type - The type of ion(s), Na/Cl/K/Net
  */
  toggle(type) {
    console.log("Getting toggled", type);
    var thisEnable = type.toLowerCase() + "-bg";
    var thisDisable = type.toLowerCase() + "-disabled";

    for (var row in this.table) {
      var enableColor = row.toLowerCase() + "-bg";
      var disableColor = row.toLowerCase() + "-disabled";

      if (type !== "Net") {
        this.table[row].elt.classList.add(disableColor);
        this.table[row].elt.classList.remove(enableColor);
      } else {
        this.table[row].elt.classList.add(enableColor);
        this.table[row].elt.classList.remove(disableColor);
      }
    }

    this.table[type].elt.classList.remove(thisDisable);
    this.table[type].elt.classList.add(thisEnable);
  }

  /**
  * Function to update the equation answer globally (In stored value & equaiton table)
  * @access public
  * @param {Float} answer - The numerical answer
  * @param {String} type - The type of ion(s), Na/Cl/K/Net
  */
  setAnswer(answer, type) {
    this.values[type] = answer;
    this.update(answer, type);
  }

  /**
  * Function to set ion(s) column in the equation table
  * active/inactive based on current simulation mode.
  * @access public
  * @param {String} type - The type of ion(s), Na/Cl/K
  */
  setSelected(type) {
    var mode = this.dom.sim.simMode();

    if (mode == "Nernst") {
      this.toggle(type);
    } else {
      this.toggle("Net");
    }
  }
}
