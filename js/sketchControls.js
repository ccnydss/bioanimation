// Pause / unpause the animation (debug purposes)
var togLoop = false;
function toggleLoop() {
  if (togLoop) {
    loop();
    togLoop = false;
  } else {
    noLoop();
    togLoop = true;
  }
}

function keyPressed() {
  if (keyCode == 32) {
    toggleLoop();
  }
}

//UI
function increase(evt) {
  console.log(evt.target.id);
  var j = evt.target.id;

  var i = Math.floor(j/3);
  var row = 3;

  randomX = outerBox[i].tl.x + radius + (Math.floor(Math.random() * xRange))
  randomY = outerBox[i].tl.y + radius + (Math.floor(Math.random() * yRange))

    var velocity = createVector(-5, -4);

    if (j==1 || j==(1+row) ) {
      eval("NaParticles" + i).push(new Na(randomX,randomY,radius,velocity));
      N_Na[Math.floor(j/3)] = N_Na[Math.floor(j/3)] + 1;
      var Value = N_Na[Math.floor(j/3)]

    } else if(j==2 || j==(2+row) ) {
      eval("ClParticles" + i).push(new Cl(randomX,randomY,2*radius,velocity));
      N_Cl[Math.floor(j/3)] = N_Cl[Math.floor(j/3)] + 1;
      var Value = N_Cl[Math.floor(j/3)]
    }

    input[j].value(Value);
}

function decrease(evt) {
  console.log(evt.target.id);
  var j = evt.target.id;

  var i = Math.floor(j/3);
  var row = 3;

  if (j==1 || j==(1+row) ) {

    if(N_Na[i]>0) {
      eval("NaParticles" + i).splice(N_Na[i]-1, 1);
      N_Na[i]--;
    }
    var Value = N_Na[i]

  }else if(j==2 || j==(2+row) ) {

    if(N_Cl[i]>0) {
      eval("ClParticles" + i).splice(N_Cl[i]-1, 1);
      N_Cl[i]--;
    }
    var Value = N_Cl[i]
  }


  input[j].value(Value);
}

function ChangeNumParticles(evt) {

  var j = evt.target.id;

  var i = Math.floor(j/3);
  var row = 3;
  console.log("Id is "+evt.target.id+" Input is "+input[j].value());

  if (!isNaN(input[j].value())) {

    if (j==1 || j==(1+row) ) {
      var Compare = N_Na[i]

    }else if(j==2 || j==(2+row) ) {
      var Compare = N_Cl[i]
    }


    if (input[j].value() > Compare ) {
      if (input[j].value() >= MaxParticles+1) {
        input[j].value(MaxParticles);
      }

        for (var k = Compare; k<input[j].value(); k++) {

          randomX = outerBox[i].tl.x + radius + (Math.floor(Math.random() * xRange))
          randomY = outerBox[i].tl.y + radius + (Math.floor(Math.random() * yRange))


          var velocity = createVector(-5, -4);

          if (j==1 || j==(1+row) ) {
            eval("NaParticles" + i).push(new Na(randomX,randomY,radius,velocity));
            N_Na[i]++;
            var Value = N_Na[i]

          }else if(j==2 || j==(2+row) ) {
            eval("ClParticles" + i).push(new Cl(randomX,randomY,2*radius,velocity));
            N_Cl[i]++;
            var Value = N_Cl[i]
          }
        }
    } else if  (input[j].value() < Compare) {

      for (var k = input[j].value(); k<Compare; k++) {
        if (j==1 || j==(1+row) ) {

          if(N_Na[i]>0) {
            eval("NaParticles" + i).splice(N_Na[i]-1, 1);
            N_Na[i]--;
          }
          var Value = N_Na[i]

        }else if(j==2 || j==(2+row) ) {

          if(N_Cl[i]>0) {
            eval("ClParticles" + i).splice(N_Cl[i]-1, 1);
            N_Cl[i]--;
          }
          var Value = N_Cl[i]
        }
      }

    }

  } else if (isNaN(input[j].value())) {
    input[j].value(0);

    for (var k = 0; k<MaxParticles; k++) {
      if (j==1 || j==(1+row) ) {

        if(N_Na[i]>0) {
          eval("NaParticles" + i).splice(N_Na[i]-1, 1);
          N_Na[i]--;
        }
        var Value = N_Na[i]

      }else if(j==2 || j==(2+row) ) {

        if(N_Cl[i]>0) {
          eval("ClParticles" + i).splice(N_Cl[i]-1, 1);
          N_Cl[i]--;
        }
        var Value = N_Cl[i]
      }
    }

  }


}

