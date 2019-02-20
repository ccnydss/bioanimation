class SimulatorInputs {
  constructor(m_dom) {
    this.m_dom = m_dom;

    this.controls = {
      inside: {
        label: "Intracellular",
        header: null,
        table: null,
        controls: null,
        rows: []
      },
      outside: {
        label: "Extracellular",
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
    this.m_simulatorInputContainer = ec("div", 'simulatorInputContainer', 'secondBox', { className: 'bottom-scroll' });
    this.m_simulatorInput = ec("div", 'simInput', 'simulatorInputContainer');

    //Control UI ----------------------------
    this.m_controlsLeft = ec("div", 'controls', 'simInput', { className: 'controls' });
    this.m_controlsRight = ec("div", 'controls', 'simInput', { className: 'controls' });

    this.m_control0 = ec("div", 'control0', this.m_controlsLeft);
    this.m_control1 = ec("div", 'control1', this.m_controlsLeft);
    this.m_control2 = ec("div", 'control2', this.m_controlsRight);
    this.m_control3 = ec("div", 'control3', this.m_controlsRight);

    this.controls.inside.controls = [this.m_control0, this.m_control1];
    this.controls.outside.controls = [this.m_control2, this.m_control3];

    this.m_particleControl = ec("div", 'particleControl', 'simulatorInputContainer');
  }

  create() {
    var ec = elementCreator;

    var numParticles = this.m_dom.m_sim.numParticleTypes();

    // Create the radio buttons to select particles
    for (var i = 0; i < numParticles; i++) {
      var name = this.m_dom.m_sim.m_particle_types[i];

      var chk = createCheckbox(name, false);
      chk.addClass('checkboxes');
      chk.parent('particleControl');
      chk.attribute('data-id', i);
      chk.attribute('data-ptype', name);
      chk.changed(this.checkedEvent.bind(this));

      this.addCheckbox(chk);
    };

    // Create the nernst buttons
    var startNernst = this.m_dom.m_sim.m_nernst_eq.start.bind(this.m_dom.m_sim.m_nernst_eq);
    var startGoldman = this.m_dom.m_sim.m_goldman_eq.start.bind(this.m_dom.m_sim.m_goldman_eq);

    this.m_NernstButton = ec("button", 'NernstButton', 'particleControl', { content: "Nernst", mousePressed: startNernst });
    this.m_GoldmanButton = ec("button", 'GoldmanButton', 'particleControl', { content: "Goldman", mousePressed: startGoldman });

    for (var locStr in this.controls) {
      var location = this.controls[locStr];

      location.header = ec("h4", '', location.controls[0], {
        content: location.label
      });

      location.table = ec("table", '', location.controls[1], {
        className: 'table qoptions'
      });

      for (var i = 0; i < numParticles; i++) {
        var name = this.m_dom.m_sim.m_particle_types[i];
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
    return this.controls[location].rows[id].value();
  }

  setConcentration(particleType, location, amount) {
    var id = particleMapper[particleType].id;
    this.controls[location].rows[id].value(amount);
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

    if (this.m_dom.m_sim.simMode() == "Nernst") {
      animationSequencer.current().setContainerDisplays(particleType, this.checkbox(checkboxID));
      if (this.m_dom.m_sim.m_nernst_particle !== particleType) {
        this.m_dom.m_sim.m_nernst_particle = particleType;
        for (var j = 0; j < this.m_dom.m_sim.numParticleTypes(); j++) {
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
