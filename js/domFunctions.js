
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