function makeUIs() {
  //UI
  stage = createDiv('');
  stage.id('stage');

  questions = createDiv("");
  questions.id('qdiv');
  questions.parent('stage');

  simulator = createDiv("");
  simulator.id('sim');
  simulator.parent('stage');

  canvas = createCanvas(600, 600);
  canvas.class('can');
  canvas.parent('sim');

  simulatorInput = createDiv('');
  simulatorInput.id('simInput');
  simulatorInput.parent('sim');

  //Control UI
  controlsLeft = createDiv('');
  controlsLeft.class('controls');
  controlsLeft.parent('simInput');

  controlsRight = createDiv('');
  controlsRight.class('controls');
  controlsRight.parent('simInput');

  // NOt Working
  // for (var i = 0; i<2; i++) {
  //   eval("control" + i) = createDiv('');
  // }
  control0 = createDiv('');
  control0.class('control');
  control0.parent(controlsLeft);

  control1 = createDiv('');
  control1.class('control');
  control1.parent(controlsLeft);

  control2 = createDiv('');
  control2.class('control');
  control2.parent(controlsLeft);

  control3 = createDiv('');
  control3.class('control');
  control3.parent(controlsRight);

  control4 = createDiv('');
  control4.class('control');
  control4.parent(controlsRight);

  control5 = createDiv('');
  control5.class('control');
  control5.parent(controlsRight);

  //Channel
  var topLeft = new Point( length/2-thickness, length/2-thickness );
  var topRight = new Point( length/2+thickness, length/2-thickness );
  var botRight = new Point( length/2+thickness, length/2-thickness );
  var botLeft = new Point( length/2-thickness, length/2+thickness );

  var divisionTL = new Point(outerBox[0].bl.x,outerBox[0].bl.y);
  var divisionTR = new Point(outerBox[0].br.x,outerBox[0].br.y);
  var divisionBR = new Point(outerBox[1].tr.x,outerBox[1].tr.y);
  var divisionBL = new Point(outerBox[1].tl.x,outerBox[1].tl.y);

  channels = createChannels(divisionTL,divisionTR,divisionBR,divisionBL,2);
  for (var i=0; i<channels.length; i++) {
    channels[i].draw();
  }

  //Title text
  //Na Input
  //Cl Input
  var row = 3;
  for (var k = 0; k < numContainer*row; k++) {

    if (k==0) {
      var text = 'Top';
    } else if(k==row) {
      var text = 'Bottom';
    } else if(k==1 || k==(1+row)) {
      var text = 'Na Ions:&nbsp;';
      var Value = N_Na[Math.floor(k/3)]
    } else if(k==2 || k==(2+row)) {
      var text = 'Cl Ions:&nbsp;';
      var Value = N_Cl[Math.floor(k/3)]
    }

    textboard[k] = createElement('h3', text);
    textboard[k].class('qoptions');
    textboard[k].parent(eval("control" + k));

    if (k != 0 & k!= row) {


      input[k] = createInput(Value);

      if (Value == 0) {input[k].value(0)}
      input[k].input(ChangeNumParticles);
      input[k].id(k);
      input[k].class('qoptions');
      input[k].parent(eval("control" + k));

      PlusButton[k] = createButton('+');
      PlusButton[k].id(k);
      PlusButton[k].mousePressed(increase);
      PlusButton[k].class('qoptions');
      PlusButton[k].parent(eval("control" + k));

      MinusButton[k] = createButton('-');
      MinusButton[k].id(k);
      MinusButton[k].mousePressed(decrease);
      MinusButton[k].class('qoptions');
      MinusButton[k].parent(eval("control" + k));
    }
  }
}
