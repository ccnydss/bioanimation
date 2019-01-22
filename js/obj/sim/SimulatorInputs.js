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
    this.m_simulatorInputContainer = ec("div", 'simulatorInputContainer', 'secondBox');
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
    var answer = 0;

    this.m_dom.m_equationResult = ec("h3", 'answer', 'equationdiv', { className: 'answer', content: 'Answer: ' + answer + 'V'});

    var numParticles = this.m_dom.m_sim.numParticleTypes();

    // Create the radio buttons to select particles
    for (var i = 0; i < numParticles; i++) {
      var name = this.m_dom.m_sim.m_particle_types[i];

      var chk = createCheckbox(name, false);
      chk.class('checkboxes');
      chk.id('checkbox' + name);
      chk.parent('particleControl');
      chk.changed(checkedEvent);

      this.addCheckbox(chk);
    };

    // Create the nernst buttons
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

        location.rows[i] = new InputRow(label, value, true, color);
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
}
