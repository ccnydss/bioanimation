var helpDebug = false;
class Help {
  /**
  * Create a new help menu.
  * @example <caption>Create a help menu based on current simulator UI</caption>
  help = new Help(mainSim);
  help.initialize()
  help.resize()
  // help.clear() If you want to clear it
  *
  * @param {Object} _sim - Current simulator
  * @access public
  */
  constructor(_sim) {

    this.sim = _sim;

    /** @property {Dictionary} - A array of setting listing a specific ID and its corresponding help description.
    * Leave the description empty if that DOM element is just a container */
    this.id_list = {
      firstBox:"",
      leftbar:"The questions will be listed in this area.</br> Please read the questions carefully and make sure you have answer every questions",
      equationContainer:"",
      hidebar:"Click arrow to expanded/hide questions",
      equationdiv:"",
      NernstEqn:"Current mode governing equation",
      GoldmanEqn:"Goldman equation",
      simulatorSetting:"In the setting Menu, you can change the setting of temperature and ion permeability",
      leftWindow: "", //space for add the 'last' class
      dataPlot:"Voltage data plot",
      answer:"Current Voltage in membrane",
      equilibrateButton:"Click this to equilibrate the membrane",
      secondBox:"",
      sim:"This window will demonstrate the movement of particles with the membrane</br>. You can either hover the window or press 'space' to pause the window",
      simulatorInputContainer:"",
      simInput:"All the particle input",
      particleControl:"All the particle control"
    }

  }
  /**
  * Function to initialize the help page, detecting all the ID in the setting,
  * then clone them to the desired DOM element.
  * @access public
  */
  initialize() {
    var sim = document.querySelector("#root #stage");
    var help_page = document.querySelector("#helpPage");

    //Need this line, can't append clone directly to the parent Element
    var temp = document.createDocumentFragment();
    //See https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment

    helpDebug && console.log('Help Page initialize start')

    for (let i = 0; i < sim.children.length; i++) { //1

      var layer1 = this.createLayer(sim,i)
      if (!layer1) continue;

      for (let j = 0; j < sim.children[i].children.length; j++) { //2

        var layer2 = this.createLayer(sim.children[i],j)
        if (!layer2) continue;

        for (let k = 0; k < sim.children[i].children[j].children.length; k++) { //3

          var layer3 = this.createLayer(sim.children[i].children[j],k)
          if (!layer3) continue;

          for (let l = 0; l < sim.children[i].children[j].children[k].children.length; l++) { //4

            var layer4 = this.createLayer(sim.children[i].children[j].children[k],l)
            if (!layer4) continue;

            for (let m = 0; m < sim.children[i].children[j].children[k].children[l].children.length; m++) { //4

              var layer5 = this.createLayer(sim.children[i].children[j].children[k].children[l],m)
              if (!layer5) continue;

              layer4.appendChild(layer5);
            }

            layer3.appendChild(layer4);
          }

          layer2.appendChild(layer3);
        }

        layer1.appendChild(layer2);
      }

      temp.appendChild(layer1);
    }
    help_page.appendChild(temp);

    helpDebug && console.log('Help Page initialize end')
  }
  /**
  * Function to clear the help page, removing all the element attaching to the help menu
  * @access public
  */
  clear() {
    var help_page = document.querySelector("#helpPage");
    while (help_page.firstChild) {
      help_page.removeChild(help_page.firstChild);
    }
  }

  /**
  * Function to make help menu responsive when resizing the window
  * @access public
  */
  resize() {

    var current = this;
    //Only dataPlot need to be resize...
    setTimeout(
      function() {
        var original = document.getElementById('dataPlot')
        var height = (parseFloat(getComputedStyle(original)['height']))

        if(document.getElementById('dataPlot-clone'))
        document.getElementById('dataPlot-clone').style.height = height + 'px'

        if(current.sim.dom.canvas_in_leftbar) { //Also resize canvas if it is in  leftbar
          var original = document.getElementById('sim')
          var height = (parseFloat(getComputedStyle(original)['height']))

          if(document.getElementById('sim-clone'))
          document.getElementById('sim-clone').style.height = height + 'px'

        }

      }
      ,150)
    }

    /**
    * Function to check if certain DOM element should be clone in the help menu
    * @access private
    * @param {DOM} parent - The target parent DOM element
    *
    * @param {Int} index - A child index within the parent DOM element
    *
    * @returns {DOM} - If the child index pass the verification, then return the DOM element, else return false
    */
    createLayer(parent,index) {
      // input 1: DOM element
      // input 2: int
      // return: DOM element

      var ui = parent.children[index]
      if(!Object.keys(this.id_list).includes(ui.id) || ui.classList.contains('hidden') || ui.style.display=='none')
      return;

      helpDebug && console.log('Layer '+index+' found. ID is'+ui.id+' childlength is '+ui.children.length)
      var layer = this.cloneUI(ui)

      return layer
    }

    /**
    * Function to check if certain DOM element should be clone in the help menu
    * @access private
    * @param {DOM} original - The desired DOM element to be cloned in help menu
    */
    cloneUI(original) {
      //Input1: DOM element

      var clone = document.createElement("div");

      clone.id = original.id+"-clone";
      clone.classList = original.classList
      clone.classList.add('clone')
      clone.classList.add(original.id)

      var extra = ['NernstEqn',
      'GoldmanEqn',
      'answer',
      'simulatorSetting',
      'dataPlot']
      if(extra.includes(original.id)) {
        var height = (parseFloat(getComputedStyle(original)['height'])
      )

      if(original.id=='GoldmanEqn' || original.id=='NernstEqn' )
      height=height+10+10;

      if(original.id=='answer') {


        clone.style.paddingTop=height/2 + 5 + 'px'
        clone.style.paddingBottom=height/2 + 5 + 'px'
      } else {
        clone.style.height=height + 'px'
      }

    }

    if(getComputedStyle(original)['overflow']=='auto' || getComputedStyle(original)['overflow-y']=='auto') {

      //Initialize the scroll position
      original.scrollTop = clone.scrollTop;
      original.scrollLeft = clone.scrollLeft;

      clone.onscroll = function(e) {
        original.scrollTop = clone.scrollTop;
        original.scrollLeft = clone.scrollLeft;
      };
    }


    this.initContent(clone,original.id)

    return clone
  }
  /**
  * Function to initialize the clone element's string and css
  * @access private
  * @param {DOM} target - The clone element
  *
  * @param {String} content - Optional text, can be void
  */
  initContent(target,content) {
    //Input1: DOM element
    //Input2: Optional text


    target.innerHTML = this.id_list[content]
    if(this.id_list[content]!="") {
      // target.classList.add('hovering')
      target.style.display = "flex";
      target.style.justifyContent = "center";
      target.style.alignItems = "center";
      target.style.textAlign = "center";
      target.classList.add('last')
    }
  }

}
