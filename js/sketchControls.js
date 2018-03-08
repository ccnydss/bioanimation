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


  if (keyCode == 81) {
    // console.log(NaParticles0[0].move_velocity)
    //   console.log(NaParticles0[0].orig_velocity)
    //   console.log(NaParticles0[0].x + " & " + channels[0].tl.x)
    //   console.log(Math.pow(10,Math.floor(Math.log10(channels[0].tl.x+25 -NaParticles0[0].x))) )

//xMul = Math.pow(10,Math.floor(Math.log10(channels[0].tl.x+25 -NaParticles0[0].x)))
//yMul = Math.pow(10,Math.floor(Math.log10(channels[0].tl.y -NaParticles0[0].y)))
xMul = 100;
yMul = 100;
  //if (isNaN(xMul)) {xMul = 1}
  //  if (isNaN(yMul)) {yMul = 1}
var v = (channels[0].tl.x+25 -NaParticles0[0].x)/(xMul );
var u = (channels[0].tl.y -NaParticles0[0].y)/(yMul );
       NaParticles0[0].orig_velocity = createVector(v, u);
      NaParticles0[0].move_velocity = createVector(v, u);

setTimeout(function() {
var OriX = NaParticles0[0].x;
var OriY = NaParticles0[0].y;
  eval("NaParticles" + 0).splice(0, 1);
    var velocity = createVector(0, -3);
  eval("NaParticles" + 0).push(new AnimatedParticle(OriX,OriY,radius,velocity, false));
}, 800)

setTimeout(function() {
var OriX = NaParticles0[N_Na[0]-1].x;
var OriY = NaParticles0[N_Na[0]-1].y;

var x_vel = Math.floor(Math.random() * 3) + 0;
var y_vel = Math.floor(Math.random() * 3) + 0;
var velocity = createVector(velocities[x_vel],velocities[y_vel]);
    eval("NaParticles" + 0).splice(N_Na[0]-1, 1);
    N_Na[0]--;
        input[1].value(N_Na[0]);
  eval("NaParticles" + 1).push(new Na(OriX,OriY,radius,velocity, true));
    N_Na[1]++;
        input[4].value(N_Na[1]);
}, 1200)

  }


}


function equilibriumCheck() {


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
        if(N_Na[i]<MaxParticles) {
      eval("NaParticles" + i).push(new Na(randomX,randomY,radius,velocity, true));
      N_Na[Math.floor(j/3)] = N_Na[Math.floor(j/3)] + 1;
      var Value = N_Na[Math.floor(j/3)]
      NernstFormulaInput("Na");
          input[j].value(Value);
        }

    } else if(j==2 || j==(2+row) ) {
        if(N_Cl[i]<MaxParticles) {
      eval("ClParticles" + i).push(new Cl(randomX,randomY,2*radius,velocity, true));
      N_Cl[Math.floor(j/3)] = N_Cl[Math.floor(j/3)] + 1;
      var Value = N_Cl[Math.floor(j/3)]
      NernstFormulaInput("Cl");
          input[j].value(Value);
        }
    }

}

function decrease(evt) {
  console.log(evt.target.id);
  var j = evt.target.id;

  var i = Math.floor(j/3);
  var row = 3;

  if (j==1 || j==(1+row) & N_Na[i]>0 ) {

    if(N_Na[i]>0) {
      eval("NaParticles" + i).splice(N_Na[i]-1, 1);
      N_Na[i]--;
    }
    var Value = N_Na[i]
    NernstFormulaInput("Na");
      input[j].value(Value);

  }else if(j==2 || j==(2+row) ) {

    if(N_Cl[i]>0) {
      eval("ClParticles" + i).splice(N_Cl[i]-1, 1);
      N_Cl[i]--;
    }
    var Value = N_Cl[i]
    NernstFormulaInput("Cl");
      input[j].value(Value);
  }


}

