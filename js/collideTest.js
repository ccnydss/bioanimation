var circles;
var outerBox;
var numParticles = 1;
var particles = [];
var cellWalls = [];
var radius = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();

  var length = 600;
  var topLeft = new Point( ( windowWidth - length ) / 2, ( windowHeight - length ) / 2 );
  var topRight = new Point( ( windowWidth + length ) / 2, ( windowHeight - length ) / 2 );
  var botRight = new Point( ( windowWidth + length ) / 2, ( windowHeight + length ) / 2 );
  var botLeft = new Point( ( windowWidth - length ) / 2, ( windowHeight + length ) / 2 );

  outerBox = new Container( topLeft, topRight, botRight, botLeft );
  outerBox.draw();

  var velocity = createVector(-5, -4);

  xRange = outerBox.tr.x - outerBox.tl.x - 100
  yRange = outerBox.br.y - outerBox.tr.y - 100
  for (var i = 0; i < numParticles; i++) {
    // Get random location
    randomX = outerBox.tl.x + radius + (Math.floor(Math.random() * xRange))
    randomY = outerBox.tl.y + radius + (Math.floor(Math.random() * yRange))/2
    console.log(randomX,randomY);

    //particles.push(new Particle( (outerBox.tl.x + radius + 50), outerBox.tl.y + radius+1, 2*radius, velocity) );
    particles.push(new Particle(randomX,randomY,2*radius,velocity));
  }
  drawCellWall(outerBox.tl.x,outerBox.tl.y,outerBox.tr.x,outerBox.bl.y);

}

function draw() {
  clear();
  console.log("---------------------- CLEARED ------------------------------- ", frameCount);

  stroke(15, 15, 15, 100);
  fill(15, 15, 15, 100);

  outerBox.draw();
  for (var i = 0; i < numParticles; i++) {
    fill(color(50, 55, 100));

    particles[i].move(outerBox);
  }

  for (var i = 0; i < 2; i++) {
    cellWalls[i].draw();
  }

  console.log(cellWalls);
}

function drawCellWall(x1,y1,x2,y2) {
  var channelGap = 100;
  var wallThickness = 20;
  boxWidth = x2 - x1;
  boxHeight = y2 - y1;
  background(255);
  cellWalls.push(new CellWall(x1, y1 + boxHeight/2, (boxWidth/2) - (channelGap/2), wallThickness, 0, 10, 10, 0));
  cellWalls.push(new CellWall(x1 + (boxWidth/2) + (channelGap/2), y1 + boxHeight/2, (boxWidth/2) - (channelGap/2), wallThickness, 10, 0, 0, 10));
}
