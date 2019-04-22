/**
* Class simulatorInputs, used to manage the inputs for the Simulator. These
* inputs include the table of plus/minus buttons, the text amount inputs, and
* the checkbox elements for switching simulator modes.
*/
class SimulatorInputs {
  /**
  * Construct a new SimulatorInputs instance.
  * @param {SimulatorDOM} dom - The SimulatorDOM instance to attach these inputs to.
  */
  constructor(dom) {
    /**
    * @private
    *
    * @type {SimulatorDOM}
    */
    this.dom = dom;

    /**
    * @private
    *
    * @type {Object}
    */
    this.controls_list = {
      inside: {
        label: "Intracellular (mM)",
        header: null,
        table: null,
        controls: null,
        rows: []
      },
      outside: {
        label: "Extracellular (mM)",
        header: null,
        table: null,
        controls: null,
        rows: []
      }
    };

    /**
    * @private
    *
    * @type {p5.Element[]}
    */
    this.checkboxes = [];
  }

  /**
  * This setup() function runs during the p5.js setup event. It defines and
  * creates the actual p5.Elements to go onto the DOM.
  * @public
  */
  setup() {
    var ec = elementCreator;

    /**
    * Overall div to contain the simulatorInput
    * @private
    *
    * @type {p5.Element}
    */
    this.simulator_input_container = ec (
      "div",
      'simulatorInputContainer',
      'secondBox',
      { className: 'simulatorInputContainer' }
    );

    /**
    * @private
    *
    * @type {p5.Element}
    */
    this.simulator_input = ec (
      "div",
      'simInput',
      'simulatorInputContainer',
      { className: 'simInput' }
    );

    //Control UI ---------------------------------------------------------------

    /**
    * @private
    *
    * @type {p5.Element}
    */
    this.controls_left = ec (
      "div",
      'controls',
      'simInput',
      { className: 'controls' }
    );

    /**
    * @private
    *
    * @type {p5.Element}
    */
    this.controls_right = ec (
      "div",
      'controls',
      'simInput',
      { className: 'controls' }
    );

    /**
    * @private
    *
    * @type {p5.Element}
    */
    this.control0 = ec("div", 'control0', this.controls_left);

    /**
    * @private
    *
    * @type {p5.Element}
    */
    this.control1 = ec("div", 'control1', this.controls_left);

    /**
    * @private
    *
    * @type {p5.Element}
    */
    this.control2 = ec("div", 'control2', this.controls_right);

    /**
    * @private
    *
    * @type {p5.Element}
    */
    this.control3 = ec("div", 'control3', this.controls_right);

    /**
    * @private
    *
    * @type {p5.Element}
    */
    this.controls_list.inside.controls = [this.control0, this.control1];

    /**
    * @private
    *
    * @type {p5.Element}
    */
    this.controls_list.outside.controls = [this.control2, this.control3];

    /**
    * @private
    *
    * @type {p5.Element}
    */
    this.particle_control = ec("div", 'particleControl', 'simulatorInputContainer', {className: 'particleControl'});

    // Create
    var num_particles = this.dom.sim.numParticleTypes();

    // Create the radio buttons to select particles
    for (var i = 0; i < num_particles; i++) {
      var name = this.dom.sim.particle_types[i];

      var chk = createCheckbox(name, false);
      chk.addClass('checkboxes');
      chk.parent('particleControl');
      chk.attribute('data-id', i);
      chk.attribute('data-ptype', name);
      chk.changed(this.checkedEvent.bind(this));

      this.addCheckbox(chk);
    };

    // Create the nernst buttons
    var start_nernst = this.dom.sim.nernst_eq.start.bind(this.dom.sim.nernst_eq);
    var start_goldman = this.dom.sim.goldman_eq.start.bind(this.dom.sim.goldman_eq);

    /**
    * @private
    *
    * @type {p5.Element}
    */
    this.nernst_button = ec (
      "button",
      'NernstButton',
      'particleControl',
      { content: "Nernst", mousePressed: start_nernst }
    );

    /**
    * @private
    *
    * @type {p5.Element}
    */
    this.goldman_button = ec (
      "button",
      'GoldmanButton',
      'particleControl',
      { content: "Goldman", mousePressed: start_goldman }
    );

    for (var loc_str in this.controls_list) {
      var location = this.controls_list[loc_str];

      location.header = ec("h4", '', location.controls[0], {
        content: location.label
      });

      location.table = ec("table", '', location.controls[1], {
        className: 'table qoptions'
      });

      for (var i = 0; i < num_particles; i++) {
        var name = this.dom.sim.particle_types[i];
        var { sign, color } = particleMapper[name];

        var label = '[' + name + '<sup>' + sign + '</sup>]'
        label += '<sub>' + loc_str.slice(0, -4) + '</sub>&nbsp;';

        location.rows[i] = new InputRow(label, 0, true, name, this);
        location.rows[i].create(location.table, i, name, loc_str);
      }
    }
  }

