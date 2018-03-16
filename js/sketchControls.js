var transferParticle = function(particle,currentNum) {
  var xMul = 100;
  var yMul = 100;

  // Set names of current array is in and array to transfer particle into
  var currentArray = eval(particle+"Particles"+currentNum);
  var transferNum = (currentNum == 0)? 1 : 0;
  var transferArray = eval(particle+"Particles"+transferNum);
  var numOfParticles = eval("N_"+particle);
  var offset = Math.floor(channels[0].width/2+10);

  if (currentArray.length == 0) {
    return;
  }
  // If the particle is in the top division
  if (currentNum == 0) {
    var targetChannel = (particle == "Na") ? channels[0].tl : channels[1].tl;
  }
  // If the particle is in the bottom division
  else {
    var targetChannel = (particle == "Na") ? channels[0].bl : channels[1].bl;
  }
  // Change move velocity to get particle to target channel
  var v = (targetChannel.x+ offset - currentArray[0].x)/xMul;
  var u = (targetChannel.y - currentArray[0].y)/yMul;
  currentArray[0].orig_velocity = createVector(v, u);
  currentArray[0].move_velocity = createVector(v, u);

  // Move particle through channel
  setTimeout(function() {
    var OriX = Math.floor(currentArray[0].x);
    var OriY = Math.floor(currentArray[0].y);
    var diam = currentArray[0].diam;
    currentArray.splice(0, 1);
    var yVector = (currentNum == 0) ? 3 : -3;
    var velocity = createVector(0, yVector);
    currentArray.push(new AnimatedParticle(OriX,OriY,diam,velocity, false, particle));
  }, 800)
  // Remove particle from its old division and create particle in the new division
  setTimeout(function() {
    var OriParticle = currentArray[numOfParticles[currentNum]-1]
    var OriX = Math.floor(OriParticle.x);
    var OriY = Math.floor(OriParticle.y);
    var diam = Math.floor(OriParticle.diam);
    var velocities = [-4,-3,3,4];
    var x_vel = Math.floor(Math.random() * 3) + 0;
    var y_vel = Math.floor(Math.random() * 3) + 0;
    var velocity = createVector(velocities[x_vel],Math.abs(velocities[y_vel]));
    currentArray.splice(numOfParticles[currentNum]-1, 1);
    numOfParticles[currentNum]--;

    if (particle == "Na") {
      var oldInput = currentNum == 0 ? input[1] : input[4];
      var transferInput = transferNum == 0 ? input[1] : input[4];
    }
    else {
      var oldInput = currentNum == 0 ? input[2] : input[5];
      var transferInput = transferNum == 0 ? input[2] : input[5];
    }
    oldInput.value(numOfParticles[currentNum]);
    (particle == "Na") ? transferArray.push(new Na(OriX,OriY,diam,velocity,true)):
                         transferArray.push(new Cl(OriX,OriY,diam,velocity,true));
    numOfParticles[transferNum]++;
    transferInput.value(numOfParticles[transferNum]);
  }, 1200)
}

// Brings outside and inside into equilibrium
function equilibrate(particle) {
  topArray = eval(particle+"Particles"+0);
  botArray = eval(particle+"Particles"+1);

  particleAmount = topArray.length + botArray.length;
  equiAmount = Math.floor(particleAmount/2);
  // if either top or bottom has equilibrium amount, we can return
  if (topArray.length == equiAmount || botArray.length == equiAmount) {
    console.log("equi reached");
    return;
  }
  largerArrayNum = topArray.length > botArray.length? 0 : 1;
  largerArray = eval(particle+"Particles"+largerArrayNum);

  var transfers = largerArray.length - equiAmount
  for (var i = 0; i < transfers; i++) {
    setTimeout(function(){
        transferParticle(particle,largerArrayNum);
    }, 1000*i);

  }

}

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
  var spacebar = 32;
  var Q_key = 81;
  var W_key = 87;
  var A_key = 65;
  var S_key = 83;
  var E_key = 69;

  switch (keyCode) {
    case spacebar:
    toggleLoop();
    break;

    case Q_key:
    transferParticle("Na", 0);
    break;

    case W_key:
    transferParticle("Cl", 0);
    break;

    case A_key:
    transferParticle("Na", 1);
    break;

    case S_key:
    transferParticle("Cl", 1);
    break;

    case E_key:
    equilibrate("Na");
    equilibrate("Cl");
    break;
  }

  // if (keyCode == spacebar) {
  //   toggleLoop();
  // }
  // if (keyCode == Q_key) {
  //   transferParticle("Na",0);
  // }
  // if (keyCode == W_key) {
  //   transferParticle("Cl",0);
  // }
  // if (keyCode == A_key) {
  //   transferParticle("Na",1);
  // }
  // if (keyCode == S_key) {
  //   transferParticle("Cl",1);
  // }
  // Press E
  // if (keyCode == 69) {
  //   equilibrate("Na");
  //   equilibrate("Cl");
  // }
}


