class SimulatorInputs {
  constructor(dom) {
    this.dom = dom;

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

    this.checkboxes = [];
  }

  setup() {
    var ec = elementCreator;

    // Div to contain the simulatorInput
    this.simulatorInputContainer = ec("div", 'simulatorInputContainer', 'secondBox', { className: 'simulatorInputContainer' });
    this.simulatorInput = ec("div", 'simInput', 'simulatorInputContainer', { className: 'simInput' });

    //Control UI ----------------------------
    this.controlsLeft = ec("div", 'controls', 'simInput', { className: 'controls' });
    this.controlsRight = ec("div", 'controls', 'simInput', { className: 'controls' });

    this.control0 = ec("div", 'control0', this.controlsLeft);
    this.control1 = ec("div", 'control1', this.controlsLeft);
    this.control2 = ec("div", 'control2', this.controlsRight);
    this.control3 = ec("div", 'control3', this.controlsRight);

    this.controls_list.inside.controls = [this.control0, this.control1];
    this.controls_list.outside.controls = [this.control2, this.control3];

    this.particleControl = ec("div", 'particleControl', 'simulatorInputContainer', {className: 'particleControl'});
  }

  create() {
    var ec = elementCreator;

    var numParticles = this.dom.sim.numParticleTypes();

    // Create the radio buttons to select particles
    for (var i = 0; i < numParticles; i++) {
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
    var startNernst = this.dom.sim.nernst_eq.start.bind(this.dom.sim.nernst_eq);
    var startGoldman = this.dom.sim.goldman_eq.start.bind(this.dom.sim.goldman_eq);

    this.NernstButton = ec("button", 'NernstButton', 'particleControl', { content: "Nernst", mousePressed: startNernst });
    this.GoldmanButton = ec("button", 'GoldmanButton', 'particleControl', { content: "Goldman", mousePressed: startGoldman });

    for (var locStr in this.controls_list) {
      var location = this.controls_list[locStr];

      location.header = ec("h4", '', location.controls[0], {
        content: location.label
      });

      location.table = ec("table", '', location.controls[1], {
        className: 'table qoptions'
      });

      for (var i = 0; i < numParticles; i++) {
        var name = this.dom.sim.particle_types[i];
        var { sign, color } = particleMapper[name];

        var label = '[' + name + '<sup>' + sign + '</sup>]'
        label += '<sub>' + locStr.slice(0, -4) + '</sub>&nbsp;';

        var value = animationSequencer.current().getNumParticles(locStr, name);

        location.rows[i] = new InputRow(label, value, true, name, this);
        location.rows[i].create(location.table, i, name, locStr);
      }
    }
  }

  addCheckbox(checkbox) {
    this.checkboxes.push(checkbox);
  }

  checkbox(index, bool=null) {
    if (bool != null) {
      this.checkboxes[index].checked(bool);
    } else {
      return this.checkboxes[index].checked();
    }
  }

  concentration(particleType, location) {
    var id = particleMapper[particleType].id;
    return this.controls_list[location].rows[id].value();
  }

  setConcentration(particleType, location, amount) {
    var id = particleMapper[particleType].id;
    this.controls_list[location].rows[id].value(amount);
  }

  // updateInputs(particleType, location, id) {
  //   var transferLocation = (location == "outside")
  //   ? "inside"
  //   : "outside";
  //
  //   var oldAmount = animationSequencer.current().getNumParticles(location, particleType);
  //   var transferAmount = animationSequencer.current().getNumParticles(transferLocation, particleType);
  //
  //   var oldInput = this.controls[location].rows[id];
  //   var transferInput = this.controls[transferLocation].rows[id];
  //
  //   oldInput.value(oldAmount);
  //   transferInput.value(transferAmount);
  //
  //   FormulaInputCalculation(particleType);
  // }
  //
  // updateAll() {
  //   this.updateInputs("Na", "outside", 0);
  //   this.updateInputs("Na", "inside", 0);
  //   this.updateInputs("Cl", "outside", 1);
  //   this.updateInputs("Cl", "inside", 1);
  //   this.updateInputs("K", "outside", 2);
  //   this.updateInputs("K", "inside", 2);
  //
  //   FormulaInputCalculation("Na");
  // }

  checkedEvent(evt) {
    // input: the element that triggered the event (Input buttons);
    var checkboxID = evt.target.attributes["data-id"].value;
    var particleType = evt.target.attributes["data-ptype"].value;

    if (this.dom.sim.simMode() == "Nernst") {
      animationSequencer.current().setContainerDisplays(particleType, this.checkbox(checkboxID));
      if (this.dom.sim.nernst_particle !== particleType) {
        this.dom.sim.nernst_particle = particleType;
        for (var j = 0; j < this.dom.sim.numParticleTypes(); j++) {
          var checkBoxParticle = this.checkboxes[j].elt.innerText;

          if (
            this.checkbox(j) &&
            checkBoxParticle !== particleType &&
            particleMapper[checkBoxParticle].display
          ) {
            //Disable those particles
            disableInputForParticle(checkBoxParticle);

            //Also disable the particle in the plot
            graph.hidePlot(j, true);
          } else if (particleMapper[checkBoxParticle]["display"]) {
            enableInputForParticle(particleType);

            //Enable the particle in the plot
            graph.hidePlot(j, false);
          }
        }
      }
      FormulaInputCalculation(particleType);
    }
    enableInputForParticle(particleType);
  }
}