  /**
  * addCheckbox is used to add a new checkbox to the input section. This is only
  * used internally for initialization.
  * @private
  * @param {p5.Element} checkbox - the checkbox element created using the p5 API
  */
  addCheckbox(checkbox) {
    this.checkboxes.push(checkbox);
  }

  /**
  * The checkbox function allows you to set the value of a particle type, or
  * read the current value. Leave bool empty to use this as a getter.
  * @public
  *
  * @param {integer} index - The particle array index to use.
  * @param {boolean} [bool=null] - If supplied, the true/false value to set the
  * checkbox to. If left blank, the function will instead return the current value.
  */
  checkbox(index, bool=null) {
    if (bool != null) {
      this.checkboxes[index].checked(bool);
    } else {
      return this.checkboxes[index].checked();
    }
  }

  /**
  * Getter function to get the current concentration for this particle type.
  * This is done by checking the value of the appropriate InputRow.
  * @public
  * @param {string} particle_type - The name of the particle to use.
  * @param {string} location - The name of the location ("inside" or "outside") to use.
  */
  concentration(particle_type, location) {
    var id = particleMapper[particle_type].id;
    return this.controls_list[location].rows[id].value();
  }

  /**
  * Setter function to set the concentration for this particle type.
  * @public
  * @param {string} particle_type - The name of the particle to use.
  * @param {string} location - The name of the location ("inside" or "outside") to use.
  * @param {integer} amount - The concentration amount you want to set.
  */
  setConcentration(particle_type, location, amount) {
    var id = particleMapper[particle_type].id;
    this.controls_list[location].rows[id].value(amount);
  }

  /**
  * The checkedEvent function is a callback that is run whenever a user clicks
  * on one of the three checkboxes at the bottom of the simulatorInputs. It
  * overrides the default browser behavior to act more like radio buttons, where
  * only one value can be checked at a time.
  * @private
  * @param {} evt - The calling event.
  */
  checkedEvent(evt) {
    var checkbox_id = evt.target.attributes["data-id"].value;
    var particle_type = evt.target.attributes["data-ptype"].value;

    if (this.dom.sim.simMode() == "Nernst") {
      animationSequencer.current().setContainerDisplays(particle_type, this.checkbox(checkbox_id));
      if (this.dom.sim.nernst_particle !== particle_type) {
        this.dom.sim.nernst_particle = particle_type;
        for (var j = 0; j < this.dom.sim.numParticleTypes(); j++) {
          var check_box_particle = this.checkboxes[j].elt.innerText;

          if (
            this.checkbox(j) &&
            check_box_particle !== particle_type &&
            particleMapper[check_box_particle].display
          ) {
            //Disable those particles
            this.dom.sim.toggleInputForParticle(check_box_particle, false);

            //Also disable the particle in the plot
            graph.hidePlot(j, true);
          } else if (particleMapper[check_box_particle]["display"]) {
            this.dom.sim.toggleInputForParticle(particle_type, true);

            //Enable the particle in the plot
            graph.hidePlot(j, false);
          }
        }
      }
      FormulaInputCalculation(particle_type);
    }
    this.dom.sim.toggleInputForParticle(particle_type, true);
  }
}
