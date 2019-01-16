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
  }

  initialize() {
    var sim = document.querySelector("#root #stage");
    var helpPage = document.querySelector("#helpPage");

    for (let i = 0; i < sim.children.length; i++) {

      var temp = document.createDocumentFragment(); //Need this line, can't append clone directly to the parent Element
      //See https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment
      var layer5Temp = document.createDocumentFragment(); //Need this line, can't append clone directly to the parent Element

      var ui = sim.children[i]
      var layer3 = this.cloneUI(ui)

      for (let i = 0; i < ui.children.length; i++) { //4
        
        // console.log("The UI ID is "+ui.children[i].id+" H: "+ui.children[i].style.height+" W: "+ui.children[i].style.width);
        if(ui.children[i].style.height!='0px') {
          var layer4 = this.cloneUI(ui.children[i])

          if (layer4.id == 'equationContainer-clone') {

            for (let j = 0; j < ui.children[i].children[i].childElementCount; j++) { //5
              var curLayer5 = ui.children[i].children[i].children[j];
              if(curLayer5.style.height!='0px' && curLayer5.id && curLayer5.display != "none" && curLayer5.className != "hidden") {
                console.log(curLayer5)
                console.log(document.getElementById(curLayer5.id).style)
                console.log(curLayer5.id)

                var layer5 = this.cloneUI(curLayer5)
                console.log(layer5)
                layer5Temp.appendChild(layer5)
              }
            }
          }
          this.initContent(layer4)
          layer4.appendChild(layer5Temp)
          layer3.appendChild(layer4)
        }


      }
      temp.appendChild(layer3);
      helpPage.appendChild(temp);
    }
  }

  clear() {
    var helpPage = document.querySelector("#helpPage");
    while (helpPage.firstChild) {
      helpPage.removeChild(helpPage.firstChild);
    }
  }

  cloneUI(original) {

    var height = original.getBoundingClientRect().height,
    width = original.getBoundingClientRect().width,
    parent = original.parentNode;

    var height = height / parent.getBoundingClientRect().height * 100;
    var width = width / parent.getBoundingClientRect().width * 100;

    var clone = document.createElement("div");
    clone.style.height = height+'%';
    clone.style.width = width+'%';
    // clone.style.background = "red";
    // clone.style.color = "white";
    clone.id = original.id+"-clone";

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
