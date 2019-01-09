function renderUI(id,mode) {
//Input DOM object/chartjs object, Boolean

switch (id) {
  case "hidebarText":
    document.getElementById("hidebarText").innerText = (mode) ? ">" : "<";
    break;
  case "simulatorSetting":
    document.getElementById('simulatorSetting').style.display = (mode) ? "flex" : "none";
    break;
  case "NernstSetting":
    document.getElementById('NernstSetting').style.display = (mode) ? "initial" : "none";
    break;
  case "GoldmanSetting":
    document.getElementById('GoldmanSetting').style.display = (mode) ? "initial" : "none";
    break;
  case "helpQuestion":
    document.getElementById('helpQuestion').style.display = (mode) ? "initial" : "none";
    break;
  case "helpSetting":
    document.getElementById('helpSetting').style.height = (mode) ? "initial" : "100%";
    break;
  case "dataPlot":
    document.getElementById('dataPlot').style.display = (mode) ? "initial" : "none";
    break;
  case dataChart:
    dataChart.getDatasetMeta(j).hidden = (mode) ? false : true;
    break;
}

}


function makeUIs(creation) {
  // input: Boolean;
  // usage: True is for initializing the UI; False is for recreating UI when browser window is resized (responsive UI)

  // Set up the section where answers are displayed
  if (creation == true) {
    var answer = 0;

    equations[1] = createElement('h3', 'Answer: ' + answer + 'V');
    equations[1].class('qoptions');
    equations[1].parent('equationdiv');

    // Radio buttons to select ions to include
    for (var i = 0; i < particleTypes.length; i++) {
      checkboxes[i] = createCheckbox(particleTypes[i], false);
      checkboxes[i].class('checkboxes');
      checkboxes[i].id('checkbox' + particleTypes[i]);
      checkboxes[i].parent('particleControl');
      checkboxes[i].changed(checkedEvent);
    }

    NernstButton = createButton('Nernst');
    NernstButton.id('NernstButton');
    NernstButton.parent('particleControl');
    NernstButton.mousePressed(startNernst);
    GoldmanButton = createButton('Goldman');
    GoldmanButton.id('GoldmanButton');
    GoldmanButton.parent('particleControl');
    GoldmanButton.mousePressed(startGoldman);

    var row = 4;
    for (var k = 0; k < bioMainSequence.getNumContainers() * row; k++) {
      if (k == 0) {
        var text = 'Extracellular Control:';
      } else if (k == row) {
        var text = 'Intracellular Control:';
      } else {
        var id = (k % row) - 1;
        var particleType = particleTypes[id];
        var particleLocation = (k <= 3) ? "outside" : "inside";

        var particleSuffix = (k <= 3) ?
          "out" :
          "in";
        var particleCharge = (particleMapper[particleType].charge == 1) ?
          "+" :
          "-";
        var text = '[' + particleType + '<sup>' + particleCharge + '</sup>]' + '<sub>' + particleSuffix + '</sub>&nbsp;';
        var Value = bioMainSequence.getNumParticles(particleLocation, particleType);
      }
      if (k == 0 || k == row) {
        textboard[k] = createElement('h4', text);
        textboard[k].class('qoptions');
        textboard[k].parent(eval("control" + k));

        createElement('br').parent(eval("control" + k));

        var table = createElement('table')
        table.class("table qoptions");
        table.id("table" + k);
        table.parent(eval("control" + (
          k + 1)));
      } else {
        var trow = createElement('tr');
        if (k < row) {
          trow.parent("table0");
        } else {
          trow.parent("table" + row);
        }

        textboard[k] = createElement('h4', text);
        textboard[k].class('qoptions');

        var td0 = createElement('td');
        textboard[k].parent(td0);
        td0.parent(trow);
        input[k] = createInput();
        input[k].value(Value)
        input[k].id(k);
        input[k].class('qoptions');
        var td1 = createElement('td');
        input[k].parent(td1);
        td1.parent(trow);
        input[k].input(changeNumParticles);

        plusButton[k] = createButton('+');
        plusButton[k].id(k);

        plusButton[k].attribute("data-ptype", particleType);
        plusButton[k].attribute("data-location", particleLocation);
        plusButton[k].style("background-color", particleMapper[particleType].color)
        plusButton[k].mousePressed(insertParticle);
        plusButton[k].class('qoptions');

        var td2 = createElement('td');
        plusButton[k].parent(td2);
        td2.parent(trow);

        minusButton[k] = createButton('-');
        minusButton[k].id(k);

        minusButton[k].attribute("data-ptype", particleType);
        minusButton[k].attribute("data-location", particleLocation);
        minusButton[k].style("background-color", particleMapper[particleType].color)
        minusButton[k].mousePressed(removeParticle);
        minusButton[k].class('qoptions');

        var td3 = createElement('td');
        minusButton[k].parent(td3);
        td3.parent(trow);
      }
    }
  }
}

// NOTE: Might want to rename this function
function redrawUI(questionBox) {
  // input: Boolean
  // usage: True is for initializing the UI; False is for recreating UI when browser window is resized (responsive UI)

  if (questionBox == true) {
    equationContainerHeighthMul = equationHeightPercent;
  } else {
    equationContainerHeighthMul = 1;
  }

  adjustUISize(equationContainerHeighthMul);
  canvas.size(canWidth, canHeight);

  //Relative to parent coordinate
  animationSequencer.current().setContainerSizes(canWidth, canHeight, thickness);
}

function adjustUISize(multiple) {
  // input: Floats
  // usage: Resizing the question/equation window; 0.35 (including question), 1 (excluding question)

  simuWidth = 0.65 * windowWidth;
  stage.size(windowWidth, (windowHeight - 36));
  firstBox.size(0.35 * windowWidth, (windowHeight - 36));
  secondBox.size(0.65 * windowWidth, (windowHeight - 36));
  questions.size(0.35 * windowWidth, (1 - multiple) * (windowHeight - 36));

  equationContainer.size(0.35 * windowWidth, multiple * (windowHeight - 36));
  leftBox.size(0.35 * windowWidth, (1 - multiple) * (windowHeight - 36));
  hideBar.size(0.35 * windowWidth, 20);
  equi.size(0.35 * windowWidth, 40);
  equation.size(0.35 * windowWidth, multiple * (windowHeight - 36) - 40 - 20);
  simulator.size(0.65 * windowWidth, 0.65 * (windowHeight - 36));

  // Define the global canWidth & canHeight variables
  canWidth = simulator.size().width;

  canHeight = 1 * (simulator.size().height - 4);

  simulatorInputContainer.size(0.65 * windowWidth, 0.35 * (windowHeight - 36));
  simulatorInput.size(simuWidth, 0.35 * 0.90 * (windowHeight - 36));
  controlsLeft.size(simuWidth / 2, 0.35 * canHeight);
  controlsRight.size(simuWidth / 2, 0.35 * canHeight);
  particleControl.size(simuWidth, 0.1 * 0.80 * (windowHeight - 36));
  canvas.size(canWidth, canHeight);
}
