class EquationResult {
  constructor(m_dom) {
    this.dom = m_dom;

    this.values = {
      "Na": 0,
      "Cl": 0,
      "K": 0,
      "Net": 0
    };

    this.table = { "Na" : null, "Cl" : null, "K" : null, "Net" : null };
  }

  setup() {
    this.display = elementCreator("table", 'answer', 'equationContainer', { className: 'answer' });

    this.table.Na = elementCreator("tr", 'answer-Na', 'answer', { className: 'answer-row na-bg' });
    this.td0 = elementCreator("td", '', this.table.Na, { content: 'Na' });
    this.td1 = elementCreator("td", '', this.table.Na, { content: this.values.Na });

    this.table.Cl = elementCreator("tr", 'answer-Cl', 'answer', { className: 'answer-row cl-disabled' });
    this.td2 = elementCreator("td", '', this.table.Cl, { content: 'Cl' });
    this.td3 = elementCreator("td", '', this.table.Cl, { content: this.values.Cl });

    this.table.K = elementCreator("tr", 'answer-K', 'answer', { className: 'answer-row k-disabled' });
    this.td4 = elementCreator("td", '', this.table.K, { content: 'K' });
    this.td5 = elementCreator("td", '', this.table.K, { content: this.values.K });

    this.table.Net = elementCreator("tr", 'answer-Net', 'answer', { className: 'answer-row net-disabled' });
    this.td6 = elementCreator("td", '', this.table.Net, { content: 'Net' });
    this.td7 = elementCreator("td", '', this.table.Net, { content: this.values.Net });
  }

  update(answer, type) {
    this.table[type].child()[1].innerText = answer + " V";

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

      console.log("upating", this.table[row]);
    }

    this.table[type].elt.classList.remove(thisDisable);
    this.table[type].elt.classList.add(thisEnable);


    // if (type == "Net") {
    //   for (var row in this.table) {
    //     var enableColor = row.toLowerCase() + "-bg";
    //     var disableColor = row.toLowerCase() + "-disabled";
    //
    //     this.table[row].removeClass(disableColor);
    //     this.table[row].addClass(enableColor);
    //     console.log("updating all", row);
    //   }
    // } else {
    //   for (var row in this.table) {
    //     var enableColor = row.toLowerCase() + "-bg";
    //     var disableColor = row.toLowerCase() + "-disabled";
    //
    //     console.log("updating in nernst", type, this.table[row]);
    //
    //     this.table[row].removeClass(enableColor);
    //     this.table[row].addClass(disableColor);
    //   }
    //
    //   this.table[type].removeClass(type.toLowerCase() + "-disabled");
    //   this.table[type].addClass(type.toLowerCase() + "-bg");
    // }
  }

  setAnswer(answer, type) {
    this.values[type] = answer;
    this.update(answer, type);
  }
}
