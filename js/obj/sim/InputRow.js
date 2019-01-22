class InputRow {
  constructor(label, value, enabled, color) {
    this.m_label = label;
    this.m_value = value;
    this.m_enabled = enabled;
    this.m_color = color;

    this.dom = {
      title: null,
      input: null,
      table: {
        trow: null, // Row element
        td0: null,  // Contains the h4 label
        td1: null,  // Contains the text input
        td2: null,  // Contains the plus button
        td3: null   // Contains the minus button
      },
      buttons: {
        plus: null,
        minus: null
      }
    }
  }

  create(parent, id, particleType, particleLocation) {
    var { title, input, table, buttons } = this.dom;

    table.trow = elementCreator("tr", '', parent);
    table.td0 = elementCreator("td", '', table.trow);
    table.td1 = elementCreator("td", '', table.trow);
    table.td2 = elementCreator("td", '', table.trow);
    table.td3 = elementCreator("td", '', table.trow);

    // Create the h4 label on the left
    this.dom.title = elementCreator("h4", '', table.td0, {
      content: this.m_label,
      className: 'qoptions'
    });

    // Create the text input for number of particles
    this.dom.input = elementCreator("input", id, table.td1, {
      className: 'qoptions'
    });
    this.dom.input.value(this.m_value);
    this.dom.input.input(changeNumParticles);
    this.dom.input.attribute("data-location", particleLocation);
    this.dom.input.attribute("data-ptype", particleType);
    this.dom.input.mouseClicked(highLightInput);

    // Create the plus button and minus button
    buttons.plus = elementCreator("button", id, table.td2, {
      content: "+",
      className: 'qoptions',
      mousePressed: changeNumParticles
    });
    buttons.plus.attribute("data-location", particleLocation);
    buttons.plus.attribute("data-ptype", particleType);
    buttons.plus.style("background-color", this.m_color);

    buttons.minus = elementCreator("button", id, table.td3, {
      content: "-",
      className: 'qoptions',
      mousePressed: changeNumParticles
    });
    buttons.minus.attribute("data-location", particleLocation);
    buttons.minus.attribute("data-ptype", particleType);
    buttons.minus.style("background-color", this.m_color);
  }

  value(setter) {
    if (setter == null) return this.m_value;
    else {
      this.m_value = setter;
      this.dom.input.value(setter);
    }
  }

  enable(setter) {
    if (setter == null) return this.m_enabled;
    else {
      this.m_enabled = setter;

      if (setter) {
        this.dom.input.removeAttribute("disabled");
        this.dom.buttons.plus.removeAttribute("disabled");
        this.dom.buttons.minus.removeAttribute("disabled");
      } else {
        this.dom.input.attribute("disabled", '');
        this.dom.buttons.plus.attribute("disabled", '');
        this.dom.buttons.minus.attribute("disabled", '');
      }
    }
  }
}
