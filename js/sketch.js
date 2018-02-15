// var myc;
//
// function setup() {
//   // Configure canvas parameters
//   stage = createDiv('');
//   stage.id('stage');
//
//   questions = createDiv("");
//   questions.id('qdiv');
//   questions.parent('stage');
//
//   canvas = createCanvas(600, 600);
//   canvas.class('can');
//   canvas.parent('stage');
//   background(200, 250, 255);
//
//   radio = createRadio();
//   radio.option(5);
//   radio.option(10);
//   radio.option(15);
//   radio.style('width', '30px');
//   radio.class('qoptions');
//   radio.parent('qdiv');
//
//   drawCellWall();
//   noCursor();
// }
//
//
// function draw() {
//   fill(245);
//   ellipse(mouseX, mouseY, 35);
// }
//
// function mouseMoved() {
//   clear();
//   drawCellWall();
// }
//
// function drawCellWall() {
//   var channelGap = 100;
//   var wallThickness = 50;
//   background(255);
//
//   fill(0);
//   rect(0, height/2, (width/2) - (channelGap/2), wallThickness, 0, 10, 10, 0);
//   rect((width/2) + (channelGap/2), height/2, width, wallThickness, 10);
// }
