var helpDebug = false;

class Help {
  constructor() {

    this.m_list = {
      firstBox:"",
      leftbar:"The questions will be listed in this area.</br> Please read the questions carefully and make sure you have answer every questions",
      equationContainer:"",
      hidebar:"Click arrow to expanded/hide questions",
      equationdiv:"",
      NernstEqn:"Current mode governing equation",
      GoldmanEqn:"Goldman equation",
      simulatorSetting:"In the setting Menu, you can change the setting of temperature and ion permeability",
      leftWindow: " ", //space for add the 'last' class
      dataPlot:"Voltage data plot",
      answer:"Current Voltage in membrane",
      equilibrateButton:"Click this to equilibrate the membrane",
      secondBox:"",
      sim:"This window will deminstrate the movement of pparticles with the membrane</br>. You can either hover the window or press 'space' to pause the window",
      simulatorInputContainer:"",
      simInput:"All the particle input",
      particleControl:"All the particle control",
      helpDummy:""
    }

  }

  initialize() {
    var sim = document.querySelector("#root #stage");
    var helpPage = document.querySelector("#helpPage");

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
    helpPage.appendChild(temp);

    helpDebug && console.log('Help Page initialize end')
  }

  clear() {
    var helpPage = document.querySelector("#helpPage");
    while (helpPage.firstChild) {
      helpPage.removeChild(helpPage.firstChild);
    }
  }

  resize() {
    var total = Object.keys(this.m_list).length;

    for (let i = 0; i<total; i++) {

      var element = document.getElementById(Object.keys(this.m_list)[i]);
      var dim = this.getDim(element)
      var clone = document.getElementById(Object.keys(this.m_list)[i]+"-clone");

      if(clone) {
        clone.style.height = dim[0] + "%"
        clone.style.width = dim[1] + "%"
        this.helpDummyCheck(clone,element)
      }
    }
  }


  createLayer(parent,index) {
    // input 1: DOM element
    // input 2: int
    // return: DOM element

    var ui = parent.children[index]
    if(!Object.keys(this.m_list).includes(ui.id) || ui.classList.contains('hidden') || ui.style.display=='none')
    return;

    helpDebug && console.log('Layer '+index+' found. ID is'+ui.id+' childlength is '+ui.children.length)
    var layer = this.cloneUI(ui)

    return layer
  }

  cloneUI(original) {
    //Input1: DOM element

    var clone = document.createElement("div");
    var dim = this.getDim(original)

    helpDebug && console.log(dim)

    clone.style.height = dim[0] + "%"
    clone.style.width = dim[1] + "%"

    clone.id = original.id+"-clone";
    clone.classList.add('clone')

    this.helpDummyCheck(clone,original)

    this.initContent(clone,original.id)

    return clone
  }

  getDim(reference) {
    //Input1: DOM element

    var parent = reference.parentNode;
    var height = getStyle(reference,"height") / getStyle(parent,"height") * 100;
    var width = getStyle(reference,"width") / getStyle(parent,"width") * 100;

    height = Math.ceil(height);
    if(height > 95) height = 100;

    width = Math.ceil(width);
    if(width > 92) width = 100;
    if(width == 34) width = 35;
    if(width == 64)  width = 65;

    return [height,width]
  }

  initContent(target,content) {
    //Input1: DOM element
    //Input2: Optional text

    target.innerHTML = this.m_list[content]
    if(this.m_list[content]!="") {
      target.style.justifyContent = "center";
      target.style.textAlign = "center";
      target.classList.add('last')
    }
  }

  helpDummyCheck(clone,original) {
    //Input1: DOM element
    //Input2: DOM element

    if (original.id=="helpDummy") {

      if (document.getElementById("simulatorSetting").classList.contains("hidden")) {
        var eqnDim = this.getDim(document.getElementById("NernstEqn"))
        var ansDim = this.getDim(document.getElementById("answer"))
        var height = 100 - eqnDim[0] - ansDim[0]
        var width = 100 - eqnDim[1] - ansDim[1]
      } else {
        var eqnDim = this.getDim(document.getElementById("NernstEqn"))
        var settingDim = this.getDim(document.getElementById("simulatorSetting"))
        var plotDim = this.getDim(document.getElementById("dataPlot"))
        var ansDim = this.getDim(document.getElementById("answer"))

        var height = 100 - eqnDim[0] - ansDim[0] - settingDim[0] - plotDim[0]
        var width = 100 - eqnDim[1] - ansDim[1] - settingDim[1] - plotDim[1]
      }

      clone.style.height = height + "%"
      clone.style.width = width + "%"
      clone.classList.add('last')
    }
  }

}
