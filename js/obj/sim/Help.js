function helpPageScript() {
  var helpPage = document.getElementById("helpPage");
  if (helpPage.style.display == "none") {
    // alert("yes")
    helpPage.style.display = "flex";
    help.initialize()
  } else {
    // alert("no")
    helpPage.style.display = "none";
    help.clear()
  }
}

class Help {
  constructor() {

    this.m_list = [
    "firstBox",
    "leftbar", "equationContainer",
    "hidebar", "equationdiv",
    "NernstEqn", "GoldmanEqn", "simulatorSetting", "dataPlot", "answer", "equilibrate-button",
    "secondBox",
    "sim", "simulatorInputContainer",
    "simInput", "particleControl"
    ]
  }

  initialize() {
    var sim = document.querySelector("#root #stage");
    var helpPage = document.querySelector("#helpPage");

    var temp1 = document.createDocumentFragment(); //Need this line, can't append clone directly to the parent Element
    //See https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment
    var layer6Temp = document.createDocumentFragment(); //Need this line, can't append clone directly to the parent Element
    var layer5Temp = document.createDocumentFragment(); //Need this line, can't append clone directly to the parent Element

    console.log('Help Page initialize start')

    for (let i = 0; i < sim.children.length; i++) {

      var ui = sim.children[i]
      if(!this.m_list.includes(ui.id))
      break;
      var layer1 = this.cloneUI(ui)
      console.log('Layer 1 found. ID is'+ui.id)

      for (let j = 0; j < ui.children.length; j++) { //2

        var ui2 = ui.children[j]
        if(!this.m_list.includes(ui2.id))
        break;
        console.log('Layer 2 found. ID is'+ui2.id)
        var layer2 = this.cloneUI(ui2)

        for (let k = 0; k < ui2.children.length; k++) { //2

          var ui3 = ui2.children[k]
          if(!this.m_list.includes(ui3.id))
          break;
          console.log('Layer 3 found. ID is'+ui3.id)
          var layer3 = this.cloneUI(ui3)

            for (let l = 0; l < ui3.children.length; l++) { //2

              var ui4 = ui3.children[l]
              if(this.m_list.includes(ui4.id)) {
              console.log('Layer 4 found. ID is'+ui4.id)
              var layer4 = this.cloneUI(ui4)

              layer3.appendChild(layer4);
              }
            }

          layer2.appendChild(layer3);
        }

        layer1.appendChild(layer2);
      }

      temp1.appendChild(layer1);
    }
    helpPage.appendChild(temp1);

    console.log('Help Page initialize end')
  }

  clear() {
    var helpPage = document.querySelector("#helpPage");
    while (helpPage.firstChild) {
      helpPage.removeChild(helpPage.firstChild);
    }
  }

  cloneUI(original) {

    parent = original.parentNode;


    var height = getStyle(original,"height") / getStyle(parent,"height") * 100;
    var width = getStyle(original,"width") / getStyle(parent,"width") * 100;
    // var width = getComputedStyle(original).width / getComputedStyle(parent).width * 100;

    console.log(height)

    var clone = document.createElement("div");
    clone.style.height = height+'%';
    clone.style.width = width+'%';
    // clone.style.padding = parent.style.padding
    // clone.style.margin = parent.style.margin
    // clone.style.background = "red";
    // clone.style.color = "white";
    clone.id = original.id+"-clone";
    clone.classList.add('clone')

    return clone
  }

  initContent(target,content) {
    //Input1: DOM object
    //Input2: Optional text

    if(!text) {
      target.innerHTML = text;

      switch (target.id) {
        case "leftbar-clone":
        var text = 'This is the question area';
        break;

        case "equationContainer-clone":

        var text = mainSim.questionsAreHidden() ?
        'This is the equation area, you can also click "arrow" button to show up the setting menu' :
        'This is the equation, setting and c area, you can also click "arrow" button to show up the question';
        break;

        case "sim-clone":
        var text = 'This is the simulation area';
        break;

        case "simulatorInputContainer-clone":
        var text = 'This is the simulation control area';
        break;

        default:
        var text = '';
      }
      target.innerHTML = text;
    } else {
      target.innerHTML = content;
    }

  }
}

// https://stackoverflow.com/questions/10787782/full-height-of-a-html-element-div-including-border-padding-and-margin
function getStyle(elm,style) {

  var elmDim, elmMargin;

  switch(style) {
    case "height":
    if(document.all) {// IE
      elmDim = elm.currentStyle.height;
      elmMargin = parseInt(elm.currentStyle.marginTop, 10) + parseInt(elm.currentStyle.marginBottom, 10);
      return (elmHeight+elmMargin);
    } else {// Mozilla
      elmDim = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('height'));
      elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom'));
    }

    return (elmDim+elmMargin);
    break;

    case "width":
    if(document.all) {// IE
      elmDim = elm.currentStyle.width;
      elmMargin = parseInt(elm.currentStyle.marginLeft, 10) + parseInt(elm.currentStyle.marginRight, 10);
    } else {// Mozilla
      elmDim = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('width'));
      elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-left')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-right'));
    }
    return (elmDim+elmMargin);
    break;
  }

}
