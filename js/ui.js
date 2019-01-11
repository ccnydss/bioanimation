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
      var chk = createCheckbox(particleTypes[i], false);
      chk.class('checkboxes');
      chk.id('checkbox' + particleTypes[i]);
      chk.parent('particleControl');
      chk.changed(checkedEvent);

      mainSim.addCheckbox(chk);
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
