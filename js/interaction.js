//alert(numParticles);
    
//var greeting = document.getElementsByTagName("h3")[0];
//alert(greeting);
function increase() {
    randomX = outerBox.tl.x + radius + (Math.floor(Math.random() * xRange))
    randomY = outerBox.tl.y + radius + (Math.floor(Math.random() * yRange))
    
    numParticles++;
  textboard.html('Current Number:'+numParticles);
    
    //Random position when spawn
    particles[numParticles].x = randomX;
    particles[numParticles].y = randomY;
}

function decrease() {
    randomX = outerBox.tl.x + radius + (Math.floor(Math.random() * xRange))
    randomY = outerBox.tl.y + radius + (Math.floor(Math.random() * yRange))
    
    numParticles--;
    if (numParticles < 0){numParticles=0}
  textboard.html('Current Number:'+numParticles);
    particles[numParticles].x = randomX;
    particles[numParticles].y = randomY;
}