
class Preset {
  /**
  * Create a preset menu attaching to current simulator canvas
  * @example <caption>Create a new preset menu.</caption>
  mainSim.sim.preset = new Preset(mainSim);
  // Some element that you want to trigger preset
  mainSim.simCanvasPreset_dropbtn_list[i].elt.onclick = function() {
    mainSim.sim.preset.changePreset(mainSim.simCanvasPreset_dropbtn_list[i].elt)
  };
  *
  * @param {Object} _sim - Current simulator
  * @access public
  */
  constructor(_sim) {

    /** @property {String} - The CSS selector string that defined the preset buttons */
    this.btn_group = ".dropdown-content a";

    /** @property {Dictionary} - A array of preset parameters. */
    this.preset_list = [
      {
        name:'Default',
        PK:1,
        K_out:5,
        K_in:3,
        PNa:0.03,
        Na_out:2,
        Na_in:1,
        PCl:0.1,
        Cl_out:1,
        Cl_in:2,
        Temp:37, //degree C
        color_in:"#fffbea",
        color_out:"#e3f8fc",
        color_membrane:"rgba(100,155,180,0.39215686)"
      },
      {
        name:'Generic Cell',
        PK:100,
        K_out:4.5,
        K_in:120,
        PNa:5,
        Na_out:145,
        Na_in:15,
        PCl:10,
        Cl_out:116,
        Cl_in:20,
        Temp:37, //degree C
        color_in:"#fffbea",
        color_out:"#e3f8fc",
        color_membrane:"rgba(100,155,180,0.39215686)"
      },
      {
        name:'Skeletal Muscle',
        PK:100,
        K_out:4.5,
        K_in:150,
        PNa:1,
        Na_out:145,
        Na_in:12,
        PCl:1000,
        Cl_out:116,
        Cl_in:4.2,
        Temp:37, //degree C
        color_in:"rgba(255,121,121,0.5)",
        color_out:"rgba(250,177,160,0.39)",
        color_membrane:"rgba(250,211,144,0.6)"
      },
      {
        name:'Squid Axon',
        PK:100,
        K_out:20,
        K_in:200,
        PNa:1,
        Na_out:440,
        Na_in:50,
        PCl:10,
        Cl_out:540,
        Cl_in:40,
        Temp:37, //degree C
        color_in:"rgba(241,144,102,0.5)",
        color_out:"rgba(243,166,131,0.39)",
        color_membrane:"rgba(245,205,121,0.6)"
      },
      {
        name:'Red Cell',
        PK:100,
        K_out:4.5,
        K_in:140,
        PNa:54,
        Na_out:145,
        Na_in:11,
        PCl:21,
        Cl_out:116,
        Cl_in:80,
        Temp:37, //degree C
        color_in:"rgba(214,48,49,1)",
        color_out:"rgba(255,118,117,1)",
        color_membrane:"rgba(241,144,102,0.6)"
      }
    ]
    this.sim = _sim;
  }

  /**
  * Function to check if certain DOM element should be clone in the help menu
  * @access public
  * @param {DOM} elm - The target preset button that is being clicked
  */
  changePreset(elm) {
    //Input 1: DOM element
    var btn = document.querySelectorAll(this.btn_group);
    for(let i = 0;i<btn.length;i++) {
      if(btn[i].textContent != elm.textContent && btn[i].classList.contains('active')) {
        btn[i].classList.remove('active')
      } else if (btn[i].textContent == elm.textContent) {
        btn[i].classList.add('active')

        document.getElementsByClassName('dropbtn')[0].textContent = btn[i].textContent;

        for(let j = 0; j < this.preset_list.length; j++) {
          if (this.preset_list[j].name == btn[i].textContent) {

            K.permeability = this.preset_list[j].PK;
            document.querySelector('input[placeholder="Enter K permeability..."]').value = this.preset_list[j].PK
            this.sim.updateParticles("K","outside",this.preset_list[j].K_out,true);
            this.sim.updateParticles("K","inside",this.preset_list[j].K_in,true);
            Na.permeability =  this.preset_list[j].PNa;
            document.querySelector('input[placeholder="Enter Na permeability..."]').value = this.preset_list[j].PNa
            this.sim.updateParticles("Na","outside",this.preset_list[j].Na_out,true);
            this.sim.updateParticles("Na","inside",this.preset_list[j].Na_in,true);
            Cl.permeability = this.preset_list[j].PCl;
            document.querySelector('input[placeholder="Enter Cl permeability..."]').value = this.preset_list[j].PCl
            this.sim.updateParticles("Cl","outside",this.preset_list[j].Cl_out,true);
            this.sim.updateParticles("Cl","inside",this.preset_list[j].Cl_in,true);
            this.sim.settings.temperature = 273.15 + this.preset_list[j].Temp;
            document.querySelector('input[placeholder="Enter Temperature..."]').value = 273.15 + this.preset_list[j].Temp
            animationSequencer.current().setContainerColor("inside",this.preset_list[j].color_in)
            animationSequencer.current().setContainerColor("outside",this.preset_list[j].color_out)
            animationSequencer.current().setMembraneColor(this.preset_list[j].color_membrane)

          }
        }

        if(mainSim.paused)
        mainSim.resize()

      }
    }
  }
}
