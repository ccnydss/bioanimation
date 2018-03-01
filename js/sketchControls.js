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
  // console.log(evt.target.id);
  var i = evt.target.id;
  randomX = outerBox[i].tl.x + radius + (Math.floor(Math.random() * xRange))
  randomY = outerBox[i].tl.y + radius + (Math.floor(Math.random() * yRange))

  if (numParticles[i] >= numParticlesMax[i]){numParticles[i]=numParticlesMax[i]-1} else {

    //textboard[i].html('Current Number:'+numParticles[i]);


      var velocity = createVector(-5, -4);

          var chance = Math.random()
          if (chance < 0.5) {
          eval("particles" + i).push(new Na(randomX,randomY,radius,velocity));
          }else {
          eval("particles" + i).push(new Cl(randomX,randomY,2*radius,velocity));
          }

              //Random position when spawn
              // eval("particles" + i)[numParticles[i]].x = randomX;
              // eval("particles" + i)[numParticles[i]].y = randomY;

    numParticles[i]++;

    OldnumParticles[i] = numParticles[i]
    input[i].value(numParticles[i]);
  }
}

function decrease(evt) {
  // console.log(evt.target.id);
  var i = evt.target.id;
  randomX = outerBox[i].tl.x + radius + (Math.floor(Math.random() * xRange))
  randomY = outerBox[i].tl.y + radius + (Math.floor(Math.random() * yRange))

  if (numParticles[i] <= 0){numParticles[i]=0} else {

    //textboard[i].html('Current Number:'+numParticles[i]);
    // eval("particles" + i)[numParticles[i]].x = randomX;
    // eval("particles" + i)[numParticles[i]].y = randomY;

    eval("particles" + i).splice(numParticles[i]-1, 1);

    numParticles[i]--;

    OldnumParticles[i] = numParticles[i]
    input[i].value(numParticles[i]);
  }
}
