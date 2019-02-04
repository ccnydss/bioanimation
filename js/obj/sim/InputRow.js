class InputRow {
  constructor(label, value, enabled, type, updateInputs) {
    this.m_label = label;
    this.m_value = value;
    this.m_enabled = enabled;
    this.m_type = type;

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

    this.updateInputs = updateInputs;
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
    // this.dom.input = elementCreator("input", id, table.td1, {
    //   className: 'qoptions'
    // });

    this.dom.input = createInput("");
    this.dom.input.id(id);
    this.dom.input.class('qoptions');

    this.dom.input.value(this.m_value);
    this.dom.input.input(this.changeNumParticles.bind(this));
    this.dom.input.attribute("data-location", particleLocation);
    this.dom.input.attribute("data-ptype", particleType);
    this.dom.input.attribute("type", "text");
    this.dom.input.mouseClicked(this.highLightInput);
    this.dom.input.parent(table.td1);


    // this.dom.input = document.createElement("INPUT");
    // this.dom.input.setAttribute("id", id);
    // this.dom.input.setAttribute("class", "qoptions");
    // this.dom.input.setAttribute("type", "text");
    // this.dom.input.setAttribute("data-ptype", particleType);
    // this.dom.input.setAttribute("data-location", particleLocation);
    // this.dom.input.value = this.m_value;
    // this.dom.input.oninput = this.changeNumParticles.bind(this);
    // this.dom.input.onclick = this.highLightInput;
    // table.td1.elt.appendChild(this.dom.input);

    // Create the plus button and minus button
    var colorClass = particleType.toLowerCase() + "-bg";
    buttons.plus = elementCreator("button", id, table.td2, {
      content: "+",
      className: 'qoptions',
      mousePressed: this.changeNumParticles.bind(this)
    });
    buttons.plus.attribute("data-location", particleLocation);
    buttons.plus.attribute("data-ptype", particleType);
    buttons.plus.addClass(colorClass);

    buttons.minus = elementCreator("button", id, table.td3, {
      content: "-",
      className: 'qoptions',
      mousePressed: this.changeNumParticles.bind(this)
    });
    buttons.minus.attribute("data-location", particleLocation);
    buttons.minus.attribute("data-ptype", particleType);
    buttons.minus.addClass(colorClass);
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
      var enableColor = this.m_type.toLowerCase() + "-bg";
      var disableColor = this.m_type.toLowerCase() + "-disabled";

      if (setter) {
        this.dom.input.removeAttribute("disabled");

        this.dom.buttons.plus.removeAttribute("disabled");
        this.dom.buttons.plus.addClass(enableColor);
        this.dom.buttons.plus.removeClass(disableColor);

        this.dom.buttons.minus.removeAttribute("disabled");
        this.dom.buttons.minus.addClass(enableColor);
        this.dom.buttons.minus.removeClass(disableColor);
      } else {
        this.dom.input.attribute("disabled", '');

        this.dom.buttons.plus.attribute("disabled", '');
        this.dom.buttons.plus.addClass(disableColor);
        this.dom.buttons.plus.removeClass(enableColor);

        this.dom.buttons.minus.attribute("disabled", '');
        this.dom.buttons.minus.addClass(disableColor);
        this.dom.buttons.minus.removeClass(enableColor);
      }
    }
  }

  changeNumParticles(evt, updatedAmount=evt.target.value) {
    // input: the element that triggered the event (Input buttons);
    var eventID = evt.target.id;

    console.log("t", this, evt.target.value);

    var particleType = evt.target.attributes['data-ptype'].value;
    var particleLocation = evt.target.attributes['data-location'].value;

    var numParticles = animationSequencer.current().getNumParticles(particleLocation, particleType);
    var MaxParticles = animationSequencer.current().MAX_PARTICLES;

    if (!updatedAmount) {
      var symbol = evt.target.innerText;
      var current = this.value();
      updatedAmount = (symbol == "+") ? current + 1 : current - 1;
    }

    // If the amount entered is invalid, alert user
    if (
      isNaN(updatedAmount) ||
      Math.floor(updatedAmount) != updatedAmount ||
      updatedAmount < 0
    ) {
      alert("Please enter valid input.");
      evt.target.value = "";
      return;
    } else if (updatedAmount > MaxParticles) {
      // If the amount entered is greater than the maximum, force it to maximum and alert user

      this.value(MaxParticles);
      updatedAmount = MaxParticles;
      alert("Maximum amount is " + MaxParticles + ".");
    }

    var difference = Math.abs(updatedAmount - numParticles)

    // If the amount entered is less than 0, increase the amount
    if (updatedAmount > numParticles) {
      for (var i = 0; i < difference; i++) {
        animationSequencer.current().insertNewParticle(particleLocation, particleType);
      }
    } else if (updatedAmount < numParticles) {
      for (var i = 0; i < difference; i++) {
        animationSequencer.current().removeParticle(particleLocation, particleType, 0);
      }
    }

    this.updateInputs(particleType, particleLocation, eventID);
  }

  highLightInput(evt) {
    evt.target.setSelectionRange(0, evt.target.value.length)
  }
}
