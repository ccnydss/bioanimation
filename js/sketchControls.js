//alert(numParticles);

//var greeting = document.getElementsByTagName("h3")[0];
//alert(greeting);
function increase() {
    randomX = outerBox[0].tl.x + radius + (Math.floor(Math.random() * xRange))
    randomY = outerBox[0].tl.y + radius + (Math.floor(Math.random() * yRange))


  textboard.html('Current Number:'+numParticles[0]);

    //Random position when spawn
    eval("particles" + 0)[numParticles[0]].x = randomX;
    eval("particles" + 0)[numParticles[0]].y = randomY;

    numParticles[0]++;

    OldnumParticles = numParticles[0]
    input.value(numParticles[0]);
}

function decrease() {
    randomX = outerBox[0].tl.x + radius + (Math.floor(Math.random() * xRange))
    randomY = outerBox[0].tl.y + radius + (Math.floor(Math.random() * yRange))

    if (numParticles[0] < 0){numParticles[0]=0}

  textboard.html('Current Number:'+numParticles[0]);
    eval("particles" + 0)[numParticles[0]].x = randomX;
    eval("particles" + 0)[numParticles[0]].y = randomY;

    numParticles[0]--;

    OldnumParticles = numParticles[0]
    input.value(numParticles[0]);
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
  if (keyCode == 32) {
    toggleLoop();
  }
}
