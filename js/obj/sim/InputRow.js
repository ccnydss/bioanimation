
class InputRow {
  /**
  * Create ions control table.
  * @example <caption>Initialize an new ions control table.</caption>
  for (var i = 0; i < numParticles; i++) {
    var name = this.dom.sim.particle_types[i];
    var { sign, color } = particleMapper[name];

    var label = '[' + name + '<sup>' + sign + '</sup>]'
    label += '<sub>' + locStr.slice(0, -4) + '</sub>&nbsp;';

    var value = animationSequencer.current().getNumParticles(locStr, name);

    location.rows[i] = new InputRow(label, value, true, name, this);
    location.rows[i].create(location.table, i, name, locStr);
  }
  *
  * @param {string} label - ex: [Na+]in, [K+]out
  * @param {double} value - Value of ion concentration/Number of ion to display
  * @param {boolean} enabled - Is current Ion enabled
  * @param {string} type - Ion type, 'Na', 'Cl', 'K'
  * @param {DOM} inputs - Current input DOM object
  */
  constructor(label, value, enabled, type, inputs) {
    this.label = label;
    this.values = value;
    this.enabled = enabled;
    this.type = type;
    this.inputs = inputs;

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

  /**
  * Create an new ions control table.
  * @param {DOM} parent - The parent DOM table
  * @param {String} id - The id of control table, range from 0-2 (# of particle)
  * @param {string} particle_type - Ion type, 'Na', 'Cl', 'K'
  * @param {string} particle_location - 'inside' or 'outside'
  * @access public
  */
  create(parent, id, particle_type, particle_location) {
    var { title, input, table, buttons } = this.dom;

    table.trow = elementCreator("tr", '', parent);
    table.td0 = elementCreator("td", '', table.trow);
    table.td1 = elementCreator("td", '', table.trow);
    table.td2 = elementCreator("td", '', table.trow);
    table.td3 = elementCreator("td", '', table.trow);

    // Create the h4 label on the left
    this.dom.title = elementCreator("h4", '', table.td0, {
      content: this.label,
      className: 'qoptions'
    });

    this.dom.input = createInput("");
    this.dom.input.id(id);
    this.dom.input.class('qoptions');

    this.dom.input.value(this.values);
    this.dom.input.input(this.changeNumParticles.bind(this));
    this.dom.input.attribute("data-location", particle_location);
    this.dom.input.attribute("data-ptype", particle_type);
    this.dom.input.attribute("type", "text");
    this.dom.input.mouseClicked(this.highLightInput);
    this.dom.input.parent(table.td1);

    // Create the plus button and minus button
    var colorClass = particle_type.toLowerCase() + "-bg";
    buttons.plus = elementCreator("button", id, table.td2, {
      content: "+",
      className: 'qoptions',
      mousePressed: this.changeNumParticles.bind(this)
    });
    buttons.plus.attribute("data-location", particle_location);
    buttons.plus.attribute("data-ptype", particle_type);
    buttons.plus.addClass(colorClass);

    buttons.minus = elementCreator("button", id, table.td3, {
      content: "-",
      className: 'qoptions',
      mousePressed: this.changeNumParticles.bind(this)
    });
    buttons.minus.attribute("data-location", particle_location);
    buttons.minus.attribute("data-ptype", particle_type);
    buttons.minus.addClass(colorClass);
  }

  /**
  * Change value of an ions control table.
  * @param {double} setter - The new value
  * @access public
  */
  value(setter) {
    if (typeof setter === 'undefined') {
      this.values = Number(this.values);
      return this.values;
    }
    else {
      if(setter>animationSequencer.current().MAX_PARTICLES)
      setter=animationSequencer.current().MAX_PARTICLES
      if(setter<animationSequencer.current().MIN_PARTICLES)
      setter=animationSequencer.current().MIN_PARTICLES

      this.values = setter;
      this.dom.input.value(setter);
    }
  }

  /**
  * Change value of an ions control table.
  * @param {boolean} setter - The new enable parameter
  * @access public
  */
  enable(setter) {
    if (setter == null) return this.enabled;
    else {
      this.enabled = setter;
      var enableColor = this.type.toLowerCase() + "-bg";
      var disableColor = this.type.toLowerCase() + "-disabled";

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

  /**
  * Called by the plus/minus buttons, and also the text field input
  * @param {DOM} evt - the element that triggered the event (Input buttons)
  * @param {double} updated_amount=evt.target.value - the value of triggered element
  * @access private
  */
  changeNumParticles(evt, updated_amount=evt.target.value) {
    // Called by the plus/minus buttons, and also the text field input
    // input: the element that triggered the event (Input buttons);
    var eventID = evt.target.id;

    var particle_type = evt.target.attributes['data-ptype'].value;
    var particle_location = evt.target.attributes['data-location'].value;

    if (!updated_amount) {
      var symbol = evt.target.innerText;
      var current = this.value();
      updated_amount = (symbol == "+") ? current + 1 : current - 1;
    }

    // NOTE: Call the Simulator object less directly?
    // otherwise, renaming the global "mainSim" variable breaks this code
    mainSim.updateParticles(particle_type, particle_location, updated_amount);

    this.value(updated_amount);

    // Change the Preset text content to custom
    mainSim.dom.sim_canvas_preset_dropbtn.elt.textContent = 'Custom'
  }

  /**
  * Highlight all the value when user click in the input
  * By doing this, user can change the input value directly
  * @param {DOM} evt - the element that triggered the event (Input box)
  * @access private
  */
  highLightInput(evt) {
    evt.target.setSelectionRange(0, evt.target.value.length)
  }
}
