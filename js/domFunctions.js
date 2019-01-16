
function renderMathEqn() {
  var nernstEqn = document.getElementById("NernstEqn");
  var goldmanEqn = document.getElementById("GoldmanEqn");
  document.getElementById("equationdiv").appendChild(nernstEqn);
  document.getElementById("equationdiv").appendChild(goldmanEqn);
}

function hideQuestion(evt) {
  // input: the element that triggered the event (hide buttons [arrow]);
  var show = mainSim.questionsAreHidden(); // Check if the questions are already hidden. If TRUE, we should show them. If FALSE, we should hide them.
  var hide = !show;

  //Turn the question menu off
  mainSim.renderUI("hidebarText", hide)
  mainSim.renderUI("simulatorSetting", hide)

  var curUI = (mainSim.simMode() == "Nernst") ? "NernstSetting" : "GoldmanSetting"
  mainSim.renderUI(curUI, hide)

  mainSim.renderUI("dataPlot", hide)

  mainSim.redrawUI(show);
}

function makeTable(id, parent, content, placeholder, contentUnit, contentDefaultValue, prevLength) {

  var settingPart = createDiv('');
  settingPart.id(id)
  settingPart.parent(parent);

  var tableRow = content.length;

  for (var i = 0; i < tableRow; i++) {
    var trow = createElement('tr');
    trow.parent(settingPart);

    var td0 = createElement('label', content[i]);
    td0.parent(trow);

    simSetting[i] = createInput().attribute('placeholder', placeholder[i]);;
    simSetting[i].parent(parent);
    simSetting[i].value(contentDefaultValue[i])
    simSetting[i].parent(trow);
    simSetting[i].id(i);
    simSetting[i].input(mainSim.changeSimulatorSettings.bind(mainSim));

    var td3 = createDiv(contentUnit[i]);
    td3.parent(trow);
    if(contentUnit[i]) {
      td3.addClass('unit');
    }

  }
}
