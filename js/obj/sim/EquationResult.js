class EquationResult {
  constructor(m_dom) {
    this.dom = m_dom;

    this.values = {
      "Na": 0,
      "Cl": 0,
      "K": 0,
      "Net": 0
    };

    this.table = {"Na" : null, "Cl" : null, "K" : null, "Net" : null};
  }

  setup() {
    this.display = elementCreator("table", 'answer', 'equationContainer', { className: 'answer' });

    this.table.Na = elementCreator("tr", 'answer-Na', 'answer', { className: 'answer-row na-bg' });
    this.td0 = elementCreator("td", '', this.table.Na, { content: 'Na' });
    this.td1 = elementCreator("td", '', this.table.Na, { content: this.values.Na });

    this.table.Cl = elementCreator("tr", 'answer-Cl', 'answer', { className: 'answer-row cl-bg' });
    this.td2 = elementCreator("td", '', this.table.Cl, { content: 'Cl' });
    this.td3 = elementCreator("td", '', this.table.Cl, { content: this.values.Cl });

    this.table.K = elementCreator("tr", 'answer-K', 'answer', { className: 'answer-row k-bg' });
    this.td4 = elementCreator("td", '', this.table.K, { content: 'K' });
    this.td5 = elementCreator("td", '', this.table.K, { content: this.values.K });

    this.table.Net = elementCreator("tr", 'answer-Net', 'answer', { className: 'answer-row net-bg' });
    this.td6 = elementCreator("td", '', this.table.Net, { content: 'Net' });
    this.td7 = elementCreator("td", '', this.table.Net, { content: this.values.Net });
  }

  update(answer, type) {
    this.table[type].child()[1].innerText = answer + " V";
  }

  setAnswer(answer, type) {
    this.values[type] = answer;
    this.update(answer, type);
  }
}