function ChangeNumParticles(evt) {

  var j = evt.target.id;

  var i = Math.floor(j/3);
  var row = 3;
  console.log("Id is "+evt.target.id+" Input is "+input[j].value());

  if (!isNaN(input[j].value()) & Math.floor(input[j].value()) == input[j].value()) {

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
            eval("NaParticles" + i).push(new Na(randomX,randomY,radius,velocity, true));
            N_Na[i]++;
            NernstFormulaInput("Na");

          }else if(j==2 || j==(2+row) ) {
            eval("ClParticles" + i).push(new Cl(randomX,randomY,2*radius,velocity, true));
            N_Cl[i]++;
            NernstFormulaInput("Cl");
          }
        }
    } else if  (input[j].value() < Compare) {

      for (var k = input[j].value(); k<Compare; k++) {
        if (j==1 || j==(1+row) ) {

          if(N_Na[i]>0) {
            eval("NaParticles" + i).splice(N_Na[i]-1, 1);
            N_Na[i]--;
          }
          NernstFormulaInput("Na");

        }else if(j==2 || j==(2+row) ) {

          if(N_Cl[i]>0) {
            eval("ClParticles" + i).splice(N_Cl[i]-1, 1);
            N_Cl[i]--;
          }
          NernstFormulaInput("Cl");
        }
      }

    }

  } else if (isNaN(input[j].value()) || Math.floor(input[j].value()) != input[j].value()) {
    input[j].value(0);

    for (var k = 0; k<MaxParticles; k++) {
      if (j==1 || j==(1+row) ) {

        if(N_Na[i]>0) {
          eval("NaParticles" + i).splice(N_Na[i]-1, 1);
          N_Na[i]--;
        }
        NernstFormulaInput("Na");

      }else if(j==2 || j==(2+row) ) {

        if(N_Cl[i]>0) {
          eval("ClParticles" + i).splice(N_Cl[i]-1, 1);
          N_Cl[i]--;
        }
        NernstFormulaInput("Cl");
      }
    }

  }


}

function makeUIs() {
  //UI
  stage = createDiv('');
  stage.id('stage');

  rightBox = createDiv("");
  rightBox.id('qdiv');
  rightBox.parent('stage');


  questions = createDiv("");
  questions.id('questionsdiv');
  questions.parent('qdiv');


  equation = createDiv("");
  equation.id('equationdiv');
  equation.parent('qdiv');

  // equation0 = createDiv('');
  // equation0.id('equation0');
  // equation0.parent(equationdiv);
  //
  // equation1 = createDiv('');
  // equation1.id('equation1');
  // equation1.parent(equationdiv);

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

var answer = 0;
    equations[0] = createDiv('<img src="js/files/NernstEqn.JPG" alt="Nernst equaiton">');
    equations[0].class('qoptions');
    equations[0].parent('equationdiv');
    equations[1] = createElement('h3', 'Answer: '+answer+'V');
    equations[1].class('qoptions');
    equations[1].parent('equationdiv');

    equations[2] = createSelect();
    equations[2].id(2);
    equations[2].class('eqninput');
    equations[2].parent('equationdiv');
    equations[2].option('Na');
    equations[2].option('Cl');
    equations[2].changed(NernstFormula);

    equations[3] = createSelect();
    equations[3].id(3);
    equations[3].class('eqninput');
    equations[3].parent('equationdiv');
    equations[3].option('Na');
    equations[3].option('Cl');
    equations[3].changed(NernstFormula);

  //Right side equaiton
       // equations[0] = createElement('h3', "E<sub>ion</sub> = RT/zF ln([Cl]<sub>out</sub>/[Cl]<sub>in</sub>)");
      //  equations[0] = createElement('h3', "E<sub>ion</sub> = ");
      //  equations[0].class('qoptions');
      // equations[0].parent('equationdiv');
      //
      //
      //   equations[1] = createDiv("");
      //   equations[1].parent('equationdiv');
      //   equations[1].class('eqntop');
      //   equations[2] = createDiv("");
      //   equations[2].parent('equationdiv');
      //   equations[2].class('eqnbot');

  //Title text
  //Na Input
  //Cl Input
  var row = 3;
  for (var k = 0; k < numContainer*row; k++) {

    if (k==0) {
      var text = 'Outside';
    } else if(k==row) {
      var text = 'Inside';
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

function NernstFormula(evt) {
  var j = evt.target.id;

  if (j == 2) {
    i =3;
  } else if (j == 3) {
    i =2;
  }
  var R = 8.314;
  var T = 37 + 273.13 //@37C is common
    if (equations[j].value()=="Na") {
      var z = 1;
      Xout = N_Na[0];
      Xin = N_Na[1];
    } else if (equations[j].value()=="Cl") {
      var z = -1;
      Xout = N_Cl[0];
      Xin = N_Cl[1];}
  var F = 0.096485;

  var answer = (R*T)/(z*F)*Math.log(Xout/Xin);
  console.log(answer*10000)

  equations[i].value(equations[j].value());
  equations[1].html('Answer: '+answer+'V');

}

function NernstFormulaInput(j) {
  var R = 8.314;
  var T = 37 + 273.13 //@37C is common
    if (j=="Na") {
      var z = 1;
      Xout = N_Na[0];
      Xin = N_Na[1];
    } else if (j="Cl") {
      var z = -1;
      Xout = N_Cl[0];
      Xin = N_Cl[1];}
  var F = 0.096485;

  var answer = (R*T)/(z*F)*Math.log(Xout/Xin);
  console.log(answer*10000)

  equations[1].html('Answer: '+answer+'V');

}