function equilibriumCheck() {


}

//UI
function increase(evt) {
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
  //Channel
  var topLeft = new Point( canWidth/2-thickness, canHeight/2-thickness );
  var topRight = new Point( canWidth/2+thickness, canHeight/2-thickness );
  var botRight = new Point( canWidth/2+thickness, canHeight/2-thickness );
  var botLeft = new Point( canWidth/2-thickness, canHeight/2+thickness );

  var divisionTL = new Point(outerBox[0].bl.x,outerBox[0].bl.y);
  var divisionTR = new Point(outerBox[0].br.x,outerBox[0].br.y);
  var divisionBR = new Point(outerBox[1].tr.x,outerBox[1].tr.y);
  var divisionBL = new Point(outerBox[1].tl.x,outerBox[1].tl.y);

  channels = createChannels(divisionTL,divisionTR,divisionBR,divisionBL,2);
  for (var i=0; i<channels.length; i++) {
    channels[i].draw();
  }

  var answer = 0;
  equations[1] = createElement('h3', 'Answer: '+answer+'V');
  equations[1].class('qoptions');
  equations[1].parent('equationdiv');

  equations[2] = createSelect();
  equations[2].id(2);
  equations[2].attribute("xmlns", "http://www.w3.org/1999/xhtml")
  equations[2].class('eqninput');
  equations[2].parent('neq-top');
  equations[2].option('Na');
  equations[2].option('Cl');
  equations[2].changed(NernstFormula);

  equations[3] = createSelect();
  equations[3].id(3);
  equations[3].attribute("xmlns", "http://www.w3.org/1999/xhtml")
  equations[3].class('eqninput');
  equations[3].parent('neq-bot');
  equations[3].option('Na');
  equations[3].option('Cl');
  equations[3].changed(NernstFormula);

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

    if (k == 0 || k == row) {
      textboard[k] = createElement('h3', text);
      textboard[k].class('qoptions');
      textboard[k].parent(eval("control" + k));

      createElement('br').parent(eval("control" + k));

      console.log("Table time?");
      var table = createElement('table')
      table.class("table qoptions");
      table.id("table" + k);
      table.parent(eval("control" + (k + 1)));
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

      input[k] = createInput(Value);
      input[k].id("fasf");
      input[k].class('qoptions');

      var td1 = createElement('td');
      input[k].parent(td1);
      td1.parent(trow);

      PlusButton[k] = createButton('+');
      PlusButton[k].id(k);
      PlusButton[k].mousePressed(increase);
      PlusButton[k].class('qoptions');

      var td2 = createElement('td');
      PlusButton[k].parent(td2);
      td2.parent(trow);

      MinusButton[k] = createButton('-');
      MinusButton[k].id(k);
      MinusButton[k].mousePressed(decrease);
      MinusButton[k].class('qoptions');

      var td3 = createElement('td');
      MinusButton[k].parent(td3);
      td3.parent(trow);
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
      var F = 96485.3329;//0.096485;
      var answer = (R*T)/(z*F)*Math.log(Xout/Xin);
      console.log(answer*10000)

      equations[1].html('Answer: '+answer+'V');

    }
